import { createProduct } from "./Product.js";
import { products as staticProducts } from "../js/data.js";

function createHomeProductSection({ id, ariaLabel }) {
  const section = document.createElement("section");
  section.id = id;
  section.className = "new-arrivals-section";
  section.setAttribute("aria-label", ariaLabel);

  const grid = document.createElement("div");
  grid.className = "grid";

  staticProducts.forEach((product, index) => {
    grid.appendChild(createProduct(product, index));
  });

  section.appendChild(grid);
  return section;
}

export function createProductGrid() {
  return createHomeProductSection({
    id: "newArrivalsSection",
    ariaLabel: "New arrivals",
  });
}

export function createEditorialProductGrid() {
  return createHomeProductSection({
    id: "editorialProductsSection",
    ariaLabel: "More products",
  });
}
