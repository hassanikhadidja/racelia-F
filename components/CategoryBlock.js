export function createCategoryBlock() {
  const section = document.createElement("section");
  section.className = "category-block reveal";
  section.id = "metiersArtSection";
  section.setAttribute("aria-label", "Métiers d'Art 2026");

  const eyebrow = document.createElement("div");
  eyebrow.className = "eyebrow";
  eyebrow.innerHTML = "MÉTIERS D'ART 2026<br>COLLECTION";

  const heading = document.createElement("h1");
  heading.textContent = "SACS";

  section.append(eyebrow, heading);
  return section;
}
