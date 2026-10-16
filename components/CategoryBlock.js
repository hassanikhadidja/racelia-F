export function createCategoryBlock() {
  const section = document.createElement("section");
  section.className = "category-block reveal";
  section.id = "metiersArtSection";
  section.setAttribute("aria-label", "L’ART DU GESTE Collection 2026");

  const eyebrow = document.createElement("div");
  eyebrow.className = "eyebrow";
  eyebrow.dataset.i18nHtml = "home.metiersTitle";
  eyebrow.innerHTML = "L’ART DU GESTE<br>Collection 2026";

  const heading = document.createElement("h1");
  heading.textContent = "SACS";

  section.append(eyebrow, heading);
  return section;
}
