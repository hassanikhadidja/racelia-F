import { createProduct } from "../components/Product.js";
import {
  getEditorialGridProducts,
  getEditorialSpotlightProducts,
  getNewArrivalProducts,
} from "./productCatalog.js";
import { initProductSliders } from "./productSliders.js";
import { syncWishlistHeartStates } from "./clientCartWishlist.js";

const HOME_ROW_CAPTION =
  "Once reserved for the lining<br>of the House’s iconic bags,<br>burgundy takes centre stage.";

const HOME_END_CAPTION =
  "In shearling, suede<br>or soft leather, the bags<br>are imagined in an array<br>of materials and forms,<br>made for life on the move.";

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
  { withRowCaption = false, withEndCaption = false } = {}
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

  if (!products.length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  const cards = products.map((product, index) => createProduct(product, index));
  cards.forEach((card, index) => {
    grid.appendChild(card);
    if (withRowCaption && index === 1) {
      grid.appendChild(createHomeCaption(HOME_ROW_CAPTION));
    }
  });

  if (withEndCaption) {
    grid.appendChild(createHomeCaption(HOME_END_CAPTION, "home-product-caption--right"));
  }

  revealProductCards(cards);
  initProductSliders(root, grid);
}

function bindHomeEditorials(root) {
  const spotlights = getEditorialSpotlightProducts();
  root.querySelectorAll("#pageMain .editorial").forEach((el) => {
    const offset = Number(el.dataset.productOffset || 0);
    const product = spotlights[offset] || spotlights[0];
    if (!product) return;

    el.dataset.productId = product.id;
    el.setAttribute("aria-label", product.name);

    const nameEl = el.querySelector(".editorial__name");
    if (nameEl) nameEl.textContent = product.name;
  });
}

export function renderHomeNewArrivals(root) {
  renderHomeProductSection(root, "newArrivalsSection", getNewArrivalProducts(), {
    withRowCaption: true,
  });
  renderHomeProductSection(
    root,
    "editorialProductsSection",
    getEditorialGridProducts(),
    { withEndCaption: true }
  );
  bindHomeEditorials(root);
  syncWishlistHeartStates(root);
}
