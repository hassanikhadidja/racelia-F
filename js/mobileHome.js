import { createProduct } from "../components/Product.js";
import { KIDS_GROUPS, getSelectedAudience, setSelectedAudience, productMatchesAudience } from "./audience.js";
import { heroImage, toutHeroImage } from "./data.js";
import { formatPrice, parseCatalogPriceEur } from "./currency.js";
import { applyI18n, t } from "./i18n.js";
import { applyResponsiveImage, HERO_SIZES, HERO_WIDTHS } from "./imageDelivery.js";
import { STORY_ITEMS } from "./homeStories.js";
import { initProductSliders } from "./productSliders.js";
import {
  getAllCatalogProducts,
  getCatalogProductById,
  getProductsForSection,
  isInSalesReport,
  toCategoryProduct,
} from "./productCatalog.js";
import { getCardImages } from "./productImages.js";
import { productMatchesFilters } from "./categoryFilters.js";
import { isProductInWishlist, syncWishlistHeartStates } from "./clientCartWishlist.js";
import { updateTopbar } from "./topbar.js";

let homeFeedFilters = [];

export function setHomeFeedFilters(filters) {
  homeFeedFilters = Array.isArray(filters) ? filters : [];
}

const TOUT_FEATURED_PRODUCT_ID = "demo-sac-mom-racelia";

function toutFeaturedProduct() {
  return (
    getCatalogProductById(TOUT_FEATURED_PRODUCT_ID) ||
    getAllCatalogProducts().find((product) => product?.name === "Sac Mom RACÈLIA") ||
    null
  );
}

const TABS = {
  tout: {},
  femme: { audience: "femme" },
  chaussures: { circle: "chaussures" },
  enfants: { audience: "enfants" },
  sacs: { circle: "sacs" },
  homme: { audience: "homme" },
  bijoux: { circle: "accessories" },
  mariee: { audience: "mariee" },
  hammam: { audience: "hammam" },
};

const STORY_BY_ID = new Map(STORY_ITEMS.map((item) => [item.id, item]));

const VIEWS = {
  chaussures: {
    poster: true,
    banner: "/images/hero-chaussures.jpg",
    kicker: "home.mall.chaussures",
    title: "home.mall.view.homme.title",
    page: "nouveautes",
    rails: ["nouveautes", "mariee"],
    circles: ["chaussures-everyday-heels", "chaussures-boots", "chaussures-sandals", "chaussures-heels", "chaussures-sneakers", "chaussures-clogs", "chaussures-racelia", "chaussures-tendance"],
  },
  bijoux: {
    poster: true,
    banner: "/images/hero-accessories.jpg",
    kicker: "home.mall.bijoux",
    title: "home.mall.view.femme.title",
    page: "parfums-feminins",
    rails: ["nouveautes", "mariee"],
    circles: ["accessories-hair-clips", "accessories-satin-scarves", "accessories-watches", "accessories-belts", "accessories-bijoux", "accessories-cc", "accessories-racelia", "accessories-tendance"],
  },
  femme: {
    audience: "femme",
    poster: true,
    banner: "/images/hero-femme.jpg",
    kicker: "home.mall.view.femme.kicker",
    title: "home.mall.view.femme.title",
    page: "nouveautes",
    rails: ["nouveautes", "racelia-handbag", "mariee", "hammam"],
    circles: ["tendance", "banane", "year", "bijoux", "chaussures", "lacos", "femme-mariee", "femme-sacs-mom"],
  },
  enfants: {
    audience: "enfants",
    banner: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=1200&q=80",
    kicker: "home.mall.view.enfants.kicker",
    title: "home.mall.view.enfants.title",
    page: "petite-princesse",
    rails: ["fille-6-14", "garcon-6-14", "fille-0-6", "garcon-0-6", "petite-princesse"],
    circles: ["fille-6-14", "garcon-6-14", "fille-0-6", "garcon-0-6", "hermes", "tendance", "banane"],
  },
  homme: {
    audience: "homme",
    poster: true,
    banner: "/images/hero-homme.jpg",
    kicker: "home.mall.view.homme.kicker",
    title: "home.mall.view.homme.title",
    page: "homme",
    rails: [],
    circles: ["homme-sacs", "homme-accessories", "homme-shoes"],
  },
  sacs: {
    poster: true,
    banner: "/images/hero-sacs.jpg",
    kicker: "home.mall.view.sacs.kicker",
    title: "home.mall.view.sacs.title",
    page: "sacs",
    rails: ["nouveautes", "racelia-handbag", "mariee"],
    circles: ["sacs-laptop-bags", "sacs-backpacks", "sacs-cosmetic-bags", "sacs-housse", "sacs-moms", "sacs-cc", "sacs-racelia", "sacs-tendance"],
  },
  mariee: {
    audience: "mariee",
    poster: true,
    banner: "/images/hero-mariee.jpg",
    kicker: "home.mall.view.mariee.kicker",
    title: "home.mall.view.mariee.title",
    page: "mariee",
    rails: ["nouveautes", "racelia-handbag", "hammam"],
    circles: ["tendance", "banane", "year", "bijoux", "chaussures", "lacos"],
  },
  hammam: {
    audience: "hammam",
    poster: true,
    banner: "/images/hero-hammam.jpg",
    kicker: "home.mall.view.hammam.kicker",
    title: "home.mall.view.hammam.title",
    page: "hammam",
    rails: ["nouveautes", "mariee"],
    circles: ["hammam-cosmetic-bags", "hammam-tote-bag", "hammam-rug-pouches", "hammam-tendance"],
  },
};

const RAIL_LABELS = {
  nouveautes: "mega.new",
  "mini-bags": "mega.miniBags",
  "racelia-handbag": "mega.raceliaBags",
  "moms-bags": "mega.momsBags",
  mariee: "home.stories.modele",
  homme: "home.stories.louisvuitton",
  sacs: "mega.bags",
  hammam: "home.stories.grand",
  "parfums-feminins": "home.stories.lacos",
  "petite-princesse": "home.stories.hermes",
  "fille-6-14": "mega.girl614",
  "garcon-6-14": "mega.boy614",
  "fille-0-6": "mega.girl06",
  "garcon-0-6": "mega.boy06",
  "icons-cc": "home.mall.cc",
};

const PAGE_STORY = {
  nouveautes: "tendance",
  "mini-bags": "banane",
  "racelia-handbag": "year",
  "moms-bags": "luxe",
  mariee: "modele",
  homme: "louisvuitton",
  sacs: "year",
  hammam: "grand",
  "parfums-feminins": "lacos",
  "petite-princesse": "hermes",
  "icons-cc": "year",
};

const BAG_RAILS = ["racelia-handbag", "icons-cc", "mini-bags", "moms-bags", "nouveautes"];
const BAG_CIRCLES = ["banane", "year", "luxe", "tendance"];
const KID_RAILS = ["fille-6-14", "garcon-6-14", "fille-0-6", "garcon-0-6", "petite-princesse"];

