/** Wishlist page markup (RACÈLIA storefront) */
export function getWishlistMarkup() {
  return `<div class="wishlist-shell">
  <header class="wishlist-topbar">
    <button type="button" class="btn-icon js-wishlist-back" aria-label="Back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h1>Wishlist</h1>
    <span class="wishlist-topbar__spacer" aria-hidden="true"></span>
  </header>
  <div class="wishlist-inner">
    <p class="wishlist-summary"><span class="wishlist-count">2</span> <span class="wishlist-count-label">items</span></p>

    <div class="wishlist-empty" id="wishlistEmpty" hidden>
      <p class="wishlist-empty__title">Your wishlist is empty</p>
      <p class="wishlist-empty__text">Save pieces you love to find them here.</p>
      <button type="button" class="wishlist-btn wishlist-btn--outline js-wishlist-continue">Continue shopping</button>
    </div>

    <div class="wishlist-list" id="wishlistList">
      <article class="wishlist-item" id="wishlist-quilted">
        <div class="wishlist-image">
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
        <div class="wishlist-details">
          <p class="wishlist-name">Tabby Shoulder Bag 20 With Pillow Quilting</p>
          <p class="wishlist-color">Color: Silver/Black</p>
          <p class="wishlist-price" data-price-eur="475">475 €</p>
          <div class="wishlist-actions">
            <a href="#" class="js-wishlist-move-to-bag">Move to bag</a>
            <a href="#" class="js-wishlist-remove">Remove</a>
          </div>
        </div>
      </article>

      <article class="wishlist-item" id="wishlist-biscuit">
        <div class="wishlist-image">
          <svg class="bag-svg" viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 40 Q70 10 110 40" stroke="#8B6914" stroke-width="5" fill="none" stroke-linecap="round"/>
            <rect x="18" y="40" width="104" height="62" rx="6" fill="#D4A96A"/>
            <rect x="18" y="40" width="104" height="62" rx="6" stroke="#B8860B" stroke-width="1.5"/>
            <path d="M18 40 Q18 70 70 74 Q122 70 122 40 Z" fill="#C49A50"/>
            <path d="M18 40 Q18 70 70 74 Q122 70 122 40 Z" stroke="#B8860B" stroke-width="1.5"/>
            <circle cx="70" cy="62" r="10" fill="#D4AF37" stroke="#B8860B" stroke-width="1"/>
            <text x="70" y="67" text-anchor="middle" fill="#7A5C0A" font-size="12" font-family="serif" font-weight="bold">C</text>
          </svg>
        </div>
        <div class="wishlist-details">
          <p class="wishlist-name">Tabby Shoulder Bag 26</p>
          <p class="wishlist-color">Color: Brass/Biscuit</p>
          <p class="wishlist-price" data-price-eur="495">495 €</p>
          <div class="wishlist-actions">
            <a href="#" class="js-wishlist-move-to-bag">Move to bag</a>
            <a href="#" class="js-wishlist-remove">Remove</a>
          </div>
        </div>
      </article>
    </div>

    <footer class="wishlist-footer">
      <button type="button" class="wishlist-btn wishlist-btn--primary js-wishlist-open-bag">View shopping bag</button>
      <button type="button" class="wishlist-btn wishlist-btn--text js-wishlist-continue">Continue shopping</button>
    </footer>
  </div>
</div>`;
}
