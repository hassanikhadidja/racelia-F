import { categoryPages, getCategoryProductsForSection } from "./categoryData.js";
import { getCatalogProductById } from "./productCatalog.js";
import { getCardImages } from "./productImages.js";
import { defaultSelection } from "./data.js";
import { createCategoryProduct } from "../components/CategoryProduct.js";
import { updateCtaDock, getActiveDockSlot, isOnProductDetailPage } from "./ctaDock.js";
import { closeStyleSheet } from "./raceliaStyle.js";
import { initProductSliders } from "./productSliders.js";
import { updateTopbar } from "./topbar.js";
import { getAuthToken, isAdminUser } from "./api.js";
import { updateAccountButtons } from "./accountUi.js";
import { initProductDetailPage, mountProductDetail, closePdpAddedOverlay, closePdpVirtualTryOn } from "./productDetail.js";
import { initDashboard } from "./dashboard.js";
import { initShoppingBag } from "./shoppingBag.js";
import { initWishlist } from "./wishlist.js";
import { initCheckout } from "./checkout.js";
import { collectBagItems } from "./bagHelpers.js";
import { syncWishlistHeartStates } from "./clientCartWishlist.js";
import { parseRoute, writeRoute, isValidProductRoute, shouldIgnoreHashChange } from "./route.js";
import { applyHomeWebPics } from "./homeWebPics.js";
import { renderHomeNewArrivals } from "./homeNewArrivals.js";
import {
  initBlogsPage,
  renderBlogsList,
  renderBlogArticle,
  showBlogsListView,
} from "./blogsPage.js";

let currentPage = "home";
let currentProductId = null;
let currentBlogId = null;
let lastCategoryPage = null;
let lastStorePage = "home";
/** Page to restore when leaving the shopping bag (not overwritten by checkout/wishlist). */
let pageBeforeShoppingBag = "home";
let pageBeforeAccount = "home";
let activeCategoryFilters = [];

function resolveAccountReturnPage(fromPage = currentPage) {
  if (fromPage === "account") return pageBeforeAccount || "home";
  return fromPage || "home";
}

export function getCurrentPage() {
  return currentPage;
}

function syncRoute() {
  if (currentPage === "dashboard") {
    const tab = sessionStorage.getItem("racelia-dashboard-tab") || "overview";
    writeRoute({ view: "dashboard", dashboardTab: tab });
    return;
  }

  if (currentPage === "shopping-bag") {
    writeRoute({ view: "shopping-bag" });
    return;
  }

  if (currentPage === "wishlist") {
    writeRoute({ view: "wishlist" });
    return;
  }

  if (currentPage === "checkout") {
    writeRoute({ view: "checkout" });
    return;
  }

  if (currentPage === "account") {
    writeRoute({ view: "account" });
    return;
  }

  if (currentPage === "product" && currentProductId) {
    writeRoute({ view: "product", productId: currentProductId });
    return;
  }

  if (currentPage === "blogs") {
    writeRoute({ view: "blogs" });
    return;
  }

  if (currentPage === "blog" && currentBlogId) {
    writeRoute({ view: "blog", blogId: currentBlogId });
    return;
  }

  if (categoryPages[currentPage]) {
    writeRoute({ view: "category", categoryKey: currentPage });
    return;
  }

  writeRoute({ view: "home" });
}

export function restoreRouteFromUrl(root) {
  const route = parseRoute();

  if (route.view === "dashboard") {
    if (!isAdminUser()) {
      showHome(root);
      return;
    }
    sessionStorage.setItem("racelia-dashboard-tab", route.dashboardTab);
    showDashboard(root);
    return;
  }

  if (route.view === "shopping-bag") {
    showShoppingBag(root);
    return;
  }

  if (route.view === "wishlist") {
    showWishlist(root);
    return;
  }

  if (route.view === "checkout") {
    if (collectBagItems(root).length > 0) {
      showCheckout(root);
    } else {
      showShoppingBag(root);
    }
    return;
  }

  if (route.view === "account") {
    if (getAuthToken()) showHome(root);
    else showAccount(root);
    return;
  }

  if (route.view === "category") {
    showCategory(root, route.categoryKey);
    return;
  }

  if (route.view === "blogs") {
    showBlogs(root);
    return;
  }

  if (route.view === "blog" && route.blogId) {
    showBlogs(root, { blogId: route.blogId });
    return;
  }

  if (route.view === "product" && isValidProductRoute(route.productId)) {
    showProductDetail(root, route.productId);
    return;
  }

  showHome(root);
}

