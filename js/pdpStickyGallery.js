function isDesktop() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function getHeaderOffset(root) {
  const topbar = root.querySelector(":scope > .topbar");
  if (!topbar) return 118;
  return Math.max(0, Math.round(topbar.getBoundingClientRect().bottom));
}

function clearPdpGalleryPin(hero, col) {
  if (hero) {
    hero.classList.remove("is-pinned", "is-pinned-bottom");
    hero.style.position = "";
    hero.style.top = "";
    hero.style.left = "";
    hero.style.right = "";
    hero.style.bottom = "";
    hero.style.width = "";
    hero.style.zIndex = "";
  }
  if (col) col.style.minHeight = "";
}

export function updatePdpStickyGallery(root) {
  const page = root.querySelector("#productDetailPage");
  const hero = page?.querySelector("#pdpHero");
  const stage = page?.querySelector(".pdp-gallery-stage");
  const sheet = page?.querySelector("#pdpSheet");
  const col = page?.querySelector(".pdp-gallery-col");

  if (!page || page.hidden || !hero || !stage || !sheet || !col) return;

  if (!isDesktop()) {
    clearPdpGalleryPin(hero, col);
    return;
  }

  col.style.position = "relative";
  col.style.minHeight = `${sheet.offsetHeight}px`;

  const top = getHeaderOffset(root);
  const sheetRect = sheet.getBoundingClientRect();
  const colRect = col.getBoundingClientRect();
  const heroHeight = hero.offsetHeight;
  const pinLimit = sheetRect.bottom - heroHeight;

  if (sheetRect.top >= top) {
    clearPdpGalleryPin(hero, col);
    col.style.minHeight = `${sheet.offsetHeight}px`;
    return;
  }

  if (pinLimit <= top) {
    hero.classList.add("is-pinned-bottom");
    hero.classList.remove("is-pinned");
    hero.style.position = "absolute";
    hero.style.top = "auto";
    hero.style.bottom = "0";
    hero.style.left = "0";
    hero.style.width = `${colRect.width}px`;
    hero.style.zIndex = "2";
    return;
  }

  hero.classList.add("is-pinned");
  hero.classList.remove("is-pinned-bottom");
  hero.style.position = "fixed";
  hero.style.top = `${top}px`;
  hero.style.bottom = "auto";
  hero.style.left = `${colRect.left}px`;
  hero.style.width = `${colRect.width}px`;
  hero.style.zIndex = "2";
}

export function initPdpStickyGallery(root) {
  if (root.dataset.pdpStickyGalleryBound === "true") return;
  root.dataset.pdpStickyGalleryBound = "true";

  const update = () => updatePdpStickyGallery(root);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  const page = root.querySelector("#productDetailPage");
  if (page && typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(update);
    observer.observe(page);
    root._pdpStickyGalleryObserver = observer;
  }
}
