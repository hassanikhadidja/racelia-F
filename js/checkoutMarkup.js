import { WILAYAS } from "./checkoutWilayas.js";
import { ONLINE_PAYMENT_METHODS } from "./checkoutPaymentMethods.js";

function onlinePaymentMethodsMarkup() {
  return ONLINE_PAYMENT_METHODS.map((method, index) => {
    const active = index === 0;
    return `<button type="button" class="checkout-method checkout-method--icon${active ? " is-active" : ""}" data-payment-method="${method.id}" aria-checked="${active}" aria-label="${method.label}">
              <img src="${method.icon}" alt="" width="72" height="44" loading="lazy" decoding="async" />
            </button>`;
  }).join("");
}

function wilayaOptions() {
  return WILAYAS.map((w) => `<option value="${w.code}">${w.code} — ${w.name}</option>`).join("");
}

function geoSelectField({ id, label, required, optional }) {
  const reqClass = required ? " checkout-field--required" : "";
  const opt = optional ? ' <span class="checkout-optional">(facultatif)</span>' : "";
  const placeholder =
    required
      ? `Choisir une ${label.toLowerCase()}`
      : "Choisir une wilaya d'abord";
  return `
        <div class="checkout-field${reqClass}">
          <label for="${id}-trigger">${label}${opt}</label>
          <div class="checkout-geo-select" id="${id}-wrap">
            <button type="button" id="${id}-trigger" class="checkout-geo-select__trigger is-placeholder" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-list">
              <span class="checkout-geo-select__value" id="${id}-value">${placeholder}</span>
              <span class="checkout-geo-select__chev" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </button>
            <div class="checkout-geo-select__panel" id="${id}-panel" hidden>
              <input type="search" class="checkout-geo-select__search" id="${id}-search" placeholder="Rechercher…" autocomplete="off" aria-label="Rechercher ${label}">
              <ul class="checkout-geo-select__list" id="${id}-list" role="listbox"></ul>
            </div>
          </div>
          <select id="${id}" name="${id.replace("checkout-", "")}" class="checkout-geo-select__native" tabindex="-1" aria-hidden="true"${required ? " required" : ""}${id === "checkout-commune" ? " disabled" : ""}>
            ${id === "checkout-wilaya" ? `<option value="" disabled selected>Choisir une wilaya</option>${wilayaOptions()}` : `<option value="" selected>Choisir une wilaya d'abord</option>`}
          </select>
        </div>`;
}

export function getCheckoutMarkup() {
  return `<div class="checkout-shell">
  <header class="checkout-topbar">
    <button type="button" class="btn-icon js-checkout-back" aria-label="Retour">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h1>Paiement</h1>
    <span class="checkout-topbar__spacer" aria-hidden="true"></span>
  </header>

  <div class="checkout-inner">
    <form class="checkout-form" id="checkoutForm" novalidate>
      <section class="checkout-section">
        <h2 class="checkout-section__title">Coordonnées de livraison</h2>
        <div class="checkout-field checkout-field--required">
          <label for="checkout-name">Nom complet</label>
          <input id="checkout-name" name="name" type="text" autocomplete="name" required placeholder=" " />
        </div>
        <div class="checkout-field checkout-field--required">
          <label for="checkout-phone">Téléphone</label>
          <input id="checkout-phone" name="phone" type="tel" autocomplete="tel" required placeholder=" " />
        </div>
        ${geoSelectField({ id: "checkout-wilaya", label: "Wilaya", required: true, optional: false })}
        ${geoSelectField({ id: "checkout-commune", label: "Commune", required: false, optional: true })}
        <div class="checkout-field">
          <label for="checkout-email">E-mail <span class="checkout-optional">(facultatif)</span></label>
          <input id="checkout-email" name="email" type="email" autocomplete="email" placeholder=" " />
        </div>
      </section>

      <section class="checkout-section">
        <h2 class="checkout-section__title">Votre commande</h2>
        <ul class="checkout-items" id="checkoutItems" aria-label="Articles de la commande"></ul>
      </section>

      <section class="checkout-section checkout-payment-section" id="checkoutPaymentSection">
        <h2 class="checkout-section__title">Paiement</h2>
        <input type="hidden" name="paymentMode" id="checkoutPaymentMode" value="cod" />
        <input type="hidden" name="paymentMethod" id="checkoutPaymentMethod" value="visa" />
        <div class="checkout-payment-modes" role="radiogroup" aria-label="Mode de paiement">
          <button type="button" class="checkout-payment-mode is-active" data-payment-mode="cod" aria-checked="true">
            <span class="checkout-payment-mode__box">
              <span class="checkout-payment-mode__label">Paiement à la livraison</span>
              <span class="checkout-payment-mode__hint">Payez à la réception</span>
            </span>
          </button>
          <button type="button" class="checkout-payment-mode" data-payment-mode="online" aria-checked="false">
            <span class="checkout-payment-mode__box">
              <span class="checkout-payment-mode__label">Paiement en ligne</span>
              <span class="checkout-payment-mode__hint checkout-payment-mode__hint--sale">−5 % sur votre commande</span>
            </span>
          </button>
        </div>

        <div class="checkout-online-methods" id="checkoutOnlineMethods" aria-hidden="true">
          <p class="checkout-online-methods__label">Payer avec</p>
          <div class="checkout-method-grid checkout-method-grid--icons" role="radiogroup" aria-label="Moyen de paiement en ligne">
            ${onlinePaymentMethodsMarkup()}
          </div>
        </div>
      </section>

      <section class="checkout-section checkout-summary">
        <div class="checkout-summary__row">
          <span>Sous-total</span>
          <span id="checkoutSubtotal">0.00 €</span>
        </div>
        <div class="checkout-summary__row">
          <span>Livraison</span>
          <span id="checkoutDelivery">0.00 €</span>
        </div>
        <div class="checkout-summary__row checkout-summary__row--discount" id="checkoutLoyaltyRow" hidden>
          <span id="checkoutLoyaltyLabel">Code promo</span>
          <span id="checkoutLoyaltyDiscount">−0.00 €</span>
        </div>
        <div class="checkout-summary__row checkout-summary__row--discount" id="checkoutDiscountRow" hidden>
          <span>Paiement en ligne (−5 %)</span>
          <span id="checkoutDiscount">−0.00 €</span>
        </div>
        <div class="checkout-summary__row checkout-summary__row--total">
          <span>Total</span>
          <span id="checkoutGrandTotal">0.00 €</span>
        </div>
      </section>

      <button type="submit" class="checkout-submit">Passer la commande</button>
    </form>
  </div>
</div>`;
}
