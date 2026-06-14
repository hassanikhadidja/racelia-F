import { editorialImage } from "../js/data.js";

export function createEditorial() {
  const section = document.createElement("div");
  section.className = "editorial reveal";

  const img = document.createElement("img");
  img.src = editorialImage;
  img.alt = "Editorial";
  img.onerror = () => {
    img.style.display = "none";
  };

  section.appendChild(img);
  return section;
}
