const AUDIENCE_STORAGE_KEY = "raceliaAudience";

export const AUDIENCES = [
  { id: "femme", label: "Femme" },
  { id: "homme", label: "Homme" },
  { id: "enfants", label: "Enfants" },
  { id: "mariee", label: "Mariée" },
  { id: "hammam", label: "Hammam" },
];

export const KIDS_GROUPS = [
  {
    id: "fille-6-14",
    label: "FILLE",
    age: "6 - 14 ANS",
    image:
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "garcon-6-14",
    label: "GARÇON",
    age: "6 - 14 ANS",
    image:
      "https://images.unsplash.com/photo-1503919548889-1b0ab73be4eb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "fille-0-6",
    label: "FILLE",
    age: "½ - 6 ANS",
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "garcon-0-6",
    label: "GARÇON",
    age: "½ - 6 ANS",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80",
  },
];

const AUDIENCE_IDS = new Set(AUDIENCES.map((item) => item.id));
const KIDS_GROUP_IDS = new Set(KIDS_GROUPS.map((item) => item.id));

export function isKidsGroup(id) {
  return KIDS_GROUP_IDS.has(String(id || ""));
}

export function getAudienceLabel(id) {
  return AUDIENCES.find((item) => item.id === id)?.label || "";
}

export function normalizeAudiences(list) {
  const source = Array.isArray(list) ? list : [];
  const next = new Set();
  source.forEach((value) => {
    const id = String(value || "").trim();
    if (id === "kids") next.add("enfants");
    else if (id === "mariee-hammam") {
      next.add("mariee");
      next.add("hammam");
    } else if (AUDIENCE_IDS.has(id)) next.add(id);
  });
  return [...next];
}

export function normalizeKidsGroup(value, sections = []) {
  const raw = String(value || "").trim();
  if (KIDS_GROUP_IDS.has(raw)) return raw;
  const fromSection = (Array.isArray(sections) ? sections : []).find((id) => KIDS_GROUP_IDS.has(id));
  return fromSection || "";
}

export function getSelectedAudience() {
  try {
    const value = sessionStorage.getItem(AUDIENCE_STORAGE_KEY) || "";
    return AUDIENCE_IDS.has(value) ? value : "";
  } catch {
    return "";
  }
}

export function setSelectedAudience(id) {
  const next = AUDIENCE_IDS.has(id) ? id : "";
  try {
    if (next) sessionStorage.setItem(AUDIENCE_STORAGE_KEY, next);
    else sessionStorage.removeItem(AUDIENCE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return next;
}

export function toggleSelectedAudience(id) {
  const current = getSelectedAudience();
  return setSelectedAudience(current === id ? "" : id);
}

export function productMatchesAudience(product, audience = getSelectedAudience()) {
  if (!audience) return true;
  const list = normalizeAudiences(product?.audiences);
  return list.includes(audience);
}

export function storeMatchesAudience(store, audience = getSelectedAudience()) {
  if (!audience) return true;
  const list = normalizeAudiences(store?.audiences);
  if (!list.length) return true;
  return list.includes(audience);
}
