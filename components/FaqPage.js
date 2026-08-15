import { createCtaDock } from "./CtaDock.js";

const SEARCH_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`;
const HOME_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const BOX_ICON = `<svg class="faq-action-card__box" viewBox="0 0 60 60" fill="none" aria-hidden="true"><rect x="8" y="20" width="44" height="32" rx="3" fill="#c8c8c8"/><rect x="8" y="12" width="44" height="10" rx="2" fill="#b0b0b0"/><rect x="22" y="12" width="16" height="10" fill="#9a9a9a"/><rect x="20" y="30" width="20" height="4" rx="1" fill="#a0a0a0"/></svg>`;

function searchWrapHtml(inputId) {
  return `<div class="faq-search">
    ${SEARCH_ICON}
    <input type="search" id="${inputId}" placeholder="Rechercher" autocomplete="off" aria-label="Rechercher dans la FAQ" />
  </div>`;
}

function breadcrumbHomeHtml() {
  return `<button type="button" class="faq-breadcrumb__home js-faq-home" aria-label="Accueil FAQ">${HOME_ICON}</button>`;
}

export function createFaqPage() {
  const page = document.createElement("section");
  page.className = "faq-page";
  page.id = "faqPage";
  page.hidden = true;

  page.innerHTML = `
    <div class="faq-page__inner">
      <div class="faq-view is-active" id="faq-view-home" data-faq-view="home">
        <h1 class="faq-page-title js-faq-home">FAQ</h1>
        ${searchWrapHtml("faq-search-home")}
        <div class="faq-action-cards">
          <button type="button" class="faq-action-card js-faq-report">
            <span class="faq-action-card__icon">
              ${BOX_ICON}
              <span class="faq-action-card__badge" aria-hidden="true">!</span>
            </span>
            <span class="faq-action-card__label">Signaler un problème</span>
            <span class="faq-action-card__chev" aria-hidden="true">›</span>
          </button>
        </div>
        <div class="faq-section-head">
          <h2 class="faq-section-title">Plus d'informations</h2>
          <div class="faq-view-toggles" role="group" aria-label="Disposition des catégories">
            <button type="button" class="faq-view-toggle is-active js-faq-view-grid" aria-label="Vue grille" aria-pressed="true">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
            </button>
            <button type="button" class="faq-view-toggle js-faq-view-list" aria-label="Vue liste" aria-pressed="false">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="4" y="5" width="16" height="3" rx="1.5"/><rect x="4" y="10.5" width="16" height="3" rx="1.5"/><rect x="4" y="16" width="16" height="3" rx="1.5"/></svg>
            </button>
          </div>
        </div>
        <div class="faq-cat-list is-grid" id="faq-cat-list-home"></div>
      </div>

      <div class="faq-view" id="faq-view-all" data-faq-view="all" hidden>
        <h1 class="faq-page-title js-faq-home">FAQ</h1>
        <nav class="faq-breadcrumb" aria-label="Fil d'Ariane">
          ${breadcrumbHomeHtml()}
          <span class="faq-breadcrumb__sep">›</span>
          <span class="faq-breadcrumb__current">Tous les articles</span>
        </nav>
        ${searchWrapHtml("faq-search-all")}
        <h2 class="faq-section-title">Tous les articles</h2>
        <div class="faq-cat-list" id="faq-cat-list-all"></div>
      </div>

      <div class="faq-view" id="faq-view-search" data-faq-view="search" hidden>
        <h1 class="faq-page-title js-faq-home">FAQ</h1>
        ${searchWrapHtml("faq-search-results")}
        <div id="faq-search-results"></div>
      </div>

      <div class="faq-view" id="faq-view-category" data-faq-view="category" hidden>
        <h1 class="faq-page-title js-faq-home">FAQ</h1>
        <nav class="faq-breadcrumb" aria-label="Fil d'Ariane">
          ${breadcrumbHomeHtml()}
          <span class="faq-breadcrumb__sep">›</span>
          <button type="button" class="faq-breadcrumb__link js-faq-all">Tous les articles</button>
          <span class="faq-breadcrumb__sep">›</span>
          <span class="faq-breadcrumb__current" id="faq-breadcrumb-cat"></span>
        </nav>
        ${searchWrapHtml("faq-search-cat")}
        <h2 class="faq-cat-detail-title" id="faq-cat-title"></h2>
        <p class="faq-cat-detail-sub" id="faq-cat-sub"></p>
        <div class="faq-article-list" id="faq-article-list"></div>
      </div>

      <div class="faq-view" id="faq-view-article" data-faq-view="article" hidden>
        <h1 class="faq-page-title js-faq-home">FAQ</h1>
        <nav class="faq-breadcrumb" aria-label="Fil d'Ariane">
          ${breadcrumbHomeHtml()}
          <span class="faq-breadcrumb__sep">›</span>
          <button type="button" class="faq-breadcrumb__link js-faq-all">Tous les articles</button>
          <span class="faq-breadcrumb__sep">›</span>
          <button type="button" class="faq-breadcrumb__link" id="faq-breadcrumb-cat-art"></button>
          <span class="faq-breadcrumb__sep">›</span>
          <span class="faq-breadcrumb__current" id="faq-breadcrumb-article"></span>
        </nav>
        ${searchWrapHtml("faq-search-article")}
        <h2 class="faq-article-detail-title" id="faq-article-title"></h2>
        <div class="faq-article-body" id="faq-article-body"></div>
      </div>
    </div>
  `;

  page.appendChild(createCtaDock({ sectionId: "faqCtaDock", slotId: "faqCtaDockSlot" }));
  return page;
}
