import {
  bindProfileSheet,
  closeProfileSheet,
  openProfileSheet,
} from "./clientProfileSheets.js";
import { getStoredUser } from "./api.js";
import {
  loadDashboardOrders,
  DASHBOARD_SITUATION_OPTIONS,
  SITUATIONS_STORAGE_KEY,
} from "./dashboardOrdersData.js";
import { syncOrderStatus } from "./syncBackend.js";

const PROFILE_STORAGE_KEY = "raceliaDashboardProfile";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getAvatarLetter(name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return "A";
  return trimmed[0].toUpperCase();
}

function loadProfile() {
  const user = getStoredUser();
  if (user?.email) {
    return { name: user.name || "", email: user.email || "" };
  }
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return { name: "", email: "" };
}

function saveProfile(data) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
}

function loadSituations() {
  try {
    const saved = localStorage.getItem(SITUATIONS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return {};
}

function saveSituations(map) {
  localStorage.setItem(SITUATIONS_STORAGE_KEY, JSON.stringify(map));
}

function getOrdersNeedingSituation() {
  const situations = loadSituations();
  return loadDashboardOrders().filter((order) => !situations[order.id]);
}

function applyAvatarToElements(page, profile) {
  const letter = getAvatarLetter(profile.name);
  [
    page.querySelector("#dashboard-profile-avatar"),
    page.querySelector(".js-dashboard-avatar-lg"),
    page.querySelector(".js-dashboard-avatar-sm"),
  ]
    .filter(Boolean)
    .forEach((el) => {
      el.style.backgroundImage = "";
      el.textContent = letter;
      el.classList.remove("has-photo");
    });
}

function syncAccountHeader(page, profile) {
  const nameEl = page.querySelector(".js-dashboard-account-name");
  if (nameEl) nameEl.textContent = profile.name;
  applyAvatarToElements(page, profile);
}

function updateNotificationsBadge(page) {
  const count = getOrdersNeedingSituation().length;
  page.querySelectorAll(".js-dashboard-notifications-badge").forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count === 0;
  });
  const sub = page.querySelector(".js-dashboard-notifications-sub");
  if (sub) {
    sub.textContent =
      count === 0
        ? "No pending order updates"
        : count === 1
          ? "1 order needs a situation"
          : `${count} orders need a situation`;
  }
}

function renderNotificationsList(page) {
  const list = page.querySelector("#dashboard-notifications-list");
  const empty = page.querySelector("#dashboard-notifications-empty");
  if (!list || !empty) return;

  const pending = getOrdersNeedingSituation();
  updateNotificationsBadge(page);

  if (pending.length === 0) {
    list.innerHTML = "";
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  const optionsHtml = DASHBOARD_SITUATION_OPTIONS.map(
    (opt) =>
      `<button type="button" class="dashboard-situation-opt" data-value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</button>`
  ).join("");

  list.innerHTML = pending
    .map(
      (order) => `
    <article class="dashboard-notification-card" data-order-id="${escapeHtml(order.id)}">
      <div class="dashboard-notification-card__head">
        <div>
          <p class="dashboard-notification-card__id">${escapeHtml(order.id)}</p>
          <p class="dashboard-notification-card__meta">${escapeHtml(order.date)} · ${escapeHtml(order.customer)}</p>
        </div>
        <span class="dashboard-notification-card__badge">New</span>
      </div>
      <p class="dashboard-notification-card__product">${escapeHtml(order.product)}</p>
      <p class="dashboard-notification-card__total">${escapeHtml(order.total)}</p>
      <div class="dashboard-notification-card__action">
        <span class="dashboard-notification-card__label" id="situation-label-${escapeHtml(order.id)}">Situation</span>
        <div class="dashboard-situation-picker" role="group" aria-labelledby="situation-label-${escapeHtml(order.id)}">
          ${optionsHtml}
        </div>
        <button type="button" class="dashboard-situation-apply js-dashboard-apply-situation" data-order-id="${escapeHtml(order.id)}">Apply</button>
      </div>
    </article>
  `
    )
    .join("");

  list.querySelectorAll(".dashboard-situation-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".dashboard-notification-card");
      if (!card) return;
      card.querySelectorAll(".dashboard-situation-opt").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      card.dataset.selectedSituation = btn.dataset.value || "";
    });
  });

  list.querySelectorAll(".js-dashboard-apply-situation").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.dataset.orderId;
      const card = btn.closest(".dashboard-notification-card");
      const value = card?.dataset.selectedSituation;
      if (!orderId || !value) {
        card?.querySelector(".dashboard-situation-opt")?.focus();
        return;
      }
      const situations = loadSituations();
      situations[orderId] = value;
      saveSituations(situations);
      syncOrderStatus(orderId, value).catch(() => {});
      renderNotificationsList(page);
    });
  });
}