const COLLECTION_MALL = {
  nouveautes: {
    kicker: "mega.new",
    title: "home.mall.view.femme.title",
    story: "tendance",
    rails: [],
    circles: [],
  },
  "all-selection": {
    kicker: "home.mall.view.sacs.kicker",
    title: "home.mall.view.sacs.title",
    story: "year",
    rails: BAG_RAILS,
    circles: BAG_CIRCLES,
  },
  sacs: {
    kicker: "home.mall.view.sacs.kicker",
    title: "home.mall.view.sacs.title",
    banner: "/images/story-cc-bag.jpg",
    rails: ["mini-bags", "racelia-handbag", "moms-bags", "nouveautes", "sacs"],
    circles: ["banane", "year", "luxe", "tendance"],
  },
  "mini-bags": {
    kicker: "mega.miniBags",
    title: "home.mall.view.sacs.title",
    story: "banane",
    rails: ["mini-bags", "racelia-handbag", "icons-cc", "moms-bags", "nouveautes"],
    circles: BAG_CIRCLES,
  },
  "racelia-handbag": {
    kicker: "home.mall.marque",
    titleText: "RACÈLIA",
    poster: true,
    banner: "/images/hero-marque-racelia.jpg",
    story: "banane",
    rails: [],
    circles: ["tendance", "luxe", "year", "lacos"],
  },
  "moms-bags": {
    kicker: "mega.momsBags",
    title: "home.mall.view.femme.title",
    story: "luxe",
    rails: ["moms-bags", "racelia-handbag", "icons-cc", "mini-bags", "nouveautes"],
    circles: ["luxe", "banane", "year", "tendance"],
  },
  "icons-cc": {
    kicker: "home.mall.marque",
    titleText: "CC",
    poster: true,
    banner: "/images/hero-marque-cc.jpg",
    story: "year",
    rails: [],
    circles: ["cc-sacs", "cc-accessories", "cc-chaussures"],
  },
  hammam: {
    kicker: VIEWS.hammam.kicker,
    title: VIEWS.hammam.title,
    banner: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1790730704/f1ac71d5c79611f9866923f1e00193e8_znfhay.jpg",
    rails: ["hammam", "nouveautes", "parfums-feminins", "mariee"],
    circles: ["grand", "modele", "banane", "lacos"],
  },
  homme: {
    kicker: VIEWS.homme.kicker,
    title: VIEWS.homme.title,
    banner: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1200&q=80",
    rails: ["homme", "nouveautes", "racelia-handbag", "mini-bags", "sacs"],
    circles: ["louisvuitton", "banane", "year", "tendance", "luxe"],
  },
  mariee: {
    kicker: VIEWS.mariee.kicker,
    title: VIEWS.mariee.title,
    banner: "/images/editorial-home.jpg",
    rails: ["mariee", "nouveautes", "racelia-handbag", "parfums-feminins"],
    circles: ["modele", "lacos", "banane", "hermes"],
  },
  "petite-princesse": {
    kicker: VIEWS.enfants.kicker,
    title: VIEWS.enfants.title,
    banner: VIEWS.enfants.banner,
    rails: KID_RAILS,
    circles: VIEWS.enfants.circles,
  },
  "parfums-feminins": {
    kicker: "home.stories.lacos",
    title: "home.mall.view.femme.title",
    poster: true,
    banner: "/images/hero-parfums-buy.jpg",
    story: "lacos",
    rails: [],
    circles: ["parfum-racelia", "parfum-brumes", "parfum-fragrances"],
  },
};

const KIDS_PAGE_IDS = new Set(["fille-6-14", "garcon-6-14", "fille-0-6", "garcon-0-6", "petite-princesse"]);

["fille-6-14", "garcon-6-14", "fille-0-6", "garcon-0-6"].forEach((id) => {
  COLLECTION_MALL[id] = {
    kicker: "home.mall.view.enfants.kicker",
    title: RAIL_LABELS[id],
    banner: KIDS_GROUPS.find((group) => group.id === id)?.image,
    rails: KID_RAILS,
    circles: VIEWS.enfants.circles,
  };
});

const LOGO_STORIES = new Set(["banane"]);
const PAGE_TAB = {
  hammam: "hammam",
  homme: "homme",
  mariee: "mariee",
  "petite-princesse": "enfants",
  "fille-6-14": "enfants",
  "garcon-6-14": "enfants",
  "fille-0-6": "enfants",
  "garcon-0-6": "enfants",
  sacs: "sacs",
  "mini-bags": "sacs",
  "racelia-handbag": "sacs",
  "moms-bags": "sacs",
  "icons-cc": "sacs",
};

function isWholesaleOnly(product) {
  const sections = product?.sections || [];
  return sections.length > 0 && sections.every((id) => id === "catalogue-grossiste");
}

function storefrontProducts() {
  return getAllCatalogProducts()
    .filter((product) => product && !isWholesaleOnly(product))
    .map(toCategoryProduct)
    .filter((product) => product?.id && product.images?.length);
}

export function listStorefrontProducts() {
  return storefrontProducts();
}

function mentionedAsNew(product) {
  if ((product?.stockNotes || []).includes("new")) return true;
  const note = String(product?.stockNote || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (note === "new" || note === "nouveau" || note === "nouveaute") return true;
  const hay = [product?.tag, product?.name]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return /\b(new|nouveau|nouveaute|nouveautes)\b/.test(hay);
}

function mentionedAsBestSeller(product) {
  if ((product?.stockNotes || []).includes("best-sellers")) return true;
  const hay = [product?.name, product?.tag, product?.stockNote, product?.description, product?.packLabel, ...(product?.filters || [])]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/\bbest[\s-]*sellers?\b/.test(hay)) return true;
  return isInSalesReport(product);
}

function withImages(product) {
  const images = getCardImages(product, 0);
  if (!images.length || !product.id) return null;
  return product;
}

function productsForTab(tabId) {
  const tab = TABS[tabId] || TABS.tout;
  let list = getAllCatalogProducts()
    .filter((product) => product && !isWholesaleOnly(product))
    .map(withImages)
    .filter(Boolean);
  if (tab.audience) list = list.filter((product) => productMatchesAudience(product, tab.audience));
  if (tab.circle) list = list.filter((product) => productMatchesCircleFilter(product, tab.circle));
  return list;
}

export function productsForChip(list, chipId) {
  if (chipId === "new") return list.filter(mentionedAsNew);
  if (chipId === "favoris") return list.filter((product) => isProductInWishlist(product.id));
  if (chipId === "best") return list.filter(mentionedAsBestSeller);
  return list;
}

const HOME_NOUVEAUTES_ORIGINS = new Set(["femme", "sacs", "bijoux", "chaussures", "mariee", "hammam"]);
const HOME_MARIEE_ORIGINS = new Set(["femme", "sacs", "bijoux", "chaussures", "hammam"]);
const HOME_HAMMAM_ORIGINS = new Set(["femme", "sacs", "bijoux", "chaussures", "mariee", "hammam"]);
const HOME_RACELIA_ORIGINS = new Set(["femme", "sacs", "mariee"]);

function matchesHomeOrigin(product, origin) {
  if (origin === "femme" || origin === "mariee" || origin === "hammam") {
    return (product?.audiences || []).includes(origin);
  }
  if (origin === "sacs") return productMatchesCircleFilter(product, "sacs");
  if (origin === "chaussures") return productMatchesCircleFilter(product, "chaussures");
  if (origin === "bijoux") return productMatchesCircleFilter(product, "accessories");
  return false;
}

export function prioritizeHomeOrigin(products, origin) {
  if (!HOME_NOUVEAUTES_ORIGINS.has(origin)) return products;
  const top = [];
  const rest = [];
  products.forEach((product) => {
    if (matchesHomeOrigin(product, origin)) top.push(product);
    else rest.push(product);
  });
  return top.concat(rest);
}

function isTaggedMariee(product) {
  if ((product?.audiences || []).includes("mariee")) return true;
  const hay = [product?.name, product?.tag, ...(product?.filters || [])]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return /\bmariee\b/.test(hay);
}

export function prioritizeMarieeOrigin(products, origin) {
  if (!HOME_MARIEE_ORIGINS.has(origin)) return products;
  const top = [];
  const rest = [];
  products.forEach((product) => {
    if (matchesHomeOrigin(product, origin) && isTaggedMariee(product)) top.push(product);
    else rest.push(product);
  });
  return top.concat(rest);
}

function isTaggedHammam(product) {
  if ((product?.audiences || []).includes("hammam")) return true;
  const hay = [product?.name, product?.tag, ...(product?.filters || [])]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return /\bhammam\b/.test(hay);
}

export function prioritizeHammamOrigin(products, origin) {
  if (!HOME_HAMMAM_ORIGINS.has(origin)) return products;
  const top = [];
  const rest = [];
  products.forEach((product) => {
    if (matchesHomeOrigin(product, origin) && isTaggedHammam(product)) top.push(product);
    else rest.push(product);
  });
  return top.concat(rest);
}

export function prioritizeRaceliaOrigin(products, origin) {
  if (!HOME_RACELIA_ORIGINS.has(origin)) return products;
  const top = [];
  const rest = [];
  products.forEach((product) => {
    const tagged =
      origin === "mariee"
        ? isTaggedMariee(product)
        : origin === "femme"
          ? (product?.audiences || []).includes("femme")
          : productMatchesCircleFilter(product, "sacs");
    if (tagged) top.push(product);
    else rest.push(product);
  });
  return top.concat(rest);
}

