import { getAuthToken, isAdminUser } from "./api.js";
import { loadClientProfile } from "./clientProfileData.js";
import { applyAvatarToAccountButton } from "./profileAvatar.js";

export function updateDashboardMenuVisibility(root) {
  const showDashboard = isAdminUser();
  root.querySelectorAll(".js-dashboard-menu-item").forEach((item) => {
    item.hidden = !showDashboard;
  });

  const showProfile = Boolean(getAuthToken());
  root.querySelectorAll(".js-client-profile-menu-item").forEach((item) => {
    item.hidden = !showProfile;
  });
}

export function updateAccountButtons(root) {
  const profile = loadClientProfile();
  const loggedIn = Boolean(getAuthToken());

  root.querySelectorAll(".js-account-open").forEach((button) => {
    applyAvatarToAccountButton(button, profile, loggedIn);
  });

  updateDashboardMenuVisibility(root);
}
