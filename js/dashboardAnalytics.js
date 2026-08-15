import { loadDashboardOrders } from "./dashboardOrdersData.js";
import { loadCatalogProducts, PRODUCT_SECTIONS } from "./productCatalog.js";
import { loadPublishedReviews, getReviewStats } from "./dashboardReviewsData.js";
import { formatDzdPrice, eurToDzd, USD_TO_DZD } from "./currency.js";

const DONUT_C = 2 * Math.PI * 28;
const BAG_SECTION_IDS = ["mini-bags", "racelia-handbag", "moms-bags", "all-selection"];

function orderStatus(order) {
  return String(order?.status || "").toLowerCase();
}

function isReceivedOrder(order) {
  const status = orderStatus(order);
  return status === "received" || status === "delivered";
}

function isReturnedOrder(order) {
  const status = orderStatus(order);
  return status === "cancelled" || status === "not_received";
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

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

function weekBounds(now = new Date()) {
  const thisStart = startOfWeek(now);
  const lastStart = new Date(thisStart);
  lastStart.setDate(lastStart.getDate() - 7);
  return {
    thisWeek: { start: thisStart, end: now },
    lastWeek: { start: lastStart, end: new Date(thisStart.getTime() - 1) },
  };
}

function inRange(order, range) {
  const date = parseOrderDate(order);
  if (!date) return false;
  return date >= range.start && date <= range.end;
}

function orderItems(order) {
  if (Array.isArray(order.items) && order.items.length) return order.items;
  return [
    {
      productSlug: order.productSlug,
      name: order.product,
      quantity: order.quantity || 1,
    },
  ];
}

function itemQty(item) {
  return Math.max(1, Number(item.quantity) || 1);
}

function productMatchesItem(product, item) {
  const slug = String(product.id || "").toLowerCase();
  const name = String(product.name || "").toLowerCase();
  const itemSlug = String(item.productSlug || item.productId || "").toLowerCase();
  const itemName = String(item.name || "").toLowerCase();
  return Boolean((slug && itemSlug && slug === itemSlug) || (name && itemName && name === itemName));
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function compactRevenue(amount) {
  const value = Math.max(0, Number(amount) || 0);
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M DZD`;
  }
  return formatDzdPrice(value);
}

function formatDelta(current, previous) {
  if (previous <= 0 && current <= 0) return { label: "—", tone: "green" };
  if (previous <= 0) return { label: "▲ New", tone: "green" };
  const pct = ((current - previous) / previous) * 100;
  const abs = Math.abs(pct);
  const num = abs >= 10 ? abs.toFixed(0) : abs.toFixed(1);
  if (pct > 0.05) return { label: `▲ +${num}%`, tone: "green" };
  if (pct < -0.05) return { label: `▼ -${num}%`, tone: "red" };
  return { label: "▲ 0%", tone: "green" };
}

function setBadge(el, delta) {
  if (!el) return;
  el.textContent = delta.label;
  el.classList.toggle("badge-green", delta.tone === "green");
  el.classList.toggle("badge-red", delta.tone === "red");
}

function setArc(circle, length, offset) {
  if (!circle) return;
  const arc = Math.max(0, Number(length) || 0);
  circle.setAttribute("stroke-dasharray", `${arc} ${DONUT_C}`);
  circle.setAttribute("stroke-dashoffset", String(offset || 0));
}

function catalogByItem(catalog, item) {
  return catalog.find((product) => productMatchesItem(product, item)) || null;
}

function countSectionQty(orders, catalog, sectionId) {
  return orders.reduce((sum, order) => {
    return (
      sum +
      orderItems(order).reduce((itemSum, item) => {
        const product = catalogByItem(catalog, item);
        if (!product?.sections?.includes(sectionId)) return itemSum;
        return itemSum + itemQty(item);
      }, 0)
    );
  }, 0);
}

function orderUnits(order) {
  return orderItems(order).reduce((sum, item) => sum + itemQty(item), 0);
}

export function getAnalyticsData(now = new Date()) {
  const orders = loadDashboardOrders();
  const catalog = loadCatalogProducts();
  const weeks = weekBounds(now);

  const received = orders.filter(isReceivedOrder);
  const returned = orders.filter(isReturnedOrder);
  const processed = orders.filter((order) => !isReceivedOrder(order) && !isReturnedOrder(order));
  const total = orders.length;
  const receivedPct = total ? Math.round((received.length / total) * 100) : 0;

  const thisReceived = received.filter((order) => inRange(order, weeks.thisWeek));
  const lastReceived = received.filter((order) => inRange(order, weeks.lastWeek));

  const categories = BAG_SECTION_IDS.map((id) => {
    const section = PRODUCT_SECTIONS.find((item) => item.id === id);
    return {
      id,
      label: section?.label || id,
      count: countSectionQty(received, catalog, id),
      thisWeek: countSectionQty(thisReceived, catalog, id),
      lastWeek: countSectionQty(lastReceived, catalog, id),
    };
  });
  const maxCategory = Math.max(1, ...categories.map((item) => item.count));
  const categoryThis = categories.reduce((sum, item) => sum + item.thisWeek, 0);
  const categoryLast = categories.reduce((sum, item) => sum + item.lastWeek, 0);

  const weeklyUnits = thisReceived.reduce((sum, order) => sum + orderUnits(order), 0);
  const lastUnits = lastReceived.reduce((sum, order) => sum + orderUnits(order), 0);
  const weeklyRevenue = thisReceived.reduce((sum, order) => sum + productCostDzd(order), 0);
  const lastRevenue = lastReceived.reduce((sum, order) => sum + productCostDzd(order), 0);

  const reviews = getReviewStats(loadPublishedReviews());

  return {
    received: received.length,
    returned: returned.length,
    processed: processed.length,
    total,
    receivedPct,
    receivedArc: total ? (received.length / total) * DONUT_C : 0,
    returnedArc: total ? (returned.length / total) * DONUT_C : 0,
    breakdownDelta: formatDelta(thisReceived.length, lastReceived.length),
    categories,
    maxCategory,
    categoriesDelta: formatDelta(categoryThis, categoryLast),
    weeklyUnits,
    weeklyRevenue,
    weeklyRating: reviews.average,
    weeklyDelta: formatDelta(weeklyRevenue, lastRevenue),
  };
}

export function renderDashboardAnalytics(page) {
  const root = page?.querySelector("#analytics");
  if (!root) return;

  const data = getAnalyticsData();
  const setText = (selector, value) => {
    const el = root.querySelector(selector);
    if (el) el.textContent = value;
  };

  setBadge(root.querySelector("#analytics-breakdown-badge"), data.breakdownDelta);
  setArc(root.querySelector("#analytics-donut-received"), data.receivedArc, 0);
  setArc(root.querySelector("#analytics-donut-returned"), data.returnedArc, -data.receivedArc);
  setText("#analytics-donut-pct", `${data.receivedPct}%`);
  setText("#analytics-received-count", String(data.received));
  setText("#analytics-returned-count", String(data.returned));
  setText("#analytics-processed-count", String(data.processed));

  setBadge(root.querySelector("#analytics-categories-badge"), data.categoriesDelta);
  const bars = root.querySelector("#analytics-category-bars");
  if (bars) {
    bars.innerHTML = data.categories
      .map((item) => {
        const width = Math.round((item.count / data.maxCategory) * 100);
        const label = item.count === 1 ? "order" : "orders";
        return `<div class="mini-bar-item"><div class="mini-bar-label"><span>${escapeHtml(item.label)}</span><span>${item.count} ${label}</span></div><div class="mini-bar-track"><div class="mini-bar-fill" style="width:${width}%"></div></div></div>`;
      })
      .join("");
  }

  setBadge(root.querySelector("#analytics-weekly-badge"), data.weeklyDelta);
  setText("#analytics-weekly-units", data.weeklyUnits.toLocaleString("fr-FR"));
  setText("#analytics-weekly-revenue", compactRevenue(data.weeklyRevenue));
  setText(
    "#analytics-weekly-rating",
    data.weeklyRating === "—" ? "—" : `${data.weeklyRating}★`
  );
}

export function initDashboardAnalytics(page) {
  if (!page || page.dataset.analyticsBound === "true") return;
  page.dataset.analyticsBound = "true";

  const render = () => renderDashboardAnalytics(page);
  render();

  page.addEventListener("racelia:backend-synced", render);
  page.querySelector('[data-screen="analytics"]')?.addEventListener("click", () => {
    requestAnimationFrame(render);
  });
}
