import { loadDashboardOrders } from "./dashboardOrdersData.js";
import { loadDashboardUsers } from "./dashboardUsersData.js";
import { formatDashboardTotal, formatDzdPrice, eurToDzd, USD_TO_DZD } from "./currency.js";

function orderStatus(order) {
  return String(order?.status || "").toLowerCase();
}

function isReceivedOrder(order) {
  return orderStatus(order) === "received";
}

function isRevenueOrder(order) {
  const status = orderStatus(order);
  return status === "received" || status === "delivered";
}

function parseAmountDzd(value) {
  const raw = String(value ?? "");
  const numeric = parseFloat(raw.replace(/[^\d.]/g, "")) || 0;
  if (/dzd/i.test(raw)) return numeric;
  if (/\$/.test(raw)) return numeric * USD_TO_DZD;
  return eurToDzd(numeric);
}

function productCostDzd(order) {
  if (order.subtotal != null && order.subtotal !== "") {
    return parseAmountDzd(order.subtotal);
  }
  const total = parseAmountDzd(order.total);
  const delivery = parseAmountDzd(order.deliveryFee);
  return Math.max(0, total - delivery);
}

function deliveryCostDzd(order) {
  return parseAmountDzd(order.deliveryFee);
}

function parseOrderDate(order) {
  if (order?.createdAt) {
    const date = new Date(order.createdAt);
    if (!Number.isNaN(date.getTime())) return date;
  }
  if (order?.date) {
    const date = new Date(order.date);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function compactDzd(amount) {
  const value = Math.max(0, Number(amount) || 0);
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000).toLocaleString("fr-FR")} k`;
  }
  return Math.round(value).toLocaleString("fr-FR");
}

function niceMax(value) {
  if (value <= 0) return 1000;
  const exp = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / exp) * exp;
}

function getRevenueBuckets(period, now = new Date()) {
  if (period === "Today") {
    return Array.from({ length: 6 }, (_, index) => {
      const start = new Date(now);
      start.setHours(index * 4, 0, 0, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + 4, 0, 0, 0);
      return { start, end, label: `${String(index * 4).padStart(2, "0")}h` };
    });
  }

  if (period === "Monthly") {
    return Array.from({ length: 7 }, (_, index) => {
      const start = new Date(now.getFullYear(), now.getMonth() - 6 + index, 1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      return {
        start,
        end,
        label: start.toLocaleDateString("en-GB", { month: "short" }),
      };
    });
  }

  const weekStart = startOfDay(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, index) => {
    const start = new Date(weekStart);
    start.setDate(weekStart.getDate() + index);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end, label };
  });
}

export function getRevenueChartData(period = "Weekly") {
  const buckets = getRevenueBuckets(period);
  const orders = loadDashboardOrders();

  const points = buckets.map((bucket) => {
    let revenue = 0;
    let delivery = 0;
    orders.forEach((order) => {
      const date = parseOrderDate(order);
      if (!date || date < bucket.start || date >= bucket.end) return;
      if (isRevenueOrder(order)) revenue += productCostDzd(order);
      if (isReceivedOrder(order)) delivery += deliveryCostDzd(order);
    });
    return { ...bucket, revenue, delivery };
  });

  const maxValue = niceMax(Math.max(0, ...points.map((point) => Math.max(point.revenue, point.delivery))));
  return { points, maxValue };
}

function yAxisLabels(maxValue) {
  return [1, 0.8, 0.6, 0.4, 0.2].map((ratio) => `${compactDzd(maxValue * ratio)} DZD`);
}

export function renderRevenueChart(page, period = "Weekly") {
  const container = page.querySelector("#chart");
  if (!container) return;

  const { points, maxValue } = getRevenueChartData(period);
  const barsHtml = points
    .map((point) => {
      const revenuePct = maxValue ? Math.round((point.revenue / maxValue) * 100) : 0;
      const deliveryPct = maxValue ? Math.round((point.delivery / maxValue) * 100) : 0;
      return `<div class="bar-group">
        <div class="bar-tooltip">${formatDzdPrice(point.revenue)} net · ${formatDzdPrice(point.delivery)} delivery</div>
        <div class="bar light" style="height:0%" data-height="${deliveryPct}"></div>
        <div class="bar dark" style="height:0%" data-height="${revenuePct}"></div>
      </div>`;
    })
    .join("");

  container.innerHTML = `
    <div class="chart-labels-y">${yAxisLabels(maxValue).map((label) => `<span>${label}</span>`).join("")}</div>
    <div class="bars-area">${barsHtml}</div>
    <div class="chart-labels-x">${points.map((point) => `<span>${point.label}</span>`).join("")}</div>
  `;

  requestAnimationFrame(() => {
    container.querySelectorAll(".bar").forEach((bar) => {
      bar.style.height = `${bar.dataset.height || 0}%`;
    });
  });
}

function isCustomerAccount(user) {
  const role = String(user?.role || "Customer").toLowerCase();
  return role === "customer" || role === "client";
}

function orderHasAccount(order) {
  return Boolean(order?.hasAccount || order?.userId);
}

export function getOverviewStats() {
  const orders = loadDashboardOrders();
  const revenueOrders = orders.filter(isRevenueOrder);
  const received = orders.filter(isReceivedOrder);
  const users = loadDashboardUsers().filter(isCustomerAccount);
  const accountOrders = orders.filter(orderHasAccount);
  const conversion =
    orders.length === 0 ? 0 : Math.round((accountOrders.length / orders.length) * 100);

  return {
    netRevenueDzd: revenueOrders.reduce((sum, order) => sum + productCostDzd(order), 0),
    deliveryCostDzd: received.reduce((sum, order) => sum + deliveryCostDzd(order), 0),
    totalOrders: orders.length,
    totalAccounts: users.length,
    conversion,
    accountOrders: accountOrders.length,
  };
}

export function renderDashboardOverview(page) {
  const stats = getOverviewStats();
  const setText = (id, value) => {
    const el = page.querySelector(id);
    if (el) el.textContent = value;
  };

  setText("#overview-net-revenue", formatDashboardTotal(stats.netRevenueDzd + " DZD"));
  setText("#overview-delivery-cost", formatDashboardTotal(stats.deliveryCostDzd + " DZD"));
  setText("#overview-total-orders", String(stats.totalOrders));
  setText("#overview-total-accounts", String(stats.totalAccounts));
  setText("#overview-conversion", `${stats.conversion}%`);
  setText(
    "#overview-conversion-sub",
    `${stats.accountOrders} of ${stats.totalOrders} orders from accounts`
  );

  const period =
    page.querySelector("#overview .tab.active")?.dataset.period || "Weekly";
  renderRevenueChart(page, period);
}

export function initDashboardOverview(page) {
  if (!page || page.dataset.overviewBound === "true") return;
  page.dataset.overviewBound = "true";

  const render = () => renderDashboardOverview(page);
  render();

  page.querySelectorAll("#overview .tab[data-period]").forEach((tab) => {
    tab.addEventListener("click", () => {
      page.querySelectorAll("#overview .tab[data-period]").forEach((item) => {
        item.classList.toggle("active", item === tab);
      });
      renderRevenueChart(page, tab.dataset.period || "Weekly");
    });
  });

  page.addEventListener("racelia:backend-synced", render);
  page.querySelector('[data-screen="overview"]')?.addEventListener("click", () => {
    requestAnimationFrame(render);
  });
}
