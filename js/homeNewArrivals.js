import { createProduct } from "../components/Product.js";
import { getNewArrivalProducts } from "./productCatalog.js";
import { initProductSliders } from "./productSliders.js";

function revealProductCards(cards) {
  cards.forEach((card) => card.classList.add("in"));
}

export function renderHomeNewArrivals(root) {
  const section = root.querySelector("#newArrivalsSection");
  if (!section) return;

  let grid = section.querySelector(".grid");
  if (!grid) {
    grid = document.createElement("div");
    grid.className = "grid";
    section.appendChild(grid);
  }

  const products = getNewArrivalProducts();
  grid.replaceChildren();

  if (!products.length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  const cards = products.map((product, index) => createProduct(product, index));
  cards.forEach((card) => grid.appendChild(card));
  revealProductCards(cards);

  initProductSliders(root, grid);
}
