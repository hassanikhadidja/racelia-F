import { getWishlistMarkup } from "../js/wishlistMarkup.js";

export function createWishlistPage() {
  const page = document.createElement("section");
  page.id = "wishlistPage";
  page.hidden = true;
  page.setAttribute("aria-label", "Wishlist");
  page.innerHTML = getWishlistMarkup();
  return page;
}
