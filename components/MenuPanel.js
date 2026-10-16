import { wishlistIcon, accountIcon, closeIcon } from "./icons.js";
import { STORY_ITEMS } from "../js/homeStories.js";
import { deliverySrc } from "../js/imageDelivery.js";
import { createRaceliaStyleView } from "./RaceliaStyleView.js";

const storyImage = (id) => STORY_ITEMS.find((item) => item.id === id)?.image || "";

const MENU_PICKS = [
  { label: "Femme", i18n: "audience.femme", image: "/images/menu-femme.jpg", tab: "femme" },
  { label: "Sacs", i18n: "nav.menuSacs", image: "/images/menu-sacs.jpg", tab: "sacs" },
  { label: "Enfants", i18n: "audience.enfants", image: storyImage("hermes"), tab: "enfants" },
  { label: "Mariée", i18n: "audience.mariee", image: "/images/menu-mariee.jpg", tab: "mariee" },
  { label: "Hammam", i18n: "audience.hammam", image: "/images/menu-hammam.jpg", tab: "hammam" },
  { label: "Homme", i18n: "audience.homme", image: storyImage("louisvuitton"), tab: "homme" },
  { label: "Accessories", i18n: "home.mall.bijoux", image: "/images/menu-accessories.jpg", tab: "bijoux" },
  { label: "Chaussures", i18n: "home.mall.chaussures", image: "/images/menu-chaussures.jpg", tab: "chaussures" },
  {
    label: "Parfums Féminins",
    i18n: "home.stories.lacos",
    image: storyImage("lacos"),
    page: "parfums-feminins",
    clearAudience: true,
  },
];

const catalogueIcon = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4.5C5 3.5 8.2 4.2 12 6.5 15.8 4.2 19 3.5 22 4.5V19.5c-3-1-6.2-.3-10 2-3.8-2.3-7-3-10-2V4.5z"/><path d="M12 6.5V21.5"/></svg>`;
const languageIcon = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/></svg>`;
const dashboardIcon = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="4"/><rect x="14" y="10" width="7" height="11"/><rect x="3" y="13" width="7" height="8"/></svg>`;

function pickButton(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "menu-pick";
  if (item.tab) {
    button.classList.add("js-menu-home-tab");
    button.dataset.homeTab = item.tab;
  }
  if (item.page) {
    button.classList.add("js-menu-category");
    button.dataset.page = item.page;
  }
  if (item.clearAudience) button.dataset.clearAudience = "true";

  const image = document.createElement("img");
  image.alt = "";
  image.width = 46;
  image.height = 46;
  image.decoding = "async";
  image.loading = "lazy";
  image.src = deliverySrc(item.image, 96);

  const label = document.createElement("span");
  label.dataset.i18n = item.i18n;
  label.textContent = item.label;
  button.append(image, label);
  return button;
}

function toolButton({ className, i18n, label, icon, page, hidden }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `menu-tool ${className}`;
  if (page) button.dataset.page = page;
  if (hidden) button.hidden = true;
  button.innerHTML = `<span class="menu-tool__icon" aria-hidden="true">${icon}</span><span data-i18n="${i18n}">${label}</span>`;
  return button;
}

export function createMenuPanel() {
  const backdrop = document.createElement("div");
  backdrop.className = "menu-backdrop";
  backdrop.id = "menuBackdrop";

  const panel = document.createElement("aside");
  panel.className = "menu-panel";
  panel.id = "menuPanel";
  panel.setAttribute("aria-hidden", "true");

  const head = document.createElement("div");
  head.className = "menu-head";

  const menuTab = document.createElement("button");
  menuTab.className = "menu-tab active";
  menuTab.id = "menuTab";
  menuTab.type = "button";
  menuTab.dataset.i18n = "nav.menu";
  menuTab.textContent = "MENU";

  const styleTab = document.createElement("button");
  styleTab.className = "menu-tab muted";
  styleTab.id = "styleTab";
  styleTab.type = "button";
  styleTab.textContent = "#RACÈLIASTYLE";

  const spacer = document.createElement("span");
  spacer.className = "spacer";

  const wishlistBtn = document.createElement("button");
  wishlistBtn.className = "icon-btn js-menu-wishlist-open";
  wishlistBtn.id = "menuWishlistBtn";
  wishlistBtn.type = "button";
  wishlistBtn.setAttribute("aria-label", "Liste de souhaits");
  wishlistBtn.innerHTML = wishlistIcon;

  const accountBtn = document.createElement("button");
  accountBtn.className = "icon-btn js-account-open menu-account-btn";
  accountBtn.id = "menuAccountBtn";
  accountBtn.type = "button";
  accountBtn.setAttribute("aria-label", "Compte");
  accountBtn.innerHTML = `
    <span class="account-btn-icon">${accountIcon}</span>
    <span class="menu-account-avatar avatar-wrap" hidden>
      <span class="avatar-placeholder"></span>
    </span>
  `;

  const closeBtn = document.createElement("button");
  closeBtn.className = "icon-btn";
  closeBtn.id = "menuClose";
  closeBtn.setAttribute("aria-label", "Fermer");
  closeBtn.innerHTML = closeIcon;

  head.append(menuTab, styleTab, spacer, wishlistBtn, accountBtn, closeBtn);

  const menuView = document.createElement("div");
  menuView.className = "menu-view is-active";
  menuView.id = "menuView";

  const picks = document.createElement("div");
  picks.className = "menu-picks";
  picks.id = "menuDefaultList";
  MENU_PICKS.forEach((item) => picks.appendChild(pickButton(item)));

  const tools = document.createElement("div");
  tools.className = "menu-tools";
  tools.append(
    toolButton({
      className: "js-menu-category",
      i18n: "nav.catalogue",
      label: "CATALOGUE GROSSISTE",
      icon: catalogueIcon,
      page: "catalogue-grossiste",
    }),
    toolButton({
      className: "js-menu-wishlist-open",
      i18n: "nav.wishlist",
      label: "Liste d'envies",
      icon: wishlistIcon,
    }),
    toolButton({
      className: "js-account-open",
      i18n: "ui.account",
      label: "Compte",
      icon: accountIcon,
    })
  );

  const language = document.createElement("div");
  language.className = "menu-tool menu-tool--lang";
  language.id = "menuLang";
  language.innerHTML = `
    <span class="menu-tool__icon" aria-hidden="true">${languageIcon}</span>
    <span data-i18n="nav.language">Langue</span>
    <span class="menu-lang">
      <button type="button" data-lang="fr" aria-pressed="true">FR</button>
      <button type="button" data-lang="en" aria-pressed="false">EN</button>
    </span>
  `;
  tools.appendChild(language);
  tools.appendChild(
    toolButton({
      className: "js-dashboard-open js-dashboard-menu-item",
      i18n: "nav.dashboard",
      label: "TABLEAU DE BORD",
      icon: dashboardIcon,
      hidden: true,
    })
  );

  menuView.append(picks, tools);
  panel.append(head, menuView, createRaceliaStyleView());

  const fragment = document.createDocumentFragment();
  fragment.append(backdrop, panel);
  return fragment;
}