export function showAccount(root) {
  if (getAuthToken()) return;

  const accountPage = root.querySelector("#accountPage");
  if (!accountPage || !accountPage.hidden) return;

  if (currentPage !== "account") {
    pageBeforeAccount = currentPage;
  }

  currentPage = "account";
  hideAllPages(root);
  closeOverlays(root);
  setOverlayShellActive(false);

  root.querySelector("#pageMain").hidden = true;
  root.querySelector("#categoryPage").hidden = true;
  root.querySelector("#productDetailPage").hidden = true;
  root.querySelector("#dashboardPage").hidden = true;
  const shoppingBagPage = root.querySelector("#shoppingBagPage");
  if (shoppingBagPage) shoppingBagPage.hidden = true;
  const wishlistPage = root.querySelector("#wishlistPage");
  if (wishlistPage) wishlistPage.hidden = true;
  const checkoutPage = root.querySelector("#checkoutPage");
  if (checkoutPage) checkoutPage.hidden = true;
  accountPage.hidden = false;

  syncRoute();
  updateTopbar(root);
  updateCtaDock(root);
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

export function closeAccount(root) {
  const accountPage = root.querySelector("#accountPage");
  if (!accountPage || accountPage.hidden) return;

  accountPage.hidden = true;
  currentPage = pageBeforeAccount || "home";
  restoreView(root);
  syncRoute();
  updateTopbar(root);
  updateCtaDock(root);
}

function closeOverlays(root) {
  root.querySelector("#menuPanel")?.classList.remove("open");
  root.querySelector("#menuPanel")?.setAttribute("aria-hidden", "true");
  root.querySelector("#menuBackdrop")?.classList.remove("open");
  document.body.classList.remove("menu-open");
  closeStyleSheet(root);
  closePdpAddedOverlay(root);
  closePdpVirtualTryOn(root);

  const widget = root.querySelector("#selectionWidget");
  if (widget?.classList.contains("modal-animated-container--open")) {
    root.querySelector("#closeModal")?.click();
  }
}

export function attachSelectionWidget(root) {
  const widget = root.querySelector("#selectionWidget");
  const slot = getActiveDockSlot(root);
  if (!widget || !slot) return;

  slot.appendChild(widget);
  widget.classList.remove("modal-animated-container--category", "modal-animated-container--pdp");
  widget.classList.toggle("modal-animated-container--instant-dock", isOnProductDetailPage(root));
  updateCtaDock(root);
}

function setSelectionLabel(root, label) {
  const ctaLabel = root.querySelector("#ctaLabel");
  const modalHeading = root.querySelector("#modalHeading");
  if (ctaLabel) ctaLabel.textContent = label;
  if (modalHeading) modalHeading.textContent = label;

  root.querySelectorAll("#modalListWrap li").forEach((item) => {
    item.classList.toggle("active", item.textContent === label);
  });
}

function getSelectedFilterLabels(filter) {
  return [...filter.querySelectorAll('input[type="checkbox"]:checked')].map((input) => {
    const row = input.closest(".category-page__check-row");
    return row?.querySelector("span:last-child")?.textContent?.trim() || "";
  }).filter(Boolean);
}

function productMatchesFilters(product, selectedFilters) {
  if (!selectedFilters.length) return true;
  if (!product.filters?.length) return false;
  return selectedFilters.some((label) => product.filters.includes(label));
}

function renderCategoryProducts(root, pageKey, selectedFilters = activeCategoryFilters) {
  const config = categoryPages[pageKey];
  const productsRoot = root.querySelector("#categoryProducts");
  if (!config || !productsRoot) return;

  const pageProducts = getCategoryProductsForSection(pageKey);
  const products = selectedFilters.length
    ? pageProducts.filter((product) => productMatchesFilters(product, selectedFilters))
    : pageProducts;

  productsRoot.replaceChildren();
  products.forEach((product) => {
    productsRoot.appendChild(createCategoryProduct(product));
  });

  initCategoryInteractions(root);
  initProductSliders(root, productsRoot);
  updateCtaDock(root);
  syncWishlistHeartStates(root);
}

function renderCategory(root, pageKey) {
  const config = categoryPages[pageKey];
  const categoryPage = root.querySelector("#categoryPage");
  if (!config || !categoryPage) return;

  root.querySelector("#categoryPageTitle").textContent = config.title;
  root.querySelector("#categoryPageSub").textContent = config.subtitle;
  root.querySelector("#categoryPageBar").textContent = config.collectionBar;

  renderCategoryProducts(root, pageKey);
}

function hideAllPages(root) {
  root.querySelector("#pageMain").hidden = true;
  root.querySelector("#categoryPage").hidden = true;
  root.querySelector("#productDetailPage").hidden = true;
  root.querySelector("#accountPage").hidden = true;
  const dashboard = root.querySelector("#dashboardPage");
  if (dashboard) dashboard.hidden = true;
  const shoppingBag = root.querySelector("#shoppingBagPage");
  if (shoppingBag) shoppingBag.hidden = true;
  const wishlist = root.querySelector("#wishlistPage");
  if (wishlist) wishlist.hidden = true;
  const checkout = root.querySelector("#checkoutPage");
  if (checkout) checkout.hidden = true;
  const blogsPage = root.querySelector("#blogsPage");
  if (blogsPage) blogsPage.hidden = true;
}

function setOverlayShellActive(active) {
  document.body.classList.toggle("dashboard-active", active);
  document.body.classList.toggle("shopping-bag-active", active);
  document.body.classList.toggle("wishlist-active", active);
  document.body.classList.toggle("checkout-active", active);
}

function setDashboardShellActive(active) {
  document.body.classList.toggle("dashboard-active", active);
  if (active) {
    document.body.classList.remove("shopping-bag-active");
    document.body.classList.remove("wishlist-active");
    document.body.classList.remove("checkout-active");
  }
}

function setShoppingBagShellActive(active) {
  document.body.classList.toggle("shopping-bag-active", active);
  if (active) {
    document.body.classList.remove("dashboard-active");
    document.body.classList.remove("wishlist-active");
    document.body.classList.remove("checkout-active");
  }
}

function setWishlistShellActive(active) {
  document.body.classList.toggle("wishlist-active", active);
  if (active) {
    document.body.classList.remove("dashboard-active");
    document.body.classList.remove("shopping-bag-active");
    document.body.classList.remove("checkout-active");
  }
}

function setCheckoutShellActive(active) {
  document.body.classList.toggle("checkout-active", active);
  if (active) {
    document.body.classList.remove("dashboard-active");
    document.body.classList.remove("shopping-bag-active");
    document.body.classList.remove("wishlist-active");
  }
}

function initCategoryInteractions(root) {
  root.querySelectorAll(".category-product__swatch").forEach((swatch) => {
    swatch.addEventListener("click", (event) => {
      event.stopPropagation();
      const group = swatch.closest(".category-product__swatches");
      group?.querySelectorAll(".category-product__swatch").forEach((item) => {
        item.classList.remove("is-selected");
      });
      swatch.classList.add("is-selected");

      const card = swatch.closest(".category-product");
      const productId = card?.dataset.productId;
      const colorIndex = Number(swatch.dataset.colorIndex || 0);
      if (!productId || !card) return;

      const catalogProduct = getCatalogProductById(productId);
      if (!catalogProduct) return;

      const images = getCardImages(catalogProduct, colorIndex);
      if (!images.length) return;

      card.dataset.images = images.join("|");
      const slides = card.querySelector(".slides");
      if (slides) {
        slides.innerHTML = images
          .map((src) => `<img src="${src}" alt="" onerror="this.style.visibility='hidden'">`)
          .join("");
        slides.scrollTo({ left: 0 });
      }
      initProductSliders(root, card);
    });
  });
}

function initProductCardNavigation(root) {
  if (root.dataset.productNavBound === "true") return;
  root.dataset.productNavBound = "true";

  const openFromCard = (card) => {
    const productId = card?.dataset.productId;
    if (productId) showProductDetail(root, productId);
  };

  root.addEventListener("click", (event) => {
    const card = event.target.closest(".js-product-open");
    if (!card || !root.contains(card)) return;
    if (event.target.closest("button")) return;
    openFromCard(card);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".js-product-open");
    if (!card || !root.contains(card)) return;
    event.preventDefault();
    openFromCard(card);
  });
}

