const LOCALE_KEY = "raceliaLocale";

const STRINGS = {
  fr: {
    "brand.shop": "RACÈLIA",
    "brand.style": "RACÈLIASTYLE",
    "brand.tabs": "Univers RACÈLIA",
    "lang.open": "Changer de langue",
    "lang.change": "Changer de langue",
    "currency.change": "Changer de devise",
    "nav.femme": "FEMME",
    "nav.homme": "HOMME",
    "nav.enfants": "ENFANTS",
    "nav.mariee": "MARIÉE",
    "nav.hammam": "HAMMAM",
    "nav.catalogue": "CATALOGUE GROSSISTE",
    "nav.boutiques": "BOUTIQUES",
    "nav.style": "#RACÈLIASTYLE",
    "nav.about": "ABOUT RACÈLIA",
    "nav.dashboard": "TABLEAU DE BORD",
    "nav.nouveautes": "NOUVEAUTÉS",
    "nav.sacs": "SACS",
    "nav.miniBags": "MINI SACS",
    "nav.raceliaBags": "SACS RACÈLIA",
    "nav.momsBags": "SACS MOM",
    "nav.main": "Navigation principale",
    "nav.menu": "MENU",
    "nav.univers": "Univers",
    "search.title": "RECHERCHE",
    "search.placeholder": "Rechercher",
    "search.close": "Fermer",
    "search.closeAria": "Fermer la recherche",
    "search.open": "Rechercher",
    "search.suggestions": "Suggestions",
    "search.results": "Résultats de recherche",
    "search.empty": "Aucun résultat pour « {query} ».",
    "search.seeAll": "Voir tous les résultats",
    "search.seeCount": "Voir les {count} résultats",
    "search.suggest.metiers": "Découvrir les Métiers d'Art 2026",
    "search.suggest.bags": "Explorer les sacs RACÈLIA",
    "search.suggest.catalogue": "Voir le catalogue grossiste",
    "search.suggest.boutiques": "Trouver une boutique",
    "search.suggest.style": "Découvrir #RACÈLIASTYLE",
    "mega.notice": "Retrait en boutique disponible pour certaines pièces",
    "mega.close": "Fermer le menu",
    "mega.featured": "En vedette",
    "mega.categories": "Catégories",
    "mega.services": "Services",
    "mega.ages": "Âges",
    "mega.catalogue": "Catalogue",
    "mega.boutiques": "Boutiques",
    "mega.about": "About RACÈLIA",
    "mega.new": "Nouveautés",
    "mega.metiers": "Métiers d'Art 2026",
    "mega.bags": "Sacs",
    "mega.miniBags": "Mini sacs",
    "mega.raceliaBags": "Sacs RACÈLIA",
    "mega.catalogueLink": "Catalogue grossiste",
    "mega.stores": "Boutiques",
    "mega.contact": "Nous contacter",
    "mega.appointment": "Prendre rendez-vous >",
    "mega.homeAudience": "{name} accueil >",
    "mega.catalogueHome": "Catalogue accueil >",
    "mega.contactArrow": "Nous contacter >",
    "mega.allStores": "Toutes les boutiques >",
    "mega.findStore": "Trouver une boutique",
    "mega.faq": "FAQ",
    "mega.shipping": "Livraison",
    "mega.momsBags": "Sacs Mom",
    "mega.styleArrow": "#RACÈLIASTYLE >",
    "mega.newArrow": "Nouveautés >",
    "mega.aboutArrow": "About RACÈLIA >",
    "mega.girl614": "Fille 6 - 14 ans",
    "mega.boy614": "Garçon 6 - 14 ans",
    "mega.girl06": "Fille ½ - 6 ans",
    "mega.boy06": "Garçon ½ - 6 ans",
    "audience.femme": "Femme",
    "audience.homme": "Homme",
    "audience.enfants": "Enfants",
    "audience.mariee": "Mariée",
    "audience.hammam": "Hammam",
    "ui.menu": "Menu",
    "ui.close": "Fermer",
    "ui.wishlist": "Liste de souhaits",
    "ui.cart": "Panier",
    "ui.account": "Compte",
    "ui.home": "Accueil RACÈLIA",
    "tag.new": "NOUVEAU",
    "home.metiersTitle": "MÉTIERS D'ART 2026<br>COLLECTION",
    "home.stories.aria": "Parcourir",
    "home.stories.tendance": "Tendance",
    "home.stories.banane": "Banane",
    "home.stories.year": "20266",
    "home.stories.luxe": "Luxexte",
    "home.stories.grand": "Grandorf",
    "home.stories.louisvuitton": "Louisvuitton",
    "home.stories.hermes": "Hermes",
    "home.stories.modele": "Modèle",
    "home.stories.bandouliere": "Bandoulière",
    "home.stories.lacos": "lacos",
  },
  en: {
    "brand.shop": "RACÈLIA",
    "brand.style": "RACÈLIASTYLE",
    "brand.tabs": "RACÈLIA worlds",
    "lang.open": "Change language",
    "lang.change": "Change language",
    "currency.change": "Change currency",
    "nav.femme": "WOMEN",
    "nav.homme": "MEN",
    "nav.enfants": "KIDS",
    "nav.mariee": "BRIDAL",
    "nav.hammam": "HAMMAM",
    "nav.catalogue": "WHOLESALE CATALOGUE",
    "nav.boutiques": "BOUTIQUES",
    "nav.style": "#RACÈLIASTYLE",
    "nav.about": "ABOUT RACÈLIA",
    "nav.dashboard": "DASHBOARD",
    "nav.nouveautes": "NEW IN",
    "nav.sacs": "BAGS",
    "nav.miniBags": "MINI BAGS",
    "nav.raceliaBags": "RACÈLIA BAGS",
    "nav.momsBags": "MOM BAGS",
    "nav.main": "Main navigation",
    "nav.menu": "MENU",
    "nav.univers": "Worlds",
    "search.title": "SEARCH",
    "search.placeholder": "Search",
    "search.close": "Close",
    "search.closeAria": "Close search",
    "search.open": "Search",
    "search.suggestions": "Suggestions",
    "search.results": "Search results",
    "search.empty": "No results for “{query}”.",
    "search.seeAll": "See all results",
    "search.seeCount": "See the {count} results",
    "search.suggest.metiers": "Discover Métiers d'Art 2026",
    "search.suggest.bags": "Explore RACÈLIA bags",
    "search.suggest.catalogue": "View the wholesale catalogue",
    "search.suggest.boutiques": "Find a boutique",
    "search.suggest.style": "Discover #RACÈLIASTYLE",
    "mega.notice": "Click & collect available for select pieces",
    "mega.close": "Close menu",
    "mega.featured": "Featured",
    "mega.categories": "Categories",
    "mega.services": "Services",
    "mega.ages": "Ages",
    "mega.catalogue": "Catalogue",
    "mega.boutiques": "Boutiques",
    "mega.about": "About RACÈLIA",
    "mega.new": "New in",
    "mega.metiers": "Métiers d'Art 2026",
    "mega.bags": "Bags",
    "mega.miniBags": "Mini bags",
    "mega.raceliaBags": "RACÈLIA bags",
    "mega.catalogueLink": "Wholesale catalogue",
    "mega.stores": "Boutiques",
    "mega.contact": "Contact us",
    "mega.appointment": "Book an appointment >",
    "mega.homeAudience": "{name} home >",
    "mega.catalogueHome": "Catalogue home >",
    "mega.contactArrow": "Contact us >",
    "mega.allStores": "All boutiques >",
    "mega.findStore": "Find a boutique",
    "mega.faq": "FAQ",
    "mega.shipping": "Shipping",
    "mega.momsBags": "Mom bags",
    "mega.styleArrow": "#RACÈLIASTYLE >",
    "mega.newArrow": "New in >",
    "mega.aboutArrow": "About RACÈLIA >",
    "mega.girl614": "Girl 6 - 14 years",
    "mega.boy614": "Boy 6 - 14 years",
    "mega.girl06": "Girl ½ - 6 years",
    "mega.boy06": "Boy ½ - 6 years",
    "audience.femme": "Women",
    "audience.homme": "Men",
    "audience.enfants": "Kids",
    "audience.mariee": "Bridal",
    "audience.hammam": "Hammam",
    "ui.menu": "Menu",
    "ui.close": "Close",
    "ui.wishlist": "Wishlist",
    "ui.cart": "Bag",
    "ui.account": "Account",
    "ui.home": "RACÈLIA home",
    "tag.new": "NEW",
    "home.metiersTitle": "MÉTIERS D'ART 2026<br>COLLECTION",
    "home.stories.aria": "Browse",
    "home.stories.tendance": "Tendance",
    "home.stories.banane": "Banane",
    "home.stories.year": "20266",
    "home.stories.luxe": "Luxexte",
    "home.stories.grand": "Grandorf",
    "home.stories.louisvuitton": "Louisvuitton",
    "home.stories.hermes": "Hermes",
    "home.stories.modele": "Modèle",
    "home.stories.bandouliere": "Bandoulière",
    "home.stories.lacos": "lacos",
  },
};

