import { getStoredUser } from "./api.js";
import { loadClientProfile } from "./clientProfileData.js";

export const AVATAR_STORAGE_KEY = "raceliaProfileAvatarImage";

export function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return "—";
}

export function isImageFile(file) {
  if (!file) return false;
  if (file.type?.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|bmp|heic|heif)$/i.test(file.name || "");
}

export function compressImageFile(file, maxSize = 320, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image file"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height, 1));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process image"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function getProfileAvatarUrl() {
  const user = getStoredUser();
  if (user?.avatar) return user.avatar;

  try {
    return localStorage.getItem(AVATAR_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function cacheProfileAvatar(url) {
  if (!url) return;
  try {
    localStorage.setItem(AVATAR_STORAGE_KEY, url);
  } catch {
    /* ignore quota errors for remote URLs */
  }
}

export function clearProfileAvatarCache() {
  try {
    localStorage.removeItem(AVATAR_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function applyAvatarToWrap(wrap, url, initials) {
  if (!wrap) return;

  const image = wrap.querySelector(".avatar-image");
  const placeholder = wrap.querySelector(".avatar-placeholder");

  if (placeholder) placeholder.textContent = initials || "—";

  if (url && image) {
    image.src = url;
    wrap.classList.add("has-image");
    return;
  }

  image?.removeAttribute("src");
  wrap.classList.remove("has-image");
}

export function applyProfilePageAvatar(page) {
  if (!page) return;
  const wrap = page.querySelector("#avatar-wrap");
  if (!wrap) return;

  const profile = loadClientProfile();
  applyAvatarToWrap(wrap, getProfileAvatarUrl(), getInitials(profile.name));
}
