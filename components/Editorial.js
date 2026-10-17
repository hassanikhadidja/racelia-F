import { editorialImage } from "../js/data.js";
import { applyResponsiveImage, EDITORIAL_SIZES, EDITORIAL_WIDTHS } from "../js/imageDelivery.js";

const SECONDARY_EDITORIAL_IMAGE = "/images/masculine-feminine.jpg";

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
  img.alt = "Editorial";
  img.decoding = "async";
  img.onerror = () => {
    img.style.display = "none";
  };
  const load = () => {
    applyResponsiveImage(img, image, { sizes: EDITORIAL_SIZES, widths: EDITORIAL_WIDTHS });
    img.fetchPriority = "low";
  };
  if (typeof IntersectionObserver === "function") {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        load();
        observer.disconnect();
      },
      { rootMargin: "240px" }
    );
    observer.observe(media);
  } else {
    load();
  }
  media.appendChild(img);

  if (overlay) {
    const overlayEl = document.createElement("div");
    overlayEl.className = "editorial__overlay";
    const subtitle = overlay.subtitle
      ? `<p class="editorial__overlay-subtitle">${overlay.subtitle}</p>`
      : "";
    overlayEl.innerHTML = `
      <p class="editorial__overlay-title">${overlay.title}</p>
      ${subtitle}
      <span class="editorial__overlay-cta">${overlay.cta}</span>
    `;
    media.appendChild(overlayEl);
  }

  section.append(media);
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
