import { createCtaDock } from "./CtaDock.js";
import { STORE_TYPES } from "../js/boutiquesData.js";

function typeOptionsHtml() {
  return [
    `<option value="">Type de magasin</option>`,
    ...STORE_TYPES.map(
      (t) => `<option value="${t.value}">${t.label}</option>`
    ),
  ].join("");
}

export function createBoutiquesPage() {
  const page = document.createElement("section");
  page.className = "boutiques-page";
  page.id = "boutiquesPage";
  page.hidden = true;

  page.innerHTML = `
    <div class="boutiques-page__inner">
      <section class="boutiques-hero" aria-label="Boutiques RACÈLIA">
        <picture>
          <source media="(min-width: 1024px)" srcset="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80" />
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80"
            alt="Retrouvez RACÈLIA en boutique"
            width="900"
            height="500"
          />
        </picture>
        <div class="boutiques-hero__caption">
          <h1>Boutiques</h1>
          <p>Retrouvez RACÈLIA chez nos points de vente partenaires et en boutique.</p>
        </div>
      </section>

      <div class="boutiques-locator">
        <div class="boutiques-map-wrap">
          <div id="boutiquesMap" role="img" aria-label="Carte des boutiques RACÈLIA"></div>
        </div>

        <div class="boutiques-panel">
          <div class="boutiques-search">
            <div class="boutiques-search__row">
              <input type="text" id="boutiquesZipInput" placeholder="Ville ou code postal" autocomplete="off" aria-label="Ville ou code postal" />
              <button type="button" id="boutiquesSearchBtn" aria-label="Rechercher">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              </button>
            </div>
            <select class="boutiques-type-select" id="boutiquesTypeSelect" aria-label="Type de magasin">
              ${typeOptionsHtml()}
            </select>
          </div>

          <div class="boutiques-store-list" id="boutiquesStoreList">
            <p class="boutiques-empty">Chargement des boutiques…</p>
          </div>
        </div>
      </div>
    </div>
  `;

  page.appendChild(createCtaDock({ sectionId: "boutiquesCtaDock", slotId: "boutiquesCtaDockSlot" }));
  return page;
}
