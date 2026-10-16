import { CATALOG_SEED_VERSION, RETIRED_DEMO_PRODUCT_IDS, getBuiltInCatalogProducts } from "./productCatalogSeed.js";
import { getAuthToken } from "./api.js";
import { syncProductUpsert, syncProductDelete, resolveProductImagesForSave } from "./syncBackend.js";
import {
  formatPrice,
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
import { productMatchesQuery, scoreProductMatch, productMatchesFilters, PAGE_LOCKED_FILTERS } from "./categoryFilters.js";
import {
  getSelectedAudience,
  isKidsGroup,
  normalizeAudiences,
  normalizeKidsGroup,
  productMatchesAudience,
} from "./audience.js";
import {
  audiencesFromUnivers,
  departmentsFromUnivers,
  normalizeKidsCategories,
  normalizeMallFilters,
  normalizeStockNotes,
  normalizeUnivers,
  primaryStockNote,
} from "./productPlacement.js";

export const CATALOG_STORAGE_KEY = "raceliaProductCatalog";
const CATALOG_SEED_VERSION_KEY = "raceliaProductCatalogSeedVersion";

export function isInSalesReport(product) {
  const value = product?.inSalesReport;
  return value === true || value === "yes" || value === "true" || value === "Yes";
}

export const PRODUCT_SECTIONS = [
  { id: "mini-bags", label: "Mini Bags" },
  { id: "racelia-handbag", label: "The RACÈLIA Handbag" },
  { id: "moms-bags", label: "Moms Bags" },
  { id: "all-selection", label: "All Selection" },
  { id: "metiers-dart", label: "L’ART DU GESTE" },
  { id: "catalogue-grossiste", label: "Catalogue Grossiste" },
];

export const STOCK_NOTES = [
  { id: "", label: "No note" },
  { id: "new", label: "New" },
  { id: "sold-out", label: "Sold out" },
  { id: "best-sellers", label: "Best-sellers" },
  { id: "dispo", label: "Dispo" },
  { id: "not", label: "Not available" },
];

const UNAVAILABLE_STOCK_IDS = new Set(["sold-out", "not"]);

export function isProductUnavailableToBuy(productOrNote) {
  if (
    productOrNote &&
    typeof productOrNote === "object" &&
    Array.isArray(productOrNote.stockNotes) &&
    productOrNote.stockNotes.includes("sold-out")
  ) {
    return true;
  }
  const note = String(
    typeof productOrNote === "object" && productOrNote
      ? productOrNote.stockNote
      : productOrNote || ""
  )
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!note) return false;
  if (UNAVAILABLE_STOCK_IDS.has(note)) return true;
  return /sold[\s-]?out|epuis|out of stock|indisponible|unavailable|not available/.test(note);
}

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

const KNOWN_HEX_COLOR_NAMES = {
  "111111": "Noir",
  "111": "Noir",
  "000000": "Noir",
  "5a4a36": "Taupe",
  "f1ece2": "Beige",
  "7a1f1f": "Rouge",
  "6b8aa8": "Bleu",
  "c4a882": "Camel",
  "2f4f4f": "Vert",
};

