import { getClientProfileMarkup } from "../js/clientProfileMarkup.js";

export function createClientProfilePage() {
  const page = document.createElement("section");
  page.id = "clientProfilePage";
  page.hidden = true;
  page.setAttribute("aria-label", "Client profile");
  page.innerHTML = getClientProfileMarkup();
  return page;
}
