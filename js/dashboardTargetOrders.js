import { loadDashboardOrders } from "./dashboardOrdersData.js";

const THUMB_SVG =
  '<svg viewBox="0 0 24 24"><path d="M13.5 5.5c1.09 0 1.91.91 1.91 2s-.82 2-1.91 2-1.91-.91-1.91-2 .82-2 1.91-2zM20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2z"/></svg>';

export const TARGET_ORDER_PERIODS = [
  { id: "last-week", label: "Last Week" },
  { id: "this-week", label: "This Week" },
  { id: "last-month", label: "Last Month" },
  { id: "this-month", label: "This Month" },
  { id: "last-quarter", label: "Last Quarter" },
  { id: "last-year", label: "Last Year" },
];

const TARGET_ORDERS = 50;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseOrderDate(order) {
  if (order?.createdAt) {
    const d = new Date(order.createdAt);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (order?.date) {
    const d = new Date(order.date);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfQuarter(date) {
  const quarter = Math.floor(date.getMonth() / 3);
  return new Date(date.getFullYear(), quarter * 3, 1);
}

function startOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function getPeriodBounds(periodId, now = new Date()) {
  switch (periodId) {
    case "this-week":
      return { start: startOfWeek(now), end: now, compareText: "so far this week" };
    case "last-week": {
      const thisWeekStart = startOfWeek(now);
      const start = new Date(thisWeekStart);
      start.setDate(start.getDate() - 7);
      const end = new Date(thisWeekStart);
      end.setMilliseconds(-1);
      return { start, end, compareText: "last week" };
    }
    case "this-month":
      return { start: startOfMonth(now), end: now, compareText: "so far this month" };
    case "last-month": {
      const start = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      const end = new Date(startOfMonth(now));
      end.setMilliseconds(-1);
      return { start, end, compareText: "last month" };
    }
    case "last-quarter": {
      const start = startOfQuarter(new Date(now.getFullYear(), now.getMonth() - 3, 1));
      const end = new Date(startOfQuarter(now));
      end.setMilliseconds(-1);
      return { start, end, compareText: "last quarter" };
    }
    case "last-year": {
      const start = startOfYear(new Date(now.getFullYear() - 1, 0, 1));
      const end = new Date(startOfYear(now));
      end.setMilliseconds(-1);
      return { start, end, compareText: "last year" };
    }
    default:
      return { start: startOfWeek(now), end: now, compareText: "this week" };
  }
}

function filterOrdersByPeriod(orders, periodId) {
  const { start, end } = getPeriodBounds(periodId);
  return orders.filter((order) => {
    const date = parseOrderDate(order);
    if (!date) return periodId === "this-month";
    return date >= start && date <= end;
  });
}

function parseTotal(value) {
  return parseFloat(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

function buildReportFromOrders(orders, periodId) {
  const filtered = filterOrdersByPeriod(orders, periodId);
  const { compareText } = getPeriodBounds(periodId);
  const counts = {};
  let revenue = 0;

  filtered.forEach((order) => {
    const name = order.product || "Order";
    counts[name] = (counts[name] || 0) + 1;
    revenue += parseTotal(order.total);
  });

  const rows = Object.entries(counts)
    .map(([name, sold]) => ({
      name,
      sold,
      profit: revenue > 0 ? `€${Math.round((revenue * sold) / Math.max(filtered.length, 1))}` : "—",
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const progress = Math.min(100, Math.round((filtered.length / TARGET_ORDERS) * 100));

  return { progress, compareText, rows };
}

function renderReportRows(rows) {
  if (!rows.length) {
    return `<p class="target-orders-empty">No orders in this period yet.</p>`;
  }

  return rows
    .map(
      (row, index) => `
    <div class="table-row">
      <span class="row-num">${index + 1}</span>
      <div class="product-cell">
        <div class="product-img-thumb">${THUMB_SVG}</div>
        <span class="product-name">${escapeHtml(row.name)}</span>
      </div>
      <span class="cell-sold">${escapeHtml(String(row.sold))}</span>
      <span class="cell-profit">${escapeHtml(row.profit)}</span>
    </div>`
    )
    .join("");
}

function updateGauge(page, data) {
  const label = page.querySelector("#targetOrdersGaugeLabel");
  const gaugePath = page.querySelector("#targetOrdersGaugeProgress");

  if (label) {
    label.innerHTML = `You completed <strong>${data.progress}%</strong> of your target orders ${data.compareText}`;
  }

  if (gaugePath) {
    const dashoffset = Math.round(302 * (1 - data.progress / 100));
    gaugePath.setAttribute("stroke-dashoffset", String(dashoffset));
  }
}

function renderTargetOrdersReport(page, periodId) {
  const data = buildReportFromOrders(loadDashboardOrders(), periodId);
  const body = page.querySelector("#targetOrdersReportBody");
  if (!body) return;

  body.innerHTML = renderReportRows(data.rows);
  updateGauge(page, data);
}

export function initTargetOrders(page) {
  const select = page.querySelector("#targetOrdersPeriod");
  if (!select || select.dataset.bound === "true") return;
  select.dataset.bound = "true";

  const render = () => renderTargetOrdersReport(page, select.value || "last-week");
  render();

  select.addEventListener("change", render);
  page.addEventListener("racelia:backend-synced", render);
}
