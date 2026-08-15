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
import { initProductDetailPage, mountProductDetail, closePdpVirtualTryOn } from "./productDetail.js";
import { initCartAddedOverlay, closePdpAddedOverlay } from "./cartAddedOverlay.js";
import { initDashboard } from "./dashboard.js";
import { initClientProfile } from "./clientProfile.js";
import { initShoppingBag } from "./shoppingBag.js";
import { initWishlist } from "./wishlist.js";
import { initCheckout } from "./checkout.js";
import { collectBagItems } from "./bagHelpers.js";
import { syncWishlistHeartStates } from "./clientCartWishlist.js";
import { parseRoute, writeRoute, isValidProductRoute, shouldIgnoreHashChange, goBackInApp, beginRouteRestore, endRouteRestore } from "./route.js";
import { renderHomeNewArrivals } from "./homeNewArrivals.js";
import {
  initBlogsPage,
  renderBlogsList,
  renderBlogArticle,
  showBlogsListView,
} from "./blogsPage.js";
import { initPrivacyPage } from "./privacyPage.js";
import { initTermsPage } from "./termsPage.js";
import { scrollToHeading } from "./scrollToHeading.js";
import { initBoutiquesPage } from "./boutiquesPage.js";
import { initFaqPage } from "./faqPage.js";
import { initReturnsPage } from "./returnsPage.js";
import { initGiftCardPage } from "./giftCardPage.js";
import { initContactPage } from "./contactPage.js";

let currentPage = "home";
let currentProductId = null;
let currentBlogId = null;
let lastCategoryPage = null;
let lastStorePage = "home";
/** Page to restore when leaving the shopping bag (not overwritten by checkout/wishlist). */
let pageBeforeShoppingBag = "home";
let pageBeforeAccount = "home";
let activeCategoryFilters = [];

