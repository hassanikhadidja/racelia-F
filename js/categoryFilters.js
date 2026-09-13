import { loadStyleLooks } from "./dashboardRaceliaStyleData.js";

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/['’]/g, "'");
}

function productSearchText(product) {
  const swatchLabels = (product.swatches || []).map((s) =>
    typeof s === "string" ? s : s.label || ""
  );
  const colorLabels = (product.colorVariants || []).map((v) => v.label || v.name || "");
  return normalizeText(
    [
      product.id,
      product.name,
      product.tag,
      product.description,
      product.stockNote,
      ...(product.details || []),
      ...(product.filters || []),
      ...(product.sections || []),
      ...swatchLabels,
      ...colorLabels,
    ].join(" ")
  );
}

export function tokenizeQuery(query) {
  return normalizeText(query)
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function productMatchesQuery(product, query) {
  const tokens = Array.isArray(query) ? query : tokenizeQuery(query);
  if (!tokens.length) return false;
  const haystack = productSearchText(product);
  return tokens.every((token) => haystack.includes(token));
}

export function scoreProductMatch(product, query) {
  const tokens = Array.isArray(query) ? query : tokenizeQuery(query);
  if (!tokens.length) return 0;
  const name = normalizeText(product.name);
  const id = normalizeText(product.id).replace(/-/g, " ");
  const tag = normalizeText(product.tag);
  if (tokens.every((token) => name.includes(token))) return 100;
  if (tokens.every((token) => id.includes(token))) return 80;
  if (tokens.every((token) => tag.includes(token))) return 60;
  return 10;
}

function hasAny(haystack, needles) {
  return needles.some((needle) => haystack.includes(normalizeText(needle)));
}

const NAMED_COLORS = {
  noir: ["noir", "black"],
  beige: ["beige", "nude", "ecru", "ivoire", "camel"],
  bleu: ["bleu", "blue"],
  rouge: ["rouge", "red"],
  jaune: ["jaune", "yellow"],
};

const OTHER_COLORS = [
  "autres couleurs",
  "other colors",
  "vert",
  "green",
  "rose",
  "pink",
  "marron",
  "brown",
  "blanc",
  "white",
  "gris",
  "grey",
  "gray",
  "violet",
  "purple",
  "orange",
  "bordeaux",
];

const PRE_COLLECTION = [
  "pre-collection printemps-ete 2026",
  "pre-collection",
  "precollection",
  "ss26 pre-collection",
  "spring summer 2026 pre-collection",
];

const SS26 = ["printemps-ete 2026", "spring summer 2026", "ss26"];

const FILTER_ALIASES = {
  look: ["sur un look", "on a look"],
  "metiers-2026": ["metiers d'art 2026", "2026 metiers d'art", "metiers d'art", "metiers-dart"],
  ss26: SS26,
  "pre-ss26": PRE_COLLECTION,
  emblematics: ["les emblematiques", "the emblematics", "emblematics"],
  cuir: ["cuir", "leather"],
  "simili-cuir": ["simili cuir", "simili-cuir", "faux leather", "vegan leather"],
  tissu: ["tissu", "tissus", "tweed", "tweed & tissus", "tweed & fabrics", "fabric", "fabrics"],
  noir: NAMED_COLORS.noir,
  beige: NAMED_COLORS.beige,
  bleu: NAMED_COLORS.bleu,
  rouge: NAMED_COLORS.rouge,
  jaune: NAMED_COLORS.jaune,
  autres: OTHER_COLORS,
  dore: ["dore", "gold", "gold-tone", "gold tone"],
  argente: ["argente", "silver", "silver-tone", "silver tone"],
  racelia: ["racelia", "racèlia"],
};

function styleLookProductIds() {
  const ids = new Set();
  loadStyleLooks().forEach((look) => {
    (look.products || []).forEach((item) => {
      const id = item.productId || item.id;
      if (id) ids.add(String(id));
    });
  });
  return ids;
}

function matchesFilterKey(product, key, haystack, lookIds) {
  if (key === "look") {
    return lookIds.has(String(product.id)) || hasAny(haystack, FILTER_ALIASES.look);
  }

  if (key === "pre-ss26") {
    return hasAny(haystack, FILTER_ALIASES["pre-ss26"]);
  }

  if (key === "ss26") {
    return hasAny(haystack, FILTER_ALIASES.ss26) && !hasAny(haystack, FILTER_ALIASES["pre-ss26"]);
  }

  if (key === "cuir") {
    const withoutSimili = haystack
      .replace(/simili[-\s]?cuir/g, " ")
      .replace(/faux leather|vegan leather/g, " ");
    return hasAny(withoutSimili, FILTER_ALIASES.cuir);
  }

  const aliases = FILTER_ALIASES[key];
  return aliases ? hasAny(haystack, aliases) : false;
}

export function getSelectedFilterEntries(filterRoot) {
  return [...filterRoot.querySelectorAll('input[type="checkbox"]:checked')]
    .map((input) => ({
      group: input.dataset.filterGroup || "",
      key: input.dataset.filterKey || "",
    }))
    .filter((entry) => entry.group && entry.key);
}

export function productMatchesFilters(product, selectedFilters) {
  if (!selectedFilters?.length) return true;

  const haystack = productSearchText(product);
  const lookIds = selectedFilters.some((entry) => entry.key === "look") ? styleLookProductIds() : new Set();

  const grouped = new Map();
  selectedFilters.forEach((entry) => {
    const list = grouped.get(entry.group) || [];
    list.push(entry.key);
    grouped.set(entry.group, list);
  });

  for (const keys of grouped.values()) {
    const matchesGroup = keys.some((key) => matchesFilterKey(product, key, haystack, lookIds));
    if (!matchesGroup) return false;
  }

  return true;
}
