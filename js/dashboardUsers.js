import { openProfileSheet, closeProfileSheet } from "./clientProfileSheets.js";
import {
  loadDashboardUsers,
  saveDashboardUsers,
  getInitials,
} from "./dashboardUsersData.js";
import {
  getDashboardUsersSectionMarkup,
  getDashboardUsersOverlaysMarkup,
} from "./dashboardUsersMarkup.js";
import { api } from "./api.js";
import { syncAdminData } from "./syncBackend.js";
import { initProfileCardFlips, renderUserProfileCards } from "./profileCardsMarkup.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function displayValue(value) {
  const text = String(value ?? "").trim();
  return text || "—";
}

function formatMemberSince(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function renderUserAvatar(user) {
  const initials = getInitials(user.name);
  if (user.avatar) {
    return `<div class="user-avatar dashboard-user-avatar dashboard-user-avatar--photo"><img class="dashboard-user-avatar-img" src="${escapeHtml(user.avatar)}" alt="" /></div>`;
  }
  return `<div class="user-avatar dashboard-user-avatar">${escapeHtml(initials)}</div>`;
}

function renderOrderCard(order) {
  return `<article class="dashboard-user-order">
    <div class="dashboard-user-order__head">
      <div>
        <p class="dashboard-user-order__id">${escapeHtml(order.id)}</p>
        <p class="dashboard-user-order__date">${escapeHtml(order.date)}</p>
      </div>
      <span class="dashboard-user-order__status dashboard-user-order__status--${escapeHtml(order.status)}">${escapeHtml(order.statusLabel || order.status)}</span>
    </div>
    <p class="dashboard-user-order__product">${escapeHtml(order.product)}</p>
    <p class="dashboard-user-order__total">${escapeHtml(order.total)}</p>
  </article>`;
}

function renderUserRow(user) {
  const orderCount = user.orders?.length || 0;
  return `<div class="users-row dashboard-users-row" data-user-id="${escapeHtml(user.id)}">
    <div class="user-cell">
      ${renderUserAvatar(user)}
      <button type="button" class="user-name js-dashboard-user-profile-open" data-user-id="${escapeHtml(user.id)}">${escapeHtml(user.name)}</button>
    </div>
    <span class="user-email">${escapeHtml(user.email)}</span>
    <span class="dashboard-user-points">${Number(user.points || 0).toLocaleString()} pts</span>
    <span class="dashboard-user-order-count">${orderCount} order${orderCount === 1 ? "" : "s"}</span>
    <div class="dashboard-user-actions">
      <button type="button" class="dashboard-user-action js-dashboard-user-profile-open" data-user-id="${escapeHtml(user.id)}">Profile</button>
      <button type="button" class="dashboard-user-action js-dashboard-user-orders" data-user-id="${escapeHtml(user.id)}">Orders</button>
      <button type="button" class="dashboard-user-action js-dashboard-user-points" data-user-id="${escapeHtml(user.id)}">Points</button>
      <button type="button" class="dashboard-user-action dashboard-user-action--danger js-dashboard-user-delete" data-user-id="${escapeHtml(user.id)}">Delete</button>
    </div>
  </div>`;
}

function applyUserProfileAvatar(page, user) {
  const wrap = page.querySelector("#dashboard-user-profile-avatar-wrap");
  const letter = page.querySelector("#dashboard-user-profile-avatar-letter");
  const img = page.querySelector("#dashboard-user-profile-avatar-img");
  if (!wrap || !letter || !img) return;

  letter.textContent = getInitials(user.name);

  if (user.avatar) {
    img.src = user.avatar;
    img.hidden = false;
    wrap.classList.add("has-photo");
    return;
  }

  img.hidden = true;
  img.removeAttribute("src");
  wrap.classList.remove("has-photo");
}

function openUserProfile(page, userId) {
  const user = loadDashboardUsers().find((u) => u.id === userId);
  if (!user) return;

  const overlay = page.querySelector("#dashboard-user-profile-overlay");
  if (overlay) overlay.dataset.userId = user.id;

  applyUserProfileAvatar(page, user);

  const setText = (id, value) => {
    const el = page.querySelector(id);
    if (el) el.textContent = value;
  };

  setText("#dashboard-user-profile-name", displayValue(user.name));
  setText("#dashboard-user-profile-role", displayValue(user.role));
  setText("#dashboard-user-profile-email", displayValue(user.email));
  setText("#dashboard-user-profile-phone", displayValue(user.phone));
  setText("#dashboard-user-profile-address", displayValue(user.address));
  setText("#dashboard-user-profile-wilaya", displayValue(user.wilaya));
  setText("#dashboard-user-profile-commune", displayValue(user.commune));
  setText("#dashboard-user-profile-since", formatMemberSince(user.createdAt));
  setText("#dashboard-user-profile-status", displayValue(user.status));
  setText(
    "#dashboard-user-profile-points",
    `${Number(user.points || 0).toLocaleString()} pts`
  );
  setText(
    "#dashboard-user-profile-orders",
    `${user.orders?.length || 0} order${user.orders?.length === 1 ? "" : "s"}`
  );

  const cardsRoot = page.querySelector("#dashboard-user-profile-cards");
  if (cardsRoot) {
    cardsRoot.innerHTML = renderUserProfileCards(user);
    initProfileCardFlips(cardsRoot, "dashboard-user-card");
  }

  openProfileSheet(page, "dashboard-user-profile-overlay");
}

export function renderDashboardUsers(page) {
  const users = loadDashboardUsers();
  const rows = page.querySelector("#dashboard-users-rows");
  const empty = page.querySelector("#dashboard-users-empty");

  if (rows) {
    rows.innerHTML = users.map(renderUserRow).join("");
    if (empty) empty.hidden = users.length > 0;
  }

  rows?.querySelectorAll(".js-dashboard-user-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.userId;
      if (!id || !window.confirm("Delete this user? This cannot be undone.")) return;
      saveDashboardUsers(loadDashboardUsers().filter((u) => u.id !== id));
      renderDashboardUsers(page);
    });
  });

  rows?.querySelectorAll(".js-dashboard-user-profile-open").forEach((btn) => {
    btn.addEventListener("click", () => openUserProfile(page, btn.dataset.userId));
  });

  rows?.querySelectorAll(".js-dashboard-user-orders").forEach((btn) => {
    btn.addEventListener("click", () => openUserOrders(page, btn.dataset.userId));
  });

  rows?.querySelectorAll(".js-dashboard-user-points").forEach((btn) => {
    btn.addEventListener("click", () => openUserPoints(page, btn.dataset.userId));
  });
}

