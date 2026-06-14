import { getDashboardMarkup } from "../js/dashboardMarkup.js";

export function createDashboardPage() {
  const page = document.createElement("section");
  page.id = "dashboardPage";
  page.hidden = true;
  page.setAttribute("aria-label", "Store dashboard");
  page.innerHTML = `<div class="adol-app">${getDashboardMarkup()}</div>`;
  return page;
}
