import { collectBagItems, refreshShoppingBagTotals } from "./bagHelpers.js";
import { formatPrice, parsePrice } from "./currency.js";

const QUILTED_ITEM_HTML = `
  <div class="item-image">
    <svg class="bag-svg" viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 30 Q70 8 120 30" stroke="#999" stroke-width="3" stroke-dasharray="5 3" fill="none" stroke-linecap="round"/>
      <rect x="22" y="30" width="96" height="68" rx="5" fill="#1e1e1e"/>
      <rect x="22" y="30" width="96" height="68" rx="5" stroke="#555" stroke-width="1.5"/>
      <line x1="22" y1="48" x2="118" y2="48" stroke="#444" stroke-width="1"/>
      <line x1="22" y1="64" x2="118" y2="64" stroke="#444" stroke-width="1"/>
      <line x1="22" y1="80" x2="118" y2="80" stroke="#444" stroke-width="1"/>
      <line x1="46" y1="30" x2="46" y2="98" stroke="#444" stroke-width="1"/>
      <line x1="70" y1="30" x2="70" y2="98" stroke="#444" stroke-width="1"/>
      <line x1="94" y1="30" x2="94" y2="98" stroke="#444" stroke-width="1"/>
      <rect x="59" y="56" width="22" height="16" rx="3" fill="#aaa"/>
      <text x="70" y="68" text-anchor="middle" fill="#2a2a2a" font-size="11" font-family="serif" font-weight="bold">C</text>
    </svg>
  </div>
  <div class="item-details">
    <p class="item-name">Tabby Shoulder Bag 20 With Pillow Quilting</p>
    <p class="item-color">Color: Silver/Black</p>
    <div class="item-row">
      <select class="qty-select">
        <option value="1" selected>1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <span class="item-price" data-price-eur="475">475.00 €</span>
    </div>
    <button type="button" class="save-btn" data-save-label="Tabby Shoulder Bag 20 Quilted">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      Save
    </button>
  </div>
  <button type="button" class="remove-btn" title="Remove item" aria-label="Remove item">✕</button>
`;

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
    }, 300);
  };

  const saveItem = (item) => {
    const svg = item?.querySelector(".save-btn svg");
    if (!svg) return;
    svg.setAttribute("fill", "#000");
    svg.setAttribute("stroke", "#000");
  };

  const moveToBag = () => {
    const wishEl = page.querySelector("#wishlist-quilted");
    if (!wishEl) return;

    wishEl.style.transition = "opacity 0.3s";
    wishEl.style.opacity = "0";
    setTimeout(() => {
      wishEl.remove();
      const bagItems = page.querySelector(".bag-items");
      if (!bagItems) return;

      const newItem = document.createElement("div");
      newItem.className = "bag-item";
      newItem.id = "item-quilted";
      newItem.style.opacity = "0";
      newItem.innerHTML = QUILTED_ITEM_HTML;
      bagItems.appendChild(newItem);
      requestAnimationFrame(() => {
        newItem.style.transition = "opacity 0.3s";
        newItem.style.opacity = "1";
      });
      updateTotal();
    }, 300);
  };

  const removeWishlist = () => {
    const el = page.querySelector("#wishlist-quilted");
    if (!el) return;
    el.style.transition = "opacity 0.3s";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
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

    if (target.closest(".js-wishlist-move")) {
      event.preventDefault();
      moveToBag();
      return;
    }

    if (target.closest(".js-wishlist-remove")) {
      event.preventDefault();
      removeWishlist();
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