function updateClearButtonState(filter, clearBtn) {
  const hasChecked = filter.querySelector('input[type="checkbox"]:checked');
  clearBtn?.classList.toggle("is-active", !!hasChecked);
}

function clearCategoryFilters(root, filter, clearBtn) {
  filter.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });

  filter.querySelectorAll(".category-page__accordion.open").forEach((accordion) => {
    accordion.classList.remove("open");
  });

  activeCategoryFilters = [];

  if (currentPage !== "home" && currentPage !== "product" && categoryPages[currentPage]) {
    renderCategoryProducts(root, currentPage, []);
  }

  updateClearButtonState(filter, clearBtn);
}

function initCategoryFilter(root) {
  const filter = root.querySelector("#categoryFilter");
  const openBtn = root.querySelector("#categoryFilterOpen");
  const closeBtn = root.querySelector("#categoryFilterClose");
  const clearBtn = root.querySelector("#categoryFilterClear");
  const resultsBtn = root.querySelector("#categoryFilterResults");
  const widget = root.querySelector("#selectionWidget");

  if (!filter || filter.dataset.bound === "true") return;
  filter.dataset.bound = "true";

  const setFilterOpen = (open) => {
    filter.classList.toggle("open", open);
    filter.setAttribute("aria-hidden", open ? "false" : "true");
    widget?.classList.toggle("is-hidden-for-filter", open);
    if (open) updateClearButtonState(filter, clearBtn);
  };

  const closeFilter = () => setFilterOpen(false);

  openBtn?.addEventListener("click", () => setFilterOpen(true));
  closeBtn?.addEventListener("click", closeFilter);

  resultsBtn?.addEventListener("click", () => {
    activeCategoryFilters = getSelectedFilterLabels(filter);
    if (currentPage !== "home" && currentPage !== "product" && categoryPages[currentPage]) {
      renderCategoryProducts(root, currentPage, activeCategoryFilters);
    }
    closeFilter();
  });

  clearBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearCategoryFilters(root, filter, clearBtn);
  });

  filter.addEventListener("change", (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
      updateClearButtonState(filter, clearBtn);
    }
  });

  filter.querySelectorAll(".category-page__accordion-head").forEach((head) => {
    head.addEventListener("click", () => {
      head.closest(".category-page__accordion")?.classList.toggle("open");
    });
  });
}

