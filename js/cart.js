import { showShoppingBag } from "./pages.js";

let bagCount = 0;

export function getBagCount() {
  return bagCount;
}

export function addToBag(root, quantity = 1) {
  const amount = Math.max(1, Number(quantity) || 1);
  bagCount += amount;
  updateTopbarCart(root);
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
    cartBtn.setAttribute("aria-label", "Shopping bag");
  }
}

export function initCart(root) {
  updateTopbarCart(root);

  root.addEventListener("click", (event) => {
    const addBtn = event.target.closest(".category-product__add");
    if (!addBtn || event.target.closest("#productDetailPage .category-product__add")) return;

    event.stopPropagation();
    addToBag(root, 1);
  });

  root.querySelector("#topbarCartBtn")?.addEventListener("click", () => {
    showShoppingBag(root);
  });
}
