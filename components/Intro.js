export function createIntro() {
  const paragraph = document.createElement("p");
  paragraph.className = "intro reveal";
  paragraph.textContent =
    "Discover a curated selection from the collection.";
  return paragraph;
}