function openUserOrders(page, userId, { returnToProfile = false } = {}) {
  const user = loadDashboardUsers().find((u) => u.id === userId);
  if (!user) return;

  const nameEl = page.querySelector("#dashboard-user-orders-name");
  const list = page.querySelector("#dashboard-user-orders-list");
  const empty = page.querySelector("#dashboard-user-orders-empty");
  const overlay = page.querySelector("#dashboard-user-orders-overlay");

  if (nameEl) nameEl.textContent = user.name;
  const orders = user.orders || [];

  if (list) {
    list.innerHTML = orders.map(renderOrderCard).join("");
  }
  if (empty) empty.hidden = orders.length > 0;

  if (overlay) {
    overlay.dataset.userId = user.id;
    overlay.dataset.returnToProfile = returnToProfile ? "true" : "false";
  }

  openProfileSheet(page, "dashboard-user-orders-overlay");
}

function openUserPoints(page, userId, { returnToProfile = false } = {}) {
  const user = loadDashboardUsers().find((u) => u.id === userId);
  if (!user) return;

  const idInput = page.querySelector("#dashboard-user-points-id");
  const nameEl = page.querySelector("#dashboard-user-points-name");
  const currentEl = page.querySelector("#dashboard-user-points-current");
  const amountInput = page.querySelector("#dashboard-user-points-amount");
  const overlay = page.querySelector("#dashboard-user-points-overlay");

  if (idInput) idInput.value = user.id;
  if (nameEl) nameEl.textContent = user.name;
  if (currentEl) currentEl.textContent = Number(user.points || 0).toLocaleString();
  if (amountInput) amountInput.value = "";

  if (overlay) {
    overlay.dataset.userId = user.id;
    overlay.dataset.returnToProfile = returnToProfile ? "true" : "false";
  }

  openProfileSheet(page, "dashboard-user-points-overlay");
  amountInput?.focus();
}

function closeUserSubSheet(page, overlayId) {
  const overlay = page.querySelector(`#${overlayId}`);
  if (!overlay) return;

  const returnToProfile = overlay.dataset.returnToProfile === "true";
  const userId = overlay.dataset.userId;

  closeProfileSheet(page, overlayId);
  overlay.dataset.returnToProfile = "false";

  if (returnToProfile && userId) {
    openUserProfile(page, userId);
  }
}

