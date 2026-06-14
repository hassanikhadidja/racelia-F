export function initWishlist(root, { onMoveToBag, onOpenBag } = {}) {
  const page = root.querySelector("#wishlistPage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  const leave = () => {
    root.dispatchEvent(new CustomEvent("racelia:leave-wishlist"));
  };

  const list = page.querySelector("#wishlistList");
  const empty = page.querySelector("#wishlistEmpty");
  const countEl = page.querySelector(".wishlist-count");
  const labelEl = page.querySelector(".wishlist-count-label");

  const updateSummary = () => {
    const items = list?.querySelectorAll(".wishlist-item") ?? [];
    const count = items.length;
    if (countEl) countEl.textContent = String(count);
    if (labelEl) labelEl.textContent = count === 1 ? "item" : "items";
    if (list) list.hidden = count === 0;
    if (empty) empty.hidden = count > 0;
    page.querySelector(".wishlist-footer")?.toggleAttribute("hidden", count === 0);
  };

  const removeItem = (item) => {
    if (!item) return;
    item.style.transition = "opacity 0.3s ease";
    item.style.opacity = "0";
    setTimeout(() => {
      item.remove();
      updateSummary();
    }, 300);
  };

  page.querySelector(".js-wishlist-back")?.addEventListener("click", leave);
  page.querySelector(".js-wishlist-continue")?.addEventListener("click", leave);

  page.addEventListener("click", (event) => {
    const target = event.target;

    if (target.closest(".js-wishlist-remove")) {
      event.preventDefault();
      removeItem(target.closest(".wishlist-item"));
      return;
    }

    if (target.closest(".js-wishlist-move-to-bag")) {
      event.preventDefault();
      const item = target.closest(".wishlist-item");
      removeItem(item);
      onMoveToBag?.();
      return;
    }

    if (target.closest(".js-wishlist-open-bag")) {
      event.preventDefault();
      onOpenBag?.();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !page.hidden) leave();
  });

  updateSummary();
}
