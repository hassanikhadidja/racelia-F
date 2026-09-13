import { applyI18n, t } from "./i18n.js";

const STORY_IMAGES = {
  tendance: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80",
  banane: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=200&q=80",
  year: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=200&q=80",
  luxe: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=200&q=80",
  grand: "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cef?auto=format&fit=crop&w=200&q=80",
  louisvuitton: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80",
  hermes: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=200&q=80",
  modele: "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=200&q=80",
  bandouliere: "https://images.unsplash.com/photo-1590874103328-eac38a941f82?auto=format&fit=crop&w=200&q=80",
  lacos: "https://images.unsplash.com/photo-1594223274200-ef3786431443?auto=format&fit=crop&w=200&q=80",
};

const STORY_ITEMS = [
  { id: "tendance", i18n: "home.stories.tendance", color: "#c7cff8", image: STORY_IMAGES.tendance, page: "nouveautes" },
  { id: "banane", i18n: "home.stories.banane", color: "#f6eee4", image: STORY_IMAGES.banane, page: "mini-bags" },
  { id: "year", i18n: "home.stories.year", color: "#f4c8c0", image: STORY_IMAGES.year, page: "nouveautes" },
  { id: "luxe", i18n: "home.stories.luxe", color: "#f6e6d4", image: STORY_IMAGES.luxe, page: "racelia-handbag" },
  { id: "grand", i18n: "home.stories.grand", color: "#b8ebdc", image: STORY_IMAGES.grand, page: "moms-bags" },
  { id: "louisvuitton", i18n: "home.stories.louisvuitton", color: "#f6eee4", image: STORY_IMAGES.louisvuitton, page: "sacs" },
  { id: "hermes", i18n: "home.stories.hermes", color: "#b8ebdc", image: STORY_IMAGES.hermes, page: "racelia-handbag" },
  { id: "modele", i18n: "home.stories.modele", color: "#c7cff8", image: STORY_IMAGES.modele, page: "all-selection" },
  { id: "bandouliere", i18n: "home.stories.bandouliere", color: "#f6eee4", image: STORY_IMAGES.bandouliere, page: "mini-bags" },
  { id: "lacos", i18n: "home.stories.lacos", color: "#f4c8c0", image: STORY_IMAGES.lacos, page: "sacs" },
];

function createStoryButton(item) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "home-stories__item";
  btn.dataset.storyId = item.id;
  if (item.page) btn.dataset.page = item.page;
  if (item.search) btn.dataset.search = item.search;

  if (item.color) btn.style.background = item.color;

  const thumb = document.createElement("span");
  thumb.className = "home-stories__thumb";
  if (item.image) {
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = "";
    img.decoding = "async";
    thumb.appendChild(img);
  }

  const label = document.createElement("span");
  label.className = "home-stories__label";
  label.dataset.i18n = item.i18n;
  label.textContent = t(item.i18n);
  btn.setAttribute("aria-label", label.textContent);

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
      root.dispatchEvent(new CustomEvent("racelia:open-category", { detail: { categoryKey: page } }));
    }
  });
}
