import { openProfileSheet, closeProfileSheet } from "./clientProfileSheets.js";
import {
  loadCollectedEmails,
  updateCollectedEmail,
  deleteCollectedEmail,
  upsertCollectedEmail,
  isValidCollectedEmail,
  emailSourceLabel,
  loadReturnRequests,
  updateReturnRequest,
  deleteReturnRequest,
  RETURN_STATUSES,
  returnStatusLabel,
  returnTypeLabel,
  syncEmailsFromUsers,
} from "./dashboardEmailsData.js";
import { loadDashboardUsers, saveDashboardUsers } from "./dashboardUsersData.js";
import { getDashboardEmailsOverlaysMarkup } from "./dashboardEmailsMarkup.js";
import { api } from "./api.js";
import {
  syncCollectedEmail,
  syncCollectedEmailUpdate,
  syncCollectedEmailDelete,
  syncReturnUpdate,
  syncReturnDelete,
} from "./syncBackend.js";

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

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function currentEmailsTab(page) {
  return page.querySelector(".dashboard-emails-filter.active")?.dataset.emailsTab || "emails";
}

function currentReturnStatusFilter(page) {
  return page.querySelector(".dashboard-returns-filter[data-return-status].active")?.dataset.returnStatus || "all";
}

function currentReturnTypeFilter(page) {
  return page.querySelector(".dashboard-returns-filter[data-return-type].active")?.dataset.returnType || "all";
}

function filterReturnRequests(items, statusFilter, typeFilter) {
  return items.filter((item) => {
    const status = item.status || "pending";
    const type = item.requestType || "reclamation";
    const statusOk = statusFilter === "all" || status === statusFilter;
    const typeOk = typeFilter === "all" || type === typeFilter;
    return statusOk && typeOk;
  });
}

function setReturnFilterCount(btn, count) {
  const el = btn.querySelector(".dashboard-returns-count");
  if (el) el.textContent = `(${count})`;
}

function updateReturnFilterCounts(page, items) {
  const statusFilter = currentReturnStatusFilter(page);
  const typeFilter = currentReturnTypeFilter(page);

  page.querySelectorAll(".dashboard-returns-filter[data-return-status]").forEach((btn) => {
    const value = btn.dataset.returnStatus;
    const count =
      value === "all"
        ? filterReturnRequests(items, "all", typeFilter).length
        : filterReturnRequests(items, value, typeFilter).length;
    setReturnFilterCount(btn, count);
  });

  page.querySelectorAll(".dashboard-returns-filter[data-return-type]").forEach((btn) => {
    const value = btn.dataset.returnType;
    const count =
      value === "all"
        ? filterReturnRequests(items, statusFilter, "all").length
        : filterReturnRequests(items, statusFilter, value).length;
    setReturnFilterCount(btn, count);
  });
}

function renderEmailRow(item) {
  const sources = (item.sources || [])
    .map((id) => `<span class="dashboard-email-source">${escapeHtml(emailSourceLabel(id))}</span>`)
    .join("");
  const accepted = item.newsletter !== false;
  return `<div class="users-row dashboard-emails-row" data-email-id="${escapeHtml(item.id)}">
    <span class="dashboard-email-name">${escapeHtml(displayValue(item.name))}</span>
    <span class="dashboard-email-address">${escapeHtml(item.email)}</span>
    <div class="dashboard-email-news">
      <button type="button" class="dashboard-email-news-btn${accepted ? " is-on" : ""}" data-email-id="${escapeHtml(item.id)}" aria-pressed="${accepted}">
        ${accepted ? "Yes" : "No"}
      </button>
    </div>
    <div class="dashboard-email-sources">${sources || "—"}</div>
    <div class="dashboard-user-actions">
      <button type="button" class="dashboard-user-action dashboard-user-action--danger js-dashboard-email-delete" data-email-id="${escapeHtml(item.id)}">Delete</button>
    </div>
  </div>`;
}

function statusOptionsHtml(selected) {
  return RETURN_STATUSES.map(
    (status) =>
      `<option value="${escapeHtml(status.id)}"${status.id === selected ? " selected" : ""}>${escapeHtml(status.label)}</option>`
  ).join("");
}

function renderReturnCard(item) {
  const wilaya = [item.wilaya, item.wilayaName].filter(Boolean).join(" — ");
  const photo = item.picture
    ? `<div class="dashboard-return-card__photo"><img src="${escapeHtml(item.picture)}" alt="" /></div>`
    : "";
  return `<article class="dashboard-return-card" data-return-id="${escapeHtml(item.id)}">
    <div class="dashboard-return-card__top">
      <span class="dashboard-return-type">${escapeHtml(returnTypeLabel(item.requestType))}</span>
      <span class="dashboard-return-date">${escapeHtml(formatDate(item.createdAt))}</span>
    </div>
    <p class="dashboard-return-card__name">${escapeHtml(displayValue(item.name))}</p>
    <p class="dashboard-return-card__meta">${escapeHtml(displayValue(item.phone))} · ${escapeHtml(displayValue(item.email))}</p>
    <p class="dashboard-return-card__meta">${escapeHtml(displayValue(wilaya))}</p>
    <p class="dashboard-return-card__comment">${escapeHtml(displayValue(item.comment))}</p>
    ${photo}
    <div class="dashboard-return-card__actions">
      <label class="dashboard-return-status">
        <span>Status</span>
        <select class="js-dashboard-return-status" data-return-id="${escapeHtml(item.id)}">
          ${statusOptionsHtml(item.status || "pending")}
        </select>
      </label>
      <button type="button" class="dashboard-user-action js-dashboard-return-view" data-return-id="${escapeHtml(item.id)}">View</button>
      <button type="button" class="dashboard-user-action dashboard-user-action--danger js-dashboard-return-delete" data-return-id="${escapeHtml(item.id)}">Delete</button>
    </div>
  </article>`;
}

