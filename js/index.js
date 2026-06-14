import {
  createTopbar,
  createMenuPanel,
  createHero,
  createCategoryBlock,
  createIntro,
  createProductGrid,
  createEditorial,
  createCtaDock,
  createFooter,
  createSelectionWidget,
  createAccountPanel,
  createCategoryPage,
  createBlogsPage,
  createProductDetailPage,
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
    dock
  );

  container.append(
    createTopbar(),
    createMenuPanel(),
    pageMain,
    createCategoryPage(),
    createBlogsPage(),
    createProductDetailPage(),
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

  initBackendSync(container)
    .catch((error) => {
      console.warn("RACÈLIA backend sync failed:", error?.message || error);
    })
    .finally(() => {
      initApp(container);
    });
}

export { initApp } from "./app.js";
