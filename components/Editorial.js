import { editorialImage } from "../js/data.js";
import { wishlistIcon } from "./icons.js";

const SECONDARY_EDITORIAL_IMAGE =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80";

export function createEditorial({
  id = "homeEditorial",
  image = editorialImage,
  productOffset = 0,
  ariaLabel = "Editorial product",
  overlay = null,
} = {}) {
  const section = document.createElement("div");
  section.className = "editorial reveal js-product-open";
  section.id = id;
  section.dataset.productOffset = String(productOffset);
  section.setAttribute("role", "link");
  section.setAttribute("tabindex", "0");
  section.setAttribute("aria-label", ariaLabel);

  const media = document.createElement("div");
  media.className = "editorial__media";

  const img = document.createElement("img");
  img.src = image;
  img.alt = "Editorial";
  img.onerror = () => {
    img.style.display = "none";
  };
  media.appendChild(img);

  if (overlay) {
    const overlayEl = document.createElement("div");
    overlayEl.className = "editorial__overlay";
    overlayEl.innerHTML = `
      <p class="editorial__overlay-title">${overlay.title}</p>
      <span class="editorial__overlay-cta">${overlay.cta}</span>
    `;
    media.appendChild(overlayEl);
  }

  const meta = document.createElement("div");
  meta.className = "meta editorial__meta";

  const name = document.createElement("span");
  name.className = "editorial__name";
  name.textContent = "";

  const wishlist = document.createElement("button");
  wishlist.className = "wishlist-btn";
  wishlist.type = "button";
  wishlist.setAttribute("aria-label", "Ajouter à la liste d'envies");
  wishlist.innerHTML = wishlistIcon;

  meta.append(name, wishlist);
  section.append(media, meta);
  return section;
}

export function createSecondaryEditorial() {
  return createEditorial({
    id: "homeEditorialSecondary",
    image: SECONDARY_EDITORIAL_IMAGE,
    productOffset: 1,
    ariaLabel: "Masculine-feminine essentials",
    overlay: {
      title: "Masculine-feminine<br>essentials",
      cta: "Discover the selection",
    },
  });
}