function openReturnDetail(page, id) {
  const item = loadReturnRequests().find((entry) => entry.id === id);
  if (!item) return;
  const fields = page.querySelector("#dashboard-return-detail-fields");
  const photoWrap = page.querySelector("#dashboard-return-detail-photo");
  const img = page.querySelector("#dashboard-return-detail-img");
  const wilaya = [item.wilaya, item.wilayaName].filter(Boolean).join(" — ");
  if (fields) {
    fields.innerHTML = `
      <div class="dashboard-user-profile-detail"><dt>Type</dt><dd>${escapeHtml(returnTypeLabel(item.requestType))}</dd></div>
      <div class="dashboard-user-profile-detail"><dt>Name</dt><dd>${escapeHtml(displayValue(item.name))}</dd></div>
      <div class="dashboard-user-profile-detail"><dt>Number</dt><dd>${escapeHtml(displayValue(item.phone))}</dd></div>
      <div class="dashboard-user-profile-detail"><dt>Email</dt><dd>${escapeHtml(displayValue(item.email))}</dd></div>
      <div class="dashboard-user-profile-detail"><dt>Wilaya</dt><dd>${escapeHtml(displayValue(wilaya))}</dd></div>
      <div class="dashboard-user-profile-detail"><dt>Status</dt><dd>${escapeHtml(returnStatusLabel(item.status))}</dd></div>
      <div class="dashboard-user-profile-detail"><dt>Date</dt><dd>${escapeHtml(formatDate(item.createdAt))}</dd></div>
      <div class="dashboard-user-profile-detail dashboard-user-profile-detail--full"><dt>Comment</dt><dd>${escapeHtml(displayValue(item.comment))}</dd></div>
    `;
  }
  if (photoWrap && img) {
    if (item.picture) {
      img.src = item.picture;
      photoWrap.hidden = false;
    } else {
      img.removeAttribute("src");
      photoWrap.hidden = true;
    }
  }
  openProfileSheet(page, "dashboard-return-detail-overlay");
}

async function persistUserNewsletter(email, accepted) {
  const users = loadDashboardUsers();
  const match = users.find((user) => String(user.email || "").toLowerCase() === email);
  if (!match) return;
  saveDashboardUsers(
    users.map((user) => (user.id === match.id ? { ...user, newsletter: accepted } : user))
  );
  try {
    if (match.id) await api.updateUser(match.id, { newsletter: accepted });
  } catch {
    /* keep local change */
  }
}

export function renderDashboardEmails(page) {
  const emails = loadCollectedEmails();
  const returns = loadReturnRequests();
  const rows = page.querySelector("#dashboard-emails-rows");
  const emailsEmpty = page.querySelector("#dashboard-emails-empty");
  const returnsList = page.querySelector("#dashboard-returns-list");
  const returnsEmpty = page.querySelector("#dashboard-returns-empty");
  const badge = page.querySelector(".js-dash-returns-badge");
  const tab = currentEmailsTab(page);
  const statusFilter = currentReturnStatusFilter(page);
  const typeFilter = currentReturnTypeFilter(page);
  const visibleReturns = filterReturnRequests(returns, statusFilter, typeFilter);

  if (rows) rows.innerHTML = emails.map(renderEmailRow).join("");
  if (emailsEmpty) emailsEmpty.hidden = tab !== "emails" || emails.length > 0;
  if (returnsList) returnsList.innerHTML = visibleReturns.map(renderReturnCard).join("");
  if (returnsEmpty) {
    returnsEmpty.hidden = tab !== "returns" || visibleReturns.length > 0;
    returnsEmpty.textContent = returns.length
      ? "No return requests for this filter."
      : "No return requests yet.";
  }

  updateReturnFilterCounts(page, returns);

  if (badge) {
    const pending = returns.filter((item) => item.status === "pending").length;
    badge.textContent = String(pending);
    badge.hidden = pending === 0;
  }

  rows?.querySelectorAll(".dashboard-email-news-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.emailId;
      const item = loadCollectedEmails().find((entry) => entry.id === id);
      if (!item) return;
      const accepted = item.newsletter === false;
      updateCollectedEmail(id, { newsletter: accepted });
      await persistUserNewsletter(item.email, accepted);
      await syncCollectedEmailUpdate(id, { newsletter: accepted });
      renderDashboardEmails(page);
    });
  });

  rows?.querySelectorAll(".js-dashboard-email-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.emailId;
      if (!id || !window.confirm("Delete this email?")) return;
      deleteCollectedEmail(id);
      await syncCollectedEmailDelete(id);
      renderDashboardEmails(page);
    });
  });

  returnsList?.querySelectorAll(".js-dashboard-return-status").forEach((select) => {
    select.addEventListener("change", async () => {
      updateReturnRequest(select.dataset.returnId, { status: select.value });
      await syncReturnUpdate(select.dataset.returnId, { status: select.value });
      renderDashboardEmails(page);
    });
  });

  returnsList?.querySelectorAll(".js-dashboard-return-view").forEach((btn) => {
    btn.addEventListener("click", () => openReturnDetail(page, btn.dataset.returnId));
  });

  returnsList?.querySelectorAll(".js-dashboard-return-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.returnId;
      if (!id || !window.confirm("Delete this return request?")) return;
      deleteReturnRequest(id);
      await syncReturnDelete(id);
      renderDashboardEmails(page);
    });
  });
}

