import {
  createTopbar,
  createMenuPanel,
  createHero,
  createHomeStories,
  createCategoryBlock,
  createIntro,
  createProductGrid,
  createEditorialProductGrid,
  createSecondaryEditorialProductGrid,
  createClosingProductGrid,
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
  createAboutPage,
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

  const editorialBand = document.createElement("div");
  editorialBand.className = "home-editorial-band";
  editorialBand.append(createEditorial(), createEditorialProductGrid());

  const secondaryEditorialBand = document.createElement("div");
  secondaryEditorialBand.className = "home-editorial-band home-editorial-band--reverse";
  secondaryEditorialBand.append(createSecondaryEditorial(), createSecondaryEditorialProductGrid());

  pageMain.append(
    createHero(),
    createHomeStories(),
    createCategoryBlock(),
    createIntro(),
    createProductGrid(),
    editorialBand,
    secondaryEditorialBand,
    createClosingProductGrid(),
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
    createAboutPage(),
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