export function prioritizeFemmeHomme(products) {
  const top = [];
  const rest = [];
  products.forEach((product) => {
    const audiences = product?.audiences || [];
    if (audiences.includes("femme") || audiences.includes("homme")) top.push(product);
    else rest.push(product);
  });
  return top.concat(rest);
}

function railCategoryDetail(button, tab) {
  const detail = { categoryKey: button.dataset.mallPage };
  if (!button.classList.contains("mobile-home__rail")) return detail;
  if (detail.categoryKey === "nouveautes") {
    detail.chip = "new";
    detail.pin = "new";
    if (HOME_NOUVEAUTES_ORIGINS.has(tab)) detail.origin = tab;
  } else if (detail.categoryKey === "mariee") {
    detail.categoryKey = "nouveautes";
    detail.chip = "foryou";
    detail.pin = "mariee";
    if (HOME_MARIEE_ORIGINS.has(tab)) detail.origin = tab;
  } else if (detail.categoryKey === "hammam") {
    detail.categoryKey = "nouveautes";
    detail.chip = "foryou";
    detail.pin = "hammam";
    if (HOME_HAMMAM_ORIGINS.has(tab)) detail.origin = tab;
  } else if (detail.categoryKey === "racelia-handbag") {
    detail.pin = "tendance";
    if (HOME_RACELIA_ORIGINS.has(tab)) detail.origin = tab;
  }
  return detail;
}

function renderPicks(root, products) {
  const picks = root.querySelector("#mobileHomePicks");
  if (!picks) return;
  picks.replaceChildren();

  const section = root.querySelector("#mobileHome");
  const product = (section?.dataset.tab === "tout" ? toutFeaturedProduct() : null) || products[0];
  if (!product) return;

  ["/images/pick-tout-1.png", "/images/pick-tout-2.png"].forEach((src) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-home__pick";
    button.dataset.mallProduct = product.id;
    button.setAttribute("aria-label", product.name);

    const img = document.createElement("img");
    img.alt = "";
    applyResponsiveImage(img, src, {
      eager: true,
      width: 240,
      widths: [160, 240, 360],
      sizes: "96px",
    });
    button.appendChild(img);
    picks.appendChild(button);
  });

  const price = document.createElement("span");
  price.className = "mobile-home__price mobile-home__price--hot";
  const eur = parseCatalogPriceEur(product);
  price.dataset.priceEur = String(eur);
  price.textContent = formatPrice(eur);
  picks.appendChild(price);
}

function storyCircle(id) {
  return STORY_BY_ID.get(id) || null;
}

function kidsCircle(page) {
  const group = KIDS_GROUPS.find((item) => item.id === page);
  if (!group) return storyCircle("hermes");
  return {
    id: group.id,
    i18n: RAIL_LABELS[page],
    image: group.image,
    page: group.id,
  };
}

function circleItems(ids) {
  return ids
    .map((id) => {
      const accessory = ACCESSORY_CIRCLES.find((item) => item.id === id);
      if (accessory) return accessory;
      const shoe = SHOE_CIRCLES.find((item) => item.id === id);
      if (shoe) return shoe;
      const hammamItem = HAMMAM_CIRCLES.find((item) => item.id === id);
      if (hammamItem) return hammamItem;
      const hommeItem = HOMME_CIRCLES.find((item) => item.id === id);
      if (hommeItem) return hommeItem;
      const ccItem = CC_CIRCLES.find((item) => item.id === id);
      if (ccItem) return ccItem;
      const parfumItem = PARFUM_CIRCLES.find((item) => item.id === id);
      if (parfumItem) return parfumItem;
      const department = DEPARTMENT_CIRCLES.find((item) => item.id === id);
      if (department) return department;
      const bagType = SAC_CIRCLES.find((item) => item.id === id);
      if (bagType) return bagType;
      const femmeItem = FEMME_CIRCLES.find((item) => item.id === id);
      if (femmeItem) return femmeItem;
      return KIDS_GROUPS.some((group) => group.id === id) ? kidsCircle(id) : storyCircle(id);
    })
    .filter(Boolean)
    .map((item) => ({ ...item, clearAudience: false }));
}

const CC_CIRCLES = [
  {
    id: "cc-sacs",
    i18n: "home.mall.sacs",
    image: "/images/circle-cc-sacs.jpg",
    filter: "sacs",
  },
  {
    id: "cc-accessories",
    i18n: "home.mall.bijoux",
    image: "/images/circle-cc-accessories.jpg",
    filter: "accessories",
  },
  {
    id: "cc-chaussures",
    i18n: "home.mall.chaussures",
    image: "/images/circle-cc-chaussures.jpg",
    filter: "chaussures",
  },
];

const PARFUM_CIRCLES = [
  {
    id: "parfum-racelia",
    i18n: "home.mall.parfumsRacelia",
    image: "/images/circle-parfum-racelia.jpg",
    filter: "parfums-racelia",
  },
  {
    id: "parfum-brumes",
    i18n: "home.mall.brumes",
    image: "/images/circle-parfum-brumes.jpg",
    filter: "brumes",
  },
  {
    id: "parfum-fragrances",
    i18n: "home.mall.parfumsFragrances",
    image: "/images/circle-parfum-fragrances.jpg",
    filter: "parfums-fragrances",
  },
];

const CIRCLE_FILTERS = {
  chaussures: /\b(chaussure|chaussures|shoe|shoes|escarpin|escarpins|slingback|sandale|sandales|sandal|botte|bottes|boot|boots|talon|talons|heel|heels|sneaker|sneakers|basket|baskets)\b/,
  accessories: /\b(bijou|bijoux|jewel|jewelry|jewellery|accessoire|accessoires|accessory|accessories|collier|necklace|boucle|boucles|earring|earrings|bracelet|bague|montre|watch|ceinture|belt|foulard|scarf|barrette)\b/,
  sacs: /\b(sac|sacs|bag|bags|flap|tote|clutch|hobo|pochette|bandouliere|shopper|bucket|handbag)\b/,
  brumes: /\b(brume|brumes|mist|mists)\b/,
  fragrances: /\b(parfum|parfums|fragrance|fragrances|cologne|eau)\b/,
};

