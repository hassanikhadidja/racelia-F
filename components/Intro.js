export function createIntro() {
  const paragraph = document.createElement("p");
  paragraph.className = "intro reveal";
  paragraph.textContent =
    "Découvrez une sélection soigneusement choisie de la collection.";
  return paragraph;
}