function bindDashboardNotificationsSheet(page) {
  const overlay = page.querySelector("#dashboard-notifications-overlay");
  if (!overlay) return null;

  const toggles = () => page.querySelectorAll(".js-dashboard-notifications-open");

  const setExpanded = (open) => {
    toggles().forEach((toggle) => toggle.setAttribute("aria-expanded", String(open)));
  };

  const open = () => {
    renderNotificationsList(page);
    openProfileSheet(page, "dashboard-notifications-overlay");
    setExpanded(true);
  };

  const close = () => {
    closeProfileSheet(page, "dashboard-notifications-overlay");
    setExpanded(false);
  };

  toggles().forEach((toggle) => {
    toggle.addEventListener("click", open);
  });

  overlay.querySelectorAll('[data-close="dashboard-notifications-overlay"]').forEach((btn) => {
    btn.addEventListener("click", close);
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  overlay.querySelector(".profile-sheet")?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  return { open, close, overlay };
}

function initDashboardProfile(page) {
  const profileSheet = bindProfileSheet(page, {
    overlayId: "dashboard-profile-overlay",
    toggleSelector: ".js-dashboard-profile-open",
    focusSelector: "#dashboard-profile-name",
  });

  const form = page.querySelector("#dashboard-profile-form");
  const nameInput = page.querySelector("#dashboard-profile-name");
  const emailInput = page.querySelector("#dashboard-profile-email");
  const emailDisplay = page.querySelector("#dashboard-profile-email-display");

  function fillForm() {
    const profile = loadProfile();
    if (nameInput) nameInput.value = profile.name;
    if (emailInput) emailInput.value = profile.email;
    if (emailDisplay) emailDisplay.textContent = profile.email;
    syncAccountHeader(page, profile);
  }

  fillForm();
  page.querySelector(".js-dashboard-profile-open")?.addEventListener("click", fillForm);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const profile = {
      name: nameInput?.value.trim() || loadProfile().name,
      email: emailInput?.value.trim() || loadProfile().email,
    };
    saveProfile(profile);
    syncAccountHeader(page, profile);
    profileSheet?.close();
  });
}

function initDashboardNotifications(page) {
  bindDashboardNotificationsSheet(page);
  renderNotificationsList(page);
}

export function closeDashboardAccountOverlay(page) {
  const profile = page.querySelector("#dashboard-profile-overlay");
  if (profile?.classList.contains("open")) {
    closeProfileSheet(page, "dashboard-profile-overlay", ".js-dashboard-profile-open");
    return true;
  }
  const notifications = page.querySelector("#dashboard-notifications-overlay");
  if (notifications?.classList.contains("open")) {
    closeProfileSheet(page, "dashboard-notifications-overlay");
    page
      .querySelectorAll(".js-dashboard-notifications-open")
      .forEach((toggle) => toggle.setAttribute("aria-expanded", "false"));
    return true;
  }
  return false;
}

export function initDashboardAccount(page) {
  page.querySelector(".js-dashboard-avatar-sm")?.addEventListener("click", () => {
    page.querySelector("#tab-account")?.click();
  });

  initDashboardProfile(page);
  initDashboardNotifications(page);
  updateNotificationsBadge(page);

  page.addEventListener("racelia:backend-synced", () => {
    syncAccountHeader(page, loadProfile());
    renderNotificationsList(page);
  });
}
