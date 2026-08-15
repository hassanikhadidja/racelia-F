import {
  createTopbar,
  createMenuPanel,
  createHero,
  createCategoryBlock,
  createIntro,
  createProductGrid,
  createEditorialProductGrid,
  createEditorial,
  createSecondaryEditorial,
  createCtaDock,
  createFooter,
  createSelectionWidget,
  createAccountPanel,
  createCategoryPage,
  createBlogsPage,
  createPrivacyPage,
  createTermsPage,
  createShippingPage,
  createBoutiquesPage,
  createFaqPage,
  createReturnsPage,
  createGiftCardPage,
  createContactPage,
  createProductDetailPage,
  createPdpAddedOverlay,
  createDashboardPage,
  createClientProfilePage,
  createShoppingBagPage,
  createWishlistPage,
  createCheckoutPage,
} from "../components/index.js";
import { createStyleSheet } from "../components/RaceliaStyleView.js";
import { initApp } from "./app.js";
import { initBackendSync } from "./syncBackend.js";

export function mountRaceliaApp(container) {
  container.replaceChildren();

  const pageMain = document.createElement("div");
  pageMain.className = "page-main";
  pageMain.id = "pageMain";

  const dock = createCtaDock();
  const selection = createSelectionWidget();

  pageMain.append(
    createHero(),
    createCategoryBlock(),
    createIntro(),
    createProductGrid(),
    createEditorial(),
    createEditorialProductGrid(),
    createSecondaryEditorial(),
    dock
  );

  container.append(
    createTopbar(),
    createMenuPanel(),
    pageMain,
    createCategoryPage(),
    createBlogsPage(),
    createPrivacyPage(),
    createTermsPage(),
    createShippingPage(),
    createBoutiquesPage(),
    createFaqPage(),
    createReturnsPage(),
    createGiftCardPage(),
    createContactPage(),
    createProductDetailPage(),
    createPdpAddedOverlay(),
    createAccountPanel(),
    createDashboardPage(),
    createClientProfilePage(),
    createShoppingBagPage(),
    createWishlistPage(),
    createCheckoutPage(),
    createFooter(),
    selection,
    createStyleSheet()
  );

  const slot = dock.querySelector("#ctaDockSlot");
  const widget = container.querySelector("#selectionWidget");
  if (slot && widget) {
    slot.appendChild(widget);
  }

  // Show home content immediately — never leave .reveal at opacity 0 while syncing.
  container.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));

  initApp(container);

  initBackendSync(container).catch((error) => {
    console.warn("RACÈLIA backend sync failed:", error?.message || error);
  });
}

export { initApp } from "./app.js";
