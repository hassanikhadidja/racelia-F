import { createProduct } from "./Product.js";
import { products as staticProducts } from "../js/data.js";

export function createProductGrid() {
  const section = document.createElement("section");
  section.id = "newArrivalsSection";
  section.className = "new-arrivals-section";
  section.setAttribute("aria-label", "New arrivals");

  const grid = document.createElement("div");
  grid.className = "grid";

  staticProducts.forEach((product, index) => {
    grid.appendChild(createProduct(product, index));
  });

  section.appendChild(grid);
  return section;
}
