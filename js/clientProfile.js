import {
  bindProfileSheet,
  closeTopProfileOverlay,
} from "./clientProfileSheets.js";
import { refreshProfileOrdersList } from "./clientProfileOrders.js";
import { refreshPurchasedEgiftsList } from "./clientProfileEgifts.js";
import {
  getReviewsSummaryText,
  initProfileReviewForm,
} from "./clientProfileReviews.js";
import { loadClientProfile, loadClientOrders, saveClientProfileLocal } from "./clientProfileData.js";
import { clearAuthSession, getStoredUser, setStoredUser } from "./api.js";
import { syncClientData, updateClientProfile, syncCollectedEmail } from "./syncBackend.js";
import { upsertCollectedEmail } from "./dashboardEmailsData.js";
import { confirmLoyaltyBirthday, formatLoyaltyDate, refreshLoyaltyCard } from "./loyaltyCard.js";
import { updateAccountButtons } from "./accountUi.js";
import {
  applyProfilePageAvatar,
  getInitials,
  clearProfileAvatarCache,
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
  initFlipCards(page);
  initEgiftFields(page);
  page.querySelector(".js-profile-gift-card")?.addEventListener("click", (event) => {
    event.preventDefault();
    root.dispatchEvent(new CustomEvent("racelia:open-gift-card"));
  });
  initLoyaltyOrders(page);
  initPurchasedEgifts(page);
  initLoyaltyBirthday(page, root);
  initProfileReviewsSheet(page, root);
  initNewsletterFilter(page, root);
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
  if (reviewsSummary) reviewsSummary.textContent = getReviewsSummaryText();
  applyNewsletterToPage(page, profile);
  refreshProfileOrdersList(page);
  refreshPurchasedEgiftsList(page);
  refreshLoyaltyCard(page, loadClientOrders(), profile);
}

function initLoyaltyBirthday(page, root) {
  const form = page.querySelector("#loyalty-birthday-form");
  if (!form || form.dataset.bound === "true") return;
  form.dataset.bound = "true";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = page.querySelector("#loyalty-birthday-input")?.value;
    const result = confirmLoyaltyBirthday(value);
    if (!result.ok) {
      window.alert(result.error);
      return;
    }

    applyProfileToPage(page, result.profile);
    refreshLoyaltyCard(page, loadClientOrders(), result.profile);

    try {
      await updateClientProfile({ birthday: result.profile.birthday }, root);
    } catch (error) {
      window.alert(error.message || "Impossible d’enregistrer la date de naissance.");
    }
  });
}

function applyProfileToPage(page, data) {
  const nameEl = page.querySelector("#profile-name");
  const phoneEl = page.querySelector("#profile-phone");
  const emailEl = page.querySelector("#profile-email");
  const addressEl = page.querySelector("#profile-address");
  const birthdayEl = page.querySelector("#profile-birthday");
  const placeholder = page.querySelector("#avatar-placeholder");

  if (nameEl) nameEl.textContent = data.name || "—";
  if (phoneEl) phoneEl.textContent = data.phone || "—";
  if (emailEl) emailEl.textContent = data.email || "—";
  if (addressEl) addressEl.textContent = data.address || "—";
  if (birthdayEl) birthdayEl.textContent = formatLoyaltyDate(data.birthday);
  if (placeholder) placeholder.textContent = getInitials(data.name || "");
}

function initLoyaltyOrders(page) {
  bindProfileSheet(page, {
    overlayId: "profile-orders-overlay",
    toggleSelector: ".js-loyalty-orders-toggle",
    onOpen: () => refreshProfileOrdersList(page),
  });
}

function initPurchasedEgifts(page) {
  bindProfileSheet(page, {
    overlayId: "profile-egifts-overlay",
    toggleSelector: ".js-egifts-toggle",
    onOpen: () => refreshPurchasedEgiftsList(page),
  });
}

function initProfileReviewsSheet(page, root) {
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

function isNewsletterAccepted(profile) {
  return profile?.newsletter !== false;
}

function applyNewsletterToPage(page, profile = loadClientProfile()) {
  const accepted = isNewsletterAccepted(profile);
  page.querySelectorAll(".profile-newsletter-opt").forEach((btn) => {
    const on = (btn.dataset.newsletter === "yes") === accepted;
    btn.classList.toggle("is-selected", on);
    btn.setAttribute("aria-pressed", String(on));
  });
}

function initNewsletterFilter(page, root) {
  const filter = page.querySelector(".profile-newsletter-filter");
  if (!filter || filter.dataset.bound === "true") return;
  filter.dataset.bound = "true";

  applyNewsletterToPage(page);

  filter.addEventListener("click", async (event) => {
    const btn = event.target.closest(".profile-newsletter-opt");
    if (!btn) return;
    const accepted = btn.dataset.newsletter !== "no";
    const profile = { ...loadClientProfile(), newsletter: accepted };
    saveClientProfileLocal(profile);
    const user = getStoredUser();
    if (user) setStoredUser({ ...user, newsletter: accepted });
    applyNewsletterToPage(page, profile);
    if (profile.email) {
      const payload = {
        email: profile.email,
        name: profile.name || "",
        newsletter: accepted,
        source: "account",
        forceNewsletter: true,
      };
      upsertCollectedEmail(payload);
      await syncCollectedEmail(payload);
    }
    try {
      await updateClientProfile({ newsletter: accepted }, root);
    } catch {
      /* keep the local choice if the server is unavailable */
    }
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