export function showDashboard(root) {
  if (!isAdminUser()) return;

  if (currentPage !== "dashboard") {
    lastStorePage = currentPage;
  }

  currentPage = "dashboard";
  hideAllPages(root);
  closeOverlays(root);

  const dashboard = root.querySelector("#dashboardPage");
  if (dashboard) dashboard.hidden = false;

  setDashboardShellActive(true);
  initDashboard(root);
  updateCtaDock(root);
  syncRoute();
  dashboard?.scrollTo({ top: 0 });
}

export function leaveDashboard(root) {
  if (currentPage !== "dashboard") return;

  currentPage = lastStorePage;
  setDashboardShellActive(false);

  const dashboard = root.querySelector("#dashboardPage");
  if (dashboard) dashboard.hidden = true;

  restoreView(root);
  syncRoute();
  updateTopbar(root);
  updateCtaDock(root);
}

export function showShoppingBag(root) {
  if (currentPage !== "shopping-bag") {
    pageBeforeShoppingBag = currentPage;
    lastStorePage = currentPage;
  }

  currentPage = "shopping-bag";
  hideAllPages(root);
  closeOverlays(root);

  const page = root.querySelector("#shoppingBagPage");
  if (page) page.hidden = false;

  setShoppingBagShellActive(true);
  initShoppingBag(root, { onBack: () => leaveShoppingBag(root) });
  updateCtaDock(root);
  syncRoute();
  page?.scrollTo({ top: 0 });
}

