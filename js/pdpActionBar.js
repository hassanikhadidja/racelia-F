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

function getDockSlot(root) {
  return root.querySelector("#pdpActionBarDockSlot");
}

function getWrap(root) {
  return root.querySelector("#pdpActionBarWrap");
}

/** Keep exactly one action bar in the document; prefer the one in the wrap. */
function getCanonicalActionBar(root) {
  const wrap = getWrap(root);
  const inWrap = wrap?.querySelector(":scope > .pdp-action-bar");
  if (inWrap) return inWrap;
  return root.querySelector(".pdp-action-bar");
}

function removeExtraActionBars(root, keepBar) {
  if (!keepBar) {
    root.querySelectorAll(".pdp-action-bar").forEach((el) => el.remove());
    return;
  }
  root.querySelectorAll(".pdp-action-bar").forEach((el) => {
    if (el !== keepBar) el.remove();
  });
}

function placeBarInWrap(wrap, bar) {
  if (!wrap || !bar) return;
  if (bar.parentElement !== wrap) {
    wrap.appendChild(bar);
  }
}

function placeBarInDock(root, bar) {
  const dockSlot = getDockSlot(root);
  if (!dockSlot || !bar) return;
  /* Always replace — never leave sibling bars in the dock. */
  dockSlot.replaceChildren(bar);
}

export function resetPdpActionBar(root) {
  const dockSlot = getDockSlot(root);
  const wrap = getWrap(root);
  const bar = getCanonicalActionBar(root);

  removeExtraActionBars(root, bar);

  if (wrap && bar) {
    placeBarInWrap(wrap, bar);
    bar.classList.remove("is-fixed", "is-docked");
    bar.style.bottom = "";
    wrap.style.minHeight = "";
  }

  if (dockSlot) {
    dockSlot.replaceChildren();
  }
}

export function updatePdpActionBar(root) {
  const page = root.querySelector("#productDetailPage");
  const wrap = getWrap(root);
  if (!page || page.hidden || !wrap) return;

  const bar = getCanonicalActionBar(root);
  if (!bar) return;

  removeExtraActionBars(root, bar);

  const rect = wrap.getBoundingClientRect();
  const barHeight = bar.offsetHeight || 52;
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

  if (bar.classList.contains("is-docked") || bar.parentElement !== wrap) {
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
