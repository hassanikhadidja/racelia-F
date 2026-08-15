import { formatPrice } from "./bagHelpers.js";
import { closeCheckoutGeoPanels, initCheckoutGeoSelects } from "./checkoutSelect.js";
import {
  ONLINE_PAYMENT_METHOD_IDS,
  PAYMENT_METHOD_LABELS,
} from "./checkoutPaymentMethods.js";
import { submitOrder, getOrderConfig, syncClientData } from "./syncBackend.js";
import { recordPurchasedEgifts } from "./clientProfileEgifts.js";
import {
  getAppliedLoyaltyPromo,
  setFreeItemSelection,
  computeLoyaltyDiscount,
  loyaltyDiscountLabel,
  markLoyaltyRewardUsed,
} from "./loyaltyCard.js";
import { setFormStatus } from "./formStatus.js";

function getDeliveryFee() {
  return getOrderConfig().deliveryFee ?? 20;
}

function getOnlineDiscountRate() {
  return getOrderConfig().onlineDiscountRate ?? 0.05;
}

let checkoutItems = [];

export function getCheckoutItems() {
  return checkoutItems;
}

export function setCheckoutItems(items) {
  checkoutItems = items;
}

function renderOrderItems(page) {
  const list = page.querySelector("#checkoutItems");
  if (!list) return;

  list.replaceChildren();
  const promo = getAppliedLoyaltyPromo();
  const pickFree = promo?.type === "free_item";

  checkoutItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "checkout-item";
    if (pickFree && promo.freeItemId === item.id) li.classList.add("is-free");

    const media = document.createElement("div");
    media.className = "checkout-item__media";

    if (item.imageUrl && item.hasPhoto !== false) {
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.name;
      img.loading = "lazy";
      media.appendChild(img);
    } else if (item.imageHtml) {
      media.innerHTML = item.imageHtml;
    } else {
      media.classList.add("checkout-item__media--placeholder");
      media.textContent = "RACÈLIA";
    }

    const details = document.createElement("div");
    details.className = "checkout-item__details";
    details.innerHTML = `
      <p class="checkout-item__name">${escapeHtml(item.name)}</p>
      ${item.color ? `<p class="checkout-item__meta">${escapeHtml(item.color)}</p>` : ""}
      <p class="checkout-item__qty">Qté ${item.qty}</p>
      ${
        pickFree
          ? `<label class="checkout-item__free">
              <input type="radio" name="loyalty-free-item" value="${escapeHtml(item.id)}" ${
                promo.freeItemId === item.id ? "checked" : ""
              } />
              Article offert
            </label>`
          : ""
      }
    `;

    const price = document.createElement("p");
    price.className = "checkout-item__price";
    if (pickFree && promo.freeItemId === item.id) {
      const remaining = Math.max(0, item.lineTotal - item.unitPrice);
      price.innerHTML =
        remaining > 0
          ? `<span class="checkout-item__price-was">${formatPrice(item.lineTotal)}</span>${formatPrice(remaining)}`
          : `<span class="checkout-item__price-was">${formatPrice(item.lineTotal)}</span> OFFERT`;
    } else {
      price.textContent = formatPrice(item.lineTotal);
    }

    li.append(media, details, price);
    list.appendChild(li);
  });

  if (pickFree) {
    list.querySelectorAll('input[name="loyalty-free-item"]').forEach((input) => {
      input.addEventListener("change", () => {
        setFreeItemSelection(input.value);
        renderOrderItems(page);
        updateTotals(page);
      });
    });
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getSubtotal() {
  return checkoutItems.reduce((sum, item) => sum + item.lineTotal, 0);
}

function getPaymentMode(page) {
  return page.querySelector("#checkoutPaymentMode")?.value || "cod";
}

function getPaymentMethod(page) {
  return page.querySelector("#checkoutPaymentMethod")?.value || "visa";
}

function applyPaymentModeUI(page, mode) {
  const hidden = page.querySelector("#checkoutPaymentMode");
  if (hidden) hidden.value = mode;

  page.querySelectorAll("[data-payment-mode]").forEach((btn) => {
    const active = btn.dataset.paymentMode === mode;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-checked", String(active));
  });

  const onlineBlock = page.querySelector("#checkoutOnlineMethods");
  const isOnline = mode === "online";
  if (onlineBlock) {
    onlineBlock.classList.toggle("checkout-online-methods--visible", isOnline);
    onlineBlock.setAttribute("aria-hidden", String(!isOnline));
  }
}

function applyPaymentMethodUI(page, method) {
  const hidden = page.querySelector("#checkoutPaymentMethod");
  if (hidden) hidden.value = method;

  page.querySelectorAll("[data-payment-method]").forEach((btn) => {
    const active = btn.dataset.paymentMethod === method;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-checked", String(active));
  });
}

function updatePaymentState(page) {
  applyPaymentModeUI(page, getPaymentMode(page));
  applyPaymentMethodUI(page, getPaymentMethod(page));
  updateTotals(page);
}

function setPaymentMode(page, mode) {
  if (mode !== "cod" && mode !== "online") return;
  closeCheckoutGeoPanels(page);
  applyPaymentModeUI(page, mode);
  if (mode === "online" && !ONLINE_PAYMENT_METHOD_IDS.includes(getPaymentMethod(page))) {
    applyPaymentMethodUI(page, ONLINE_PAYMENT_METHOD_IDS[0]);
  }
  updateTotals(page);
}

function setPaymentMethod(page, method) {
  if (getPaymentMode(page) !== "online") return;
  const allowed = ONLINE_PAYMENT_METHOD_IDS;
  if (!allowed.includes(method)) return;
  closeCheckoutGeoPanels(page);
  applyPaymentMethodUI(page, method);
  updateTotals(page);
}

function initPaymentSelection(page) {
  const section = page.querySelector(".checkout-payment-section");
  if (!section || section.dataset.paymentBound === "true") return;
  section.dataset.paymentBound = "true";

  section.addEventListener("click", (event) => {
    const modeBtn = event.target.closest("[data-payment-mode]");
    const methodBtn = event.target.closest("[data-payment-method]");

    if (!modeBtn && !methodBtn) return;

    event.preventDefault();
    event.stopPropagation();

    if (modeBtn) {
      setPaymentMode(page, modeBtn.dataset.paymentMode);
      return;
    }

    if (methodBtn) {
      setPaymentMethod(page, methodBtn.dataset.paymentMethod);
    }
  });
}

function updateTotals(page) {
  const subtotal = getSubtotal();
  const delivery = checkoutItems.length > 0 ? getDeliveryFee() : 0;
  const isOnline = getPaymentMode(page) === "online";
  const promo = getAppliedLoyaltyPromo();
  const loyaltyDiscount = computeLoyaltyDiscount(checkoutItems, promo);
  const afterLoyalty = Math.max(0, subtotal - loyaltyDiscount);
  const beforeOnline = afterLoyalty + delivery;
  const onlineDiscount = isOnline ? beforeOnline * getOnlineDiscountRate() : 0;
  const grandTotal = Math.max(0, beforeOnline - onlineDiscount);

  const subtotalEl = page.querySelector("#checkoutSubtotal");
  const deliveryEl = page.querySelector("#checkoutDelivery");
  const loyaltyRow = page.querySelector("#checkoutLoyaltyRow");
  const loyaltyLabel = page.querySelector("#checkoutLoyaltyLabel");
  const loyaltyEl = page.querySelector("#checkoutLoyaltyDiscount");
  const discountRow = page.querySelector("#checkoutDiscountRow");
  const discountEl = page.querySelector("#checkoutDiscount");
  const grandEl = page.querySelector("#checkoutGrandTotal");

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (deliveryEl) deliveryEl.textContent = formatPrice(delivery);
  if (loyaltyRow) loyaltyRow.hidden = loyaltyDiscount <= 0;
  if (loyaltyLabel) loyaltyLabel.textContent = loyaltyDiscountLabel(promo);
  if (loyaltyEl) loyaltyEl.textContent = `−${formatPrice(loyaltyDiscount)}`;
  if (discountRow) discountRow.hidden = !isOnline || onlineDiscount <= 0;
  if (discountEl) discountEl.textContent = `−${formatPrice(onlineDiscount)}`;
  if (grandEl) grandEl.textContent = formatPrice(grandTotal);

  return { loyaltyDiscount, onlineDiscount, grandTotal, promo };
}

let geoSelectApi = null;

export function refreshCheckout(root, items) {
  const page = root.querySelector("#checkoutPage");
  if (!page) return;
  checkoutItems = items;
  renderOrderItems(page);
  updatePaymentState(page);
}

export function initCheckout(root, items) {
  const page = root.querySelector("#checkoutPage");
  if (!page) return;

  refreshCheckout(root, items);

  geoSelectApi = initCheckoutGeoSelects(page, {
    onWilayaChange: (code) => geoSelectApi?.refreshCommune(code),
  });

  initPaymentSelection(page);

  if (page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  const leave = () => {
    root.dispatchEvent(new CustomEvent("racelia:leave-checkout"));
  };

  page.querySelector(".js-checkout-back")?.addEventListener("click", leave);

  page.querySelector("#checkoutForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const mode = data.get("paymentMode");
    const method = mode === "online" ? data.get("paymentMethod") : "cod";
    const wilayaCode = data.get("wilaya");
    const submitBtn = form.querySelector('button[type="submit"]');

    const items = checkoutItems.map((item) => ({
      name: item.name,
      price: item.unitPrice,
      quantity: item.qty,
      imageUrl: item.imageUrl || "",
      color: String(item.color || "").replace(/^(Color|Couleur)\s*:\s*/i, ""),
      productSlug: String(item.productId || item.id || "").replace(/^item-pdp-/, ""),
    }));

    const totals = updateTotals(page);
    if (totals.promo?.type === "free_item" && !totals.promo.freeItemId) {
      setFormStatus(form, "Choisissez l’article offert avant de passer commande.");
      return;
    }

    setFormStatus(form, "");
    submitBtn.disabled = true;
    try {
      const result = await submitOrder({
        customerName: data.get("name"),
        customerEmail: data.get("email") || "",
        phone: data.get("phone"),
        wilaya: wilayaCode,
        commune: data.get("commune") || "",
        paymentMode: mode,
        paymentMethod: method,
        items,
        note: data.get("note") || "",
        promoCode: totals.promo?.code || "",
        loyaltyDiscount: totals.loyaltyDiscount || 0,
      });

      if (totals.promo?.code) {
        markLoyaltyRewardUsed(totals.promo.code, result.orderNumber || result.orderId || "");
      }
      recordPurchasedEgifts(checkoutItems, {
        orderId: result.orderNumber || result.orderId || "",
        paid: mode === "online",
        paymentMode: mode,
      });
      syncClientData(root).catch(() => {});
      leave();
    } catch (error) {
      setFormStatus(form, error.message || "Impossible de passer la commande. Veuillez réessayer.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !page.hidden) {
      if (page.querySelector(".checkout-geo-select.is-open")) return;
      leave();
    }
  });

  root.addEventListener("racelia:currency-changed", () => {
    if (page.hidden) return;
    renderOrderItems(page);
    updateTotals(page);
  });
}