function normalizeHexKey(hex) {
  let key = String(hex || "")
    .trim()
    .replace(/^#/, "")
    .toLowerCase();
  if (key.length === 3) key = key.split("").map((c) => c + c).join("");
  return key;
}

export function isGenericColorLabel(label) {
  const text = String(label || "")
    .trim()
    .replace(/^(color|couleur)\s*:\s*/i, "");
  if (!text) return true;
  if (/^(color|couleur)\s*\d+$/i.test(text)) return true;
  if (/^(option de couleur|color option|default)$/i.test(text)) return true;
  return false;
}

export function sanitizeColorLabel(label) {
  const text = String(label || "")
    .trim()
    .replace(/^(color|couleur)\s*:\s*/i, "")
    .trim();
  return isGenericColorLabel(text) ? "" : text;
}

export function colorVariantDisplayName(variant = {}, index = 0) {
  void index;
  const named = sanitizeColorLabel(variant?.label);
  if (named) return named;
  const fromHex = KNOWN_HEX_COLOR_NAMES[normalizeHexKey(variant?.hex)];
  return fromHex || "";
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

  const stockNotes = normalizeStockNotes(product);
  let stockNote = primaryStockNote(stockNotes);
  if (!Array.isArray(product.stockNotes) && !stockNote) {
    const legacyNote = String(product.stockNote || "").trim();
    if (legacyNote && !/best[\s-]*sellers?/i.test(legacyNote)) stockNote = legacyNote;
  }
  const univers = normalizeUnivers(product);
  const explicitUnivers = Array.isArray(product.univers);

  const normalized = {
    id: String(product.id || product.slug || "").trim(),
    name: String(product.name || "").trim(),
    tag: String(product.tag || "").trim(),
    priceAmountDzd,
    price: priceAmountDzd ? formatDzdPrice(priceAmountDzd) : String(product.price || "").trim(),
    stockNotes,
    stockNote,
    isPromo: Boolean(product.isPromo) && Number(product.promoPriceAmountDzd) > 0,
    promoPriceAmountDzd: Boolean(product.isPromo) ? Math.max(0, Number(product.promoPriceAmountDzd) || 0) : 0,
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
    univers,
    audiences: explicitUnivers
      ? audiencesFromUnivers(univers)
      : (() => {
          const audiences = normalizeAudiences(product.audiences);
          return audiences.length ? audiences : ["femme"];
        })(),
    departments: departmentsFromUnivers(univers),
    mallFilters: normalizeMallFilters(product.mallFilters),
    kidsCategories: normalizeKidsCategories(product.kidsCategories),
    kidsGroup: normalizeKidsGroup(product.kidsGroup, product.sections),
    createdAt: product.createdAt || Date.now(),
    updatedAt: product.updatedAt || Date.now(),
  };

  return normalized;
}

function getNormalizedSeedProducts() {
  return getBuiltInCatalogProducts().map(normalizeCatalogProduct).filter((p) => p?.id);
}

function rememberSeedVersion() {
  try {
    localStorage.setItem(CATALOG_SEED_VERSION_KEY, String(CATALOG_SEED_VERSION));
  } catch {
    /* ignore */
  }
}

function dropRetiredDemoProducts(existing) {
  const retired = new Set(RETIRED_DEMO_PRODUCT_IDS);
  const next = existing.filter((product) => !retired.has(String(product.id)));
  if (next.length === existing.length) return existing;
  saveCatalogProducts(next);
  return next;
}

function mergeMissingSeedProducts(existing) {
  const savedIds = new Set(existing.map((p) => String(p.id)));
  const extras = getNormalizedSeedProducts().filter((p) => !savedIds.has(String(p.id)));
  if (!extras.length) return existing;
  const next = [...existing, ...extras];
  saveCatalogProducts(next);
  return next;
}

function overlaySeedImages(existing) {
  const seedById = new Map(getNormalizedSeedProducts().map((p) => [String(p.id), p]));
  const seededIds = new Set(["wholesale-mini-lot", "east-west-flap", "chain-pochette"]);
  let changed = false;
  const next = existing.map((product) => {
    const id = String(product.id);
    if (!seededIds.has(id)) return product;
    const seed = seedById.get(id);
    if (!seed) return product;
    changed = true;
    const colorVariants = Array.isArray(product.colorVariants)
      ? product.colorVariants.map((variant, index) =>
          index === 0
            ? { ...variant, cardCover: seed.cardCover, pdpCover: seed.pdpCover }
            : variant
        )
      : product.colorVariants;
    return {
      ...product,
      cardCover: seed.cardCover,
      cardScroll: seed.cardScroll,
      pdpCover: seed.pdpCover,
      pdpScroll: seed.pdpScroll,
      coverImage: seed.coverImage,
      cardImages: seed.cardImages,
      closerLookExtra: seed.closerLookExtra,
      closerLookImages: seed.closerLookImages,
      closerLookMain: seed.closerLookMain,
      colorVariants,
      updatedAt: Date.now(),
    };
  });
  if (changed) saveCatalogProducts(next);
  return next;
}

function overlaySeedAudienceFields(existing) {
  const seedById = new Map(getNormalizedSeedProducts().map((p) => [String(p.id), p]));
  let changed = false;
  const next = existing.map((product) => {
    const seed = seedById.get(String(product.id));
    if (!seed) return product;
    const audiences = product.audiences?.length ? product.audiences : seed.audiences;
    const kidsGroup = product.kidsGroup || seed.kidsGroup || "";
    if (audiences === product.audiences && kidsGroup === product.kidsGroup) return product;
    changed = true;
    return { ...product, audiences, kidsGroup };
  });
  if (changed) saveCatalogProducts(next);
  return next;
}

function overlaySeedKidsPlacement(existing) {
  const seed = getNormalizedSeedProducts().find((product) => product.id === "demo-sac-mom-racelia");
  if (!seed) return existing;
  let changed = false;
  const next = existing.map((product) => {
    if (product.id !== "demo-sac-mom-racelia") return product;
    const sameUnivers = JSON.stringify(product.univers || []) === JSON.stringify(seed.univers || []);
    const sameKids = JSON.stringify(product.kidsCategories || []) === JSON.stringify(seed.kidsCategories || []);
    if (sameUnivers && sameKids) return product;
    changed = true;
    return normalizeCatalogProduct({
      ...product,
      univers: seed.univers,
      kidsCategories: seed.kidsCategories,
    });
  });
  if (changed) saveCatalogProducts(next);
  return next;
}

export function loadCatalogProducts() {
  try {
    const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) {
        const normalized = parsed.map(normalizeCatalogProduct).filter((p) => p?.id);
        const applied = Number(localStorage.getItem(CATALOG_SEED_VERSION_KEY) || 0);
        if (applied < CATALOG_SEED_VERSION) {
          const merged = overlaySeedKidsPlacement(
            overlaySeedImages(
              overlaySeedAudienceFields(mergeMissingSeedProducts(dropRetiredDemoProducts(normalized)))
            )
          );
          rememberSeedVersion();
          return merged;
        }
        return normalized;
      }
    }
  } catch {
    /* ignore */
  }
  const seed = getNormalizedSeedProducts();
  saveCatalogProducts(seed);
  rememberSeedVersion();
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

