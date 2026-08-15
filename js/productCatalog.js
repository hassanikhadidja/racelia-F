import { getBuiltInCatalogProducts } from "./productCatalogSeed.js";
import { getAuthToken } from "./api.js";
import { syncProductUpsert, syncProductDelete, resolveProductImagesForSave } from "./syncBackend.js";
import {
  formatProductPrice,
  parseCatalogPriceEur,
  formatDzdPrice,
  parseDzdInput,
  EUR_TO_DZD,
} from "./currency.js";
import {
  migrateLegacyImages,
  normalizeColorVariants,
  getCardImages,
  getPdpImages,
  getCloserLookForColor,
  emptyColorVariant,
  buildImageList,
} from "./productImages.js";
import { getProductReviewsForDisplay } from "./dashboardReviewsData.js";

export const CATALOG_STORAGE_KEY = "raceliaProductCatalog";

export function isInSalesReport(product) {
  const value = product?.inSalesReport;
  return value === true || value === "yes" || value === "true" || value === "Yes";
}

export const PRODUCT_SECTIONS = [
  { id: "mini-bags", label: "Mini Bags" },
  { id: "racelia-handbag", label: "The RACÈLIA Handbag" },
  { id: "moms-bags", label: "Moms Bags" },
  { id: "all-selection", label: "All Selection" },
  { id: "metiers-dart", label: "Métiers d'Art" },
  { id: "catalogue-grossiste", label: "Catalogue Grossiste" },
];

export const STOCK_NOTES = [
  { id: "", label: "No note" },
  { id: "new", label: "New" },
  { id: "dispo", label: "Dispo" },
  { id: "sold-out", label: "Sold out" },
  { id: "not", label: "Not available" },
];

const swatchStyles = {
  grey: "radial-gradient(circle at 30% 30%, #c0c0c0, #5a5a5a)",
  chalk: "radial-gradient(circle at 30% 30%, #f5e9e3, #d8c8c0)",
  brown: "radial-gradient(circle at 30% 30%, #6b3a1e, #3a1d0b)",
  natural: "radial-gradient(circle at 30% 30%, #e6a85a, #b97a2a)",
  rose: "radial-gradient(circle at 30% 30%, #d98a6b, #a85a3e)",
  black: "radial-gradient(circle at 30% 30%, #444, #111)",
  navy: "radial-gradient(circle at 30% 30%, #6b8aa8, #2a3f5f)",
};

function hexToSwatchStyle(hex) {
  const clean = String(hex || "#888").replace("#", "");
  if (clean.length !== 6) return swatchStyles.grey;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const light = `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`;
  const dark = `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`;
  return `radial-gradient(circle at 30% 30%, ${light}, ${dark})`;
}

function normalizeProductDetails(product = {}) {
  if (Array.isArray(product.details) && product.details.length) {
    return product.details.map((line) => String(line || "").trim()).filter(Boolean);
  }
  const legacy = [];
  if (product.materials) legacy.push(String(product.materials).trim());
  if (product.size) legacy.push(String(product.size).trim());
  return legacy.filter(Boolean);
}

export function normalizeCatalogProduct(product) {
  if (!product || typeof product !== "object") return null;

  const { cardCover, cardScroll, pdpCover, pdpScroll, closerLookExtra, closerMainImage } =
    migrateLegacyImages(product);

  let priceAmountDzd = Number(product.priceAmountDzd) || 0;
  if (!priceAmountDzd && product.price) {
    if (/dzd/i.test(String(product.price))) {
      priceAmountDzd = parseDzdInput(product.price);
    } else {
      priceAmountDzd = Math.round(parseCatalogPriceEur(product.price) * EUR_TO_DZD);
    }
  }

  const colorVariants = normalizeColorVariants(product, {
    cardCover,
    cardScroll,
    pdpCover,
    pdpScroll,
  });

  const colors = colorVariants.length
    ? colorVariants.map((v) => v.hex)
    : Array.isArray(product.colors)
      ? product.colors.filter(Boolean)
      : [];

  const normalized = {
    id: String(product.id || product.slug || "").trim(),
    name: String(product.name || "").trim(),
    tag: String(product.tag || "").trim(),
    priceAmountDzd,
    price: priceAmountDzd ? formatDzdPrice(priceAmountDzd) : String(product.price || "").trim(),
    stockNote: String(product.stockNote || "").trim(),
    description: String(product.description || "").trim(),
    isPack: Boolean(product.isPack),
    packLabel: String(product.packLabel || "").trim(),
    isNewArrival: Boolean(product.isNewArrival),
    inSalesReport: isInSalesReport(product),
    hasColorImages: Boolean(product.hasColorImages) || colorVariants.some(
      (v) =>
        v.cardCover ||
        v.cardScroll?.length ||
        v.pdpCover ||
        v.pdpScroll?.length ||
        v.closerLookMain ||
        v.closerLookExtra?.length
    ),
    sections: Array.isArray(product.sections) ? [...new Set(product.sections)] : ["all-selection"],
    cardCover,
    cardScroll,
    pdpCover,
    pdpScroll,
    closerLookExtra,
    coverImage: cardCover,
    cardImages: buildImageList(cardCover, cardScroll),
    closerLookImages: closerLookExtra,
    closerLookMain: {
      image: closerMainImage,
      title: product.closerLookMain?.title || "A Closer Look",
      text:
        product.closerLookMain?.text ||
        "Refined pebble leather with a polished finish — casual meets dressy, designed for everyday elegance.",
    },
    colors,
    colorVariants,
    details: normalizeProductDetails(product),
    filters: Array.isArray(product.filters) ? product.filters.filter(Boolean) : [],
    createdAt: product.createdAt || Date.now(),
    updatedAt: product.updatedAt || Date.now(),
  };

  return normalized;
}

