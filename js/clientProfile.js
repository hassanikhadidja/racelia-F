import {
  bindProfileSheet,
  closeTopProfileOverlay,
} from "./clientProfileSheets.js";
import {
  getTotalGiftPoints,
  refreshGiftPointsSummary,
} from "./clientProfileGiftPoints.js";
import { refreshProfileOrdersList } from "./clientProfileOrders.js";
import {
  getReviewsSummaryText,
  initProfileReviewForm,
} from "./clientProfileReviews.js";
import { loadClientProfile, saveClientProfileLocal } from "./clientProfileData.js";
import { syncClientData, updateClientProfile, uploadProfileAvatar } from "./syncBackend.js";
import { updateAccountButtons } from "./accountUi.js";
import { clearAuthSession } from "./api.js";
import {
  applyProfilePageAvatar,
  applyAvatarToWrap,
  compressImageFile,
  getInitials,
  isImageFile,
  clearProfileAvatarCache,
  cacheProfileAvatar,
} from "./profileAvatar.js";
import {
  applyEgiftFieldsToPage,
  loadClientEgiftFields,
  readEgiftFieldsFromPage,
  saveClientEgiftFields,
} from "./profileCardsMarkup.js";

export function initClientProfile(root) {
  const page = root.querySelector("#clientProfilePage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  const leave = () => {
    root.dispatchEvent(new CustomEvent("racelia:leave-client-profile"));
  };

  page.querySelector(".js-client-profile-back")?.addEventListener("click", () => {
    if (closeTopProfileOverlay(page)) return;
    leave();
  });

  initProfileEdit(page, root);
  initAvatarUpload(page, root);
  initFlipCards(page);
  initEgiftFields(page);
  initLoyaltyOrders(page);
  initProfileReviewsSheet(page);
  initProfileGiftPointsSheet(page);
  initLogout(page, root);

  const refreshAll = () => refreshProfileUI(page, root);
  root.addEventListener("racelia:client-synced", refreshAll);
  root.addEventListener("racelia:backend-synced", refreshAll);

  syncClientData(root).then(() => refreshProfileUI(page, root));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !page.hidden) {
      if (closeTopProfileOverlay(page)) return;
      leave();
    }
  });
}

function refreshProfileUI(page, root) {
  const profile = loadClientProfile();
  applyProfileToPage(page, profile);
  applyProfilePageAvatar(page);
  applyEgiftFieldsToPage(page, loadClientEgiftFields(profile));
  if (root) updateAccountButtons(root);

  const reviewsSummary = page.querySelector("#profile-reviews-summary");
  const pointsSummary = page.querySelector("#profile-gift-points-summary");
  if (reviewsSummary) reviewsSummary.textContent = getReviewsSummaryText();
  refreshGiftPointsSummary(page);
  if (pointsSummary && !page.querySelector("#profile-points-body")) {
    pointsSummary.textContent = `${getTotalGiftPoints().toLocaleString()} pts`;
  }
  refreshProfileOrdersList(page);
}

function applyProfileToPage(page, data) {
  const nameEl = page.querySelector("#profile-name");
  const phoneEl = page.querySelector("#profile-phone");
  const emailEl = page.querySelector("#profile-email");
  const addressEl = page.querySelector("#profile-address");
  const placeholder = page.querySelector("#avatar-placeholder");
  const avatarWrap = page.querySelector("#avatar-wrap");

  if (nameEl) nameEl.textContent = data.name || "—";
  if (phoneEl) phoneEl.textContent = data.phone || "—";
  if (emailEl) emailEl.textContent = data.email || "—";
  if (addressEl) addressEl.textContent = data.address || "—";
  if (placeholder && (!avatarWrap || !avatarWrap.classList.contains("has-image"))) {
    placeholder.textContent = getInitials(data.name || "");
  }
}

function initLoyaltyOrders(page) {
  bindProfileSheet(page, {
    overlayId: "profile-orders-overlay",
    toggleSelector: ".js-loyalty-orders-toggle",
    onOpen: () => refreshProfileOrdersList(page),
  });
}

function initProfileReviewsSheet(page) {
  const reviewSheet = bindProfileSheet(page, {
    overlayId: "profile-review-overlay",
    toggleSelector: ".js-profile-reviews-open",
    focusSelector: "#review-name",
  });

  initProfileReviewForm(page, {
    onSubmitted: () => {
      refreshProfileUI(page, root);
      reviewSheet?.close();
    },
  });
}

function initProfileGiftPointsSheet(page) {
  bindProfileSheet(page, {
    overlayId: "profile-points-overlay",
    toggleSelector: ".js-profile-points-open",
    onOpen: () => refreshGiftPointsSummary(page),
  });
}

function initLogout(page, root) {
  page.querySelector("#profile-logout-btn")?.addEventListener("click", () => {
    clearAuthSession();
    clearProfileAvatarCache();
    updateAccountButtons(root);
    root.dispatchEvent(new CustomEvent("racelia:backend-synced", { bubbles: true }));
    root.dispatchEvent(new CustomEvent("racelia:leave-client-profile"));
  });
}