function bindEmailsTabs(page) {
  const tabs = page.querySelectorAll(".dashboard-emails-filter[data-emails-tab]");
  const emailsPanel = page.querySelector("#dashboard-emails-panel");
  const returnsPanel = page.querySelector("#dashboard-returns-panel");
  const addBtn = page.querySelector("#dashboard-emails-add-btn");

  const apply = (which) => {
    tabs.forEach((tab) => {
      const on = tab.dataset.emailsTab === which;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", String(on));
    });
    if (emailsPanel) emailsPanel.hidden = which !== "emails";
    if (returnsPanel) returnsPanel.hidden = which !== "returns";
    if (addBtn) addBtn.hidden = which !== "emails";
    const emailsEmpty = page.querySelector("#dashboard-emails-empty");
    if (emailsEmpty) emailsEmpty.hidden = which !== "emails" || loadCollectedEmails().length > 0;
    if (which === "returns") renderDashboardEmails(page);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => apply(tab.dataset.emailsTab));
  });
}

function bindReturnFilters(page) {
  const activateGroup = (groupSelector, clicked) => {
    page.querySelectorAll(groupSelector).forEach((btn) => {
      const on = btn === clicked;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", String(on));
    });
    renderDashboardEmails(page);
  };

  page.querySelectorAll(".dashboard-returns-filter[data-return-status]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activateGroup(".dashboard-returns-filter[data-return-status]", btn);
    });
  });

  page.querySelectorAll(".dashboard-returns-filter[data-return-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activateGroup(".dashboard-returns-filter[data-return-type]", btn);
    });
  });
}

function bindEmailSheets(page) {
  if (!page.querySelector("#dashboard-add-email-overlay")) {
    page.insertAdjacentHTML("beforeend", getDashboardEmailsOverlaysMarkup());
  }

  ["dashboard-add-email-overlay", "dashboard-return-detail-overlay"].forEach((overlayId) => {
    const overlay = page.querySelector(`#${overlayId}`);
    overlay?.querySelector("[data-close]")?.addEventListener("click", () => {
      closeProfileSheet(page, overlayId);
    });
    overlay?.addEventListener("click", (event) => {
      if (event.target === overlay) closeProfileSheet(page, overlayId);
    });
  });

  page.querySelector(".js-dashboard-email-add-open")?.addEventListener("click", () => {
    page.querySelector("#dashboard-add-email-form")?.reset();
    openProfileSheet(page, "dashboard-add-email-overlay");
    page.querySelector("#dash-email-address")?.focus();
  });

  page.querySelector("#dashboard-add-email-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = page.querySelector("#dash-email-name")?.value.trim() || "";
    const email = page.querySelector("#dash-email-address")?.value.trim() || "";
    const newsletter = page.querySelector("#dash-email-newsletter")?.value !== "no";
    if (!isValidCollectedEmail(email)) {
      window.alert("Enter a valid email address.");
      return;
    }
    const payload = {
      email,
      name,
      newsletter,
      source: "admin",
      forceNewsletter: true,
    };
    upsertCollectedEmail(payload);
    await syncCollectedEmail(payload);
    closeProfileSheet(page, "dashboard-add-email-overlay");
    renderDashboardEmails(page);
  });
}

export function closeDashboardEmailsOverlay(page) {
  const ids = ["dashboard-add-email-overlay", "dashboard-return-detail-overlay"];
  const open = ids.find((id) => page.querySelector(`#${id}`)?.getAttribute("aria-hidden") === "false");
  if (!open) return false;
  closeProfileSheet(page, open);
  return true;
}

export function initDashboardEmails(page) {
  if (!page || page.dataset.emailsBound === "true") return;
  page.dataset.emailsBound = "true";

  bindEmailSheets(page);
  bindEmailsTabs(page);
  bindReturnFilters(page);
  syncEmailsFromUsers(loadDashboardUsers());
  renderDashboardEmails(page);

  window.addEventListener("racelia:emails-updated", () => {
    if (!page.querySelector("#emails") || page.hidden) return;
    renderDashboardEmails(page);
  });
}
