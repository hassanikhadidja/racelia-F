export const heroImage = "/images/hero-back-in-stock.jpg";
export const toutHeroImage = "/images/hero-tout.jpg?v=2";

export const editorialImage = "/images/editorial-home.jpg";

export const products = [];

export const menuHandbagItems = [
  { label: "MINI SACS", i18n: "nav.miniBags", page: "mini-bags" },
  { label: "SACS RACÈLIA", i18n: "nav.raceliaBags", page: "racelia-handbag" },
  { label: "SACS MOM", i18n: "nav.momsBags", page: "moms-bags" },
];

export const menuItems = [
  { label: "NOUVEAUTÉS", i18n: "nav.nouveautes", tag: "NOUVEAU", tagI18n: "tag.new", page: "nouveautes" },
  { label: "SACS", i18n: "nav.sacs", chevron: true, gap: true, submenu: menuHandbagItems },
  { label: "CATALOGUE GROSSISTE", i18n: "nav.catalogue", page: "catalogue-grossiste" },
  { label: "BOUTIQUES", i18n: "nav.boutiques", sale: true, action: "boutiques" },
  { label: "TABLEAU DE BORD", i18n: "nav.dashboard", muted: true, action: "dashboard" },
];

export const defaultSelection = "TOUTE LA SÉLECTION";

export const selectionItems = [
  { label: "NOUVEAUTÉS", page: "nouveautes" },
  { label: "MINI SACS", page: "mini-bags" },
  { label: "LE SAC RACÈLIA", page: "racelia-handbag" },
  { label: "SACS MOM", page: "moms-bags" },
];
