import { createProduct } from "../components/Product.js";
import {
  getClosingGridProducts,
  getEditorialGridProducts,
  getNewArrivalProducts,
  getSecondaryEditorialGridProducts,
} from "./productCatalog.js";
import { initProductSliders } from "./productSliders.js";
import { syncWishlistHeartStates } from "./clientCartWishlist.js";

const HOME_ROW_CAPTION =
  "Pour le plus beau jour de votre vie, RACÈLIA sublime chaque instant avec des créations empreintes de raffinement.";

const HOME_END_CAPTION =
  "Longtemps discret, le bordeaux s’impose aujourd’hui comme une signature d’élégance au cœur de l’univers RACÈLIA.";

function revealProductCards(cards) {
  cards.forEach((card) => card.classList.add("in"));
}

function createHomeCaption(html, extraClass = "") {
  const caption = document.createElement("p");
  caption.className = ["home-product-caption", extraClass].filter(Boolean).join(" ");
  caption.innerHTML = html;
  return caption;
}

function renderHomeProductSection(
  root,
  sectionId,
  products,
  { withRowCaption = false, withLeadingCaption = false } = {}
) {
  const section = root.querySelector(`#${sectionId}`);
  if (!section) return;

  let grid = section.querySelector(".grid");
  if (!grid) {
    grid = document.createElement("div");
    grid.className = "grid";
    section.appendChild(grid);
  }

  grid.replaceChildren();

  if (!products.length && !withRowCaption && !withLeadingCaption) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  if (withLeadingCaption) {
    grid.appendChild(createHomeCaption(HOME_END_CAPTION, "home-product-caption--right"));
  }
  const cards = products.map((product, index) => createProduct(product, index));
  cards.forEach((card, index) => {
    grid.appendChild(card);
    if (withRowCaption && index === 3) {
      grid.appendChild(createHomeCaption(HOME_ROW_CAPTION));
    }
  });
  if (withRowCaption && products.length < 4) {
    grid.appendChild(createHomeCaption(HOME_ROW_CAPTION));
  }

  revealProductCards(cards);
  initProductSliders(root, grid);
}

function bindHomeEditorials(root) {
  const bridal = root.querySelector("#homeEditorial");
  if (bridal) {
    delete bridal.dataset.productId;
    bridal.dataset.homeTab = "mariee";
    bridal.setAttribute("aria-label", "Bridal essentials");
  }

  const masculine = root.querySelector("#homeEditorialSecondary");
  if (masculine) {
    delete masculine.dataset.productId;
    masculine.dataset.editorialDestination = "tendance-foryou";
    masculine.setAttribute("aria-label", "Masculine-feminine essentials");
  }
}

export function renderHomeNewArrivals(root) {
  renderHomeProductSection(root, "newArrivalsSection", getNewArrivalProducts(), {
    withRowCaption: true,
  });
  renderHomeProductSection(
    root,
    "editorialProductsSection",
    getEditorialGridProducts()
  );
  renderHomeProductSection(
    root,
    "secondaryEditorialProductsSection",
    getSecondaryEditorialGridProducts()
  );
  renderHomeProductSection(root, "closingProductsSection", getClosingGridProducts(), {
    withLeadingCaption: true,
  });
  bindHomeEditorials(root);
  syncWishlistHeartStates(root);
}
