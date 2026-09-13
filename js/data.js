export const heroImage =
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85";

export const editorialImage =
  "https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88?auto=format&fit=crop&w=1000&q=80";

export const products = [
  {
    id: "racelia-maxi-flap",
    name: "MAXI FLAPBAG",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "mini-flap-bag",
    name: "MAXI FLAPBAG",
    images: [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "mini-evening-clutch",
    name: "EVENING BAG",
    images: [
      "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "racelia-classic",
    name: "CLUTCH WITH CHAIN",
    images: [
      "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80",
    ],
  },
];

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
