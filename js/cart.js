import { showShoppingBag } from "./pages.js";
import { addCategoryCardToBag, refreshShoppingBagTotals } from "./bagHelpers.js";
import { openPdpAddedOverlay } from "./cartAddedOverlay.js";

let bagCount = 0;
export function getBagCount() {
  return bagCount;
}

export function syncBagCountFromDom(root) {
  const page = root.querySelector("#shoppingBagPage");
  bagCount = 0;

  page?.querySelectorAll(".bag-item").forEach((item) => {
    bagCount += parseInt(item.querySelector(".qty-select")?.value || "1", 10);
  });

  updateTopbarCart(root);
  return bagCount;
}

/** @deprecated Prefer upsertBagLineItem + syncBagCountFromDom */
export function addToBag(root, quantity = 1) {
  syncBagCountFromDom(root);
  return bagCount;
}

export function updateTopbarCart(root) {
  const cartBtn = root.querySelector("#topbarCartBtn");
  const badge = root.querySelector("#topbarCartBadge");
  if (!cartBtn || !badge) return;

  if (bagCount > 0) {
    cartBtn.hidden = false;
    badge.textContent = String(bagCount);
    cartBtn.setAttribute("aria-label", `Shopping bag, ${bagCount} item${bagCount === 1 ? "" : "s"}`);
  } else {
    cartBtn.hidden = true;
    badge.textContent = "0";
    cartBtn.setAttribute("aria-label", "Panier");
  }
}

export function initCart(root) {
  syncBagCountFromDom(root);

  root.addEventListener("click", (event) => {
    const addBtn = event.target.closest(".category-product__add");
    if (!addBtn || event.target.closest("#productDetailPage .category-product__add")) return;

    event.stopPropagation();
    const card = addBtn.closest(".category-product");
    if (!card) return;

    if (addCategoryCardToBag(root, card, { qty: 1, mode: "add" })) {
      syncBagCountFromDom(root);
      refreshShoppingBagTotals(root);
      openPdpAddedOverlay(root, 1);
    }
  });

  root.querySelector("#topbarCartBtn")?.addEventListener("click", () => {
    showShoppingBag(root);
  });
}
