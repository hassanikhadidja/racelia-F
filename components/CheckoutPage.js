import { getCheckoutMarkup } from "../js/checkoutMarkup.js";

export function createCheckoutPage() {
  const page = document.createElement("section");
  page.id = "checkoutPage";
  page.hidden = true;
  page.setAttribute("aria-label", "Checkout");
  page.innerHTML = getCheckoutMarkup();
  return page;
}
