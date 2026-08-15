import { refreshShoppingBagTotals } from "./bagHelpers.js";
import { syncBagCountFromDom } from "./cart.js";
import { applyLoyaltyCode } from "./loyaltyCard.js";
import { getAuthToken } from "./api.js";
import { setFormStatus } from "./formStatus.js";

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
    refreshShoppingBagTotals(root);
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
      const promoPanel = page.querySelector("#promoModal .modal-panel") || page;
      const code = promoInput?.value.trim() || "";
      if (!code) {
        setFormStatus(promoPanel, "Veuillez saisir un code promo.");
        return;
      }
      if (!getAuthToken()) {
        setFormStatus(promoPanel, "Connectez-vous pour utiliser un code de fidélité.");
        return;
      }
      const result = applyLoyaltyCode(code);
      if (!result.ok) {
        setFormStatus(promoPanel, result.error);
        return;
      }
      setFormStatus(
        promoPanel,
        result.reward.type === "free_item"
          ? "Code appliqué. Choisissez l’article offert lors du paiement."
          : `Code promo « ${result.reward.code} » appliqué.`,
        "ok"
      );
      closePromo();
      updateTotal();
      return;
    }

    if (target.closest(".js-wishlist-page-open")) {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-wishlist"));
      return;
    }

    if (target.closest(".js-shopping-bag-signin")) {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-account"));
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
