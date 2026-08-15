/** @generated from shopping bag page.html */
export function getShoppingBagMarkup() {
  return `<div class="shopping-bag-shell">
  <header class="shopping-bag-topbar">
    <button type="button" class="btn-icon js-shopping-bag-back" aria-label="Retour">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h1>Mon panier</h1>
    <span class="shopping-bag-topbar__spacer" aria-hidden="true"></span>
  </header>
  <div class="shopping-bag-inner">
    <p class="bag-header-summary"><span class="bag-header-count">0</span> <span class="bag-header-items-label">articles</span> · <span class="bag-header-total">0.00 €</span></p>
<!-- ════════════ MY BAG ════════════ -->
<div class="bag-items">

</div><!-- /bag-items -->

<!-- ════════════ PROMOS & SIGN IN ════════════ -->
<div class="promo-section">
  <div class="promo-row js-promo-open" role="button" tabindex="0">
    <span>Appliquer une promo</span>
    <span class="promo-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></span>
  </div>
  <p class="promo-applied" id="bagPromoApplied" hidden></p>
  <div class="signin-row">
    <a href="#" class="js-shopping-bag-signin">Se connecter</a>
  </div>
</div>

<!-- ════════════ ORDER SUMMARY ════════════ -->
<div class="order-summary">
  <h2>Récapitulatif</h2>
  <div class="summary-row">
    <span>Sous-total</span>
    <span id="subtotal">0.00 €</span>
  </div>
  <div class="summary-row" id="bagDiscountRow" hidden>
    <span id="bagDiscountLabel">Promo</span>
    <span id="bagDiscount">−0.00 €</span>
  </div>
  <div class="summary-row">
    <span>Livraison</span>
    <span style="font-weight:600;">OFFERTE</span>
  </div>
  <hr class="summary-divider">
  <div class="summary-total">
    <span>Total</span>
    <span id="total">0.00 €</span>
  </div>
  <button class="checkout-btn js-checkout">PASSER COMMANDE</button>
</div>

<!-- ════════════ WISHLIST ════════════ -->
<div class="wishlist-section">
  <div class="wishlist-section-head">
    <h2>Liste d'envies</h2>
    <a href="#" class="wishlist-section-link js-wishlist-page-open">Tout voir</a>
  </div>
</div>
  </div>
</div>
<!-- ════════════ PROMO MODAL ════════════ -->
<div class="modal-overlay" id="promoModal">
  <div class="modal-backdrop"></div>
  <div class="modal-panel">
    <button class="modal-close js-promo-close">✕</button>
    <p class="modal-title">Promos</p>
    <input class="promo-input" type="text" placeholder="Saisir le code promo" id="promoInput">
    <button class="apply-btn js-promo-apply">APPLIQUER</button>
    <a href="#" class="modal-signin js-shopping-bag-signin">Se connecter</a>
  </div>
</div>
`;
}
