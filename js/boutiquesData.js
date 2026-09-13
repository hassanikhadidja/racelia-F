/** Boutiques RACÈLIA — points de vente. */

import { normalizeAudiences } from "./audience.js";

export const BOUTIQUES_STORAGE_KEY = "raceliaBoutiques";

export const STORE_TYPES = [
  { value: "boutique", label: "Boutique" },
  { value: "maroquinerie", label: "Maroquinerie" },
  { value: "atelier", label: "Atelier" },
  { value: "corner", label: "Corner" },
  { value: "boutique-de-mode", label: "Boutique de mode" },
  { value: "vente-en-ligne", label: "Vente en ligne" },
];

const LEGACY_STORE_TYPES = {
  flagship: "boutique",
  "boutique phare": "boutique",
  online: "vente-en-ligne",
  "boutique en ligne": "vente-en-ligne",
  "vente en ligne": "vente-en-ligne",
  "boutique de mode": "boutique-de-mode",
};

export const ONLINE_STORE_TYPE = "vente-en-ligne";

export function normalizeStoreType(type) {
  const raw = String(type || "")
    .trim()
    .toLowerCase();
  if (!raw) return "boutique";
  if (LEGACY_STORE_TYPES[raw]) return LEGACY_STORE_TYPES[raw];
  const compact = raw.replace(/\s+/g, "-");
  if (STORE_TYPES.some((item) => item.value === compact)) return compact;
  const byLabel = STORE_TYPES.find((item) => item.label.toLowerCase() === raw);
  return byLabel?.value || "boutique";
}

export function isOnlineStoreType(type) {
  return normalizeStoreType(type) === ONLINE_STORE_TYPE;
}

