import {
  getActiveWebPic,
  getCurrentWebPicDevice,
  loadWebPics,
} from "./dashboardWebPicsData.js";
import { getNewArrivalProducts } from "./productCatalog.js";

const SECTION_SELECTORS = {
  hero: ".hero",
  category: ".category-block",
  intro: ".intro",
  products: "#newArrivalsSection",
  editorial: ".editorial",
  other: ".page-main",
};

function clearSectionLink(el) {
  if (!el) return;
  el.classList.remove("home-webpic--linked");
  el.removeAttribute("data-product-id");
  el.style.cursor = "";
  if (el._webpicClick) {
    el.removeEventListener("click", el._webpicClick);
    el._webpicClick = null;
  }
}

function applyImgTarget(img, pic) {
  if (!img || !pic?.image) return;
  img.src = pic.image;
  img.alt = pic.title || "Home section image";
  img.style.display = "";
}

function ensureSectionMedia(sectionEl, pic) {
  if (!sectionEl || !pic?.image) return null;

  const existingImg = sectionEl.querySelector(":scope > img");
  if (existingImg) {
    applyImgTarget(existingImg, pic);
    return existingImg;
  }

  let wrap = sectionEl.querySelector(".home-webpic-media");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "home-webpic-media";
    sectionEl.prepend(wrap);
  }

  let img = wrap.querySelector("img");
  if (!img) {
    img = document.createElement("img");
    img.alt = pic.title || "Section image";
    wrap.appendChild(img);
  }
  applyImgTarget(img, pic);
  return wrap;
}

function bindProductLink(root, el, pic) {
  clearSectionLink(el);
  if (!pic?.linksToProduct || !pic.productId) return;

  el.classList.add("home-webpic--linked");
  el.dataset.productId = pic.productId;
  el.style.cursor = "pointer";

  const handler = (event) => {
    if (event.target.closest("a, button, input, select, textarea")) return;
    event.preventDefault();
    root.dispatchEvent(
      new CustomEvent("racelia:open-product", {
        detail: { productId: pic.productId },
        bubbles: true,
      })
    );
  };

  el._webpicClick = handler;
  el.addEventListener("click", handler);
}

export function applyHomeWebPics(root) {
  const pageMain = root.querySelector("#pageMain");
  if (!pageMain || pageMain.hidden) return;

  const device = getCurrentWebPicDevice();
  const pics = loadWebPics();

  Object.entries(SECTION_SELECTORS).forEach(([section, selector]) => {
    const el = pageMain.querySelector(selector);
    if (!el) return;

    if (section === "products" && !getNewArrivalProducts().length) {
      clearSectionLink(el);
      el.querySelector(".home-webpic-media")?.remove();
      return;
    }

    const pic = getActiveWebPic(device, section, pics);
    clearSectionLink(el);

    if (!pic) {
      const media = el.querySelector(".home-webpic-media");
      if (media) media.remove();
      return;
    }

    ensureSectionMedia(el, pic);
    bindProductLink(root, el, pic);
  });
}

export function initHomeWebPics(root) {
  const apply = () => applyHomeWebPics(root);
  window.addEventListener("resize", apply, { passive: true });
  apply();
}
