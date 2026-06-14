import { raceliaLooks } from "./raceliaStyleData.js";
import { products } from "./data.js";
import { getCategoryProductById } from "./categoryData.js";

export const STYLE_LOOKS_STORAGE_KEY = "raceliaDashboardStyleLooks";

function seedFromLegacy() {
  return raceliaLooks.map((look, i) => ({
    id: `style-seed-${i}`,
    title: i === 0 ? "Featured creator look" : `Creator look ${i + 1}`,
    tag: i === 0 ? "Featured" : "Live",
    image: look.img,
    products: look.products.map((p, j) => ({
      id: `style-seed-${i}-p-${j}`,
      productId: p.id,
      image: p.image,
    })),
    createdAt: i + 1,
  }));
}

function readStorage() {
  try {
    const saved = localStorage.getItem(STYLE_LOOKS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return null;
}

export function loadStyleLooks() {
  const stored = readStorage();
  if (stored === null) {
    const seeded = seedFromLegacy();
    localStorage.setItem(STYLE_LOOKS_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  return stored;
}

export function saveStyleLooks(looks) {
  try {
    localStorage.setItem(STYLE_LOOKS_STORAGE_KEY, JSON.stringify(looks));
  } catch {
    /* ignore */
  }
}

/** Format consumed by storefront #RACÈLIASTYLE grid. */
export function getStorefrontStyleLooks() {
  return loadStyleLooks().map((look) => ({
    img: look.image,
    products: (look.products || []).map((p) => ({
      id: p.productId,
      image: p.image,
    })),
  }));
}

export function getProductDefaultImage(productId) {
  const fromCatalog = getCategoryProductById(productId);
  if (fromCatalog?.images?.[0]) return fromCatalog.images[0];
  const fromHome = products.find((p) => p.id === productId);
  return fromHome?.images?.[0] || "";
}

export function getProductLabel(productId) {
  const meta = getCategoryProductById(productId);
  if (meta?.name) return meta.name;
  const fromHome = products.find((p) => p.id === productId);
  return fromHome?.name || productId;
}
