export function createRaceliaStyleView() {
  const view = document.createElement("div");
  view.className = "style-view";
  view.id = "styleView";
  view.innerHTML = `
    <form class="style-search" id="styleSearchForm">
      <input id="styleSearchInput" type="text" placeholder="Rechercher" />
      <button type="submit" class="style-search__btn" aria-label="Rechercher">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      </button>
    </form>

    <h1 class="style-title">DEVENEZ RACÈLIACREATOR !</h1>
    <p class="style-lede">
      Inspirez-nous avec votre plus beau look ! Partagez vos looks RACÈLIA avec le hashtag
      #raceliastyle et identifiez @racelia
    </p>

    <div class="style-grid" id="styleGrid"></div>
  `;
  return view;
}

export function createStyleSheet() {
  const overlay = document.createElement("div");
  overlay.className = "style-sheet-overlay";
  overlay.id = "styleSheetOverlay";
  overlay.setAttribute("aria-hidden", "true");

  const sheet = document.createElement("div");
  sheet.className = "style-sheet";
  sheet.id = "styleSheet";
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-modal", "true");
  sheet.setAttribute("aria-labelledby", "styleSheetTitle");
  sheet.setAttribute("aria-hidden", "true");
  sheet.innerHTML = `
    <div class="style-sheet-scroll">
      <div class="style-sheet-hero-wrap">
        <div class="style-sheet-handle"></div>
        <button class="style-sheet-close" id="styleSheetClose" type="button" aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <div class="style-sheet-hero"><img id="styleHeroImg" alt="Look" /></div>
      </div>
      <div class="style-sheet-head">
        <h2 id="styleSheetTitle">OBTENEZ VOTRE RACÈLIASTYLE</h2>
        <span class="style-sheet-count" id="styleSheetCount">2 PRODUITS</span>
      </div>
      <div class="style-sheet-products" id="styleSheetProducts"></div>
    </div>
  `;

  const fragment = document.createDocumentFragment();
  fragment.append(overlay, sheet);
  return fragment;
}
