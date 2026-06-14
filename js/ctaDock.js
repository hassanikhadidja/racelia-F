import { updatePdpActionBar } from "./pdpActionBar.js";

const CTA_BOTTOM = 16;
const CTA_HEIGHT = 55;

function getActiveDock(root) {
  const productDetailPage = root.querySelector("#productDetailPage");
  const categoryPage = root.querySelector("#categoryPage");
  const blogsPage = root.querySelector("#blogsPage");
  const pageMain = root.querySelector("#pageMain");

  if (productDetailPage && !productDetailPage.hidden) {
    return root.querySelector("#pdpCtaDock");
  }

  if (categoryPage && !categoryPage.hidden) {
    return root.querySelector("#categoryCtaDock");
  }

  if (blogsPage && !blogsPage.hidden) {
    return root.querySelector("#blogsCtaDock");
  }

  if (pageMain && !pageMain.hidden) {
    return root.querySelector("#ctaDock");
  }

  return null;
}

function isOnProductDetailPage(root) {
  const page = root.querySelector("#productDetailPage");
  return page && !page.hidden;
}

export { isOnProductDetailPage };

export function getActiveDockSlot(root) {
  const productDetailPage = root.querySelector("#productDetailPage");
  const categoryPage = root.querySelector("#categoryPage");
  const blogsPage = root.querySelector("#blogsPage");
  const pageMain = root.querySelector("#pageMain");

  if (productDetailPage && !productDetailPage.hidden) {
    return root.querySelector("#pdpCtaDockSlot");
  }

  if (categoryPage && !categoryPage.hidden) {
    return root.querySelector("#categoryCtaDockSlot");
  }

  if (blogsPage && !blogsPage.hidden) {
    return root.querySelector("#blogsCtaDockSlot");
  }

  if (pageMain && !pageMain.hidden) {
    return root.querySelector("#ctaDockSlot");
  }

  return null;
}

export function isCtaDockReached(root) {
  const dock = getActiveDock(root);
  if (!dock) return false;

  const dockTop = dock.getBoundingClientRect().top;
  const limit = window.innerHeight - CTA_BOTTOM - CTA_HEIGHT;
  return dockTop <= limit;
}

export function updateCtaDock(root) {
  const widget = root.querySelector("#selectionWidget");
  const dock = getActiveDock(root);

  if (!dock || !widget) return;
  if (widget.classList.contains("modal-animated-container--open")) return;

  widget.classList.remove("modal-animated-container--pdp");
  widget.classList.toggle("modal-animated-container--instant-dock", isOnProductDetailPage(root));
  widget.classList.toggle("modal-animated-container--docked", isCtaDockReached(root));

  updatePdpActionBar(root);
}

export function initCtaDock(root) {
  updateCtaDock(root);
  window.addEventListener("scroll", () => updateCtaDock(root), { passive: true });
  window.addEventListener("resize", () => updateCtaDock(root));
}
