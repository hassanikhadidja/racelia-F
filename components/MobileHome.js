import { toutHeroImage } from "../js/data.js";
import { applyResponsiveImage, HERO_SIZES, HERO_WIDTHS } from "../js/imageDelivery.js";

const TREND_ICON = `<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M4 13.5 9.2 7l3 2.4L16 5.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.5 5.5H16V10" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const TRUCK_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 7.5h11v8H3zM14 10.5h4.2L21 13.5v2h-7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="7.2" cy="17.4" r="1.35" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.2" cy="17.4" r="1.35" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>`;

const RETURN_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 3.8h7.2L19 8.6V20.2H7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 3.8v5h5M9.5 13h5.2M9.5 16.4h5.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;

const STAR_ICON = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.7 9.7 5.6l4.2.4-3.2 2.8 1 4L8 10.7 4.3 12.8l1-4L2.1 6l4.2-.4z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

const HEART_ICON = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-4.5-9.5-9C.8 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.2 4.5 4.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg>`;

const TROPHY_ICON = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.6 2.4h6.8v4.1a3.4 3.4 0 0 1-6.8 0zM5.2 3.1H3.4A2 2 0 0 0 5.1 6.2M10.8 3.1h1.8A2 2 0 0 1 10.9 6.2M8 9.9v2M5.6 13.6h4.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function createMobileHome() {
  const section = document.createElement("section");
  section.className = "mobile-home";
  section.id = "mobileHome";
  section.dataset.tab = "tout";
  section.dataset.chip = "foryou";

  section.innerHTML = `
    <div class="mobile-home__stage" id="mobileHomeStage">
      <img class="mobile-home__photo" alt="" />
      <nav class="mobile-home__tabs" aria-label="Catégories" data-i18n-aria="home.mall.tabs">
        <button type="button" class="mobile-home__tab is-active" data-mall-tab="tout" data-i18n="home.mall.tout">Tout</button>
        <button type="button" class="mobile-home__tab" data-mall-tab="femme" data-i18n="home.mall.femme">Femme</button>
        <button type="button" class="mobile-home__tab" data-mall-tab="sacs" data-i18n="home.mall.sacs">Sacs</button>
        <button type="button" class="mobile-home__tab" data-mall-tab="bijoux" data-i18n="home.mall.bijoux">Accessories</button>
        <button type="button" class="mobile-home__tab" data-mall-tab="chaussures" data-i18n="home.mall.chaussures">Chaussures</button>
        <button type="button" class="mobile-home__tab" data-mall-tab="enfants" data-i18n="home.mall.enfants">Enfants</button>
        <button type="button" class="mobile-home__tab" data-mall-tab="mariee" data-i18n="home.mall.mariee">Mariée</button>
        <button type="button" class="mobile-home__tab" data-mall-tab="hammam" data-i18n="home.mall.hammam">Hammam</button>
        <button type="button" class="mobile-home__tab" data-mall-tab="homme" data-i18n="home.mall.homme">Homme</button>
      </nav>
      <div class="mobile-home__trend">
        <div class="mobile-home__copy">
          <button type="button" class="mobile-home__badge" data-mall-action="nouveautes">
            <span class="mobile-home__badge-inner">${TREND_ICON}<span data-i18n="home.mall.tendance">tendances</span></span>
          </button>
          <button type="button" class="mobile-home__hash" data-mall-action="style" data-i18n="home.mall.hash">#LArtDuGeste</button>
        </div>
        <div class="mobile-home__picks" id="mobileHomePicks"></div>
      </div>
      <div class="mobile-home__campaign" id="mobileHomeCampaign">
        <p class="mobile-home__campaign-kicker"></p>
        <p class="mobile-home__campaign-title"></p>
        <button type="button" class="mobile-home__campaign-cta" data-i18n="home.mall.shop">Découvrir</button>
        <div class="mobile-home__dots" id="mobileHomeDots"></div>
      </div>
      <div class="mobile-home__kids">
        <button type="button" class="mobile-home__kids-hero" data-mall-page="petite-princesse" data-i18n-aria="home.mall.shop" aria-label="Découvrir">
          <img src="/images/kids-hero.png" alt="" loading="lazy" decoding="async" />
        </button>
      </div>
      <div class="mobile-home__wave" aria-hidden="true">
        <svg viewBox="0 0 390 80" preserveAspectRatio="none">
          <path fill="#6e4bff" d="M0 34C120 6 250 0 390 22V80H0Z"/>
        </svg>
      </div>
    </div>
    <div class="mobile-home__sheet">
      <div class="mobile-home__kids-board">
        <div class="mobile-home__kids-grid"></div>
      </div>
      <div class="mobile-home__rails-wrap">
        <div class="mobile-home__rails" id="mobileHomeRails"></div>
      </div>
      <div class="mobile-home__promo">
        <button type="button" class="mobile-home__promo-side" data-mall-action="shipping">
          <span class="mobile-home__promo-title">${TRUCK_ICON}<span data-i18n="home.mall.ship">Livraison offerte</span></span>
          <span class="mobile-home__promo-note" data-i18n="home.mall.shipNote">Dès 6 500 DZD</span>
        </button>
        <span class="mobile-home__promo-rule" aria-hidden="true"></span>
        <button type="button" class="mobile-home__promo-side" data-mall-action="returns">
          <span class="mobile-home__promo-title">${RETURN_ICON}<span data-i18n="home.mall.returns">Retours faciles</span></span>
          <span class="mobile-home__promo-note" data-i18n="home.mall.returnsNote">En savoir plus</span>
        </button>
      </div>
      <div class="mobile-home__body">
        <div class="category-mall__filter-row">
          <button class="category-page__filter-toggle category-mall__filter-toggle" type="button" aria-label="Ouvrir les filtres">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2" fill="#fff"/>
              <line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2" fill="#fff"/>
              <line x1="4" y1="17" x2="20" y2="17"/><circle cx="11" cy="17" r="2" fill="#fff"/>
            </svg>
          </button>
          <div class="mobile-home__circles" id="mobileHomeCircles" aria-label="Univers" data-i18n-aria="home.mall.circles"></div>
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
            <button type="button" class="mobile-home__chip is-active" data-mall-chip="foryou" data-i18n="home.mall.forYou">Pour vous</button>
            <button type="button" class="mobile-home__chip" data-mall-chip="new">${STAR_ICON}<span data-i18n="home.mall.newIn">Nouveautés</span></button>
            <button type="button" class="mobile-home__chip" data-mall-chip="favoris">${HEART_ICON}<span data-i18n="home.mall.favoris">Favoris</span></button>
            <button type="button" class="mobile-home__chip" data-mall-chip="best">${TROPHY_ICON}<span data-i18n="home.mall.best">Best-sellers</span></button>
          </div>
        </div>
        <p class="mobile-home__empty" id="mobileHomeEmpty" hidden data-i18n="home.mall.empty">Aucune pièce dans cette sélection.</p>
        <div class="grid mobile-home__feed" id="mobileHomeFeed"></div>
      </div>
    </div>
  `;

  const photo = section.querySelector(".mobile-home__photo");
  applyResponsiveImage(photo, toutHeroImage, {
    eager: true,
    priority: true,
    sizes: HERO_SIZES,
    widths: HERO_WIDTHS,
  });

  return section;
}
