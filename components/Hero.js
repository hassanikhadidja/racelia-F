import { heroImage } from "../js/data.js";

export function createHero() {
  const section = document.createElement("section");
  section.className = "hero reveal";

  const img = document.createElement("img");
  img.src = heroImage;
  img.alt = "Chanel Collection";
  img.onerror = () => {
    img.style.display = "none";
  };

  const overlay = document.createElement("div");
  overlay.className = "hero-overlay";

  const title = document.createElement("h2");
  title.textContent = "Métiers d'Art 2026";

  overlay.appendChild(title);
  section.append(img, overlay);
  return section;
}
