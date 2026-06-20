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
    <p class="wishlist-summary"><span class="wishlist-count">0</span> <span class="wishlist-count-label">items</span></p>

    <div class="wishlist-empty" id="wishlistEmpty">
      <p class="wishlist-empty__title">Your wishlist is empty</p>
      <p class="wishlist-empty__text">Save pieces you love to find them here.</p>
      <button type="button" class="wishlist-btn wishlist-btn--outline js-wishlist-continue">Continue shopping</button>
    </div>

    <div class="wishlist-list" id="wishlistList" hidden></div>

    <footer class="wishlist-footer" hidden>
      <button type="button" class="wishlist-btn wishlist-btn--primary js-wishlist-open-bag">View shopping bag</button>
      <button type="button" class="wishlist-btn wishlist-btn--text js-wishlist-continue">Continue shopping</button>
    </footer>
  </div>
</div>`;
}
