import { collectBagItems, refreshShoppingBagTotals } from "./bagHelpers.js";
import { syncBagCountFromDom } from "./cart.js";
import { formatPrice, parsePrice } from "./currency.js";

export function initShoppingBag(root, { onBack } = {}) {
  const page = root.querySelector("#shoppingBagPage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  const leave = () => {
    if (typeof onBack === "function") {
      onBack();
      return;
    }
    root.dispatchEvent(new CustomEvent("racelia:leave-shopping-bag"));
  };

  page.querySelector(".js-shopping-bag-back")?.addEventListener("click", (event) => {
    event.preventDefault();
    leave();
  });

  const modal = page.querySelector("#promoModal");
  const promoInput = page.querySelector("#promoInput");

  const openPromo = () => {
    modal?.classList.add("active");
    setTimeout(() => promoInput?.focus(), 50);
  };

  const closePromo = () => {
    modal?.classList.remove("active");
  };

  const updateTotal = () => {
    let total = 0;
    page.querySelectorAll(".bag-item").forEach((item) => {
      const qty = parseInt(item.querySelector(".qty-select")?.value || "1", 10);
      const price = parsePrice(item.querySelector(".item-price")?.textContent);
      total += qty * price;
    });
    const formatted = formatPrice(total);
    const subtotal = page.querySelector("#subtotal");
    const totalEl = page.querySelector("#total");
    if (subtotal) subtotal.textContent = formatted;
    if (totalEl) totalEl.textContent = formatted;
    updateCount(page, formatted);
  };

  const removeItem = (el) => {
    if (!el) return;
    el.style.transition = "opacity 0.3s, transform 0.3s";
    el.style.opacity = "0";
    el.style.transform = "translateX(30px)";
    setTimeout(() => {
      el.remove();
      updateTotal();
      syncBagCountFromDom(root);
      root.dispatchEvent(new CustomEvent("racelia:cart-changed", { bubbles: true }));
    }, 300);
  };

  const saveItem = (item) => {
    const svg = item?.querySelector(".save-btn svg");
    if (!svg) return;
    svg.setAttribute("fill", "#000");
    svg.setAttribute("stroke", "#000");
  };

  page.addEventListener("click", (event) => {
    const target = event.target;

    if (target.closest(".js-promo-open")) {
      event.preventDefault();
      openPromo();
      return;
    }

    if (target.closest(".js-promo-close") || target.closest(".modal-backdrop")) {
      event.preventDefault();
      closePromo();
      return;
    }

    if (target.closest(".js-promo-apply")) {
      event.preventDefault();
      const code = promoInput?.value.trim() || "";
      if (!code) {
        window.alert("Please enter a promo code.");
        return;
      }
      window.alert(`Promo code "${code}" applied!`);
      closePromo();
      return;
    }

    if (target.closest(".js-wishlist-page-open")) {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-wishlist"));
      return;
    }

    if (target.closest(".js-shopping-bag-signin")) {
      event.preventDefault();
      window.alert("Sign in — demo");
      return;
    }

    if (target.closest(".remove-btn")) {
      event.preventDefault();
      removeItem(target.closest(".bag-item"));
      return;
    }

    if (target.closest(".save-btn")) {
      event.preventDefault();
      saveItem(target.closest(".bag-item"));
      return;
    }

    if (target.closest(".js-checkout")) {
      event.preventDefault();
      const hasItems = page.querySelectorAll(".bag-item").length > 0;
      if (!hasItems) {
        window.alert("Your bag is empty.");
        return;
      }
      root.dispatchEvent(new CustomEvent("racelia:open-checkout"));
    }
  });

  page.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.closest(".js-promo-open")) {
      event.preventDefault();
      openPromo();
    }
  });

  page.addEventListener("change", (event) => {
    if (event.target.matches(".qty-select")) {
      updateTotal();
      syncBagCountFromDom(root);
      root.dispatchEvent(new CustomEvent("racelia:cart-changed", { bubbles: true }));
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !page.hidden && modal?.classList.contains("active")) {
      closePromo();
      return;
    }
    if (event.key === "Escape" && !page.hidden) {
      leave();
    }
  });

  root.addEventListener("racelia:currency-changed", () => {
    refreshShoppingBagTotals(root);
  });

  updateTotal();
}

function updateCount(page, totalText) {
  let count = 0;
  page.querySelectorAll(".bag-item").forEach((item) => {
    count += parseInt(item.querySelector(".qty-select")?.value || "1", 10);
  });
  const countEl = page.querySelector(".bag-header-count");
  const totalEl = page.querySelector(".bag-header-total");
  const labelEl = page.querySelector(".bag-header-items-label");
  if (countEl) countEl.textContent = String(count);
  if (labelEl) labelEl.textContent = count === 1 ? "item" : "items";
  if (totalEl && totalText) totalEl.textContent = totalText;
}
