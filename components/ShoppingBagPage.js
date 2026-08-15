import { getShoppingBagMarkup } from "../js/shoppingBagMarkup.js";

export function createShoppingBagPage() {
  const page = document.createElement("section");
  page.id = "shoppingBagPage";
  page.hidden = true;
  page.setAttribute("aria-label", "Panier");
  page.innerHTML = getShoppingBagMarkup();
  return page;
}
