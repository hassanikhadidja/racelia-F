import { categoryPages } from "./categoryData.js";
import { getProductDetail } from "./productDetailData.js";

export const DASHBOARD_SCREENS = new Set([
  "overview",
  "order",
  "product",
  "analytics",
  "users",
  "emails",
  "boutiques",
  "raceliastyle",
  "reviews",
  "account",
]);

let suppressHashRestore = false;
let navIndex = 0;
let restoringRoute = false;

export function beginRouteRestore() {
  restoringRoute = true;
}

export function endRouteRestore() {
  restoringRoute = false;
}

function decodeRoutePart(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseFaqRoute(parts) {
  if (!parts[1]) {
    return { view: "faq", faqView: "home" };
  }

  if (parts[1] === "all") {
    return { view: "faq", faqView: "all" };
  }

  if (parts[1] === "search") {
    const queryParts = parts.slice(2).map(decodeRoutePart);
    return { view: "faq", faqView: "search", faqQuery: queryParts.join("/") };
  }

  const faqCategoryId = decodeRoutePart(parts[1]);
  if (parts[2]) {
    return {
      view: "faq",
      faqView: "article",
      faqCategoryId,
      faqArticleId: decodeRoutePart(parts[2]),
    };
  }

  return { view: "faq", faqView: "category", faqCategoryId };
}

function buildFaqHash(route) {
  if (route.faqView === "all") return "#faq/all";
  if (route.faqView === "search") {
    const query = String(route.faqQuery || "").trim();
    return query ? `#faq/search/${encodeURIComponent(query)}` : "#faq/search";
  }
  if (route.faqView === "article" && route.faqCategoryId && route.faqArticleId) {
    return `#faq/${encodeURIComponent(route.faqCategoryId)}/${encodeURIComponent(route.faqArticleId)}`;
  }
  if (route.faqView === "category" && route.faqCategoryId) {
    return `#faq/${encodeURIComponent(route.faqCategoryId)}`;
  }
  return "#faq";
}

export function parseRoute(hash = window.location.hash) {
  const raw = hash.replace(/^#/, "").trim();
  if (!raw || raw === "home") {
    return { view: "home" };
  }

  const parts = raw.split("/").filter(Boolean);

  if (parts[0] === "category" && parts[1]) {
    if (parts[1] === "metiers-dart") {
      return { view: "category", categoryKey: "nouveautes" };
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

  if (parts[0] === "client-profile") {
    return { view: "client-profile" };
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
    return { view: "category", categoryKey: "nouveautes" };
  }

  if (parts[0] === "confidentialite" || parts[0] === "privacy") {
    return { view: "privacy" };
  }

  if (parts[0] === "conditions" || parts[0] === "terms") {
    return { view: "terms" };
  }

  if (parts[0] === "livraison" || parts[0] === "shipping") {
    return { view: "shipping" };
  }

  if (parts[0] === "boutiques" || parts[0] === "stores") {
    return { view: "boutiques" };
  }

  if (parts[0] === "faq") {
    return parseFaqRoute(parts);
  }

  if (parts[0] === "retours" || parts[0] === "returns") {
    return { view: "returns" };
  }

  if (parts[0] === "carte-cadeau" || parts[0] === "gift-card") {
    return { view: "gift-card" };
  }

  if (parts[0] === "contact") {
    return { view: "contact" };
  }

  if (parts[0] === "about" || parts[0] === "a-propos") {
    return { view: "about" };
  }

  if (parts[0] === "recherche" || parts[0] === "search") {
    const queryParts = parts.slice(1).map(decodeRoutePart);
    return { view: "search", searchQuery: queryParts.join("/") };
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
    case "client-profile":
      return "#client-profile";
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
    case "privacy":
      return "#confidentialite";
    case "terms":
      return "#conditions";
    case "shipping":
      return "#livraison";
    case "boutiques":
      return "#boutiques";
    case "faq":
      return buildFaqHash(route);
    case "returns":
      return "#retours";
    case "gift-card":
      return "#carte-cadeau";
    case "contact":
      return "#contact";
    case "about":
      return "#about";
    case "search": {
      const query = String(route.searchQuery || "").trim();
      return query ? `#recherche/${encodeURIComponent(query)}` : "#recherche";
    }
    default:
      return "#home";
  }
}

export function writeRoute(route, { replace = false } = {}) {
  const hash = buildHash(route);
  const current = window.location.hash || "#home";
  if (current === hash) return;

  const previous = parseRoute(window.location.hash);
  const replaceTab = previous.view === "dashboard" && route.view === "dashboard";
  const useReplace =
    replace || restoringRoute || replaceTab || !window.location.hash;

  suppressHashRestore = true;
  if (useReplace) {
    history.replaceState({ raceliaNav: navIndex }, "", hash);
  } else {
    navIndex += 1;
    history.pushState({ raceliaNav: navIndex }, "", hash);
  }
  queueMicrotask(() => {
    suppressHashRestore = false;
  });
}

export function goBackInApp() {
  if ((history.state?.raceliaNav || 0) > 0) {
    history.back();
    return true;
  }
  return false;
}

export function shouldIgnoreHashChange() {
  return suppressHashRestore;
}

export function isValidProductRoute(productId) {
  return Boolean(productId && getProductDetail(productId));
}