export function leaveShoppingBag(root) {
  if (currentPage !== "shopping-bag") return;

  currentPage = pageBeforeShoppingBag;
  lastStorePage = pageBeforeShoppingBag;
  setShoppingBagShellActive(false);

  const page = root.querySelector("#shoppingBagPage");
  if (page) page.hidden = true;

  restoreView(root);
  syncRoute();
  updateTopbar(root);
  updateCtaDock(root);
}

export function showWishlist(root) {
  if (currentPage !== "wishlist") {
    lastStorePage = currentPage;
  }

  currentPage = "wishlist";
  hideAllPages(root);
  closeOverlays(root);

  const page = root.querySelector("#wishlistPage");
  if (page) page.hidden = false;

  setWishlistShellActive(true);
  initWishlist(root, {
    onMoveToBag: () => {
      leaveWishlist(root);
      showShoppingBag(root);
    },
    onOpenBag: () => {
      leaveWishlist(root);
      showShoppingBag(root);
    },
  });
  updateCtaDock(root);
  syncRoute();
  page?.scrollTo({ top: 0 });
}

export function leaveWishlist(root) {
  if (currentPage !== "wishlist") return;

  currentPage = lastStorePage;
  setWishlistShellActive(false);

  const page = root.querySelector("#wishlistPage");
  if (page) page.hidden = true;

  restoreView(root);
  syncRoute();
  updateTopbar(root);
  updateCtaDock(root);
}

export function showCheckout(root) {
  const items = collectBagItems(root);
  if (items.length === 0) {
    window.alert("Your bag is empty.");
    return;
  }

  if (currentPage !== "checkout") {
    lastStorePage = currentPage;
  }

  currentPage = "checkout";
  hideAllPages(root);
  closeOverlays(root);

  const page = root.querySelector("#checkoutPage");
  if (page) page.hidden = false;

  setCheckoutShellActive(true);
  initCheckout(root, items);
  updateCtaDock(root);
  syncRoute();
  page?.scrollTo({ top: 0 });
}

export function leaveCheckout(root) {
  if (currentPage !== "checkout") return;

  currentPage = lastStorePage;
  setCheckoutShellActive(false);

  const page = root.querySelector("#checkoutPage");
  if (page) page.hidden = true;

  restoreView(root);
  syncRoute();
  updateTopbar(root);
  updateCtaDock(root);
}

const HOME_GRID_SECTION_ID = "newArrivalsSection";
const TOPBAR_SCROLL_OFFSET = 56;

export function scrollToHomeProductGrid(root) {
  const section = root.querySelector(`#${HOME_GRID_SECTION_ID}`);
  if (!section) return;

  const top = section.getBoundingClientRect().top + window.scrollY - TOPBAR_SCROLL_OFFSET;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
}

