import { setSelectedAudience } from "./audience.js";
import { applyI18n, t } from "./i18n.js";
import { applyResponsiveImage } from "./imageDelivery.js";

const STORY_IMAGES = {
  tendance: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1790601086/37efbc3e83b343577dacc7b2cde14bc4_jkjotk.jpg",
  banane: "/images/story-racelia-mark.jpg",
  year: "/images/story-cc-bag.jpg",
  luxe: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1790730350/photo_2026-09-30_02-01-49_aqqtld.jpg",
  grand: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1790730704/f1ac71d5c79611f9866923f1e00193e8_znfhay.jpg",
  louisvuitton: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1790730868/4c93e27ee7e5d08a5255c06e8a9328f8_kbjxfn.jpg",
  hermes: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1790731232/9a226f44dd7dadc3c4066f18ed893541_izgozw.jpg",
  modele: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1790731452/fd1e4a1bdd291fcfa75eb869ad891440_iohrf8.jpg",
  lacos: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1790732176/601d2b18b3a7e50fe6efecedae06e137_mvcqja.jpg",
};

export const STORY_ITEMS = [
  { id: "tendance", i18n: "home.stories.tendance", color: "#c7cff8", image: STORY_IMAGES.tendance, page: "nouveautes" },
  { id: "banane", i18n: "home.stories.banane", color: "#f6eee4", image: STORY_IMAGES.banane, page: "racelia-handbag", clearAudience: true },
  {
    id: "year",
    i18n: "home.stories.year",
    color: "#f6eee4",
    image: STORY_IMAGES.year,
    labelImage: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1790601490/Brown_Illustration_Luxury_Bag_Online_Shop_Logo_v37jry.png",
    page: "icons-cc",
    clearAudience: true,
  },
  { id: "luxe", i18n: "home.stories.luxe", color: "#f6e6d4", image: STORY_IMAGES.luxe, page: "moms-bags", clearAudience: true },
  { id: "grand", i18n: "home.stories.grand", color: "#b8ebdc", image: STORY_IMAGES.grand, page: "hammam", clearAudience: true },
  { id: "louisvuitton", i18n: "home.stories.louisvuitton", color: "#f6eee4", image: STORY_IMAGES.louisvuitton, page: "homme", clearAudience: true },
  { id: "hermes", i18n: "home.stories.hermes", color: "#b8ebdc", image: STORY_IMAGES.hermes, page: "petite-princesse", clearAudience: true },
  { id: "modele", i18n: "home.stories.modele", color: "#c7cff8", image: STORY_IMAGES.modele, page: "mariee", clearAudience: true },
  { id: "lacos", i18n: "home.stories.lacos", color: "#f4c8c0", image: STORY_IMAGES.lacos, page: "parfums-feminins", clearAudience: true },
];

function createStoryButton(item) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "home-stories__item";
  btn.dataset.storyId = item.id;
  if (item.page) btn.dataset.page = item.page;
  if (item.clearAudience) btn.dataset.clearAudience = "true";
  if (item.search) btn.dataset.search = item.search;

  if (item.color) btn.style.background = item.color;

  const thumb = document.createElement("span");
  thumb.className = "home-stories__thumb";
  if (item.image) {
    const img = document.createElement("img");
    img.alt = "";
    applyResponsiveImage(img, item.image, { width: 96, widths: [48, 96], sizes: "34px" });
    thumb.appendChild(img);
  }

  const labelText = t(item.i18n);
  btn.setAttribute("aria-label", labelText);

  if (item.labelImage) {
    const mark = document.createElement("img");
    mark.className = "home-stories__mark";
    mark.alt = "";
    applyResponsiveImage(mark, item.labelImage, { width: 160, widths: [96, 160], sizes: "64px" });
    btn.append(thumb, mark);
    return btn;
  }

  const label = document.createElement("span");
  label.className = "home-stories__label";
  label.dataset.i18n = item.i18n;
  label.textContent = labelText;

  btn.append(thumb, label);
  return btn;
}

export function renderHomeStories(root) {
  const track = root.querySelector("#homeStoriesTrack");
  if (!track) return;

  track.replaceChildren(...STORY_ITEMS.map(createStoryButton));
  applyI18n(track);
}

export function initHomeStories(root) {
  const section = root.querySelector("#homeStories");
  if (!section || section.dataset.bound === "true") {
    renderHomeStories(root);
    return;
  }

  section.dataset.bound = "true";
  renderHomeStories(root);

  section.addEventListener("click", (event) => {
    const item = event.target.closest(".home-stories__item");
    if (!item || !section.contains(item)) return;

    const search = item.dataset.search;
    const page = item.dataset.page;

    if (search) {
      root.dispatchEvent(new CustomEvent("racelia:open-search", { detail: { query: search } }));
      return;
    }
    if (page) {
      if (item.dataset.clearAudience === "true") {
        setSelectedAudience("");
        root.dispatchEvent(new CustomEvent("racelia:audience-changed"));
      }
      root.dispatchEvent(new CustomEvent("racelia:open-category", { detail: { categoryKey: page } }));
    }
  });
}