function circleHaystack(product) {
  return [product?.name, product?.tag, product?.description, ...(product?.details || []), ...(product?.filters || []), ...(product?.sections || [])]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const BAG_SECTIONS = new Set(["mini-bags", "racelia-handbag", "moms-bags", "sacs"]);

export function productMatchesCircleFilter(product, filterId) {
  if ((product?.mallFilters || []).includes(filterId)) return true;
  const departments = product?.departments || [];
  if (
    (filterId === "sacs" && departments.includes("sacs")) ||
    (filterId === "accessories" && departments.includes("accessories")) ||
    (filterId === "chaussures" && departments.includes("chaussures"))
  ) {
    return true;
  }
  const hay = circleHaystack(product);
  if (filterId === "racelia-page-tendance") return mentionedAsNew(product) || mentionedAsBestSeller(product);
  if (filterId === "racelia-page-moms") {
    return (product?.mallFilters || []).includes("sacs-moms") || (product?.sections || []).includes("moms-bags");
  }
  if (filterId === "racelia-page-cc") {
    return (
      (product?.sections || []).includes("icons-cc") ||
      (product?.mallFilters || []).some((id) => id === "sacs-cc" || id === "accessories-cc") ||
      /\bcc\b/.test(hay)
    );
  }
  if (filterId === "racelia-page-parfums") {
    return (
      (product?.mallFilters || []).includes("parfums-racelia") ||
      ((product?.departments || []).includes("parfums") && /\bracelia\b/.test(hay))
    );
  }
  if (filterId === "brumes" || filterId === "parfums-racelia" || filterId === "parfums-fragrances") {
    const brume = CIRCLE_FILTERS.brumes.test(hay);
    const racelia = /\bracelia\b/.test(hay);
    const fragrance = CIRCLE_FILTERS.fragrances.test(hay);
    if (filterId === "brumes") return brume;
    if (filterId === "parfums-racelia") return racelia && !brume;
    return fragrance && !brume && !racelia;
  }
  const shoe = CIRCLE_FILTERS.chaussures.test(hay);
  const bag = CIRCLE_FILTERS.sacs.test(hay) || (product?.sections || []).some((section) => BAG_SECTIONS.has(section));
  const accessory = CIRCLE_FILTERS.accessories.test(hay);
  if (filterId === "chaussures") return shoe && !bag;
  if (filterId === "sacs") return bag && !shoe;
  if (filterId === "accessories") return accessory && !bag && !shoe;
  if (filterId === "homme-sacs" || filterId === "homme-accessories" || filterId === "homme-chaussures") {
    const audiences = product?.audiences || [];
    const homme = audiences.includes("homme") || /\bhomme\b/.test(hay);
    if (!homme) return false;
    if (filterId === "homme-sacs") return bag && !shoe;
    if (filterId === "homme-chaussures") return shoe && !bag;
    return accessory && !bag && !shoe;
  }
  if (filterId.startsWith("hammam-")) {
    const audiences = product?.audiences || [];
    const hammam = audiences.includes("hammam") || /\bhammam\b/.test(hay);
    if (!hammam) return false;
    if (filterId === "hammam-tendance") return mentionedAsNew(product) || mentionedAsBestSeller(product);
    if (filterId === "hammam-cosmetic-bags") return /\bcosmetic bags?\b/.test(hay);
    if (filterId === "hammam-tote") return /\btote\b/.test(hay);
    if (filterId === "hammam-rug") return /\brug pouches?\b/.test(hay);
    return false;
  }
  if (filterId.startsWith("chaussures-")) {
    if (!(shoe && !bag)) return false;
    if (filterId === "chaussures-tendance") return mentionedAsNew(product) || mentionedAsBestSeller(product);
    if (filterId === "chaussures-racelia") return /\bracelia\b/.test(hay);
    if (filterId === "chaussures-everyday-heels") return /\beveryday heels?\b/.test(hay);
    if (filterId === "chaussures-heels") return /\b(heels?|talons?|escarpins?)\b/.test(hay) && !/\beveryday heels?\b/.test(hay);
    if (filterId === "chaussures-boots") return /\b(boots?|bottes?)\b/.test(hay);
    if (filterId === "chaussures-sandals") return /\b(sandals?|sandales?)\b/.test(hay);
    if (filterId === "chaussures-sneakers") return /\b(sneakers?|baskets?)\b/.test(hay);
    if (filterId === "chaussures-clogs") return /\b(clogs?|sabots?)\b/.test(hay);
    return false;
  }
  if (filterId.startsWith("accessories-")) {
    if (bag || shoe) return false;
    if (filterId === "accessories-tendance") return accessory && (mentionedAsNew(product) || mentionedAsBestSeller(product));
    if (filterId === "accessories-racelia") return accessory && /\bracelia\b/.test(hay);
    if (filterId === "accessories-cc") return accessory && ((product?.sections || []).includes("icons-cc") || /\bcc\b/.test(hay));
    if (filterId === "accessories-hair-clips") return /\b(hair clips?|barrettes?)\b/.test(hay);
    if (filterId === "accessories-satin-scarves") return /\b(satin scarves|satin scarf|scarves|scarf|foulards?)\b/.test(hay);
    if (filterId === "accessories-watches") return /\b(watches?|montres?)\b/.test(hay);
    if (filterId === "accessories-belts") return /\b(belts?|ceintures?)\b/.test(hay);
    if (filterId === "accessories-bijoux") return /\b(bijoux|bijou|jewels?|jewelry|jewellery)\b/.test(hay);
    return false;
  }
  if (filterId.startsWith("sacs-")) {
    if (!(bag && !shoe)) return false;
    if (filterId === "sacs-tendance") return mentionedAsNew(product) || mentionedAsBestSeller(product);
    if (filterId === "sacs-racelia") return /\bracelia\b/.test(hay);
    if (filterId === "sacs-cc") return (product?.sections || []).includes("icons-cc") || /\bcc\b/.test(hay);
    if (filterId === "sacs-moms") return (product?.sections || []).includes("moms-bags");
    if (filterId === "sacs-laptop-bags") return /\b(laptop bags?|sacs? ordinateur)\b/.test(hay);
    if (filterId === "sacs-backpacks") return /\b(backpacks?|sacs? a dos)\b/.test(hay);
    if (filterId === "sacs-cosmetic-bags") return /\bcosmetic bags?\b/.test(hay);
    if (filterId === "sacs-housse") return /\b(housses?|laptop sleeves?)\b/.test(hay);
    return false;
  }
  if (filterId.startsWith("enfants-")) {
    const enfant = (product?.audiences || []).includes("enfants") || /\benfants?\b/.test(hay);
    if (!enfant) return false;
    if ((product?.kidsCategories || []).includes(filterId)) return true;
    if (filterId === "enfants-sacs-mom") return (product?.sections || []).includes("moms-bags") || /\b(sacs mom|moms bags|mom bags)\b/.test(hay);
    if (filterId === "enfants-handbag") return /\b(handbags?|sacs? a main)\b/.test(hay.replace(/-/g, ""));
    if (filterId === "enfants-dress") return /\b(dresses?|robes?)\b/.test(hay);
    return false;
  }
  return true;
}

const HOMME_CIRCLES = [
  {
    id: "homme-sacs",
    i18n: "mega.raceliaBags",
    image: "/images/circle-homme-sacs.jpg",
    filter: "homme-sacs",
  },
  {
    id: "homme-accessories",
    i18n: "home.mall.bijoux",
    image: "/images/circle-homme-accessories.jpg",
    filter: "homme-accessories",
  },
  {
    id: "homme-shoes",
    i18n: "home.mall.chaussures",
    image: "/images/circle-homme-shoes.jpg",
    filter: "homme-chaussures",
  },
];

const HAMMAM_CIRCLES = [
  {
    id: "hammam-cosmetic-bags",
    i18n: "home.mall.cosmeticBags",
    image: "/images/circle-cosmetic-bags.jpg",
    filter: "hammam-cosmetic-bags",
  },
  {
    id: "hammam-tote-bag",
    i18n: "home.mall.toteBag",
    image: "/images/circle-tote-bag.jpg",
    filter: "hammam-tote",
  },
  {
    id: "hammam-rug-pouches",
    i18n: "home.mall.rugPouches",
    image: "/images/circle-rug-pouches.jpg",
    filter: "hammam-rug",
  },
  {
    id: "hammam-tendance",
    i18n: "home.stories.tendance",
    image: STORY_BY_ID.get("tendance")?.image || "",
    filter: "hammam-tendance",
  },
];

const SHOE_CIRCLES = [
  {
    id: "chaussures-everyday-heels",
    i18n: "home.mall.everydayHeels",
    image: "/images/circle-everyday-heels.jpg",
    filter: "chaussures-everyday-heels",
  },
  {
    id: "chaussures-boots",
    i18n: "home.mall.boots",
    image: "/images/circle-boots.jpg",
    filter: "chaussures-boots",
  },
  {
    id: "chaussures-sandals",
    i18n: "home.mall.sandals",
    image: "/images/circle-sandals.jpg",
    filter: "chaussures-sandals",
  },
  {
    id: "chaussures-heels",
    i18n: "home.mall.heels",
    image: "/images/circle-heels.jpg",
    filter: "chaussures-heels",
  },
  {
    id: "chaussures-sneakers",
    i18n: "home.mall.sneakers",
    image: "/images/circle-sneakers.jpg",
    filter: "chaussures-sneakers",
  },
  {
    id: "chaussures-clogs",
    i18n: "home.mall.clogs",
    image: "/images/circle-clogs.jpg",
    filter: "chaussures-clogs",
  },
  {
    id: "chaussures-racelia",
    i18n: "home.stories.banane",
    image: STORY_BY_ID.get("banane")?.image || "",
    filter: "chaussures-racelia",
  },
  {
    id: "chaussures-tendance",
    i18n: "home.stories.tendance",
    image: STORY_BY_ID.get("tendance")?.image || "",
    filter: "chaussures-tendance",
  },
];

const ACCESSORY_CIRCLES = [
  {
    id: "accessories-hair-clips",
    i18n: "home.mall.hairClips",
    image: "/images/circle-hair-clips.jpg",
    filter: "accessories-hair-clips",
  },
  {
    id: "accessories-satin-scarves",
    i18n: "home.mall.satinScarves",
    image: "/images/circle-satin-scarves.jpg",
    filter: "accessories-satin-scarves",
  },
  {
    id: "accessories-watches",
    i18n: "home.mall.watches",
    image: "/images/circle-watches.jpg",
    filter: "accessories-watches",
  },
  {
    id: "accessories-belts",
    i18n: "home.mall.belts",
    image: "/images/circle-belts.jpg",
    filter: "accessories-belts",
  },
  {
    id: "accessories-bijoux",
    i18n: "home.mall.bijouxItem",
    image: "/images/circle-bijoux-item.jpg",
    filter: "accessories-bijoux",
  },
  {
    id: "accessories-cc",
    i18n: "home.mall.cc",
    image: STORY_BY_ID.get("year")?.image || "",
    filter: "accessories-cc",
  },
  {
    id: "accessories-racelia",
    i18n: "home.stories.banane",
    image: STORY_BY_ID.get("banane")?.image || "",
    filter: "accessories-racelia",
  },
  {
    id: "accessories-tendance",
    i18n: "home.stories.tendance",
    image: STORY_BY_ID.get("tendance")?.image || "",
    filter: "accessories-tendance",
  },
];

const SAC_CIRCLES = [
  {
    id: "sacs-laptop-bags",
    i18n: "home.mall.laptopBags",
    image: "/images/circle-laptop-bags.jpg",
    filter: "sacs-laptop-bags",
  },
  {
    id: "sacs-backpacks",
    i18n: "home.mall.backpacks",
    image: "/images/circle-backpacks.jpg",
    filter: "sacs-backpacks",
  },
  {
    id: "sacs-cosmetic-bags",
    i18n: "home.mall.cosmeticBags",
    image: "/images/circle-cosmetic-bags.jpg",
    filter: "sacs-cosmetic-bags",
  },
  {
    id: "sacs-housse",
    i18n: "home.mall.laptopSleeve",
    image: "/images/circle-housse.jpg",
    filter: "sacs-housse",
  },
  {
    id: "sacs-moms",
    i18n: "home.stories.luxe",
    image: STORY_BY_ID.get("luxe")?.image || "",
    filter: "sacs-moms",
  },
  {
    id: "sacs-cc",
    i18n: "home.mall.cc",
    image: STORY_BY_ID.get("year")?.image || "",
    filter: "sacs-cc",
  },
  {
    id: "sacs-racelia",
    i18n: "home.stories.banane",
    image: STORY_BY_ID.get("banane")?.image || "",
    filter: "sacs-racelia",
  },
  {
    id: "sacs-tendance",
    i18n: "home.stories.tendance",
    image: STORY_BY_ID.get("tendance")?.image || "",
    filter: "sacs-tendance",
  },
];

const FEMME_CIRCLES = [
  {
    id: "femme-mariee",
    i18n: "home.stories.modele",
    image: STORY_BY_ID.get("modele")?.image || "",
    tab: "mariee",
  },
  {
    id: "femme-sacs-mom",
    i18n: "home.stories.luxe",
    image: STORY_BY_ID.get("luxe")?.image || "",
    tab: "sacs",
    homeCircle: "sacs-moms",
  },
];

const DEPARTMENT_CIRCLES = [
  {
    id: "bijoux",
    i18n: "home.mall.bijoux",
    image: "/images/circle-bijoux.jpg",
    tab: "bijoux",
  },
  {
    id: "chaussures",
    i18n: "home.mall.chaussures",
    image: "/images/circle-chaussures.jpg",
    tab: "chaussures",
  },
];

function storyAsCircle(id, extra = {}) {
  const story = STORY_BY_ID.get(id);
  if (!story) return null;
  if (!extra.tab) return { ...story, ...extra };
  const { page, clearAudience, ...rest } = story;
  return { ...rest, ...extra };
}

function circlesFor(tabId) {
  const view = VIEWS[tabId];
  if (view) return circleItems(view.circles);
  return [
    storyAsCircle("tendance"),
    storyAsCircle("banane"),
    storyAsCircle("year"),
    DEPARTMENT_CIRCLES[0],
    DEPARTMENT_CIRCLES[1],
    storyAsCircle("lacos"),
    storyAsCircle("modele", { tab: "mariee" }),
    storyAsCircle("luxe", { tab: "sacs", homeCircle: "sacs-moms" }),
    storyAsCircle("grand", { tab: "hammam" }),
    storyAsCircle("louisvuitton", { tab: "homme" }),
    storyAsCircle("hermes", { tab: "enfants" }),
  ].filter(Boolean);
}

function forTwoRows(items) {
  const cols = Math.ceil(items.length / 2);
  const ordered = [];
  for (let col = 0; col < cols; col += 1) {
    for (let row = 0; row < 2; row += 1) {
      const item = items[row * cols + col];
      if (item) ordered.push(item);
    }
  }
  return ordered;
}

function imagesForRail(page, audience) {
  const products = getProductsForSection(page)
    .filter((product) => !audience || productMatchesAudience(product, audience))
    .map(withImages)
    .filter(Boolean);
  const productImage = products[0] ? getCardImages(products[0], 0)[0] : "";
  const story = STORY_ITEMS.find((item) => item.page === page) || STORY_BY_ID.get(PAGE_STORY[page]);
  const group = KIDS_GROUPS.find((item) => item.id === page);
  const urls = group
    ? [group.image, productImage, story?.image]
    : [productImage, story?.image, group?.image];
  return [...new Set(urls.filter(Boolean))];
}

function paintImage(img, urls) {
  const list = urls.filter(Boolean);
  if (!list.length) return;
  const show = (index) => {
    img.dataset.try = String(index);
    applyResponsiveImage(img, list[index], { width: 240, widths: [160, 240, 360], sizes: "104px" });
  };
  img.addEventListener("error", () => {
    const next = Number(img.dataset.try || 0) + 1;
    if (next < list.length) show(next);
  });
  show(0);
}

const KIDS_HERO = "/images/kids-hero.png";

const RAIL_IMAGES = {
  nouveautes: "/images/rail-nouveautes.jpg",
  "racelia-handbag": "/images/rail-sacs-racelia.jpg",
  mariee: "/images/rail-mariee.jpg",
};

function appendRails(track, pages, audience) {
  pages.forEach((page) => {
    const images = [RAIL_IMAGES[page], ...imagesForRail(page, audience)].filter(Boolean);
    if (!images.length) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-home__rail";
    button.dataset.mallPage = page;

    const img = document.createElement("img");
    img.alt = "";
    paintImage(img, images);

    const label = document.createElement("span");
    label.className = "mobile-home__rail-label";
    label.dataset.i18n = RAIL_LABELS[page] || page;
    label.textContent = t(label.dataset.i18n);
    button.setAttribute("aria-label", label.textContent);
    button.dataset.i18nAria = label.dataset.i18n;

    button.append(img, label);
    track.appendChild(button);
  });
}

function renderRails(root, tabId) {
  const track = root.querySelector("#mobileHomeRails");
  if (!track) return;
  const view = VIEWS[tabId];
  const pages = view?.rails || [];
  track.replaceChildren();
  track.parentElement?.classList.toggle("is-empty", !pages.length);
  if (!pages.length) return;
  appendRails(track, pages, view.audience);
}

function slidesFor(tabId) {
  const view = VIEWS[tabId];
  if (!view) return [];
  const slides = [
    { image: view.banner, kicker: view.kicker, title: view.title, titleIsKey: true, page: view.page },
  ];
  if (view.poster) return slides;
  productsForTab(tabId)
    .slice(0, 2)
    .forEach((product) => {
      const image = getCardImages(product, 0)[0];
      if (!image) return;
      slides.push({
        image,
        kicker: view.kicker,
        title: product.name,
        titleIsKey: false,
        page: view.page,
      });
    });
  return slides;
}

function applyKidsHeroPhoto(section) {
  const photo = section?.querySelector(".mobile-home__photo");
  if (!photo) return;
  applyResponsiveImage(photo, KIDS_HERO, {
    eager: true,
    sizes: "375px",
    widths: [375, 750],
  });
}

function applySlide(root, index, host) {
  const section = host || root.querySelector("#mobileHome");
  const slides = section?._slides || [];
  const slide = slides[index];
  if (!section || !slide) return;

  section.dataset.slide = String(index);
  const photo = section.querySelector(".mobile-home__photo");
  applyResponsiveImage(photo, slide.image, {
    eager: true,
    sizes: HERO_SIZES,
    widths: HERO_WIDTHS,
  });

  const kicker = section.querySelector(".mobile-home__campaign-kicker");
  const title = section.querySelector(".mobile-home__campaign-title");
  const cta = section.querySelector(".mobile-home__campaign-cta");
  if (kicker) {
    kicker.dataset.i18n = slide.kicker;
    kicker.textContent = t(slide.kicker);
  }
  if (title) {
    if (slide.titleIsKey) {
      title.dataset.i18n = slide.title;
      title.textContent = t(slide.title);
    } else {
      delete title.dataset.i18n;
      title.textContent = slide.title;
    }
  }
  if (cta) {
    if (slide.jump) {
      cta.dataset.mallJump = slide.jump;
      delete cta.dataset.mallPage;
    } else if (slide.page) {
      cta.dataset.mallPage = slide.page;
      delete cta.dataset.mallJump;
    }
  }

  section.querySelectorAll(".mobile-home__dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
}

function renderCampaign(root, tabId) {
  const section = root.querySelector("#mobileHome");
  const dots = root.querySelector("#mobileHomeDots");
  const view = VIEWS[tabId];
  if (!section || !dots) return;

  const photo = section.querySelector(".mobile-home__photo");
  if (!view) {
    section._slides = [];
    dots.replaceChildren();
    applyResponsiveImage(photo, toutHeroImage, {
      eager: true,
      sizes: HERO_SIZES,
      widths: HERO_WIDTHS,
    });
    const featured = toutFeaturedProduct();
    if (photo && featured) {
      photo.dataset.mallProduct = featured.id;
      photo.alt = featured.name;
    } else if (photo) {
      delete photo.dataset.mallProduct;
      photo.alt = "";
    }
    return;
  }
  if (photo) {
    delete photo.dataset.mallProduct;
    photo.alt = "";
  }

  const slides = slidesFor(tabId);
  section._slides = slides;
  dots.replaceChildren(
    ...slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "mobile-home__dot";
      dot.dataset.mallSlide = String(index);
      dot.setAttribute("aria-label", String(index + 1));
      return dot;
    })
  );
  applySlide(root, 0);
}

