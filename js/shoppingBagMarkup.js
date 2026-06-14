/** @generated from shopping bag page.html */
export function getShoppingBagMarkup() {
  return `<div class="shopping-bag-shell">
  <header class="shopping-bag-topbar">
    <button type="button" class="btn-icon js-shopping-bag-back" aria-label="Back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h1>My Bag</h1>
    <span class="shopping-bag-topbar__spacer" aria-hidden="true"></span>
  </header>
  <div class="shopping-bag-inner">
    <p class="bag-header-summary"><span class="bag-header-count">2</span> <span class="bag-header-items-label">items</span> · <span class="bag-header-total">990.00 €</span></p>
<!-- ════════════ MY BAG ════════════ -->
<div class="bag-items">

  <!-- Item 1 – Biscuit -->
  <div class="bag-item" id="item-biscuit">
    <div class="item-image">
      <!-- Tan/Biscuit bag placeholder -->
      <svg class="bag-svg" viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- strap -->
        <path d="M30 40 Q70 10 110 40" stroke="#8B6914" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- body -->
        <rect x="18" y="40" width="104" height="62" rx="6" fill="#D4A96A"/>
        <rect x="18" y="40" width="104" height="62" rx="6" stroke="#B8860B" stroke-width="1.5"/>
        <!-- flap -->
        <path d="M18 40 Q18 70 70 74 Q122 70 122 40 Z" fill="#C49A50"/>
        <path d="M18 40 Q18 70 70 74 Q122 70 122 40 Z" stroke="#B8860B" stroke-width="1.5"/>
        <!-- C clasp -->
        <circle cx="70" cy="62" r="10" fill="#D4AF37" stroke="#B8860B" stroke-width="1"/>
        <text x="70" y="67" text-anchor="middle" fill="#7A5C0A" font-size="12" font-family="serif" font-weight="bold">C</text>
      </svg>
    </div>
    <div class="item-details">
      <p class="item-name">Tabby Shoulder Bag 26</p>
      <p class="item-color">Color: Brass/Biscuit</p>
      <div class="item-row">
        <select class="qty-select">
          <option value="1" selected>1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <span class="item-price" data-price-eur="495">495.00 €</span>
      </div>
      <button class="save-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        Save
      </button>
    </div>
    <button class="remove-btn" title="Remove item">✕</button>
  </div>

  <!-- Item 2 – Black -->
  <div class="bag-item" id="item-black">
    <div class="item-image">
      <!-- Black bag placeholder -->
      <svg class="bag-svg" viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 Q70 10 110 40" stroke="#555" stroke-width="5" fill="none" stroke-linecap="round"/>
        <rect x="18" y="40" width="104" height="62" rx="6" fill="#2a2a2a"/>
        <rect x="18" y="40" width="104" height="62" rx="6" stroke="#555" stroke-width="1.5"/>
        <path d="M18 40 Q18 70 70 74 Q122 70 122 40 Z" fill="#1a1a1a"/>
        <path d="M18 40 Q18 70 70 74 Q122 70 122 40 Z" stroke="#555" stroke-width="1.5"/>
        <circle cx="70" cy="62" r="10" fill="#D4AF37" stroke="#B8860B" stroke-width="1"/>
        <text x="70" y="67" text-anchor="middle" fill="#7A5C0A" font-size="12" font-family="serif" font-weight="bold">C</text>
      </svg>
    </div>
    <div class="item-details">
      <p class="item-name">Tabby Shoulder Bag 26</p>
      <p class="item-color">Color: Brass/Black</p>
      <div class="item-row">
        <select class="qty-select">
          <option value="1" selected>1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <span class="item-price" data-price-eur="495">495.00 €</span>
      </div>
      <button class="save-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        Save
      </button>
    </div>
    <button class="remove-btn" title="Remove item">✕</button>
  </div>

</div><!-- /bag-items -->

<!-- ════════════ PROMOS & SIGN IN ════════════ -->
<div class="promo-section">
  <div class="promo-row js-promo-open" role="button" tabindex="0">
    <span>Apply Promos</span>
    <span class="promo-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></span>
  </div>
  <div class="signin-row">
    <a href="#" class="js-shopping-bag-signin">Sign In</a>
  </div>
</div>

<!-- ════════════ ORDER SUMMARY ════════════ -->
<div class="order-summary">
  <h2>Order Summary</h2>
  <div class="summary-row">
    <span>Subtotal</span>
    <span id="subtotal">990.00 €</span>
  </div>
  <div class="summary-row">
    <span>Shipping</span>
    <span style="font-weight:600;">FREE</span>
  </div>
  <hr class="summary-divider">
  <div class="summary-total">
    <span>Total</span>
    <span id="total">990.00 €</span>
  </div>
  <button class="checkout-btn js-checkout">PROCEED TO CHECKOUT</button>
</div>

<!-- ════════════ WISHLIST ════════════ -->
<div class="wishlist-section">
  <div class="wishlist-section-head">
    <h2>Wishlist</h2>
    <a href="#" class="wishlist-section-link js-wishlist-page-open">View all</a>
  </div>
  <div class="wishlist-item" id="wishlist-quilted">
    <div class="wishlist-image">
      <!-- Quilted black mini bag placeholder -->
      <svg class="bag-svg" viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- chain strap -->
        <path d="M20 30 Q70 8 120 30" stroke="#999" stroke-width="3" stroke-dasharray="5 3" fill="none" stroke-linecap="round"/>
        <!-- body -->
        <rect x="22" y="30" width="96" height="68" rx="5" fill="#1e1e1e"/>
        <rect x="22" y="30" width="96" height="68" rx="5" stroke="#555" stroke-width="1.5"/>
        <!-- quilting lines horizontal -->
        <line x1="22" y1="48" x2="118" y2="48" stroke="#444" stroke-width="1"/>
        <line x1="22" y1="64" x2="118" y2="64" stroke="#444" stroke-width="1"/>
        <line x1="22" y1="80" x2="118" y2="80" stroke="#444" stroke-width="1"/>
        <!-- quilting lines vertical -->
        <line x1="46" y1="30" x2="46" y2="98" stroke="#444" stroke-width="1"/>
        <line x1="70" y1="30" x2="70" y2="98" stroke="#444" stroke-width="1"/>
        <line x1="94" y1="30" x2="94" y2="98" stroke="#444" stroke-width="1"/>
        <!-- C clasp – silver -->
        <rect x="59" y="56" width="22" height="16" rx="3" fill="#aaa"/>
        <text x="70" y="68" text-anchor="middle" fill="#2a2a2a" font-size="11" font-family="serif" font-weight="bold">C</text>
      </svg>
    </div>
    <div class="wishlist-details">
      <p class="wishlist-name">Tabby Shoulder Bag 20 With Pillow Quilting</p>
      <p class="wishlist-color">Color: Silver/Black</p>
      <p class="wishlist-price" data-price-eur="475">475 €</p>
      <div class="wishlist-actions">
        <a href="#" class="js-wishlist-move">Move to Bag</a>
        <a href="#" class="js-wishlist-remove">Remove</a>
      </div>
    </div>
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
    <input class="promo-input" type="text" placeholder="Enter Promo Code" id="promoInput">
    <button class="apply-btn js-promo-apply">APPLY</button>
    <a href="#" class="modal-signin js-shopping-bag-signin">Sign In</a>
  </div>
</div>
`;
}
