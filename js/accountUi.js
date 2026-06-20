import { isAdminUser } from "./api.js";

export function updateDashboardMenuVisibility(root) {
  const showDashboard = isAdminUser();
  root.querySelectorAll(".js-dashboard-menu-item").forEach((item) => {
    item.hidden = !showDashboard;
  });
}

export function updateAccountButtons(root) {
  updateDashboardMenuVisibility(root);
}
