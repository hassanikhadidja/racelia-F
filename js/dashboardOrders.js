import {
  loadDashboardOrders,
  orderMatchesFilter,
  updateDashboardOrderStatus,
  DASHBOARD_SITUATION_OPTIONS,
  DASHBOARD_ORDER_FILTERS,
} from "./dashboardOrdersData.js";
import { formatDashboardTotal } from "./currency.js";
import { syncOrderStatus } from "./syncBackend.js";
import { loadDashboardUsers, saveDashboardUsers } from "./dashboardUsersData.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function statusClass(status) {
  const value = String(status || "").toLowerCase();
  if (value === "processing") return "pending";
  return value || "pending";
}

function displayStatusLabel(order) {
  const status = String(order?.status || "").toLowerCase();
  if (status === "processing" || status === "pending") return "Pending";
  if (status === "on_way") return "In way";
  if (status === "not_received") return "Not Received";
  if (status === "order_issue") return "Order Issue";
  if (status === "cancelled") return "Canceled";
  return order.statusLabel || order.status || "Pending";
}

function orderItems(order) {
  if (Array.isArray(order.items) && order.items.length) return order.items;
  return [
    {
      productSlug: order.productSlug || "",
      name: order.product || "",
      quantity: order.quantity || 1,
    },
  ];
}

function detailRow(label, value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return `<div class="dashboard-order-row">
    <span class="dashboard-order-row__label">${escapeHtml(label)}</span>
    <span class="dashboard-order-row__value">${escapeHtml(text)}</span>
  </div>`;
}

function statusMenuMarkup(order) {
  const current = statusClass(order.status);
  return DASHBOARD_SITUATION_OPTIONS.map((option) => {
    const selected = option.value === current ? " is-selected" : "";
    return `<button type="button" class="dashboard-order-status-opt js-dashboard-order-status-opt${selected}" data-order-id="${escapeHtml(order.id)}" data-value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</button>`;
  }).join("");
}

export function renderStoreOrderCard(order) {
  const items = orderItems(order);
  const productRows = items
    .map((item) => {
      const slug = item.productSlug || item.productId || item.name || "—";
      const qty = Number(item.quantity) || 1;
      return `${detailRow("Product ID", slug)}${detailRow("Quantity", String(qty))}`;
    })
    .join("");
  const current = statusClass(order.status);

  return `<article class="dashboard-store-order dashboard-user-order" data-order-id="${escapeHtml(order.id)}">
    <div class="dashboard-user-order__head">
      <div>
        <p class="dashboard-user-order__id">${escapeHtml(order.id)}</p>
        <p class="dashboard-user-order__date">${escapeHtml(order.date || "")}</p>
      </div>
      <button type="button" class="dashboard-user-order__status dashboard-user-order__status--${escapeHtml(current)} js-dashboard-order-status" data-order-id="${escapeHtml(order.id)}" aria-expanded="false" aria-haspopup="listbox" aria-label="Change order status">
        ${escapeHtml(displayStatusLabel(order))}
      </button>
    </div>
    <div class="dashboard-order-status-menu" hidden role="listbox" aria-label="Order status">
      ${statusMenuMarkup(order)}
      <div class="dashboard-order-issue-form" hidden>
        <label class="dashboard-order-row__label" for="order-issue-${escapeHtml(order.id)}">Issue comment</label>
        <textarea id="order-issue-${escapeHtml(order.id)}" class="dashboard-order-issue-comment js-dashboard-order-issue-comment" rows="3" placeholder="Describe the issue (required)">${escapeHtml(order.issueComment || "")}</textarea>
        <p class="dashboard-order-issue-error js-dashboard-order-issue-error" hidden>A comment is required for Order Issue.</p>
        <button type="button" class="dashboard-order-issue-save js-dashboard-order-issue-save" data-order-id="${escapeHtml(order.id)}">Save Order Issue</button>
      </div>
    </div>
    <div class="dashboard-order-details">
      ${productRows}
      ${detailRow("Client name", order.customer || order.customerName)}
      ${detailRow("Number", order.phone)}
      ${detailRow("Wilaya", order.wilaya)}
      ${detailRow("Commune", order.commune)}
      ${detailRow("Email", order.customerEmail || order.email)}
      ${detailRow("Promo code", order.promoCode)}
      ${detailRow("Account", order.hasAccount || order.userId ? "Yes" : "No")}
      ${detailRow("Product cost", formatDashboardTotal(order.subtotal))}
      ${detailRow("Delivery cost", formatDashboardTotal(order.deliveryFee))}
      ${detailRow("Total cost", formatDashboardTotal(order.total))}
      ${current === "order_issue" ? detailRow("Issue comment", order.issueComment) : ""}
    </div>
  </article>`;
}

export function getActiveOrdersFilter(page) {
  return page.querySelector(".dashboard-orders-filter.active")?.dataset.ordersFilter || "all";
}

export function renderDashboardOrders(page, filter = getActiveOrdersFilter(page)) {
  const list = page.querySelector("#dashboard-orders-list");
  const empty = page.querySelector("#dashboard-orders-empty");
  if (!list) return;

  const allOrders = loadDashboardOrders();
  page.querySelectorAll(".dashboard-orders-filter").forEach((btn) => {
    const value = btn.dataset.ordersFilter || "all";
    const definition = DASHBOARD_ORDER_FILTERS.find((item) => item.value === value);
    const count = allOrders.filter((order) => orderMatchesFilter(order, value)).length;
    const label = definition?.label || "All";
    btn.textContent = `${label} (${count})`;
  });

  const orders = allOrders.filter((order) => orderMatchesFilter(order, filter));
  list.innerHTML = orders.map(renderStoreOrderCard).join("");
  if (empty) {
    empty.hidden = orders.length > 0;
    empty.textContent =
      filter === "all" ? "No orders yet." : "No orders in this status.";
  }
}

