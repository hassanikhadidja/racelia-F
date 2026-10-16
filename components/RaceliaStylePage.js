export function createRaceliaStylePage() {
  const page = document.createElement("section");
  page.className = "style-board";
  page.id = "styleBoardPage";
  page.hidden = true;
  page.innerHTML = `
    <h1 class="style-board__title">#RACÈLIASTYLE</h1>
    <div class="style-board__chips" id="styleBoardChips" role="toolbar" aria-label="Filtrer les looks"></div>
    <div class="style-board__masonry" id="styleBoardMasonry"></div>
    <p class="style-board__empty" id="styleBoardEmpty" hidden>Aucun look ne correspond.</p>
  `;
  return page;
}