function raceliaPageCircles() {
  const image = (id) => STORY_BY_ID.get(id)?.image || "";
  return [
    { id: "tendance", i18n: "home.stories.tendance", image: image("tendance"), filter: "racelia-page-tendance" },
    { id: "luxe", i18n: "home.stories.luxe", image: image("luxe"), filter: "racelia-page-moms" },
    { id: "year", i18n: "home.stories.year", image: image("year"), filter: "racelia-page-cc" },
    { id: "lacos", i18n: "home.stories.lacos", image: image("lacos"), filter: "racelia-page-parfums" },
  ];
}

function paintCircles(track, items, audience) {
  if (!track) return;
  const fits = items.length <= 10;
  const key = `${fits ? "fit" : "scroll"}:${items.map((item) => `${item.id}:${item.filter || item.homeCircle || item.tab || item.page || ""}`).join(",")}`;
  if (track.dataset.key === key && track.childElementCount) return;
  track.dataset.key = key;
  track.classList.toggle("mobile-home__circles--fit", fits);
  track.scrollLeft = 0;

  track.replaceChildren(
    ...(fits ? items : forTwoRows(items)).map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mobile-home__circle";
      button.dataset.circleId = item.id;
      if (item.filter) {
        button.dataset.mallFilter = item.filter;
        button.setAttribute("aria-pressed", "false");
      } else if (item.tab) button.dataset.mallTab = item.tab;
      if (item.homeCircle) button.dataset.homeCircle = item.homeCircle;
      if (item.page) button.dataset.mallPage = item.page;
      if (item.clearAudience) button.dataset.clearAudience = "true";

      const thumb = document.createElement("span");
      thumb.className = "mobile-home__circle-thumb";
      const img = document.createElement("img");
      img.alt = "";
      const fallback = imagesForRail(item.page || item.id, audience);
      paintImage(img, [item.image, ...fallback.filter((url) => url !== item.image)]);
      thumb.appendChild(img);

      const label = document.createElement("span");
      label.className = "mobile-home__circle-label";
      label.dataset.i18n = item.i18n;
      label.textContent = t(item.i18n);
      button.dataset.i18nAria = item.i18n;
      button.setAttribute("aria-label", t(item.i18n));

      button.append(thumb, label);
      return button;
    })
  );
}

