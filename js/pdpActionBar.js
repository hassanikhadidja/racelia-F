import { isCtaDockReached } from "./ctaDock.js";

const CTA_BOTTOM = 16;
const SELECTION_HEIGHT = 55;
const DOCKED_GAP = 8;
const FLOATING_SELECTION_OFFSET = CTA_BOTTOM + SELECTION_HEIGHT + DOCKED_GAP;

function getActionBarBottom(root) {
  const widget = root.querySelector("#selectionWidget");
  if (widget?.classList.contains("modal-animated-container--docked")) {
    return CTA_BOTTOM + SELECTION_HEIGHT + DOCKED_GAP;
  }
  return FLOATING_SELECTION_OFFSET;
}

function placeBarInWrap(wrap, bar) {
  if (bar.parentElement !== wrap) {
    wrap.appendChild(bar);
  }
}

function placeBarInDock(root, bar) {
  const dockSlot = root.querySelector("#pdpActionBarDockSlot");
  if (dockSlot && bar.parentElement !== dockSlot) {
    dockSlot.appendChild(bar);
  }
}

export function updatePdpActionBar(root) {
  const page = root.querySelector("#productDetailPage");
  const wrap = root.querySelector("#pdpActionBarWrap");
  const bar = root.querySelector("#pdpActionBar");
  if (!page || page.hidden || !wrap || !bar) return;

  const rect = wrap.getBoundingClientRect();
  const barHeight = bar.offsetHeight;
  const shouldFix = rect.bottom <= 0;
  const dockReached = isCtaDockReached(root);

  if (shouldFix && dockReached) {
    placeBarInDock(root, bar);
    bar.classList.remove("is-fixed");
    bar.classList.add("is-docked");
    bar.style.bottom = "";
    wrap.style.minHeight = `${barHeight}px`;
    return;
  }

  if (bar.classList.contains("is-docked")) {
    placeBarInWrap(wrap, bar);
    bar.classList.remove("is-docked");
  }

  if (shouldFix) {
    placeBarInWrap(wrap, bar);
    bar.style.bottom = `${getActionBarBottom(root)}px`;
    bar.classList.add("is-fixed");
    wrap.style.minHeight = `${barHeight}px`;
    return;
  }

  placeBarInWrap(wrap, bar);
  bar.classList.remove("is-fixed", "is-docked");
  bar.style.bottom = "";
  wrap.style.minHeight = "";
}

export function initPdpActionBar(root) {
  if (root.dataset.pdpActionBarBound === "true") return;
  root.dataset.pdpActionBarBound = "true";

  const update = () => updatePdpActionBar(root);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}
