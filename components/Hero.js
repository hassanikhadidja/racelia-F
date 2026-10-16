import { heroImage } from "../js/data.js";
import { applyResponsiveImage, HERO_SIZES, HERO_WIDTHS } from "../js/imageDelivery.js";

export function createHero() {
  const existing = document.getElementById("ssrHero");
  if (existing) {
    const img = existing.querySelector("img");
    if (img) {
      img.onerror = () => {
        img.style.display = "none";
      };
    }
    return existing;
  }

  const section = document.createElement("section");
  section.className = "hero reveal";

  const frame = document.createElement("div");
  frame.className = "hero-frame";

  const img = document.createElement("img");
  img.alt = "Collection RACÈLIA";
  applyResponsiveImage(img, heroImage, {
    eager: true,
    priority: true,
    sizes: HERO_SIZES,
    widths: HERO_WIDTHS,
  });
  img.onerror = () => {
    img.style.display = "none";
  };

  const overlay = document.createElement("div");
  overlay.className = "hero-overlay";

  const title = document.createElement("h2");
  title.textContent = "RACÈLIA, simplement vous.";

  overlay.appendChild(title);
  frame.append(img);
  section.append(frame, overlay);
  return section;
}
