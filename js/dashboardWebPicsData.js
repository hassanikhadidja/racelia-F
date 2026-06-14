import { products, heroImage, editorialImage } from "./data.js";

export const WEBPICS_STORAGE_KEY = "raceliaDashboardWebPics";

export const WEBPIC_DEVICES = [
  { value: "mobile", label: "Mobile", size: "390×844" },
  { value: "tablet", label: "Tablet", size: "768×1024" },
  { value: "laptop", label: "Laptop", size: "1440×900" },
];

export const WEBPIC_SECTIONS = [
  { value: "hero", label: "Hero section" },
  { value: "category", label: "Category block" },
  { value: "intro", label: "Intro text" },
  { value: "products", label: "Product grid" },
  { value: "editorial", label: "Editorial" },
  { value: "other", label: "Other home section" },
];

const defaultWebPics = [
  {
    id: "webpic-seed-1",
    title: "Homepage hero — laptop",
    image: heroImage,
    device: "laptop",
    section: "hero",
    linksToProduct: false,
    productId: null,
    createdAt: 1,
  },
  {
    id: "webpic-seed-2",
    title: "Editorial — tablet",
    image: editorialImage,
    device: "tablet",
    section: "editorial",
    linksToProduct: false,
    productId: null,
    createdAt: 2,
  },
];

function readStorage() {
  try {
    const saved = localStorage.getItem(WEBPICS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return null;
}

export function loadWebPics() {
  const stored = readStorage();
  if (stored === null) {
    localStorage.setItem(WEBPICS_STORAGE_KEY, JSON.stringify(defaultWebPics));
    return [...defaultWebPics];
  }
  return stored;
}

export function saveWebPics(pics) {
  try {
    localStorage.setItem(WEBPICS_STORAGE_KEY, JSON.stringify(pics));
  } catch {
    /* ignore */
  }
}

export function getDeviceLabel(device) {
  return WEBPIC_DEVICES.find((d) => d.value === device)?.label || device;
}

export function getSectionLabel(section) {
  return WEBPIC_SECTIONS.find((s) => s.value === section)?.label || section;
}

export function getDeviceSize(device) {
  return WEBPIC_DEVICES.find((d) => d.value === device)?.size || "";
}

export function getCurrentWebPicDevice() {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "laptop";
}

/** Latest image for device + home section. */
export function getActiveWebPic(device, section, pics = loadWebPics()) {
  return (
    pics
      .filter((p) => p.device === device && p.section === section)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0] || null
  );
}

export function getProductOptions() {
  return products.map((p) => ({ id: p.id, name: p.name }));
}
