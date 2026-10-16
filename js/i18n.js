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
    "nav.menuSacs": "Sacs",
    "nav.wishlist": "Liste d'envies",
    "nav.language": "Langue",
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
    "search.suggest.metiers": "Découvrir L’ART DU GESTE Collection 2026",
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
    "mega.metiers": "L’ART DU GESTE Collection 2026",
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
    "home.metiersTitle": "L’ART DU GESTE<br>Collection 2026",
    "home.stories.aria": "Parcourir",
    "home.stories.tendance": "Tendance",
    "home.stories.banane": "RACÈLIA",
    "home.stories.year": "CC",
    "home.stories.luxe": "SACS MOM",
    "home.stories.grand": "HAMMAM",
    "home.stories.louisvuitton": "HOMME",
    "home.stories.hermes": "Petite Princesse",
    "home.stories.modele": "MARIÉE",
    "home.stories.bandouliere": "Idées Cadeaux",
    "home.stories.lacos": "Parfums Féminins",
    "home.mall.parfumsRacelia": "Parfums Racèlia",
    "home.mall.brumes": "Brumes",
    "home.mall.parfumsFragrances": "Parfums et fragrances",
    "home.mall.tabs": "Catégories",
    "home.mall.tout": "Tout",
    "home.mall.femme": "Femme",
    "home.mall.chaussures": "Chaussures",
    "home.mall.enfants": "Enfants",
    "home.mall.sacs": "Sacs",
    "home.mall.homme": "Homme",
    "home.mall.bijoux": "Accessories",
    "home.mall.hairClips": "Hair Clips",
    "home.mall.satinScarves": "Satin Scarves",
    "home.mall.watches": "Watches",
    "home.mall.belts": "Belts",
    "home.mall.bijouxItem": "Bijoux",
    "home.mall.everydayHeels": "Everyday Heels",
    "home.mall.boots": "BOOTS",
    "home.mall.sandals": "SANDALS",
    "home.mall.heels": "HEELS",
    "home.mall.sneakers": "SNEAKERS",
    "home.mall.clogs": "CLOGS",
    "home.mall.handbag": "Handbag",
    "home.mall.dress": "Dress",
    "home.mall.toteBag": "Tote Bag",
    "home.mall.rugPouches": "Rug Pouches",
    "home.mall.laptopBags": "LAPTOP BAGS",
    "home.mall.backpacks": "BACKPACKS",
    "home.mall.cosmeticBags": "COSMETIC BAGS",
    "home.mall.laptopSleeve": "Housse d’ordinateur",
    "home.mall.mariee": "Mariée",
    "home.mall.hammam": "Hammam",
    "home.mall.tendance": "tendances",
    "home.mall.hash": "#LArtDuGeste",
    "home.mall.tendanceLine": "Les tendances du moment, sélectionnées pour sublimer votre style",
    "home.mall.ship": "Livraison offerte",
    "home.mall.shipNote": "Dès 6 500 DZD",
    "home.mall.returns": "Retours faciles",
    "home.mall.returnsNote": "En savoir plus",
    "home.mall.forYou": "Pour vous",
    "home.mall.newIn": "Nouveautés",
    "home.mall.favoris": "Favoris",
    "home.mall.best": "Best-sellers",
    "home.mall.empty": "Aucune pièce dans cette sélection.",
    "home.mall.circles": "Univers",
    "home.mall.shop": "Découvrir",
    "home.mall.marque": "Marque",
    "home.mall.cc": "CC",
    "home.mall.view.femme.kicker": "L’ART DU GESTE",
    "home.mall.view.femme.title": "Collection 2026",
    "home.mall.view.enfants.kicker": "ENFANTS",
    "home.mall.view.enfants.title": "Petite Princesse",
    "home.mall.kids.category": "Catégorie",
    "home.mall.kids.age06": "½ – 6 ans",
    "home.mall.kids.age614": "6 – 14 ans",
    "home.mall.view.homme.kicker": "HOMME",
    "home.mall.view.homme.title": "La collection",
    "home.mall.view.sacs.kicker": "SACS",
    "home.mall.view.sacs.title": "Le sac RACÈLIA",
    "home.mall.view.mariee.kicker": "MARIÉE",
    "home.mall.view.mariee.title": "Bridal essentials",
    "home.mall.view.hammam.kicker": "HAMMAM",
    "home.mall.view.hammam.title": "La collection",
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
    "nav.menuSacs": "Bags",
    "nav.wishlist": "Wishlist",
    "nav.language": "Language",
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
    "search.suggest.metiers": "Discover L’ART DU GESTE Collection 2026",
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
    "mega.metiers": "L’ART DU GESTE Collection 2026",
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
    "home.metiersTitle": "L’ART DU GESTE<br>Collection 2026",
    "home.stories.aria": "Browse",
    "home.stories.tendance": "Tendance",
    "home.stories.banane": "RACÈLIA",
    "home.stories.year": "CC",
    "home.stories.luxe": "SACS MOM",
    "home.stories.grand": "HAMMAM",
    "home.stories.louisvuitton": "HOMME",
    "home.stories.hermes": "Petite Princesse",
    "home.stories.modele": "MARIÉE",
    "home.stories.bandouliere": "Idées Cadeaux",
    "home.stories.lacos": "Parfums Féminins",
    "home.mall.parfumsRacelia": "Racèlia perfumes",
    "home.mall.brumes": "Mists",
    "home.mall.parfumsFragrances": "Perfumes and fragrances",
    "home.mall.tabs": "Categories",
    "home.mall.tout": "All",
    "home.mall.femme": "Women",
    "home.mall.chaussures": "Shoes",
    "home.mall.enfants": "Kids",
    "home.mall.sacs": "Bags",
    "home.mall.homme": "Men",
    "home.mall.bijoux": "Accessories",
    "home.mall.hairClips": "Hair Clips",
    "home.mall.satinScarves": "Satin Scarves",
    "home.mall.watches": "Watches",
    "home.mall.belts": "Belts",
    "home.mall.bijouxItem": "Bijoux",
    "home.mall.everydayHeels": "Everyday Heels",
    "home.mall.boots": "BOOTS",
    "home.mall.sandals": "SANDALS",
    "home.mall.heels": "HEELS",
    "home.mall.sneakers": "SNEAKERS",
    "home.mall.clogs": "CLOGS",
    "home.mall.handbag": "Handbag",
    "home.mall.dress": "Dress",
    "home.mall.toteBag": "Tote Bag",
    "home.mall.rugPouches": "Rug Pouches",
    "home.mall.laptopBags": "Laptop bags",
    "home.mall.backpacks": "Backpacks",
    "home.mall.cosmeticBags": "Cosmetic bags",
    "home.mall.laptopSleeve": "Laptop sleeve",
    "home.mall.mariee": "Bridal",
    "home.mall.hammam": "Hammam",
    "home.mall.tendance": "trending",
    "home.mall.hash": "#LArtDuGeste",
    "home.mall.tendanceLine": "The trends of the moment, selected to elevate your style",
    "home.mall.ship": "Free shipping",
    "home.mall.shipNote": "From 6,500 DZD",
    "home.mall.returns": "Easy returns",
    "home.mall.returnsNote": "View more",
    "home.mall.forYou": "For you",
    "home.mall.newIn": "New in",
    "home.mall.favoris": "Favorites",
    "home.mall.best": "Best-sellers",
    "home.mall.empty": "Nothing in this selection.",
    "home.mall.circles": "Worlds",
    "home.mall.shop": "Discover",
    "home.mall.marque": "Brand",
    "home.mall.cc": "CC",
    "home.mall.view.femme.kicker": "L’ART DU GESTE",
    "home.mall.view.femme.title": "Collection 2026",
    "home.mall.view.enfants.kicker": "KIDS",
    "home.mall.view.enfants.title": "Little Princess",
    "home.mall.kids.category": "Category",
    "home.mall.kids.age06": "½ – 6 yrs",
    "home.mall.kids.age614": "6 – 14 yrs",
    "home.mall.view.homme.kicker": "MEN",
    "home.mall.view.homme.title": "The collection",
    "home.mall.view.sacs.kicker": "BAGS",
    "home.mall.view.sacs.title": "The RACÈLIA bag",
    "home.mall.view.mariee.kicker": "BRIDAL",
    "home.mall.view.mariee.title": "Bridal essentials",
    "home.mall.view.hammam.kicker": "HAMMAM",
    "home.mall.view.hammam.title": "The collection",
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