function showChosenPillFirst(track) {
  if (!track?.closest(".category-mall--pills")) return;
  const active = track.querySelector(".mobile-home__circle.is-active");
  const first = track.querySelector(".mobile-home__circle");
  if (active || (first && first.getBoundingClientRect().left < 0)) track.scrollLeft = 0;
}

function renderCircles(root, tabId) {
  const section = root.querySelector("#mobileHome");
  const track = section?.querySelector("#mobileHomeCircles");
  paintCircles(track, circlesFor(tabId), VIEWS[tabId]?.audience);
  const current = section?.dataset.circle || "";
  section?.querySelectorAll("[data-mall-filter]").forEach((button) => {
    const on = button.dataset.mallFilter === current;
    button.classList.toggle("is-active", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
  showChosenPillFirst(track);
}

function renderFeed(root, products) {
  const feed = root.querySelector("#mobileHomeFeed");
  const empty = root.querySelector("#mobileHomeEmpty");
  if (!feed) return;

  feed.replaceChildren();
  if (!products.length) {
    feed.hidden = true;
    if (empty) empty.hidden = false;
    return;
  }

  feed.hidden = false;
  if (empty) empty.hidden = true;
  const cards = products.map((product, index) =>
    createProduct(
      {
        id: product.id,
        name: product.name,
        images: getCardImages(product, 0),
      },
      index
    )
  );
  cards.forEach((card) => {
    card.classList.add("in");
    feed.appendChild(card);
  });
  initProductSliders(root, feed);
  syncWishlistHeartStates(root);
}

function syncPressed(section) {
  const tab = section.dataset.tab || "tout";
  const chip = section.dataset.chip || "foryou";
  section.querySelectorAll("[data-mall-tab]").forEach((button) => {
    const on = button.dataset.mallTab === tab;
    button.classList.toggle("is-active", on);
    if (on) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
  section.querySelectorAll("[data-mall-chip]").forEach((button) => {
    const on = button.dataset.mallChip === chip;
    button.classList.toggle("is-active", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

export function renderMobileHome(root) {
  const section = root.querySelector("#mobileHome");
  if (!section) return;

  const tab = TABS[section.dataset.tab] ? section.dataset.tab : "tout";
  const chip = section.dataset.chip || "foryou";
  section.dataset.tab = tab;
  const kids = tab === "enfants";
  section.classList.toggle("mobile-home--kids", kids);
  section.classList.toggle("mobile-home--audience", Boolean(VIEWS[tab]) && !kids);
  section.classList.toggle("mobile-home--poster", Boolean(VIEWS[tab]?.poster) && !kids);
  section.classList.toggle("category-mall--pills", tab === "sacs" || tab === "bijoux" || tab === "chaussures" || tab === "hammam" || tab === "homme");
  if (kids) delete section.dataset.kidsFilter;
  const circle = section.dataset.circle || "";
  const circleOk =
    (tab === "homme" && circle.startsWith("homme-")) ||
    (tab === "hammam" && circle.startsWith("hammam-")) ||
    (tab === "chaussures" && circle.startsWith("chaussures-")) ||
    (tab === "bijoux" && circle.startsWith("accessories-")) ||
    (tab === "sacs" && circle.startsWith("sacs-")) ||
    (tab === "enfants" && circle.startsWith("enfants-"));
  if (!circleOk) delete section.dataset.circle;
  const listed = productsForTab(tab);
  syncPressed(section);
  renderCampaign(root, tab);
  if (kids) applyKidsHeroPhoto(section);
  renderRails(root, tab);
  renderPicks(root, listed);
  renderCircles(root, tab);
  renderKidsBoard(section);
  const chipFilters = tab === "tout" && !kids;
  const activeChip = chipFilters ? chip : "foryou";
  let feedList = kids
    ? productsForKidsAge(listed, section.dataset.kidsFilter || "")
    : chipFilters
      ? storefrontProducts()
      : listed;
  if (homeFeedFilters.length) {
    feedList = feedList.filter((product) => productMatchesFilters(product, homeFeedFilters));
  }
  if (section.dataset.circle) {
    feedList = feedList.filter((product) => productMatchesCircleFilter(product, section.dataset.circle));
  }
  renderFeed(root, productsForChip(feedList, activeChip));
  applyI18n(section);
  updateTopbar(root);
}

function onMobileHomeClick(root, event) {
  const section = root.querySelector("#mobileHome");
  if (!section?.contains(event.target)) return;

  const slide = event.target.closest("[data-mall-slide]");
  if (slide) {
    applySlide(root, Number(slide.dataset.mallSlide));
    return;
  }

  const kidsAge = event.target.closest(".mobile-home__kids-head [data-kids-age]");
  if (kidsAge) {
    selectKidsAge(root, section, kidsAge.dataset.kidsAge || "");
    return;
  }

  const filter = event.target.closest("[data-mall-filter]");
  if (filter) {
    const next = filter.dataset.mallFilter || "";
    if (section.dataset.circle === next) delete section.dataset.circle;
    else section.dataset.circle = next;
    renderMobileHome(root);
    return;
  }

  const tab = event.target.closest("[data-mall-tab]");
  if (tab) {
    const next = tab.dataset.mallTab;
    section.dataset.tab = next;
    if (tab.dataset.homeCircle) section.dataset.circle = tab.dataset.homeCircle;
    const view = VIEWS[next];
    setSelectedAudience(view?.audience || "");
    root.dispatchEvent(new CustomEvent("racelia:audience-changed"));
    renderMobileHome(root);
    const tabButton = section.querySelector(`.mobile-home__tab[data-mall-tab="${next}"]`);
    const scroller = tabButton?.closest(".mobile-home__tabs");
    if (scroller && tabButton) {
      const left = tabButton.offsetLeft - (scroller.clientWidth - tabButton.offsetWidth) / 2;
      scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
    return;
  }

  const chip = event.target.closest("[data-mall-chip]");
  if (chip) {
    section.dataset.chip = chip.dataset.mallChip;
    renderMobileHome(root);
    return;
  }

  const action = event.target.closest("[data-mall-action]");
  if (action) {
    const name = action.dataset.mallAction;
    if (name === "shipping") root.dispatchEvent(new CustomEvent("racelia:open-shipping"));
    else if (name === "returns") root.dispatchEvent(new CustomEvent("racelia:open-returns"));
    else if (name === "style") root.dispatchEvent(new CustomEvent("racelia:open-style"));
    else if (name === "nouveautes") {
      root.dispatchEvent(new CustomEvent("racelia:open-category", { detail: { categoryKey: "nouveautes" } }));
    }
    return;
  }

  const circle = event.target.closest("[data-mall-page]");
  if (circle) {
    const leaveHomeAudience =
      (section.dataset.tab === "mariee" || section.dataset.tab === "femme") &&
      circle.classList.contains("mobile-home__circle");
    if (circle.dataset.clearAudience === "true" || leaveHomeAudience) {
      setSelectedAudience("");
      root.dispatchEvent(new CustomEvent("racelia:audience-changed"));
    }
    const detail = railCategoryDetail(circle, section.dataset.tab || "");
    root.dispatchEvent(new CustomEvent("racelia:open-category", { detail }));
    return;
  }

  const pick = event.target.closest("[data-mall-product]");
  if (!pick) return;
  root.dispatchEvent(
    new CustomEvent("racelia:open-product", { detail: { productId: pick.dataset.mallProduct } })
  );
}

function collectionProducts(pageKey) {
  let products = getProductsForSection(pageKey).map(withImages).filter(Boolean);
  const audience = getSelectedAudience();
  if (!audience) return products;
  const matched = products.filter((product) => productMatchesAudience(product, audience));
  return matched.length ? matched : products;
}

function bannerFor(pageKey, config, products) {
  if (config.banner) return config.banner;
  const story = STORY_BY_ID.get(config.story);
  if (story?.image && !LOGO_STORIES.has(config.story)) return story.image;
  const productImage = products[0] ? getCardImages(products[0], 0)[0] : "";
  return productImage || story?.image || heroImage;
}

function tabForPage(pageKey) {
  if (PAGE_TAB[pageKey]) return PAGE_TAB[pageKey];
  const audience = getSelectedAudience();
  return TABS[audience] ? audience : "tout";
}

function slidesForCollection(pageKey, config) {
  const products = collectionProducts(pageKey);
  const title = config.titleText || config.title;
  const titleIsKey = !config.titleText;
  const slides = [
    {
      image: bannerFor(pageKey, config, products),
      kicker: config.kicker,
      title,
      titleIsKey,
      jump: "products",
    },
  ];
  if (config.poster) return slides;
  products.slice(0, 2).forEach((product) => {
    const image = getCardImages(product, 0)[0];
    if (!image) return;
    slides.push({
      image,
      kicker: config.kicker,
      title: product.name,
      titleIsKey: false,
      jump: "products",
    });
  });
  return slides;
}

export function renderCategoryMall(root, pageKey) {
  const page = root.querySelector("#categoryPage");
  const mall = root.querySelector("#categoryMall");
  if (!page || !mall) return;
  const config = COLLECTION_MALL[pageKey];
  if (!config) {
    page.classList.remove("category-page--mall");
    mall.classList.remove("category-mall--kids", "category-mall--tendance", "category-mall--cc", "category-mall--pills", "mobile-home--poster");
    mall.hidden = true;
    return;
  }

  page.classList.add("category-page--mall");
  mall.hidden = false;
  const kidsPage = KIDS_PAGE_IDS.has(pageKey);
  mall.classList.toggle("category-mall--kids", kidsPage);
  mall.classList.toggle("category-mall--tendance", pageKey === "nouveautes");
  mall.classList.toggle("category-mall--cc", pageKey === "icons-cc");
  mall.classList.toggle("category-mall--pills", pageKey === "icons-cc" || pageKey === "racelia-handbag" || pageKey === "parfums-feminins");
  mall.classList.toggle("mobile-home--poster", Boolean(config.poster));
  if (mall.dataset.circlePage !== pageKey) {
    delete mall.dataset.circle;
    if (pageKey === "icons-cc" || pageKey === "parfums-feminins" || pageKey === "racelia-handbag") mall.dataset.circlePage = pageKey;
    else delete mall.dataset.circlePage;
  }
  if (pageKey === "nouveautes") {
    if (!mall.dataset.chip) mall.dataset.chip = "foryou";
  } else {
    delete mall.dataset.chip;
  }
  mall.querySelectorAll("[data-mall-chip]").forEach((button) => {
    const on = button.dataset.mallChip === (mall.dataset.chip || "foryou");
    button.classList.toggle("is-active", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
  const active = tabForPage(pageKey);
  mall.querySelectorAll("[data-mall-tab]").forEach((button) => {
    const on = button.dataset.mallTab === active;
    button.classList.toggle("is-active", on);
    if (on) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
  const scroller = mall.querySelector(".mobile-home__tabs");
  const currentTab = scroller?.querySelector(".mobile-home__tab.is-active");
  if (scroller && currentTab) {
    scroller.scrollLeft = Math.max(0, currentTab.offsetLeft - (scroller.clientWidth - currentTab.offsetWidth) / 2);
  }

  const slides = slidesForCollection(pageKey, config);
  mall._slides = slides;
  const dots = mall.querySelector(".mobile-home__dots");
  if (dots) {
    dots.replaceChildren(
      ...slides.map((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "mobile-home__dot";
        dot.dataset.mallSlide = String(index);
        dot.setAttribute("aria-label", String(index + 1));
        return dot;
      })
    );
  }
  applySlide(root, 0, mall);
  if (kidsPage) applyKidsHeroPhoto(mall);

  const rails = mall.querySelector("#categoryMallRails");
  if (rails) {
    rails.replaceChildren();
    const pages = config.rails || [];
    rails.parentElement?.classList.toggle("is-empty", !pages.length);
    if (pages.length) appendRails(rails, pages, getSelectedAudience());
  }
  const circles = pageKey === "racelia-handbag" ? raceliaPageCircles() : circleItems(config.circles || []);
  const circleTrack = mall.querySelector("#categoryMallCircles");
  paintCircles(circleTrack, circles, getSelectedAudience());
  mall.querySelectorAll("[data-mall-filter]").forEach((button) => {
    const on = button.dataset.mallFilter === (mall.dataset.circle || "");
    button.classList.toggle("is-active", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
  mall.querySelectorAll(".mobile-home__circle[data-circle-id]").forEach((button) => {
    if (button.dataset.mallFilter) {
      const pinned =
        pageKey === "racelia-handbag" &&
        !mall.dataset.circle &&
        mall.dataset.pin === "tendance" &&
        button.dataset.circleId === "tendance";
      if (pinned) {
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");
      }
      return;
    }
    const on = pageKey === "racelia-handbag" && mall.dataset.pin === "tendance" && button.dataset.circleId === "tendance";
    button.classList.toggle("is-active", on);
    if (on) button.setAttribute("aria-pressed", "true");
    else button.removeAttribute("aria-pressed");
  });
  showChosenPillFirst(circleTrack);
  renderKidsBoard(mall);
  applyI18n(mall);
  updateTopbar(root);
}

const KIDS_AGE_PAGES = {
  "06": ["fille-0-6", "garcon-0-6"],
  "614": ["fille-6-14", "garcon-6-14"],
};

function kidsBoardItems() {
  const groupImage = (id) => KIDS_GROUPS.find((group) => group.id === id)?.image || "";
  return [
    { page: "fille-0-6", age: "06", i18n: "mega.girl06", image: groupImage("fille-0-6") },
    { page: "fille-6-14", age: "614", i18n: "mega.girl614", image: groupImage("fille-6-14") },
    { page: "garcon-0-6", age: "06", i18n: "mega.boy06", image: groupImage("garcon-0-6") },
    { page: "garcon-6-14", age: "614", i18n: "mega.boy614", image: groupImage("garcon-6-14") },
    { page: "petite-princesse", i18n: "home.stories.hermes", image: STORY_BY_ID.get("hermes")?.image || "" },
    { page: "mini-bags", i18n: "mega.miniBags", image: imagesForRail("mini-bags")[0] || "" },
    { page: "nouveautes", i18n: "mega.new", image: imagesForRail("nouveautes")[0] || "" },
  ];
}

function productsForKidsAge(products, age) {
  const pages = KIDS_AGE_PAGES[age];
  if (!pages) return products;
  const ids = new Set(pages);
  return products.filter((product) => ids.has(product.kidsGroup));
}

function selectKidsAge(root, host, age) {
  host.dataset.kidsFilter = age;
  delete host.dataset.kidsAge;
  renderKidsBoard(host);
  if (host.id !== "mobileHome") return;
  let listed = productsForKidsAge(productsForTab("enfants"), age);
  if (host.dataset.circle) listed = listed.filter((product) => productMatchesCircleFilter(product, host.dataset.circle));
  renderFeed(root, productsForChip(listed, host.dataset.chip || "foryou"));
}

function homeKidsItems() {
  return [
    { filter: "enfants-sacs-mom", i18n: "home.stories.luxe", image: STORY_BY_ID.get("luxe")?.image || "" },
    { filter: "enfants-handbag", i18n: "home.mall.handbag", image: "/images/kids-handbag.jpg" },
    { filter: "enfants-dress", i18n: "home.mall.dress", image: "/images/kids-dress.jpg" },
  ];
}

function renderKidsBoard(host) {
  const grid = host.querySelector(".mobile-home__kids-grid");
  if (!grid) return;
  const age = host.dataset.kidsFilter || "";
  host.querySelectorAll(".mobile-home__kids-head [data-kids-age]").forEach((button) => {
    const on = (button.dataset.kidsAge || "") === age;
    button.classList.toggle("is-active", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
  const items = host.id === "mobileHome"
    ? homeKidsItems()
    : age
      ? kidsBoardItems().filter((item) => item.age === age)
      : kidsBoardItems();
  grid.replaceChildren(
    ...items.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mobile-home__kids-item";
      if (item.filter) {
        button.dataset.mallFilter = item.filter;
        const on = host.dataset.circle === item.filter;
        button.classList.toggle("is-active", on);
        button.setAttribute("aria-pressed", on ? "true" : "false");
      } else if (item.page) button.dataset.mallPage = item.page;
      button.dataset.i18nAria = item.i18n;
      button.setAttribute("aria-label", t(item.i18n));

      const thumb = document.createElement("span");
      thumb.className = "mobile-home__kids-thumb";
      const img = document.createElement("img");
      img.alt = "";
      paintImage(img, [item.image, ...imagesForRail(item.page)].filter(Boolean));
      thumb.appendChild(img);

      const label = document.createElement("span");
      label.className = "mobile-home__kids-label";
      label.dataset.i18n = item.i18n;
      label.textContent = t(item.i18n);
      button.append(thumb, label);
      return button;
    })
  );
}

function onCategoryMallClick(root, event) {
  const mall = root.querySelector("#categoryMall");
  if (!mall?.contains(event.target)) return;

  const slide = event.target.closest("[data-mall-slide]");
  if (slide) {
    applySlide(root, Number(slide.dataset.mallSlide), mall);
    return;
  }

  const kidsAge = event.target.closest(".mobile-home__kids-head [data-kids-age]");
  if (kidsAge) {
    selectKidsAge(root, mall, kidsAge.dataset.kidsAge || "");
    return;
  }

  const circle = event.target.closest("[data-mall-filter]");
  if (circle) {
    const next = circle.dataset.mallFilter || "";
    const pinnedTendance = !mall.dataset.circle && mall.dataset.pin === "tendance" && next === "racelia-page-tendance";
    if (mall.dataset.circle === next || pinnedTendance) {
      delete mall.dataset.circle;
      delete mall.dataset.pin;
    } else {
      mall.dataset.circle = next;
      if (next !== "racelia-page-tendance") delete mall.dataset.pin;
    }
    mall.querySelectorAll("[data-mall-filter]").forEach((button) => {
      const on = button.dataset.mallFilter === (mall.dataset.circle || "");
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
    root.dispatchEvent(new CustomEvent("racelia:category-chip"));
    return;
  }

  const tab = event.target.closest("[data-mall-tab]");
  if (tab) {
    root.dispatchEvent(new CustomEvent("racelia:open-home-tab", { detail: { tab: tab.dataset.mallTab } }));
    return;
  }

  if (event.target.closest("[data-mall-jump]")) {
    root.querySelector("#categoryProducts")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const chip = event.target.closest("[data-mall-chip]");
  if (chip) {
    mall.dataset.chip = chip.dataset.mallChip || "foryou";
    mall.querySelectorAll("[data-mall-chip]").forEach((button) => {
      const on = button.dataset.mallChip === mall.dataset.chip;
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
    root.dispatchEvent(new CustomEvent("racelia:category-chip"));
    return;
  }

  const page = event.target.closest("[data-mall-page]");
  if (!page) return;
  const detail = railCategoryDetail(page, root.querySelector("#mobileHome")?.dataset.tab || "");
  root.dispatchEvent(new CustomEvent("racelia:open-category", { detail }));
}

export function applyHomeTab(root, tabId) {
  const section = root.querySelector("#mobileHome");
  if (!section) return;
  const next = TABS[tabId] ? tabId : "tout";
  section.dataset.tab = next;
  setSelectedAudience(VIEWS[next]?.audience || "");
  renderMobileHome(root);
}

export function initMobileHome(root) {
  const section = root.querySelector("#mobileHome");
  if (section) {
    if (section.dataset.bound !== "true") {
      section.dataset.bound = "true";
      section.addEventListener("click", (event) => onMobileHomeClick(root, event));
    }
    renderMobileHome(root);
  }

  const mall = root.querySelector("#categoryMall");
  if (mall && mall.dataset.bound !== "true") {
    mall.dataset.bound = "true";
    mall.addEventListener("click", (event) => onCategoryMallClick(root, event));
  }

  if (root.dataset.wishlistChipBound !== "true") {
    root.dataset.wishlistChipBound = "true";
    root.addEventListener("racelia:wishlist-changed", () => {
      const home = root.querySelector("#mobileHome");
      if (home && !home.hidden && home.dataset.chip === "favoris") renderMobileHome(root);
      const categoryMall = root.querySelector("#categoryMall");
      if (categoryMall && !categoryMall.hidden && categoryMall.dataset.chip === "favoris") {
        root.dispatchEvent(new CustomEvent("racelia:category-chip"));
      }
    });
  }
}