function bindUserSheets(page) {
  if (!page.querySelector("#dashboard-add-user-overlay")) {
    page.insertAdjacentHTML("beforeend", getDashboardUsersOverlaysMarkup());
  }

  const bindOverlayClose = (overlayId, { returnToProfileOnClose = false } = {}) => {
    const overlay = page.querySelector(`#${overlayId}`);
    const close = () => {
      if (returnToProfileOnClose) closeUserSubSheet(page, overlayId);
      else closeProfileSheet(page, overlayId);
    };
    overlay?.querySelectorAll(`[data-close="${overlayId}"]`).forEach((btn) => {
      btn.addEventListener("click", close);
    });
    overlay?.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    overlay?.querySelector(".profile-sheet")?.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  };

  bindOverlayClose("dashboard-add-user-overlay");
  bindOverlayClose("dashboard-user-points-overlay", { returnToProfileOnClose: true });
  bindOverlayClose("dashboard-user-orders-overlay", { returnToProfileOnClose: true });
  bindOverlayClose("dashboard-user-profile-overlay");

  page.querySelector(".js-dashboard-user-profile-orders")?.addEventListener("click", () => {
    const userId = page.querySelector("#dashboard-user-profile-overlay")?.dataset.userId;
    if (!userId) return;
    closeProfileSheet(page, "dashboard-user-profile-overlay");
    openUserOrders(page, userId, { returnToProfile: true });
  });

  page.querySelector(".js-dashboard-user-profile-points")?.addEventListener("click", () => {
    const userId = page.querySelector("#dashboard-user-profile-overlay")?.dataset.userId;
    if (!userId) return;
    closeProfileSheet(page, "dashboard-user-profile-overlay");
    openUserPoints(page, userId, { returnToProfile: true });
  });

  page.querySelectorAll(".js-dashboard-user-add-open").forEach((btn) => {
    btn.addEventListener("click", () => {
      openProfileSheet(page, "dashboard-add-user-overlay");
      page.querySelector("#dash-user-name")?.focus();
    });
  });

  page.querySelector("#dashboard-add-user-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = page.querySelector("#dash-user-name")?.value.trim();
    const email = page.querySelector("#dash-user-email")?.value.trim();
    const password = page.querySelector("#dash-user-password")?.value;
    if (!name || !email || !password) return;

    const users = loadDashboardUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      window.alert("A user with this email already exists.");
      return;
    }

    try {
      await api.register({ name, email, password });
      await syncAdminData();
    } catch (error) {
      window.alert(error.message || "Could not create user.");
      return;
    }

    page.querySelector("#dashboard-add-user-form")?.reset();
    closeProfileSheet(page, "dashboard-add-user-overlay");
    renderDashboardUsers(page);
  });

  page.querySelector("#dashboard-user-points-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userId = page.querySelector("#dashboard-user-points-id")?.value;
    const amount = Number(page.querySelector("#dashboard-user-points-amount")?.value);
    if (!userId || !amount || amount < 1) return;

    const user = loadDashboardUsers().find((u) => u.id === userId);
    if (!user) return;
    const nextPoints = (user.points || 0) + amount;

    try {
      await api.updateUser(userId, { points: nextPoints });
      const users = loadDashboardUsers().map((u) =>
        u.id === userId ? { ...u, points: nextPoints } : u
      );
      saveDashboardUsers(users);
    } catch (error) {
      window.alert(error.message || "Could not update points.");
      return;
    }

    closeProfileSheet(page, "dashboard-user-points-overlay");
    renderDashboardUsers(page);
  });
}

export function closeDashboardUsersOverlay(page) {
  const ids = [
    "dashboard-add-user-overlay",
    "dashboard-user-points-overlay",
    "dashboard-user-orders-overlay",
    "dashboard-user-profile-overlay",
  ];
  for (const id of ids) {
    if (page.querySelector(`#${id}`)?.classList.contains("open")) {
      if (id === "dashboard-user-points-overlay" || id === "dashboard-user-orders-overlay") {
        closeUserSubSheet(page, id);
      } else {
        closeProfileSheet(page, id);
      }
      return true;
    }
  }
  return false;
}

export function initDashboardUsers(page) {
  const section = page.querySelector("#users");
  if (!section || section.dataset.usersBound === "true") return;
  section.dataset.usersBound = "true";

  bindUserSheets(page);
  renderDashboardUsers(page);

  page.querySelector('[data-screen="users"]')?.addEventListener("click", () => {
    requestAnimationFrame(() => renderDashboardUsers(page));
  });

  page.addEventListener("racelia:backend-synced", () => renderDashboardUsers(page));
}