function hasRaceliaTag(product) {
  const hay = [
    product.name,
    product.tag,
    product.description,
    ...(product.details || []),
    ...(product.filters || []),
  ]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return hay.includes("racelia");
}

export function getProductsForSection(sectionKey) {
  const products = loadCatalogProducts();
  if (isKidsGroup(sectionKey)) {
    return products.filter((p) => p.kidsGroup === sectionKey || p.sections.includes(sectionKey));
  }
  if (sectionKey === "nouveautes") {
    return products.filter((p) => p.isNewArrival);
  }
  if (sectionKey === "all-selection") {
    return products;
  }
  if (sectionKey === "sacs") {
    const bagSections = new Set(["mini-bags", "racelia-handbag", "moms-bags", "sacs"]);
    return products.filter(
      (p) => (p.sections || []).some((section) => bagSections.has(section)) || hasRaceliaTag(p)
    );
  }
  if (sectionKey === "racelia-handbag") {
    return products.filter(
      (p) => hasRaceliaTag(p) && !(p.departments || []).includes("parfums")
    );
  }
  if (PAGE_LOCKED_FILTERS[sectionKey]) {
    return products.filter(
      (p) =>
        productMatchesFilters(p, PAGE_LOCKED_FILTERS[sectionKey]) ||
        (sectionKey === "parfums-feminins" && (p.departments || []).includes("parfums"))
    );
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

function applyAudienceFilter(products) {
  const audience = getSelectedAudience();
  return products.filter((product) => productMatchesAudience(product, audience));
}

function sellingPriceFields(product) {
  const regularDzd = Number(product.priceAmountDzd) || 0;
  const promoDzd = product.isPromo ? Number(product.promoPriceAmountDzd) || 0 : 0;
  const onPromo = promoDzd > 0;
  const sellingDzd = onPromo ? promoDzd : regularDzd;
  const priceEur = sellingDzd > 0 ? sellingDzd / EUR_TO_DZD : parseCatalogPriceEur(product);
  const compareAtEur = onPromo && regularDzd > 0 ? regularDzd / EUR_TO_DZD : 0;
  return {
    isPromo: onPromo,
    price: formatPrice(priceEur),
    priceEur,
    compareAtPrice: compareAtEur ? formatPrice(compareAtEur) : "",
    compareAtEur,
  };
}

export function toCategoryProduct(catalogProduct) {
  const p = normalizeCatalogProduct(catalogProduct);
  if (!p) return null;
  const priceFields = sellingPriceFields(p);
  const cardImages = getCardImages(p, 0);
  const images = cardImages.length ? cardImages : getPdpImages(p, 0);
  const swatches = (p.colorVariants.length ? p.colorVariants : p.colors.map((hex) => ({ hex }))).map(
    (v, index) => ({
      hex: v.hex || p.colors[index] || "#111",
      label: colorVariantDisplayName(v, index),
      index,
    })
  );
  return {
    id: p.id,
    name: p.name,
    tag: p.tag,
    price: priceFields.price,
    priceEur: priceFields.priceEur,
    compareAtPrice: priceFields.compareAtPrice,
    compareAtEur: priceFields.compareAtEur,
    isPromo: priceFields.isPromo,
    stockNote: p.stockNote,
    stockNotes: p.stockNotes,
    isPack: p.isPack,
    packLabel: p.packLabel,
    images: images.length ? images : [p.cardCover, p.pdpCover].filter(Boolean),
    swatches: swatches.length ? swatches : [{ hex: "#111", label: "Default", index: 0 }],
    filters: p.filters,
    description: p.description,
    details: p.details,
    sections: p.sections,
    isNewArrival: p.isNewArrival,
    inSalesReport: p.inSalesReport,
    audiences: p.audiences,
    univers: p.univers,
    departments: p.departments,
    mallFilters: p.mallFilters,
    kidsCategories: p.kidsCategories,
    kidsGroup: p.kidsGroup,
    hasColorImages: p.hasColorImages,
  };
}

export function getCategoryProductById(id) {
  const product = getCatalogProductById(id);
  return product ? toCategoryProduct(product) : null;
}

export function getAllSelectionProducts() {
  return applyAudienceFilter(getProductsForSection("all-selection"))
    .map(toCategoryProduct)
    .filter(Boolean);
}

export function getCategoryProductsForSection(sectionKey) {
  return applyAudienceFilter(getProductsForSection(sectionKey))
    .map(toCategoryProduct)
    .filter(Boolean);
}

export function searchProducts(query, { limit = 0 } = {}) {
  const q = String(query || "").trim();
  if (!q) return [];
  const matches = applyAudienceFilter(loadCatalogProducts())
    .map(toCategoryProduct)
    .filter(Boolean)
    .filter((product) => productMatchesQuery(product, q))
    .sort((a, b) => scoreProductMatch(b, q) - scoreProductMatch(a, q));
  return limit > 0 ? matches.slice(0, limit) : matches;
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
    label: colorVariantDisplayName(variant, index),
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
  const priceFields = sellingPriceFields(p);
  const closer = getCloserLookForColor(p, 0);
  const reviews = getProductReviewsForDisplay(p.id, p.name);

  return {
    id: p.id,
    name: p.name,
    tag: p.tag,
    price: priceFields.price,
    priceEur: priceFields.priceEur,
    compareAtPrice: priceFields.compareAtPrice,
    compareAtEur: priceFields.compareAtEur,
    isPromo: priceFields.isPromo,
    stockNote: p.stockNote,
    stockNotes: p.stockNotes,
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

/** First 2×2 grid beside the home editorial image. */
export function getEditorialGridProducts() {
  return getHomeProductPool(8).slice(4, 8);
}

/** Second 2×2 grid beside the reversed home editorial image. */
export function getSecondaryEditorialGridProducts() {
  return getHomeProductPool(12).slice(8, 12);
}

/** Full row of four cards under the closing home caption. */
export function getClosingGridProducts() {
  return getHomeProductPool(16).slice(12, 16);
}

/** Large home editorial photos (name + link under each campaign image). */
export function getEditorialSpotlightProducts() {
  const pool = getHomeProductPool(18);
  if (pool.length >= 18) return pool.slice(16, 18);
  if (pool.length >= 2) return pool.slice(-2);
  return pool;
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
        const synced = normalizeCatalogProduct({
          ...result.product,
          stockNotes: normalized.stockNotes,
          stockNote: normalized.stockNote,
          isPromo: normalized.isPromo,
          promoPriceAmountDzd: normalized.promoPriceAmountDzd,
          univers: normalized.univers,
          audiences: normalized.audiences,
          departments: normalized.departments,
          mallFilters: normalized.mallFilters,
          kidsCategories: normalized.kidsCategories,
          sections: normalized.sections,
        });
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
    stockNotes: ["new"],
    isPromo: false,
    promoPriceAmountDzd: 0,
    univers: ["femme"],
    audiences: ["femme"],
    departments: [],
    mallFilters: [],
    kidsCategories: [],
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
    audiences: ["femme"],
    kidsGroup: "",
  });
}

export function stockNoteLabel(note) {
  return STOCK_NOTES.find((n) => n.id === note)?.label || "";
}

export function notifyCatalogUpdated(root) {
  root?.dispatchEvent(new CustomEvent("racelia:catalog-updated", { bubbles: true }));
}
