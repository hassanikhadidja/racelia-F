import { loadClientProfile } from "./clientProfileData.js";

export const AVATAR_STORAGE_KEY = "raceliaProfileAvatarImage";

/** First letter of the user's name (no profile photos). */
export function getInitials(name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return "—";
  return trimmed.charAt(0).toUpperCase();
}

export function clearProfileAvatarCache() {
  try {
    localStorage.removeItem(AVATAR_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function applyAvatarToWrap(wrap, _url, initials) {
  if (!wrap) return;
  const placeholder = wrap.querySelector(".avatar-placeholder");
  if (placeholder) placeholder.textContent = initials || "—";
  wrap.classList.remove("has-image");
}

export function applyProfilePageAvatar(page) {
  if (!page) return;
  const wrap = page.querySelector("#avatar-wrap");
  if (!wrap) return;

  const profile = loadClientProfile();
  applyAvatarToWrap(wrap, "", getInitials(profile.name));
}

export function applyAvatarToAccountButton(button, profile, loggedIn = false) {
  const icon = button.querySelector(".account-btn-icon");
  const wrap = button.querySelector(".avatar-wrap");
  if (!wrap) return;

  applyAvatarToWrap(wrap, "", getInitials(profile?.name));

  if (loggedIn) {
    button.classList.add("is-profile-avatar");
    if (icon) icon.hidden = true;
    wrap.hidden = false;
    button.setAttribute("aria-label", profile?.name ? `${profile.name} profile` : "Profile");
    return;
  }

  button.classList.remove("is-profile-avatar");
  if (icon) icon.hidden = false;
  wrap.hidden = true;
  button.setAttribute("aria-label", "Account");
}