function initProfileEdit(page, root) {
  const overlay = page.querySelector("#profile-edit-overlay");
  const openBtn = page.querySelector("#edit-profile-btn");
  const cancelBtn = page.querySelector("#profile-edit-cancel");
  const form = page.querySelector("#profile-edit-form");
  const editName = page.querySelector("#edit-name");
  const editPhone = page.querySelector("#edit-phone");
  const editEmail = page.querySelector("#edit-email");
  const editAddress = page.querySelector("#edit-address");

  if (!overlay || !openBtn || !form) return;

  function fillForm(data) {
    if (editName) editName.value = data.name || "";
    if (editPhone) editPhone.value = data.phone || "";
    if (editEmail) editEmail.value = data.email || "";
    if (editAddress) editAddress.value = data.address || "";
    if (editEmail) editEmail.readOnly = Boolean(data.email);
  }

  function openEditor() {
    fillForm(loadClientProfile());
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    editName?.focus();
  }

  applyProfileToPage(page, loadClientProfile());

  openBtn.addEventListener("click", openEditor);
  cancelBtn?.addEventListener("click", () => closeEditor(overlay));

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeEditor(overlay);
  });

  page.querySelector(".profile-edit-sheet")?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const profile = loadClientProfile();
    const updated = {
      ...profile,
      name: editName?.value.trim() || "",
      phone: editPhone?.value.trim() || "",
      email: editEmail?.value.trim() || "",
      address: editAddress?.value.trim() || "",
    };

    applyProfileToPage(page, updated);
    saveClientProfileLocal(updated);
    closeEditor(overlay);

    try {
      await updateClientProfile(
        {
          name: updated.name,
          phone: updated.phone,
          address: updated.address,
        },
        root
      );
    } catch (error) {
      window.alert(error.message || "Could not save profile to server.");
    }
  });
}

function closeEditor(overlay) {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
}

function initAvatarUpload(page, root) {
  const wrap = page.querySelector("#avatar-wrap");
  const fileInput = page.querySelector("#avatar-file-input");
  const editBadge = page.querySelector("#edit-badge");

  if (!wrap || !fileInput || !editBadge) return;

  applyProfilePageAvatar(page);

  editBadge.addEventListener("click", (event) => {
    event.stopPropagation();
    fileInput.click();
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!isImageFile(file)) {
      window.alert("Please choose a valid image file.");
      fileInput.value = "";
      return;
    }

    try {
      const dataUrl = await compressImageFile(file);
      applyAvatarToWrap(wrap, dataUrl, getInitials(loadClientProfile().name));

      try {
        await uploadProfileAvatar(dataUrl, root);
      } catch (uploadError) {
        cacheProfileAvatar(dataUrl);
        console.warn("Profile photo saved locally:", uploadError.message);
      }

      applyProfilePageAvatar(page);
      updateAccountButtons(root);
    } catch (error) {
      window.alert(error.message || "Could not update profile photo.");
      applyProfilePageAvatar(page);
    } finally {
      fileInput.value = "";
    }
  });
}

function initFlipCards(page) {
  const loyaltyScene = page.querySelector(".loyalty-scene");
  const egiftScene = page.querySelector(".egift-scene");
  const loyaltyCard = page.querySelector("#loyalty-card");
  const egiftCard = page.querySelector("#egift-card");

  loyaltyScene?.addEventListener("click", () => {
    loyaltyCard?.classList.toggle("flipped");
  });

  egiftScene?.addEventListener("click", () => {
    egiftCard?.classList.toggle("flipped");
  });

  const loyaltyFrontImg = page.querySelector("#loyalty-card-front-img");
  const egiftFrontImg = page.querySelector("#egift-card-front-img");

  const setLoyaltyRatio = () => {
    if (!loyaltyCard || !loyaltyFrontImg?.naturalWidth) return;
    loyaltyCard.style.setProperty(
      "--loyalty-card-ratio",
      String(loyaltyFrontImg.naturalWidth / loyaltyFrontImg.naturalHeight)
    );
  };

  const setEgiftRatio = () => {
    if (!egiftCard || !egiftFrontImg?.naturalWidth) return;
    egiftCard.style.setProperty(
      "--egift-card-ratio",
      String(egiftFrontImg.naturalWidth / egiftFrontImg.naturalHeight)
    );
  };

  loyaltyFrontImg?.addEventListener("load", setLoyaltyRatio);
  if (loyaltyFrontImg?.complete) setLoyaltyRatio();

  egiftFrontImg?.addEventListener("load", setEgiftRatio);
  if (egiftFrontImg?.complete) setEgiftRatio();

  page.querySelectorAll(".egift-field-box").forEach((input) => {
    input.addEventListener("click", (event) => event.stopPropagation());
  });
}

function initEgiftFields(page) {
  const fields = page.querySelectorAll(
    "#egift-field-to, #egift-field-from, #egift-field-amount, #egift-field-expiry"
  );
  if (!fields.length) return;

  const persist = () => {
    saveClientEgiftFields(readEgiftFieldsFromPage(page));
  };

  fields.forEach((input) => {
    input.addEventListener("change", persist);
    input.addEventListener("blur", persist);
  });
}
