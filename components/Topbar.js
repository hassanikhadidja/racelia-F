import { menuIcon, searchIcon, accountIcon, cartIcon, closeIcon, wishlistIcon } from "./icons.js";
import { AUDIENCES } from "../js/audience.js";

export function createTopbar() {
  const header = document.createElement("header");
  header.className = "topbar";

  const menuBtn = document.createElement("button");
  menuBtn.className = "icon-btn";
  menuBtn.id = "menuBtn";
  menuBtn.setAttribute("aria-label", "Menu");
  menuBtn.setAttribute("data-i18n-aria", "ui.menu");
  menuBtn.innerHTML = menuIcon;

  const searchBtn = document.createElement("button");
  searchBtn.className = "icon-btn";
  searchBtn.id = "topbarSearchBtn";
  searchBtn.type = "button";
  searchBtn.setAttribute("aria-label", "Rechercher");
  searchBtn.setAttribute("data-i18n-aria", "search.open");
  searchBtn.setAttribute("aria-expanded", "false");
  searchBtn.setAttribute("aria-controls", "topbarSearchPanel");
  searchBtn.innerHTML = searchIcon;

  const strip = document.createElement("div");
  strip.className = "topbar-strip";
  strip.setAttribute("aria-hidden", "true");

  const searchPanel = document.createElement("div");
  searchPanel.className = "topbar-search";
  searchPanel.id = "topbarSearchPanel";
  searchPanel.hidden = true;

  const searchTitle = document.createElement("p");
  searchTitle.className = "topbar-search__title";
  searchTitle.dataset.i18n = "search.title";
  searchTitle.textContent = "RECHERCHE";

  const searchForm = document.createElement("form");
  searchForm.className = "topbar-search__form";
  searchForm.id = "topbarSearchForm";
  searchForm.setAttribute("role", "search");

  const searchGlyph = document.createElement("span");
  searchGlyph.className = "topbar-search__icon";
  searchGlyph.setAttribute("aria-hidden", "true");
  searchGlyph.innerHTML = searchIcon;

  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.id = "topbarSearchInput";
  searchInput.className = "topbar-search__input";
  searchInput.placeholder = "Rechercher";
  searchInput.setAttribute("data-i18n-placeholder", "search.placeholder");
  searchInput.setAttribute("aria-label", "Rechercher");
  searchInput.setAttribute("data-i18n-aria", "search.open");
  searchInput.setAttribute("enterkeyhint", "search");
  searchInput.setAttribute("aria-autocomplete", "list");
  searchInput.setAttribute("aria-controls", "topbarSearchResults");
  searchInput.autocomplete = "off";

  const searchClose = document.createElement("button");
  searchClose.type = "button";
  searchClose.className = "icon-btn topbar-search__close";
  searchClose.id = "topbarSearchClose";
  searchClose.setAttribute("aria-label", "Fermer la recherche");
  searchClose.setAttribute("data-i18n-aria", "search.closeAria");
  searchClose.innerHTML = `
    <span class="topbar-search__close-icon">${closeIcon}</span>
    <span class="topbar-search__close-text" data-i18n="search.close">Fermer</span>
  `;

  const searchSuggestions = document.createElement("div");
  searchSuggestions.className = "topbar-search__suggestions";
  searchSuggestions.id = "topbarSearchSuggestions";
  searchSuggestions.innerHTML = `
    <p class="topbar-search__suggest-label" data-i18n="search.suggestions">Suggestions</p>
    <button type="button" class="topbar-search__suggest" data-suggest-page="nouveautes" data-i18n="search.suggest.metiers">Découvrir les Métiers d'Art 2026</button>
    <button type="button" class="topbar-search__suggest" data-suggest-page="racelia-handbag" data-i18n="search.suggest.bags">Explorer les sacs RACÈLIA</button>
    <button type="button" class="topbar-search__suggest" data-suggest-page="catalogue-grossiste" data-i18n="search.suggest.catalogue">Voir le catalogue grossiste</button>
    <button type="button" class="topbar-search__suggest" data-suggest-action="boutiques" data-i18n="search.suggest.boutiques">Trouver une boutique</button>
    <button type="button" class="topbar-search__suggest" data-suggest-action="style" data-i18n="search.suggest.style">Découvrir #RACÈLIASTYLE</button>
  `;

  const searchResults = document.createElement("div");
  searchResults.className = "topbar-search__results";
  searchResults.id = "topbarSearchResults";
  searchResults.hidden = true;
  searchResults.setAttribute("role", "listbox");
  searchResults.setAttribute("aria-label", "Résultats de recherche");
  searchResults.setAttribute("data-i18n-aria", "search.results");

  searchForm.append(searchGlyph, searchInput, searchClose);
  searchPanel.append(searchTitle, searchForm, searchSuggestions, searchResults);

  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = "/";
  brand.setAttribute("aria-label", "Accueil RACÈLIA");
  brand.setAttribute("data-i18n-aria", "ui.home");
  brand.innerHTML = `
    <span class="brand__name">RACÈLIA</span>
    <span class="brand__section" data-i18n-html="home.metiersTitle">MÉTIERS D'ART 2026<br>COLLECTION</span>
  `;

  const actions = document.createElement("div");
  actions.className = "topbar__actions";

  const lang = document.createElement("div");
  lang.className = "topbar-lang";
  lang.setAttribute("role", "group");
  lang.setAttribute("aria-label", "Changer de langue");
  lang.setAttribute("data-i18n-aria", "lang.change");
  lang.innerHTML = `
    <button type="button" class="topbar-lang__btn" data-lang="fr" aria-pressed="true">FR</button>
    <span class="topbar-lang__sep" aria-hidden="true">|</span>
    <button type="button" class="topbar-lang__btn" data-lang="en" aria-pressed="false">EN</button>
  `;

  const wishlistBtn = document.createElement("button");
  wishlistBtn.className = "icon-btn topbar-wishlist-btn js-topbar-wishlist-open";
  wishlistBtn.id = "topbarWishlistBtn";
  wishlistBtn.type = "button";
  wishlistBtn.setAttribute("aria-label", "Liste de souhaits");
  wishlistBtn.setAttribute("data-i18n-aria", "ui.wishlist");
  wishlistBtn.innerHTML = wishlistIcon;

  const cartBtn = document.createElement("button");
  cartBtn.className = "icon-btn topbar-cart-btn";
  cartBtn.id = "topbarCartBtn";
  cartBtn.type = "button";
  cartBtn.hidden = true;
  cartBtn.setAttribute("aria-label", "Panier");
  cartBtn.setAttribute("data-i18n-aria", "ui.cart");
  cartBtn.innerHTML = `
    ${cartIcon}
    <span class="topbar-cart-badge" id="topbarCartBadge">0</span>
  `;

  const accountBtn = document.createElement("button");
  accountBtn.className = "icon-btn js-account-open topbar-account-btn";
  accountBtn.id = "topbarAccountBtn";
  accountBtn.type = "button";
  accountBtn.setAttribute("aria-label", "Compte");
  accountBtn.setAttribute("data-i18n-aria", "ui.account");
  accountBtn.innerHTML = `
    <span class="account-btn-icon">${accountIcon}</span>
    <span class="topbar-account-avatar avatar-wrap" hidden>
      <span class="avatar-placeholder"></span>
    </span>
  `;

  actions.append(accountBtn, wishlistBtn, cartBtn);

  const desktopNav = document.createElement("nav");
  desktopNav.className = "topbar-nav";
  desktopNav.id = "topbarDesktopNav";
  desktopNav.setAttribute("aria-label", "Navigation principale");
  desktopNav.setAttribute("data-i18n-aria", "nav.main");

  AUDIENCES.forEach((audience) => {
    const wrap = document.createElement("div");
    wrap.className = "topbar-nav__item topbar-nav__item--audience";
    wrap.dataset.mega = audience.id;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "topbar-nav__btn js-desktop-audience";
    btn.dataset.audience = audience.id;
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-controls", "topbarMega");
    btn.dataset.i18n = `nav.${audience.id}`;
    btn.textContent = audience.label.toUpperCase();
    wrap.appendChild(btn);

    desktopNav.appendChild(wrap);
  });

  [
    { label: "CATALOGUE GROSSISTE", i18n: "nav.catalogue", page: "catalogue-grossiste", mega: "catalogue" },
    { label: "BOUTIQUES", i18n: "nav.boutiques", action: "boutiques", mega: "boutiques" },
    { label: "#RACÈLIASTYLE", i18n: "nav.style", action: "style", mega: "style" },
    { label: "ABOUT RACÈLIA", i18n: "nav.about", action: "about", mega: "about" },
    { label: "TABLEAU DE BORD", i18n: "nav.dashboard", action: "dashboard" },
  ].forEach((item) => {
    const wrap = document.createElement("div");
    wrap.className = "topbar-nav__item";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "topbar-nav__btn js-desktop-clear-audience";
    btn.dataset.i18n = item.i18n;
    btn.textContent = item.label;

    if (item.page) {
      btn.classList.add("js-menu-category");
      btn.dataset.page = item.page;
    }
    if (item.action === "boutiques") btn.classList.add("js-menu-boutiques-open");
    if (item.action === "style") btn.classList.add("js-desktop-style-open");
    if (item.action === "about") btn.classList.add("js-desktop-about-open");
    if (item.mega) wrap.dataset.mega = item.mega;
    if (item.action === "dashboard") {
      btn.classList.remove("js-desktop-clear-audience");
      wrap.classList.add("js-dashboard-open", "js-dashboard-menu-item");
      wrap.hidden = true;
    }

    wrap.appendChild(btn);
    desktopNav.appendChild(wrap);
  });

  const mega = document.createElement("div");
  mega.className = "topbar-mega";
  mega.id = "topbarMega";
  mega.hidden = true;
  mega.innerHTML = `
    <div class="topbar-mega__head">
      <p class="topbar-mega__notice" data-i18n="mega.notice">Retrait en boutique disponible pour certaines pièces</p>
      <button type="button" class="icon-btn topbar-mega__close" id="topbarMegaClose" aria-label="Fermer le menu" data-i18n-aria="mega.close">
        ${closeIcon}
      </button>
    </div>
    <div class="topbar-mega__inner">
      <div class="topbar-mega__media">
        <img id="topbarMegaImage" alt="" />
        <div class="topbar-mega__media-links" id="topbarMegaMediaLinks"></div>
      </div>
      <div class="topbar-mega__columns" id="topbarMegaColumns"></div>
    </div>
  `;

  header.append(strip, menuBtn, searchBtn, lang, brand, actions, desktopNav, searchPanel, mega);
  return header;
}