function closeAllStatusMenus(page) {
  page.querySelectorAll(".js-dashboard-order-status").forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");
    const card = btn.closest(".dashboard-user-order");
    const menu = card?.querySelector(".dashboard-order-status-menu");
    if (menu) menu.hidden = true;
    card?.classList.remove("is-status-open");
  });
}

function openStatusMenu(card) {
  const btn = card.querySelector(".js-dashboard-order-status");
  const menu = card.querySelector(".dashboard-order-status-menu");
  if (!btn || !menu) return;
  btn.setAttribute("aria-expanded", "true");
  menu.hidden = false;
  card.classList.add("is-status-open");
}

function syncStatusOnUserOrders(orderId, status, label, issueComment) {
  const users = loadDashboardUsers().map((user) => ({
    ...user,
    orders: (user.orders || []).map((order) =>
      String(order.id) === String(orderId)
        ? { ...order, status, statusLabel: label, issueComment: issueComment || order.issueComment || "" }
        : order
    ),
  }));
  saveDashboardUsers(users);
}

function refreshOpenUserOrders(page, orderId) {
  const overlay = page.querySelector("#dashboard-user-orders-overlay");
  if (!overlay?.classList.contains("open")) return;
  const list = overlay.querySelector("#dashboard-user-orders-list");
  if (!list) return;
  const users = loadDashboardUsers();
  const user = users.find((item) => item.id === overlay.dataset.userId);
  const orders = user?.orders || loadDashboardOrders().filter((order) => String(order.id) === String(orderId));
  list.innerHTML = orders.map(renderStoreOrderCard).join("");
}

function applyOrderStatus(page, orderId, status, issueComment = "") {
  if (status === "order_issue" && !String(issueComment || "").trim()) return false;
  const updated = updateDashboardOrderStatus(orderId, status, issueComment);
  const order = updated.find((item) => String(item.id) === String(orderId));
  syncStatusOnUserOrders(orderId, status, order?.statusLabel || status, issueComment);
  syncOrderStatus(orderId, status, issueComment).catch(() => {});
  renderDashboardOrders(page);
  refreshOpenUserOrders(page, orderId);
  page.dispatchEvent(new CustomEvent("racelia:backend-synced"));
  return true;
}

function showIssueForm(card) {
  const form = card?.querySelector(".dashboard-order-issue-form");
  if (!form) return;
  form.hidden = false;
  form.querySelector(".js-dashboard-order-issue-comment")?.focus();
}

function hideIssueForm(card) {
  const form = card?.querySelector(".dashboard-order-issue-form");
  if (form) form.hidden = true;
}

function bindOrderStatusMenus(page) {
  page.addEventListener("click", (event) => {
    const saveIssue = event.target.closest(".js-dashboard-order-issue-save");
    if (saveIssue && page.contains(saveIssue)) {
      event.preventDefault();
      event.stopPropagation();
      const card = saveIssue.closest(".dashboard-user-order");
      const comment = card?.querySelector(".js-dashboard-order-issue-comment")?.value.trim() || "";
      const error = card?.querySelector(".js-dashboard-order-issue-error");
      if (!comment) {
        if (error) error.hidden = false;
        card?.querySelector(".js-dashboard-order-issue-comment")?.focus();
        return;
      }
      if (error) error.hidden = true;
      applyOrderStatus(page, saveIssue.dataset.orderId, "order_issue", comment);
      return;
    }

    if (event.target.closest(".js-dashboard-order-issue-comment") && page.contains(event.target)) {
      event.stopPropagation();
      return;
    }

    const option = event.target.closest(".js-dashboard-order-status-opt");
    if (option && page.contains(option)) {
      event.preventDefault();
      event.stopPropagation();
      const orderId = option.dataset.orderId;
      const status = option.dataset.value;
      const card = option.closest(".dashboard-user-order");
      card?.querySelectorAll(".js-dashboard-order-status-opt").forEach((item) => {
        item.classList.toggle("is-selected", item === option);
      });
      if (status === "order_issue") {
        showIssueForm(card);
        return;
      }
      hideIssueForm(card);
      if (orderId && status) applyOrderStatus(page, orderId, status);
      return;
    }

    const toggle = event.target.closest(".js-dashboard-order-status");
    if (toggle && page.contains(toggle)) {
      event.preventDefault();
      event.stopPropagation();
      const card = toggle.closest(".dashboard-user-order");
      const wasOpen = toggle.getAttribute("aria-expanded") === "true";
      closeAllStatusMenus(page);
      if (!wasOpen && card) openStatusMenu(card);
      return;
    }

    if (event.target.closest(".dashboard-order-status-menu")) return;

    closeAllStatusMenus(page);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllStatusMenus(page);
  });
}

export function initDashboardOrders(page) {
  if (!page || page.dataset.ordersBound === "true") return;
  page.dataset.ordersBound = "true";

  page.querySelectorAll(".dashboard-orders-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      page.querySelectorAll(".dashboard-orders-filter").forEach((item) => {
        item.classList.toggle("active", item === btn);
      });
      renderDashboardOrders(page, btn.dataset.ordersFilter || "all");
    });
  });

  bindOrderStatusMenus(page);
  renderDashboardOrders(page);
  page.addEventListener("racelia:backend-synced", () => {
    renderDashboardOrders(page);
  });
}
