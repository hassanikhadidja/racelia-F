import { createCtaDock } from "./CtaDock.js";

export function createCategoryPage() {
  const page = document.createElement("section");
  page.className = "category-page";
  page.id = "categoryPage";
  page.hidden = true;

  page.innerHTML = `
    <div class="mobile-home mobile-home--audience category-mall" id="categoryMall" hidden>
      <div class="category-mall__ticker">
        <div class="category-mall__ticker-move">
          <p class="category-mall__ticker-track">
            <span class="category-mall__ticker-line">
              <span data-i18n="home.mall.tendanceLine">Les tendances du moment, sélectionnées pour sublimer votre style</span>
              <svg class="category-mall__ticker-star" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.7 9.7 5.6l4.2.4-3.2 2.8 1 4L8 10.7 4.3 12.8l1-4L2.1 6l4.2-.4z" fill="currentColor"/></svg>
              <span class="category-mall__ticker-offer"><span data-i18n="home.mall.ship">Livraison offerte</span> <span data-i18n="home.mall.shipNote">Dès 6 500 DZD</span></span>
              <svg class="category-mall__ticker-star" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.7 9.7 5.6l4.2.4-3.2 2.8 1 4L8 10.7 4.3 12.8l1-4L2.1 6l4.2-.4z" fill="currentColor"/></svg>
              <span data-i18n="home.mall.tendanceLine">Les tendances du moment, sélectionnées pour sublimer votre style</span>
              <svg class="category-mall__ticker-star" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.7 9.7 5.6l4.2.4-3.2 2.8 1 4L8 10.7 4.3 12.8l1-4L2.1 6l4.2-.4z" fill="currentColor"/></svg>
              <span class="category-mall__ticker-offer"><span data-i18n="home.mall.ship">Livraison offerte</span> <span data-i18n="home.mall.shipNote">Dès 6 500 DZD</span></span>
              <svg class="category-mall__ticker-star" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.7 9.7 5.6l4.2.4-3.2 2.8 1 4L8 10.7 4.3 12.8l1-4L2.1 6l4.2-.4z" fill="currentColor"/></svg>
            </span>
            <span class="category-mall__ticker-line" aria-hidden="true">
              <span data-i18n="home.mall.tendanceLine">Les tendances du moment, sélectionnées pour sublimer votre style</span>
              <svg class="category-mall__ticker-star" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.7 9.7 5.6l4.2.4-3.2 2.8 1 4L8 10.7 4.3 12.8l1-4L2.1 6l4.2-.4z" fill="currentColor"/></svg>
              <span class="category-mall__ticker-offer"><span data-i18n="home.mall.ship">Livraison offerte</span> <span data-i18n="home.mall.shipNote">Dès 6 500 DZD</span></span>
              <svg class="category-mall__ticker-star" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.7 9.7 5.6l4.2.4-3.2 2.8 1 4L8 10.7 4.3 12.8l1-4L2.1 6l4.2-.4z" fill="currentColor"/></svg>
              <span data-i18n="home.mall.tendanceLine">Les tendances du moment, sélectionnées pour sublimer votre style</span>
              <svg class="category-mall__ticker-star" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.7 9.7 5.6l4.2.4-3.2 2.8 1 4L8 10.7 4.3 12.8l1-4L2.1 6l4.2-.4z" fill="currentColor"/></svg>
              <span class="category-mall__ticker-offer"><span data-i18n="home.mall.ship">Livraison offerte</span> <span data-i18n="home.mall.shipNote">Dès 6 500 DZD</span></span>
              <svg class="category-mall__ticker-star" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.7 9.7 5.6l4.2.4-3.2 2.8 1 4L8 10.7 4.3 12.8l1-4L2.1 6l4.2-.4z" fill="currentColor"/></svg>
            </span>
          </p>
        </div>
        <div class="mobile-home__chip-row">
          <button class="category-page__filter-toggle mobile-home__filter-toggle" type="button" aria-label="Ouvrir les filtres">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2" fill="#fff"/>
              <line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2" fill="#fff"/>
              <line x1="4" y1="17" x2="20" y2="17"/><circle cx="11" cy="17" r="2" fill="#fff"/>
            </svg>
          </button>
          <div class="mobile-home__chips" role="group" aria-label="Catégories" data-i18n-aria="home.mall.tabs">
          <button type="button" class="mobile-home__chip is-active" data-mall-chip="foryou" data-i18n="home.mall.forYou" aria-pressed="true">Pour vous</button>
          <button type="button" class="mobile-home__chip" data-mall-chip="new" aria-pressed="false"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.7 9.7 5.6l4.2.4-3.2 2.8 1 4L8 10.7 4.3 12.8l1-4L2.1 6l4.2-.4z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg><span data-i18n="home.mall.newIn">Nouveautés</span></button>
          <button type="button" class="mobile-home__chip" data-mall-chip="favoris" aria-pressed="false"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-4.5-9.5-9C.8 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.2 4.5 4.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg><span data-i18n="home.mall.favoris">Favoris</span></button>
          <button type="button" class="mobile-home__chip" data-mall-chip="best" aria-pressed="false"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.6 2.4h6.8v4.1a3.4 3.4 0 0 1-6.8 0zM5.2 3.1H3.4A2 2 0 0 0 5.1 6.2M10.8 3.1h1.8A2 2 0 0 1 10.9 6.2M8 9.9v2M5.6 13.6h4.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-i18n="home.mall.best">Best-sellers</span></button>
          </div>
        </div>
      </div>
      <div class="mobile-home__stage" id="categoryMallStage">
        <img class="mobile-home__photo" alt="" />
        <nav class="mobile-home__tabs" aria-label="Catégories" data-i18n-aria="home.mall.tabs">
          <button type="button" class="mobile-home__tab" data-mall-tab="tout" data-i18n="home.mall.tout">Tout</button>
          <button type="button" class="mobile-home__tab" data-mall-tab="femme" data-i18n="home.mall.femme">Femme</button>
          <button type="button" class="mobile-home__tab" data-mall-tab="sacs" data-i18n="home.mall.sacs">Sacs</button>
          <button type="button" class="mobile-home__tab" data-mall-tab="bijoux" data-i18n="home.mall.bijoux">Accessories</button>
          <button type="button" class="mobile-home__tab" data-mall-tab="chaussures" data-i18n="home.mall.chaussures">Chaussures</button>
          <button type="button" class="mobile-home__tab" data-mall-tab="enfants" data-i18n="home.mall.enfants">Enfants</button>
          <button type="button" class="mobile-home__tab" data-mall-tab="mariee" data-i18n="home.mall.mariee">Mariée</button>
          <button type="button" class="mobile-home__tab" data-mall-tab="hammam" data-i18n="home.mall.hammam">Hammam</button>
          <button type="button" class="mobile-home__tab" data-mall-tab="homme" data-i18n="home.mall.homme">Homme</button>
        </nav>
        <div class="mobile-home__kids">
          <button type="button" class="mobile-home__kids-hero" data-mall-page="petite-princesse" data-i18n-aria="home.mall.shop" aria-label="Découvrir">
            <img src="/images/kids-hero.png" alt="" loading="lazy" decoding="async" />
          </button>
        </div>
        <div class="mobile-home__campaign">
          <p class="mobile-home__campaign-kicker"></p>
          <p class="mobile-home__campaign-title"></p>
          <button type="button" class="mobile-home__campaign-cta" data-mall-jump="products" data-i18n="home.mall.shop">Découvrir</button>
          <div class="mobile-home__dots"></div>
        </div>
      </div>
      <div class="mobile-home__sheet">
        <div class="mobile-home__kids-board">
          <div class="mobile-home__kids-head" role="group">
            <button type="button" class="mobile-home__kids-cat is-active" data-kids-age="" data-i18n="home.mall.kids.category">Catégorie</button>
            <button type="button" class="mobile-home__kids-age" data-kids-age="06" data-i18n="home.mall.kids.age06">½ – 6 ans</button>
            <button type="button" class="mobile-home__kids-age" data-kids-age="614" data-i18n="home.mall.kids.age614">6 – 14 ans</button>
          </div>
          <div class="mobile-home__kids-grid"></div>
        </div>
        <div class="mobile-home__rails-wrap">
          <div class="mobile-home__rails" id="categoryMallRails"></div>
        </div>
        <div class="category-mall__filter-row">
          <button class="category-page__filter-toggle category-mall__filter-toggle" id="categoryMallFilterToggle" type="button" aria-label="Ouvrir les filtres">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2" fill="#fff"/>
              <line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2" fill="#fff"/>
              <line x1="4" y1="17" x2="20" y2="17"/><circle cx="11" cy="17" r="2" fill="#fff"/>
            </svg>
          </button>
          <div class="mobile-home__circles" id="categoryMallCircles" aria-label="Univers" data-i18n-aria="home.mall.circles"></div>
        </div>
      </div>
    </div>
    <h1 class="category-page__title" id="categoryPageTitle"></h1>
    <p class="category-page__sub" id="categoryPageSub"></p>

    <div class="category-page__bar">
      <span class="category-page__bar-label" id="categoryPageBar"></span>
      <button class="category-page__filter-toggle" id="categoryFilterOpen" type="button" aria-label="Ouvrir les filtres">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2" fill="#fff"/>
          <line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2" fill="#fff"/>
          <line x1="4" y1="17" x2="20" y2="17"/><circle cx="11" cy="17" r="2" fill="#fff"/>
        </svg>
      </button>
    </div>

    <div class="category-page__products" id="categoryProducts"></div>
    <p class="category-page__empty" id="categoryProductsEmpty" hidden>Aucun produit dans cette sélection.</p>

    <div class="category-page__filter" id="categoryFilter" aria-hidden="true">
      <button type="button" class="category-page__filter-backdrop js-category-filter-close" aria-label="Fermer les filtres"></button>
      <div class="category-page__filter-panel">
      <div class="category-page__filter-head">
        <p class="category-page__filter-title">Filtres</p>
      </div>
      <div class="category-page__filter-close-spacer" aria-hidden="true"></div>
      <div class="category-page__filter-body">
        <div class="category-page__filter-item category-page__filter-item--look">
          <label class="category-page__check-row">
            <input type="checkbox" data-filter-group="look" data-filter-key="look" />
            <span class="category-page__check-box"></span>
            <span>Sur un look</span>
          </label>
          <button
            class="category-page__filter-close js-category-filter-close"
            id="categoryFilterClose"
            type="button"
            aria-label="Fermer les filtres"
          ></button>
        </div>

        <div class="category-page__filter-item category-page__accordion">
          <button class="category-page__accordion-head" type="button">
            <span class="category-page__accordion-label">COLLECTION</span>
            <span class="category-page__chev-icon" aria-hidden="true"></span>
          </button>
          <div class="category-page__accordion-content">
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="collection" data-filter-key="hammam"/><span class="category-page__check-box"></span><span>HAMMAM</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="collection" data-filter-key="homme"/><span class="category-page__check-box"></span><span>HOMME</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="collection" data-filter-key="petite-princesse"/><span class="category-page__check-box"></span><span>Enfants</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="collection" data-filter-key="mariee"/><span class="category-page__check-box"></span><span>MARIÉE</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="collection" data-filter-key="parfums-feminins"/><span class="category-page__check-box"></span><span>Parfums Féminins</span></label>
          </div>
        </div>

        <div class="category-page__filter-item category-page__accordion">
          <button class="category-page__accordion-head" type="button">
            <span class="category-page__accordion-label">MATIÈRE</span>
            <span class="category-page__chev-icon" aria-hidden="true"></span>
          </button>
          <div class="category-page__accordion-content">
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="matiere" data-filter-key="cuir"/><span class="category-page__check-box"></span><span>Cuir</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="matiere" data-filter-key="simili-cuir"/><span class="category-page__check-box"></span><span>Simili cuir</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="matiere" data-filter-key="tissu"/><span class="category-page__check-box"></span><span>Tissu</span></label>
          </div>
        </div>

        <div class="category-page__filter-item category-page__accordion">
          <button class="category-page__accordion-head" type="button">
            <span class="category-page__accordion-label">COULEUR</span>
            <span class="category-page__chev-icon" aria-hidden="true"></span>
          </button>
          <div class="category-page__accordion-content">
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="couleur" data-filter-key="noir"/><span class="category-page__check-box"></span><span>Noir</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="couleur" data-filter-key="beige"/><span class="category-page__check-box"></span><span>Beige</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="couleur" data-filter-key="bleu"/><span class="category-page__check-box"></span><span>Bleu</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="couleur" data-filter-key="rouge"/><span class="category-page__check-box"></span><span>Rouge</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="couleur" data-filter-key="jaune"/><span class="category-page__check-box"></span><span>Jaune</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="couleur" data-filter-key="autres"/><span class="category-page__check-box"></span><span>Autres couleurs</span></label>
          </div>
        </div>

        <div class="category-page__filter-item category-page__accordion">
          <button class="category-page__accordion-head" type="button">
            <span class="category-page__accordion-label">QUINCAILLERIE</span>
            <span class="category-page__chev-icon" aria-hidden="true"></span>
          </button>
          <div class="category-page__accordion-content">
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="quincaillerie" data-filter-key="dore"/><span class="category-page__check-box"></span><span>Doré</span></label>
            <label class="category-page__check-row"><input type="checkbox" data-filter-group="quincaillerie" data-filter-key="argente"/><span class="category-page__check-box"></span><span>Argenté</span></label>
          </div>
        </div>

      </div>

      <div class="category-page__filter-actions">
        <button class="category-page__filter-clear" id="categoryFilterClear" type="button">EFFACER</button>
        <button class="category-page__filter-results" id="categoryFilterResults" type="button">Appliquer</button>
      </div>
      </div>
    </div>
  `;

  const filter = page.querySelector("#categoryFilter");
  page.insertBefore(
    createCtaDock({ sectionId: "categoryCtaDock", slotId: "categoryCtaDockSlot" }),
    filter
  );

  return page;
}
