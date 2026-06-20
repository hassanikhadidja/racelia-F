import { categoryPages } from "./categoryData.js";
import { getProductDetail } from "./productDetailData.js";

export const DASHBOARD_SCREENS = new Set([
  "overview",
  "order",
  "product",
  "analytics",
  "blogs",
  "users",
  "raceliastyle",
  "webpics",
  "reviews",
  "account",
]);

let suppressHashRestore = false;

export function parseRoute(hash = window.location.hash) {
  const raw = hash.replace(/^#/, "").trim();
  if (!raw || raw === "home") {
    return { view: "home" };
  }

  const parts = raw.split("/").filter(Boolean);

  if (parts[0] === "category" && parts[1]) {
    if (parts[1] === "metiers-dart") {
      return { view: "blogs" };
    }
    if (categoryPages[parts[1]]) {
      return { view: "category", categoryKey: parts[1] };
    }
  }

  if (parts[0] === "product" && parts[1]) {
    return { view: "product", productId: decodeURIComponent(parts[1]) };
  }

  if (parts[0] === "dashboard") {
    const tab = parts[1] && DASHBOARD_SCREENS.has(parts[1]) ? parts[1] : "overview";
    return { view: "dashboard", dashboardTab: tab };
  }

  if (parts[0] === "account") {
    return { view: "account" };
  }

  if (parts[0] === "shopping-bag" || parts[0] === "bag") {
    return { view: "shopping-bag" };
  }

  if (parts[0] === "wishlist") {
    return { view: "wishlist" };
  }

  if (parts[0] === "checkout") {
    return { view: "checkout" };
  }

  if (parts[0] === "blogs") {
    if (parts[1]) {
      return { view: "blog", blogId: decodeURIComponent(parts[1]) };
    }
    return { view: "blogs" };
  }

  if (DASHBOARD_SCREENS.has(parts[0]) && parts.length === 1) {
    return { view: "dashboard", dashboardTab: parts[0] };
  }

  return { view: "home" };
}

export function getDashboardTabFromHash(hash = window.location.hash) {
  const route = parseRoute(hash);
  if (route.view === "dashboard") return route.dashboardTab;
  return null;
}

export function buildHash(route) {
  switch (route.view) {
    case "category":
      return `#category/${route.categoryKey}`;
    case "product":
      return `#product/${encodeURIComponent(route.productId)}`;
    case "dashboard":
      return `#dashboard/${route.dashboardTab || "overview"}`;
    case "account":
      return "#account";
    case "shopping-bag":
      return "#shopping-bag";
    case "wishlist":
      return "#wishlist";
    case "checkout":
      return "#checkout";
    case "blogs":
      return "#blogs";
    case "blog":
      return `#blogs/${encodeURIComponent(route.blogId)}`;
    default:
      return "#home";
  }
}

export function writeRoute(route) {
  const hash = buildHash(route);
  if (window.location.hash === hash) return;

  suppressHashRestore = true;
  history.replaceState(null, "", hash);
  queueMicrotask(() => {
    suppressHashRestore = false;
  });
}

export function shouldIgnoreHashChange() {
  return suppressHashRestore;
}

export function isValidProductRoute(productId) {
  return Boolean(productId && getProductDetail(productId));
}