function normalizeLocale(value) {
  return value === "en" ? "en" : "fr";
}

export function getLocale() {
  try {
    return normalizeLocale(localStorage.getItem(LOCALE_KEY));
  } catch {
    return "fr";
  }
}

export function setLocale(lang) {
  const next = normalizeLocale(lang);
  try {
    localStorage.setItem(LOCALE_KEY, next);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = next;
  return next;
}

export function t(key, vars = {}) {
  const locale = getLocale();
  const table = STRINGS[locale] || STRINGS.fr;
  let value = table[key] ?? STRINGS.fr[key] ?? key;
  Object.entries(vars).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, String(replacement ?? ""));
  });
  return value;
}

export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
}

function syncLangControls(root, locale) {
  const code = root.querySelector("#topbarLangCode");
  if (code) code.textContent = locale.toUpperCase();

  root.querySelectorAll("[data-lang]").forEach((btn) => {
    const on = btn.dataset.lang === locale;
    btn.classList.toggle("is-active", on);
    if (btn.hasAttribute("aria-pressed")) btn.setAttribute("aria-pressed", String(on));
  });

  const footer = root.querySelector("#footerLangSelect");
  if (footer && footer.value !== locale) footer.value = locale;
}

export function applyLocale(root, lang) {
  const locale = setLocale(lang);
  applyI18n(root);
  syncLangControls(root, locale);
  root.dispatchEvent(new CustomEvent("racelia:locale-changed", { detail: { locale } }));
  return locale;
}

export function initI18n(root) {
  const locale = setLocale(getLocale());
  applyI18n(root);
  syncLangControls(root, locale);

  root.querySelector(".topbar-lang")?.addEventListener("click", (event) => {
    const option = event.target.closest("[data-lang]");
    if (!option) return;
    event.preventDefault();
    event.stopPropagation();
    applyLocale(root, option.dataset.lang);
  });

  root.querySelector("#footerLangSelect")?.addEventListener("change", (event) => {
    applyLocale(root, event.target.value);
  });
}