export function showHome(root, { selectionLabel = defaultSelection, scrollToGrid = false } = {}) {
  setOverlayShellActive(false);
  currentPage = "home";
  currentProductId = null;
  activeCategoryFilters = [];

  hideAllPages(root);
  root.querySelector("#pageMain").hidden = false;

  closeOverlays(root);
  updateTopbar(root);
  attachSelectionWidget(root);
  setSelectionLabel(root, selectionLabel);
  syncRoute();
  requestAnimationFrame(() => applyHomeWebPics(root));

  if (scrollToGrid) {
    requestAnimationFrame(() => scrollToHomeProductGrid(root));
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function showProductDetail(root, productId) {
  setOverlayShellActive(false);
  if (!mountProductDetail(root, productId)) {
    showHome(root);
    return;
  }

  if (currentPage !== "home" && currentPage !== "product" && categoryPages[currentPage]) {
    lastCategoryPage = currentPage;
  }

  currentPage = "product";
  currentProductId = productId;

  hideAllPages(root);
  root.querySelector("#productDetailPage").hidden = false;

  closeOverlays(root);
  root.querySelector("#selectionWidget")?.classList.remove("is-hidden-for-filter");
  attachSelectionWidget(root);
  updateCtaDock(root);
  updateTopbar(root);
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (lastCategoryPage && categoryPages[lastCategoryPage]) {
    setSelectionLabel(root, categoryPages[lastCategoryPage].selectionLabel);
  }

  syncRoute();
}

export function showBlogs(root, { blogId = null } = {}) {
  setOverlayShellActive(false);
  currentPage = "blogs";
  currentProductId = null;
  currentBlogId = null;

  hideAllPages(root);
  const blogsPage = root.querySelector("#blogsPage");
  if (blogsPage) blogsPage.hidden = false;

  closeOverlays(root);
  showBlogsListView(root);
  renderBlogsList(root);
  initBlogsPage(root);
  attachSelectionWidget(root);
  updateCtaDock(root);
  updateTopbar(root);
  syncRoute();

  if (blogId) {
    showBlogArticle(root, blogId);
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function showBlogArticle(root, blogId) {
  if (!renderBlogArticle(root, blogId)) {
    showBlogs(root);
    return;
  }

  currentPage = "blog";
  currentBlogId = blogId;
  syncRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function showCategory(root, pageKey) {
  if (pageKey === "metiers-dart") {
    showBlogs(root);
    return;
  }

  const config = categoryPages[pageKey];
  if (!config) return;

  setOverlayShellActive(false);
  currentPage = pageKey;
  currentProductId = null;
  lastCategoryPage = pageKey;
  activeCategoryFilters = [];

  hideAllPages(root);
  root.querySelector("#categoryPage").hidden = false;

  const filter = root.querySelector("#categoryFilter");
  if (filter) {
    filter.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = false;
    });
    filter.querySelectorAll(".category-page__accordion.open").forEach((accordion) => {
      accordion.classList.remove("open");
    });
    filter.classList.remove("open");
    filter.setAttribute("aria-hidden", "true");
    root.querySelector("#selectionWidget")?.classList.remove("is-hidden-for-filter");
    updateClearButtonState(filter, root.querySelector("#categoryFilterClear"));
  }

  renderCategory(root, pageKey);
  closeOverlays(root);
  attachSelectionWidget(root);
  setSelectionLabel(root, config.selectionLabel);
  syncRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function restoreView(root) {
  closeOverlays(root);

  const pageMain = root.querySelector("#pageMain");
  const categoryPage = root.querySelector("#categoryPage");
  const productDetailPage = root.querySelector("#productDetailPage");
  const accountPage = root.querySelector("#accountPage");
  const dashboardPage = root.querySelector("#dashboardPage");
  const shoppingBagPage = root.querySelector("#shoppingBagPage");
  const wishlistPage = root.querySelector("#wishlistPage");
  const checkoutPage = root.querySelector("#checkoutPage");

  if (accountPage) accountPage.hidden = true;
  if (dashboardPage) dashboardPage.hidden = true;
  if (shoppingBagPage) shoppingBagPage.hidden = true;
  if (wishlistPage) wishlistPage.hidden = true;
  if (checkoutPage) checkoutPage.hidden = true;
  setOverlayShellActive(false);

  if (currentPage === "dashboard") {
    showDashboard(root);
    return;
  }

  if (currentPage === "shopping-bag") {
    showShoppingBag(root);
    return;
  }

  if (currentPage === "wishlist") {
    showWishlist(root);
    return;
  }

  if (currentPage === "checkout") {
    showCheckout(root);
    return;
  }

  if (currentPage === "account") {
    if (getAuthToken()) {
      currentPage = resolveAccountReturnPage(pageBeforeAccount);
      hideAllPages(root);
      if (pageMain) pageMain.hidden = false;
      attachSelectionWidget(root);
    } else {
      showAccount(root);
    }
    return;
  }

  if (currentPage === "home") {
    hideAllPages(root);
    if (pageMain) pageMain.hidden = false;
    attachSelectionWidget(root);
    return;
  }

  if (currentPage === "blogs") {
    showBlogs(root);
    return;
  }

  if (currentPage === "blog" && currentBlogId) {
    showBlogs(root, { blogId: currentBlogId });
    return;
  }

  if (currentPage === "product" && currentProductId) {
    if (mountProductDetail(root, currentProductId)) {
      hideAllPages(root);
      if (productDetailPage) productDetailPage.hidden = false;
      attachSelectionWidget(root);
    } else {
      currentPage = "home";
      hideAllPages(root);
      if (pageMain) pageMain.hidden = false;
      attachSelectionWidget(root);
    }
    return;
  }

  if (categoryPages[currentPage]) {
    hideAllPages(root);
    if (categoryPage) categoryPage.hidden = false;
    renderCategory(root, currentPage);
    attachSelectionWidget(root);
    setSelectionLabel(root, categoryPages[currentPage].selectionLabel);
    return;
  }

  hideAllPages(root);
  if (categoryPage) categoryPage.hidden = false;
  attachSelectionWidget(root);
}

export function initPages(root) {
  initProductCardNavigation(root);

  root.addEventListener("racelia:leave-dashboard", () => leaveDashboard(root));
  root.addEventListener("racelia:leave-shopping-bag", () => leaveShoppingBag(root));
  root.addEventListener("racelia:leave-wishlist", () => leaveWishlist(root));
  root.addEventListener("racelia:open-wishlist", () => showWishlist(root));
  root.addEventListener("racelia:open-shopping-bag", () => showShoppingBag(root));
  root.addEventListener("racelia:open-checkout", () => showCheckout(root));
  root.addEventListener("racelia:leave-checkout", () => leaveCheckout(root));
  root.addEventListener("racelia:open-product", (event) => {
    const productId = event.detail?.productId;
    if (productId) showProductDetail(root, productId);
  });
  root.addEventListener("racelia:open-blogs", () => showBlogs(root));
  root.addEventListener("racelia:open-blog", (event) => {
    const blogId = event.detail?.blogId;
    if (blogId) showBlogArticle(root, blogId);
  });
  root.addEventListener("racelia:catalog-updated", () => {
    renderHomeNewArrivals(root);
    if (currentPage === "home") {
      import("./productSliders.js").then(({ initProductSliders }) => initProductSliders(root));
    }
    if (currentPage === "product" && currentProductId) {
      mountProductDetail(root, currentProductId);
    }
    if (currentPage !== "home" && currentPage !== "product" && categoryPages[currentPage]) {
      renderCategoryProducts(root, currentPage);
    }
  });

  root.addEventListener("racelia:backend-synced", () => {
    if (currentPage === "home") {
      import("./productSliders.js").then(({ initProductSliders }) => initProductSliders(root));
    }
  });

  root.addEventListener("racelia:currency-changed", () => {
    if (categoryPages[currentPage]) {
      renderCategoryProducts(root, currentPage);
    }
    if (currentPage === "product" && currentProductId) {
      mountProductDetail(root, currentProductId);
    }
  });

  window.addEventListener("hashchange", () => {
    if (shouldIgnoreHashChange()) return;
    restoreRouteFromUrl(root);
  });

  initCategoryFilter(root);
  initProductDetailPage(root, {
    onProductSelect: (productId) => showProductDetail(root, productId),
  });

  restoreRouteFromUrl(root);
}
