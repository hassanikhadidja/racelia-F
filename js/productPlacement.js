export const PRODUCT_UNIVERSES = [
  { id: "femme", label: "Femme", kind: "audience" },
  { id: "homme", label: "Homme", kind: "audience" },
  { id: "enfants", label: "Enfants", kind: "audience" },
  { id: "mariee", label: "Mariée", kind: "audience" },
  { id: "hammam", label: "Hammam", kind: "audience" },
  { id: "sacs", label: "Sacs", kind: "department" },
  { id: "accessories", label: "Accessories", kind: "department" },
  { id: "chaussures", label: "Chaussures", kind: "department" },
  { id: "parfums", label: "Parfums Féminins", kind: "department" },
];

export const KIDS_CATEGORY_OPTIONS = [
  { id: "enfants-sacs-mom", label: "SACS MOM" },
  { id: "enfants-handbag", label: "Handbag" },
  { id: "enfants-dress", label: "Dress" },
];

/** Filter-row choices for each universe that has a category-mall pill row. */
export const UNIVERSE_SECTIONS = {
  sacs: [
    { id: "sacs-laptop-bags", label: "LAPTOP BAGS" },
    { id: "sacs-backpacks", label: "BACKPACKS" },
    { id: "sacs-cosmetic-bags", label: "COSMETIC BAGS" },
    { id: "sacs-housse", label: "Housse d’ordinateur" },
    { id: "sacs-moms", label: "SACS MOM" },
    { id: "sacs-cc", label: "CC" },
    { id: "sacs-racelia", label: "RACÈLIA" },
    { id: "sacs-tendance", label: "Tendance" },
  ],
  accessories: [
    { id: "accessories-hair-clips", label: "Hair Clips" },
    { id: "accessories-satin-scarves", label: "Satin Scarves" },
    { id: "accessories-watches", label: "Watches" },
    { id: "accessories-belts", label: "Belts" },
    { id: "accessories-bijoux", label: "Bijoux" },
    { id: "accessories-cc", label: "CC" },
    { id: "accessories-racelia", label: "RACÈLIA" },
    { id: "accessories-tendance", label: "Tendance" },
  ],
  chaussures: [
    { id: "chaussures-everyday-heels", label: "Everyday Heels" },
    { id: "chaussures-boots", label: "BOOTS" },
    { id: "chaussures-sandals", label: "SANDALS" },
    { id: "chaussures-heels", label: "HEELS" },
    { id: "chaussures-sneakers", label: "SNEAKERS" },
    { id: "chaussures-clogs", label: "CLOGS" },
    { id: "chaussures-racelia", label: "RACÈLIA" },
    { id: "chaussures-tendance", label: "Tendance" },
  ],
  hammam: [
    { id: "hammam-cosmetic-bags", label: "COSMETIC BAGS" },
    { id: "hammam-tote", label: "Tote Bag" },
    { id: "hammam-rug", label: "Rug Pouches" },
    { id: "hammam-tendance", label: "Tendance" },
  ],
  homme: [
    { id: "homme-sacs", label: "Sacs RACÈLIA" },
    { id: "homme-accessories", label: "Accessories" },
    { id: "homme-chaussures", label: "Chaussures" },
  ],
  parfums: [
    { id: "parfums-racelia", label: "Parfums Racèlia" },
    { id: "brumes", label: "Brumes" },
    { id: "parfums-fragrances", label: "Parfums et fragrances" },
  ],
};

const UNIVERSE_IDS = new Set(PRODUCT_UNIVERSES.map((item) => item.id));
const AUDIENCE_UNIVERSE_IDS = new Set(
  PRODUCT_UNIVERSES.filter((item) => item.kind === "audience").map((item) => item.id)
);
const DEPARTMENT_IDS = new Set(
  PRODUCT_UNIVERSES.filter((item) => item.kind === "department").map((item) => item.id)
);
const MALL_FILTER_IDS = new Set(
  Object.values(UNIVERSE_SECTIONS)
    .flat()
    .map((item) => item.id)
);
const KIDS_CATEGORY_IDS = new Set(KIDS_CATEGORY_OPTIONS.map((item) => item.id));
const STOCK_NOTE_IDS = ["new", "sold-out", "best-sellers"];

export function universeLabel(id) {
  return PRODUCT_UNIVERSES.find((item) => item.id === id)?.label || "";
}

export function mallFilterLabel(id) {
  for (const options of Object.values(UNIVERSE_SECTIONS)) {
    const match = options.find((item) => item.id === id);
    if (match) return match.label;
  }
  return "";
}

export function kidsCategoryLabel(id) {
  return KIDS_CATEGORY_OPTIONS.find((item) => item.id === id)?.label || "";
}

function uniqueAllowed(list, allowed) {
  const next = [];
  (Array.isArray(list) ? list : []).forEach((value) => {
    const id = String(value || "").trim();
    if (allowed.has(id) && !next.includes(id)) next.push(id);
  });
  return next;
}

export function normalizeStockNotes(product = {}) {
  if (Array.isArray(product.stockNotes)) {
    return STOCK_NOTE_IDS.filter((id) => product.stockNotes.includes(id));
  }
  const legacy = String(product.stockNote || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const notes = [];
  if (legacy === "new" || legacy === "nouveau" || legacy === "nouveaute") notes.push("new");
  if (legacy === "sold-out" || legacy === "sold out" || legacy === "epuise") notes.push("sold-out");
  if (/best[\s-]*sellers?/.test(legacy)) notes.push("best-sellers");
  return notes;
}

export function primaryStockNote(notes) {
  const list = Array.isArray(notes) ? notes : [];
  if (list.includes("sold-out")) return "sold-out";
  if (list.includes("new")) return "new";
  return "";
}

export function normalizeUnivers(product = {}) {
  const source = Array.isArray(product.univers) ? product.univers : product.audiences;
  const next = [];
  (Array.isArray(source) ? source : []).forEach((value) => {
    const id = String(value || "").trim();
    const mapped = id === "bijoux" ? "accessories" : id === "parfums-feminins" ? "parfums" : id;
    if (UNIVERSE_IDS.has(mapped) && !next.includes(mapped)) next.push(mapped);
  });
  if (!Array.isArray(product.univers) && !next.length) next.push("femme");
  return PRODUCT_UNIVERSES.map((item) => item.id).filter((id) => next.includes(id));
}

export function audiencesFromUnivers(univers) {
  return (univers || []).filter((id) => AUDIENCE_UNIVERSE_IDS.has(id));
}

export function departmentsFromUnivers(univers) {
  return (univers || []).filter((id) => DEPARTMENT_IDS.has(id));
}

export function normalizeMallFilters(list) {
  return uniqueAllowed(list, MALL_FILTER_IDS);
}

export function normalizeKidsCategories(list) {
  return uniqueAllowed(list, KIDS_CATEGORY_IDS);
}
