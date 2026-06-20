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
  { label: "MINI BAGS", page: "mini-bags" },
  { label: "RACÈLIA BAGS", page: "racelia-handbag" },
  { label: "MOM BAGS", page: "moms-bags" },
  { label: "ALL SELECTION", page: "all-selection" },
];

export const menuItems = [
  { label: "NEW ARRIVALS", action: "new-arrivals" },
  { label: "MÉTIERS D'ART", tag: "NEW", action: "blogs" },
  { label: "HANDBAGS", chevron: true, gap: true, submenu: menuHandbagItems },
  { label: "BOUTIQUES", sale: true },
  { label: "DASHBOARD", muted: true, action: "dashboard" },
];

export const defaultSelection = "NEW ARRIVALS";

export const selectionItems = [
  { label: "NEW ARRIVALS", page: "home" },
  { label: "ALL SELECTION", page: "all-selection" },
  { label: "MINI BAGS", page: "mini-bags" },
  { label: "THE RACÈLIA HANDBAG", page: "racelia-handbag" },
  { label: "MOMS BAGS", page: "moms-bags" },
];