function resolveProfileReturnPage(fromPage = currentPage) {
  if (fromPage === "account") return pageBeforeAccount || "home";
  if (fromPage === "client-profile") return lastStorePage || "home";
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

  if (currentPage === "client-profile") {
    writeRoute({ view: "client-profile" });
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

  if (currentPage === "privacy") {
    writeRoute({ view: "privacy" });
    return;
  }

  if (currentPage === "terms") {
    writeRoute({ view: "terms" });
    return;
  }

  if (currentPage === "shipping") {
    writeRoute({ view: "shipping" });
    return;
  }

  if (currentPage === "boutiques") {
    writeRoute({ view: "boutiques" });
    return;
  }

  if (currentPage === "faq") {
    writeRoute({ view: "faq" });
    return;
  }

  if (currentPage === "returns") {
    writeRoute({ view: "returns" });
    return;
  }

  if (currentPage === "gift-card") {
    writeRoute({ view: "gift-card" });
    return;
  }

  if (currentPage === "contact") {
    writeRoute({ view: "contact" });
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
  beginRouteRestore();

  try {
    if (route.view === "home") {
      showHome(root);
      return;
    }

    if (route.view === "dashboard") {
      if (!isAdminUser()) {
        showHome(root);
        return;
      }
      sessionStorage.setItem("racelia-dashboard-tab", route.dashboardTab);
      showDashboard(root);
      return;
    }

    if (route.view === "client-profile") {
      if (getAuthToken()) showClientProfile(root);
      else showAccount(root);
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
      if (collectBagItems(root).length > 0) showCheckout(root);
      else showShoppingBag(root);
      return;
    }

    if (route.view === "account") {
      if (getAuthToken()) showClientProfile(root);
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

    if (route.view === "privacy") {
      showPrivacy(root);
      return;
    }

    if (route.view === "terms") {
      showTerms(root);
      return;
    }

    if (route.view === "shipping") {
      showShipping(root);
      return;
    }

    if (route.view === "boutiques") {
      showBoutiques(root);
      return;
    }

    if (route.view === "faq") {
      showFaq(root);
      return;
    }

    if (route.view === "returns") {
      showReturns(root);
      return;
    }

    if (route.view === "gift-card") {
      showGiftCard(root);
      return;
    }

    if (route.view === "contact") {
      showContact(root);
      return;
    }

    if (route.view === "product" && isValidProductRoute(route.productId)) {
      showProductDetail(root, route.productId);
      return;
    }

    showHome(root);
  } finally {
    endRouteRestore();
  }
}

export function showAccount(root) {
  if (getAuthToken()) {
    showClientProfile(root);
    return;
  }

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
  root.querySelector("#clientProfilePage").hidden = true;
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

  if (goBackInApp()) return;

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
  if (modalHeading && label === "TOUTE LA SÉLECTION") {
    modalHeading.textContent = label;
  }

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
  const clientProfile = root.querySelector("#clientProfilePage");
  if (clientProfile) clientProfile.hidden = true;
  const shoppingBag = root.querySelector("#shoppingBagPage");
  if (shoppingBag) shoppingBag.hidden = true;
  const wishlist = root.querySelector("#wishlistPage");
  if (wishlist) wishlist.hidden = true;
  const checkout = root.querySelector("#checkoutPage");
  if (checkout) checkout.hidden = true;
  const blogsPage = root.querySelector("#blogsPage");
  if (blogsPage) blogsPage.hidden = true;
  const privacyPage = root.querySelector("#privacyPage");
  if (privacyPage) privacyPage.hidden = true;
  const termsPage = root.querySelector("#termsPage");
  if (termsPage) termsPage.hidden = true;
  const shippingPage = root.querySelector("#shippingPage");
  if (shippingPage) shippingPage.hidden = true;
  const boutiquesPage = root.querySelector("#boutiquesPage");
  if (boutiquesPage) boutiquesPage.hidden = true;
  const faqPage = root.querySelector("#faqPage");
  if (faqPage) faqPage.hidden = true;
  const returnsPage = root.querySelector("#returnsPage");
  if (returnsPage) returnsPage.hidden = true;
  const giftCardPage = root.querySelector("#giftCardPage");
  if (giftCardPage) giftCardPage.hidden = true;
  const contactPage = root.querySelector("#contactPage");
  if (contactPage) contactPage.hidden = true;
}

function setOverlayShellActive(active) {
  document.body.classList.toggle("dashboard-active", active);
  document.body.classList.toggle("client-profile-active", active);
  document.body.classList.toggle("shopping-bag-active", active);
  document.body.classList.toggle("wishlist-active", active);
  document.body.classList.toggle("checkout-active", active);
}

function setDashboardShellActive(active) {
  document.body.classList.toggle("dashboard-active", active);
  if (active) {
    document.body.classList.remove("client-profile-active");
    document.body.classList.remove("shopping-bag-active");
    document.body.classList.remove("wishlist-active");
    document.body.classList.remove("checkout-active");
  }
}

function setClientProfileShellActive(active) {
  document.body.classList.toggle("client-profile-active", active);
  if (active) {
    document.body.classList.remove("dashboard-active");
    document.body.classList.remove("shopping-bag-active");
    document.body.classList.remove("wishlist-active");
    document.body.classList.remove("checkout-active");
  }
}

function setShoppingBagShellActive(active) {
  document.body.classList.toggle("shopping-bag-active", active);
  if (active) {
    document.body.classList.remove("dashboard-active");
    document.body.classList.remove("client-profile-active");
    document.body.classList.remove("wishlist-active");
    document.body.classList.remove("checkout-active");
  }
}

function setWishlistShellActive(active) {
  document.body.classList.toggle("wishlist-active", active);
  if (active) {
    document.body.classList.remove("dashboard-active");
    document.body.classList.remove("client-profile-active");
    document.body.classList.remove("shopping-bag-active");
    document.body.classList.remove("checkout-active");
  }
}

function setCheckoutShellActive(active) {
  document.body.classList.toggle("checkout-active", active);
  if (active) {
    document.body.classList.remove("dashboard-active");
    document.body.classList.remove("client-profile-active");
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
  if (goBackInApp()) return;

  currentPage = lastStorePage;
  setDashboardShellActive(false);

  const dashboard = root.querySelector("#dashboardPage");
  if (dashboard) dashboard.hidden = true;

  restoreView(root);
  syncRoute();
  updateTopbar(root);
  updateCtaDock(root);
}

export function showClientProfile(root) {
  if (currentPage !== "client-profile") {
    lastStorePage = resolveProfileReturnPage(currentPage);
  }

  currentPage = "client-profile";
  hideAllPages(root);
  closeOverlays(root);

  const page = root.querySelector("#clientProfilePage");
  if (page) page.hidden = false;

  setClientProfileShellActive(true);
  initClientProfile(root);
  updateAccountButtons(root);
  updateCtaDock(root);
  syncRoute();
  page?.scrollTo({ top: 0 });
}

export function leaveClientProfile(root) {
  if (currentPage !== "client-profile") return;
  if (goBackInApp()) return;

  const returnPage = resolveProfileReturnPage(lastStorePage);
  currentPage = returnPage === "client-profile" ? "home" : returnPage;

  setClientProfileShellActive(false);

  const page = root.querySelector("#clientProfilePage");
  if (page) {
    page.hidden = true;
    page.setAttribute("hidden", "");
  }

  if (currentPage === "home" || !currentPage) {
    showHome(root);
  } else {
    restoreView(root);
  }
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
  if (goBackInApp()) return;

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
      showShoppingBag(root);
    },
    onOpenBag: () => {
      showShoppingBag(root);
    },
  });
  updateCtaDock(root);
  syncRoute();
  page?.scrollTo({ top: 0 });
}

export function leaveWishlist(root) {
  if (currentPage !== "wishlist") return;
  if (goBackInApp()) return;

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
  if (goBackInApp()) return;

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
  const pageMain = root.querySelector("#pageMain");
  if (pageMain) pageMain.hidden = false;

  closeOverlays(root);
  updateTopbar(root);
  attachSelectionWidget(root);
  setSelectionLabel(root, defaultSelection);
  syncRoute();
  requestAnimationFrame(() => {
    root.dispatchEvent(new CustomEvent("racelia:reveal"));
  });

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

export function showPrivacy(root) {
  setOverlayShellActive(false);
  currentPage = "privacy";
  currentProductId = null;
  currentBlogId = null;

  hideAllPages(root);
  const privacyPage = root.querySelector("#privacyPage");
  if (privacyPage) privacyPage.hidden = false;

  closeOverlays(root);
  attachSelectionWidget(root);
  updateCtaDock(root);
  updateTopbar(root);
  initPrivacyPage(root);
  syncRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function showTerms(root, { headingId } = {}) {
  setOverlayShellActive(false);
  currentPage = "terms";
  currentProductId = null;
  currentBlogId = null;

  hideAllPages(root);
  const termsPage = root.querySelector("#termsPage");
  if (termsPage) termsPage.hidden = false;

  closeOverlays(root);
  attachSelectionWidget(root);
  updateCtaDock(root);
  updateTopbar(root);
  initTermsPage(root);
  syncRoute();

  const target = headingId
    ? termsPage?.querySelector(`#${CSS.escape(headingId)}`)
    : null;
  if (target) {
    requestAnimationFrame(() => scrollToHeading(target));
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function showShipping(root) {
  setOverlayShellActive(false);
  currentPage = "shipping";
  currentProductId = null;
  currentBlogId = null;

  hideAllPages(root);
  const shippingPage = root.querySelector("#shippingPage");
  if (shippingPage) shippingPage.hidden = false;

  closeOverlays(root);
  attachSelectionWidget(root);
  updateCtaDock(root);
  updateTopbar(root);
  syncRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function showBoutiques(root, { query = "" } = {}) {
  setOverlayShellActive(false);
  currentPage = "boutiques";
  currentProductId = null;
  currentBlogId = null;

  hideAllPages(root);
  const boutiquesPage = root.querySelector("#boutiquesPage");
  if (boutiquesPage) boutiquesPage.hidden = false;

  closeOverlays(root);
  attachSelectionWidget(root);
  updateCtaDock(root);
  updateTopbar(root);

  const zipInput = boutiquesPage?.querySelector("#boutiquesZipInput");
  if (zipInput && query) zipInput.value = query;

  initBoutiquesPage(root);
  syncRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function showFaq(root) {
  setOverlayShellActive(false);
  currentPage = "faq";
  currentProductId = null;
  currentBlogId = null;

  hideAllPages(root);
  const faqPage = root.querySelector("#faqPage");
  if (faqPage) faqPage.hidden = false;

  closeOverlays(root);
  attachSelectionWidget(root);
  updateCtaDock(root);
  updateTopbar(root);
  initFaqPage(root);
  syncRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function showReturns(root) {
  setOverlayShellActive(false);
  currentPage = "returns";
  currentProductId = null;
  currentBlogId = null;

  hideAllPages(root);
  const returnsPage = root.querySelector("#returnsPage");
  if (returnsPage) returnsPage.hidden = false;

  closeOverlays(root);
  attachSelectionWidget(root);
  updateCtaDock(root);
  updateTopbar(root);
  initReturnsPage(root);
  syncRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function showGiftCard(root) {
  setOverlayShellActive(false);
  currentPage = "gift-card";
  currentProductId = null;
  currentBlogId = null;

  hideAllPages(root);
  const giftCardPage = root.querySelector("#giftCardPage");
  if (giftCardPage) giftCardPage.hidden = false;

  closeOverlays(root);
  attachSelectionWidget(root);
  updateCtaDock(root);
  updateTopbar(root);
  initGiftCardPage(root);
  syncRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function showContact(root) {
  setOverlayShellActive(false);
  currentPage = "contact";
  currentProductId = null;
  currentBlogId = null;

  hideAllPages(root);
  const contactPage = root.querySelector("#contactPage");
  if (contactPage) contactPage.hidden = false;

  closeOverlays(root);
  attachSelectionWidget(root);
  updateCtaDock(root);
  updateTopbar(root);
  initContactPage(root);
  syncRoute();
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
  updateTopbar(root);
  window.scrollTo({ top: 0, behavior: "smooth" });
  requestAnimationFrame(() => updateTopbar(root));
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
  updateTopbar(root);
  window.scrollTo({ top: 0, behavior: "smooth" });
  requestAnimationFrame(() => updateTopbar(root));
}

export function restoreView(root) {
  closeOverlays(root);

  const pageMain = root.querySelector("#pageMain");
  const categoryPage = root.querySelector("#categoryPage");
  const productDetailPage = root.querySelector("#productDetailPage");
  const accountPage = root.querySelector("#accountPage");
  const dashboardPage = root.querySelector("#dashboardPage");
  const clientProfilePage = root.querySelector("#clientProfilePage");
  const shoppingBagPage = root.querySelector("#shoppingBagPage");
  const wishlistPage = root.querySelector("#wishlistPage");
  const checkoutPage = root.querySelector("#checkoutPage");

  if (accountPage) accountPage.hidden = true;
  if (dashboardPage) dashboardPage.hidden = true;
  if (clientProfilePage) clientProfilePage.hidden = true;
  if (shoppingBagPage) shoppingBagPage.hidden = true;
  if (wishlistPage) wishlistPage.hidden = true;
  if (checkoutPage) checkoutPage.hidden = true;
  setOverlayShellActive(false);

  if (currentPage === "dashboard") {
    showDashboard(root);
    return;
  }

  if (currentPage === "client-profile") {
    showClientProfile(root);
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
    if (getAuthToken()) showClientProfile(root);
    else showAccount(root);
    return;
  }

  if (currentPage === "returns") {
    showReturns(root);
    return;
  }

  if (currentPage === "gift-card") {
    showGiftCard(root);
    return;
  }

  if (currentPage === "contact") {
    showContact(root);
    return;
  }

  if (currentPage === "home") {
    showHome(root);
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
      showHome(root);
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

  showHome(root);
}

export function initPages(root) {
  initProductCardNavigation(root);

  root.addEventListener("racelia:leave-dashboard", () => leaveDashboard(root));
  root.addEventListener("racelia:leave-client-profile", () => leaveClientProfile(root));
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
  root.addEventListener("racelia:open-privacy", () => showPrivacy(root));
  root.addEventListener("racelia:open-terms", (event) => {
    showTerms(root, { headingId: event.detail?.headingId });
  });
  root.addEventListener("racelia:open-shipping", () => showShipping(root));
  root.addEventListener("racelia:open-boutiques", (event) => {
    showBoutiques(root, { query: event.detail?.query || "" });
  });
  root.addEventListener("racelia:open-faq", () => showFaq(root));
  root.addEventListener("racelia:open-returns", () => showReturns(root));
  root.addEventListener("racelia:open-gift-card", () => showGiftCard(root));
  root.addEventListener("racelia:open-contact", () => showContact(root));
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
  initCartAddedOverlay(root);
  initProductDetailPage(root, {
    onProductSelect: (productId) => showProductDetail(root, productId),
  });

  restoreRouteFromUrl(root);
}