export function loadCatalogProducts() {
  try {
    const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeCatalogProduct).filter((p) => p?.id);
      }
    }
  } catch {
    /* ignore */
  }
  const seed = getBuiltInCatalogProducts().map(normalizeCatalogProduct).filter(Boolean);
  saveCatalogProducts(seed);
  return seed;
}

export function saveCatalogProducts(products) {
  try {
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch {
    return false;
  }
}

export function getCatalogProductById(id) {
  return loadCatalogProducts().find((p) => p.id === id) || null;
}

export function getAllCatalogProducts() {
  return loadCatalogProducts();
}

export function getProductsForSection(sectionKey) {
  const products = loadCatalogProducts();
  if (sectionKey === "nouveautes") {
    return products.filter((p) => p.isNewArrival);
  }
  if (sectionKey === "all-selection") {
    return products.filter((p) => p.sections.includes("all-selection"));
  }
  if (sectionKey === "metiers-dart") {
    return products.filter(
      (p) =>
        p.sections.includes("metiers-dart") ||
        p.filters?.some((f) => f.toLowerCase().includes("métiers d'art"))
    );
  }
  return products.filter((p) => p.sections.includes(sectionKey));
}

export function toCategoryProduct(catalogProduct) {
  const p = normalizeCatalogProduct(catalogProduct);
  if (!p) return null;
  const priceEur = parseCatalogPriceEur(p);
  const cardImages = getCardImages(p, 0);
  const images = cardImages.length ? cardImages : getPdpImages(p, 0);
  const swatches = (p.colorVariants.length ? p.colorVariants : p.colors.map((hex) => ({ hex }))).map(
    (v, index) => ({
      hex: v.hex || p.colors[index] || "#111",
      label: v.label || `Color ${index + 1}`,
      index,
    })
  );
  return {
    id: p.id,
    name: p.name,
    tag: p.tag,
    price: formatProductPrice(p),
    priceEur,
    stockNote: p.stockNote,
    isPack: p.isPack,
    packLabel: p.packLabel,
    images: images.length ? images : [p.cardCover, p.pdpCover].filter(Boolean),
    swatches: swatches.length ? swatches : [{ hex: "#111", label: "Default", index: 0 }],
    filters: p.filters,
    hasColorImages: p.hasColorImages,
  };
}

export function getCategoryProductById(id) {
  const product = getCatalogProductById(id);
  return product ? toCategoryProduct(product) : null;
}

export function getAllSelectionProducts() {
  return getProductsForSection("all-selection").map(toCategoryProduct).filter(Boolean);
}

export function getCategoryProductsForSection(sectionKey) {
  return getProductsForSection(sectionKey).map(toCategoryProduct).filter(Boolean);
}

function buildProductDetail(catalogProduct) {
  const p = normalizeCatalogProduct(catalogProduct);
  if (!p) return null;

  const images = getPdpImages(p, 0);
  const swatchSource = p.colorVariants.length
    ? p.colorVariants
    : p.colors.map((hex) => ({ hex, label: "" }));

  const swatches = swatchSource.map((variant, index) => ({
    hex: variant.hex || p.colors[index] || "#111",
    label: variant.label || `Color ${index + 1}`,
    style: hexToSwatchStyle(variant.hex || p.colors[index]),
    active: index === 0,
    index,
  }));

  const accordions = [
    {
      title: "DESCRIPTION",
      body: p.description || p.name,
    },
    {
      title: "DÉTAILS DU PRODUIT",
      body: (p.details || []).length
        ? (p.details || []).map((line) => `• ${line}`).join("\n")
        : "Détails à venir.",
    },
  ];

  if (p.isPack && p.packLabel) {
    accordions.unshift({
      title: "PACK CONTENTS",
      body: p.packLabel,
    });
  }

  const others = loadCatalogProducts().map((item) => item.id).filter((id) => id !== p.id);
  const similar = others.slice(0, 3);
  const forYou = others.slice(0, 4);
  const priceEur = parseCatalogPriceEur(p);
  const closer = getCloserLookForColor(p, 0);
  const reviews = getProductReviewsForDisplay(p.id, p.name);

  return {
    id: p.id,
    name: p.name,
    tag: p.tag,
    price: formatProductPrice(p),
    priceEur,
    stockNote: p.stockNote,
    isPack: p.isPack,
    packLabel: p.packLabel,
    description: p.description || "",
    details: Array.isArray(p.details) ? p.details : [],
    hasColorImages: p.hasColorImages,
    images,
    swatches: swatches.length
      ? swatches
      : [{ hex: "#111", label: "Black", style: swatchStyles.black, active: true, index: 0 }],
    reviews,
    closerLook: {
      image: closer.image,
      title: closer.title,
      text: closer.text,
    },
    closerLookExtra: closer.extra,
    accordions,
    similar,
    forYou,
  };
}

function toHomeProductCard(p) {
  const normalized = normalizeCatalogProduct(p);
  const cardImages = getCardImages(normalized, 0);
  const images = cardImages.length ? cardImages : getPdpImages(normalized, 0);
  if (!images.length) return null;
  return {
    id: normalized.id,
    name: normalized.name,
    images,
  };
}

/** Ordered catalogue pool for home product grids (new arrivals first, then rest). */
export function getHomeProductPool(limit = 8) {
  const all = loadCatalogProducts();
  let source = all.filter((p) => p.isNewArrival);

  if (!source.length) {
    source = [...all].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  const seen = new Set(source.map((p) => p.id));
  const fillers = [...all]
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .filter((p) => p.id && !seen.has(p.id));

  return [...source, ...fillers]
    .slice(0, limit)
    .map(toHomeProductCard)
    .filter(Boolean);
}

export function getNewArrivalProducts() {
  return getHomeProductPool(4);
}

/** Second 2×2 grid under the home editorial image. */
export function getEditorialGridProducts() {
  return getHomeProductPool(8).slice(4, 8);
}

export function getProductDetail(id) {
  const product = getCatalogProductById(id);
  return product ? buildProductDetail(product) : null;
}

export async function upsertCatalogProduct(product) {
  let normalized = normalizeCatalogProduct(product);
  if (!normalized?.id || !normalized.name) {
    throw new Error("Product name and ID are required.");
  }

  normalized = await resolveProductImagesForSave(normalized);

  const products = loadCatalogProducts();
  const index = products.findIndex((p) => p.id === normalized.id);
  normalized.updatedAt = Date.now();
  if (index >= 0) {
    normalized.createdAt = products[index].createdAt;
    products[index] = normalized;
  } else {
    normalized.createdAt = Date.now();
    products.push(normalized);
  }

  if (!saveCatalogProducts(products)) {
    throw new Error(
      "Could not save the product locally. Use image links or sign in as admin so photos upload to the server."
    );
  }

  if (getAuthToken()) {
    try {
      const result = await syncProductUpsert(normalized);
      if (result?.product) {
        const synced = normalizeCatalogProduct(result.product);
        if (synced) {
          const refreshed = loadCatalogProducts();
          const syncedIndex = refreshed.findIndex((p) => p.id === synced.id);
          if (syncedIndex >= 0) {
            synced.createdAt = refreshed[syncedIndex].createdAt;
            synced.updatedAt = Date.now();
            refreshed[syncedIndex] = synced;
          }
          saveCatalogProducts(refreshed);
          return synced;
        }
      }
    } catch (error) {
      console.warn("Product saved locally, but server sync failed:", error.message);
    }
  }

  return normalized;
}

export function deleteCatalogProduct(id) {
  const products = loadCatalogProducts().filter((p) => p.id !== id);
  saveCatalogProducts(products);
  syncProductDelete(id).catch(() => {});
}

export function createEmptyCatalogProduct() {
  return normalizeCatalogProduct({
    id: `product-${Date.now()}`,
    name: "",
    tag: "",
    priceAmountDzd: 0,
    price: "",
    stockNote: "new",
    description: "",
    isPack: false,
    packLabel: "",
    isNewArrival: false,
    inSalesReport: false,
    hasColorImages: false,
    sections: ["all-selection"],
    cardCover: "",
    cardScroll: [],
    pdpCover: "",
    pdpScroll: [],
    closerLookExtra: [],
    closerLookMain: {
      image: "",
      title: "A Closer Look",
      text: "",
    },
    colors: ["#111111"],
    colorVariants: [emptyColorVariant("#111111", "Black")],
    details: [],
    filters: [],
  });
}

export function stockNoteLabel(note) {
  return STOCK_NOTES.find((n) => n.id === note)?.label || "";
}

export function notifyCatalogUpdated(root) {
  root?.dispatchEvent(new CustomEvent("racelia:catalog-updated", { bubbles: true }));
}