function mapsSearchUrl(lat, lng) {
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

export function parseMapCoords(mapLink) {
  const url = String(mapLink || "").trim();
  if (!url) return null;

  const at = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (at) return { lat: Number(at[1]), lng: Number(at[2]) };

  const ll = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (ll) return { lat: Number(ll[1]), lng: Number(ll[2]) };

  try {
    const parsed = new URL(url, "https://maps.google.com");
    const query = parsed.searchParams.get("query") || parsed.searchParams.get("q") || "";
    const pair = query.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
    if (pair) return { lat: Number(pair[1]), lng: Number(pair[2]) };
  } catch {
    /* ignore */
  }

  return null;
}

export function storeMapUrl(store) {
  const link = String(store?.mapLink || "").trim();
  if (link) return /^https?:\/\//i.test(link) ? link : `https://${link}`;
  return mapsSearchUrl(store?.lat, store?.lng);
}

export function storeTypeLabel(type) {
  const value = normalizeStoreType(type);
  return STORE_TYPES.find((t) => t.value === value)?.label || type || "";
}

export function normalizeSearchText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function storeMatchesType(store, type) {
  if (!type) return true;
  const wanted = normalizeStoreType(type);
  if (wanted === ONLINE_STORE_TYPE) {
    return Boolean(store?.isOnlineStore) || isOnlineStoreType(store?.type);
  }
  return normalizeStoreType(store?.type) === wanted;
}

export function storeMatchesQuery(store, query) {
  const tokens = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;
  const hay = normalizeSearchText(
    [
      store?.name,
      store?.location,
      store?.note,
      store?.city,
      store?.postal,
      store?.address,
      store?.hours,
      storeTypeLabel(store?.type),
    ]
      .filter(Boolean)
      .join(" ")
  );
  return tokens.every((token) => hay.includes(token));
}

function locationFromLegacy(store) {
  const existing = String(store.location || "").trim();
  if (existing) return existing;
  const parts = [];
  if (store.address) parts.push(String(store.address).trim());
  const cityPostal = [store.city, store.postal].filter(Boolean).join(" ");
  if (cityPostal) parts.push(cityPostal);
  return parts.join(" · ");
}

export function normalizeStore(store) {
  if (!store || typeof store !== "object") return null;

  const type = isOnlineStoreType(store.type) || Boolean(store.isOnlineStore)
    ? ONLINE_STORE_TYPE
    : normalizeStoreType(store.type);
  const isOnlineStore = type === ONLINE_STORE_TYPE;
  const mapLink = isOnlineStore
    ? ""
    : String(store.mapLink || "").trim() || mapsSearchUrl(store.lat, store.lng);
  const coords = isOnlineStore
    ? null
    : parseMapCoords(mapLink) ||
      (Number.isFinite(Number(store.lat)) && Number.isFinite(Number(store.lng))
        ? { lat: Number(store.lat), lng: Number(store.lng) }
        : null);

  return {
    id: String(store.id || "").trim(),
    name: String(store.name || "").trim(),
    type,
    location: locationFromLegacy(store),
    city: String(store.city || "").trim(),
    postal: String(store.postal || "").trim(),
    phone: String(store.phone || "").trim(),
    website: String(store.website || "").trim(),
    hours: String(store.hours || "").trim(),
    note: store.note ? String(store.note).trim() : "",
    mapLink,
    isOnlineStore,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
    audiences: normalizeAudiences(store.audiences),
  };
}

export const RACELIA_STORES = [
  {
    id: "alger-didouche",
    name: "RACÈLIA Alger — Didouche Mourad",
    type: "flagship",
    address: "24 boulevard Didouche Mourad, Alger Centre",
    city: "Alger",
    postal: "16000",
    phone: "+213 21 00 00 01",
    website: "https://racelia.com",
    hours: "Lun–Sam 10h–19h · Dim 11h–17h",
    note: "Boutique phare — collection complète et services personnalisés.",
    lat: 36.7753,
    lng: 3.0588,
    audiences: ["femme", "homme", "enfants", "mariee", "hammam"],
  },
  {
    id: "alger-hydracity",
    name: "RACÈLIA Alger — Hydra",
    type: "boutique",
    address: "Chemin Mackley, Hydra, Alger",
    city: "Alger",
    postal: "16035",
    phone: "+213 21 00 00 02",
    website: "https://racelia.com",
    hours: "Lun–Sam 10h–19h",
    note: "Essai et conseils d’entretien.",
    lat: 36.7472,
    lng: 3.0365,
    audiences: ["femme", "mariee", "hammam"],
  },
  {
    id: "oran-front-de-mer",
    name: "RACÈLIA Oran — Front de mer",
    type: "boutique",
    address: "Boulevard de la Soummam, Oran",
    city: "Oran",
    postal: "31000",
    phone: "+213 41 00 00 03",
    website: "https://racelia.com",
    hours: "Lun–Sam 10h–19h · Dim fermé",
    note: "Livraison express disponible depuis cette boutique.",
    lat: 35.6971,
    lng: -0.6308,
    audiences: ["homme"],
  },
  {
    id: "constantine-centre",
    name: "RACÈLIA Constantine",
    type: "corner",
    address: "Avenue Aouati Mostefa, Constantine",
    city: "Constantine",
    postal: "25000",
    phone: "+213 31 00 00 04",
    website: "https://racelia.com",
    hours: "Lun–Sam 10h–18h30",
    note: "Corner partenaire — sélection saisonnière.",
    lat: 36.365,
    lng: 6.6147,
    audiences: ["enfants"],
  },
  {
    id: "blida-centre",
    name: "RACÈLIA Blida",
    type: "boutique",
    address: "Rue des Frères Bouadou, Blida",
    city: "Blida",
    postal: "09000",
    phone: "+213 25 00 00 05",
    website: "https://racelia.com",
    hours: "Lun–Sam 10h–19h",
    note: null,
    lat: 36.47,
    lng: 2.8277,
  },
  {
    id: "setif-atelier",
    name: "Atelier RACÈLIA Sétif",
    type: "atelier",
    address: "Zone industrielle, Sétif",
    city: "Sétif",
    postal: "19000",
    phone: "+213 36 00 00 06",
    website: "https://racelia.com",
    hours: "Sur rendez-vous",
    note: "Visites d’atelier sur rendez-vous uniquement.",
    lat: 36.1911,
    lng: 5.4137,
  },
].map(normalizeStore);

function readStoredStores() {
  try {
    const raw = localStorage.getItem(BOUTIQUES_STORAGE_KEY);
    if (raw == null) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map(normalizeStore).filter((store) => store?.id && store?.name);
  } catch {
    return null;
  }
}

export function loadStores() {
  const stored = readStoredStores();
  if (stored) return stored;
  return RACELIA_STORES.map((store) => ({ ...store }));
}

export function saveStores(stores, root) {
  const list = (stores || []).map(normalizeStore).filter((store) => store?.id && store?.name);
  try {
    localStorage.setItem(BOUTIQUES_STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
  notifyBoutiquesUpdated(root);
  return list;
}

export function getStoreById(id) {
  return loadStores().find((store) => store.id === id) || null;
}

export function upsertStore(store, root) {
  const next = normalizeStore(store);
  if (!next?.id || !next.name) return null;
  const stores = loadStores();
  const index = stores.findIndex((item) => item.id === next.id);
  if (index >= 0) stores[index] = next;
  else stores.push(next);
  saveStores(stores, root);
  return next;
}

export function deleteStore(id, root) {
  saveStores(
    loadStores().filter((store) => store.id !== id),
    root
  );
}

export function createEmptyStore() {
  return normalizeStore({
    id: "",
    name: "",
    type: "boutique",
    location: "",
    phone: "",
    website: "",
    hours: "",
    note: "",
    mapLink: "",
    isOnlineStore: false,
  });
}

export function notifyBoutiquesUpdated(root) {
  const target = root || document.querySelector("#racelia-app");
  target?.dispatchEvent(new CustomEvent("racelia:boutiques-updated", { bubbles: true }));
}
