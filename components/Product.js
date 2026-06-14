import { wishlistIcon } from "./icons.js";

export function createProduct(product, index) {
  const card = document.createElement("div");
  card.className = "product reveal js-product-open";
  card.dataset.images = product.images.join("|");
  if (product.id) {
    card.dataset.productId = product.id;
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `View ${product.name}`);
  }

  const imgwrap = document.createElement("div");
  imgwrap.className = "imgwrap";

  const slides = document.createElement("div");
  slides.className = "slides";
  imgwrap.appendChild(slides);

  const underline = document.createElement("div");
  underline.className = "underline";
  underline.innerHTML = `
    <div class="underline__track">
      <div class="underline__fill"></div>
    </div>
  `;

  const meta = document.createElement("div");
  meta.className = "meta";

  const name = document.createElement("span");
  name.textContent = product.name;

  const wishlist = document.createElement("button");
  wishlist.className = "wishlist-btn";
  wishlist.type = "button";
  wishlist.setAttribute("aria-label", "Add to wishlist");
  wishlist.dataset.i = String(index);
  wishlist.innerHTML = wishlistIcon;

  meta.append(name, wishlist);
  card.append(imgwrap, underline, meta);
  return card;
}
