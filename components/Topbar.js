import { menuIcon, searchIcon, accountIcon, cartIcon, closeIcon } from "./icons.js";

export function createTopbar() {
  const header = document.createElement("header");
  header.className = "topbar";

  const menuBtn = document.createElement("button");
  menuBtn.className = "icon-btn";
  menuBtn.id = "menuBtn";
  menuBtn.setAttribute("aria-label", "Menu");
  menuBtn.innerHTML = menuIcon;

  const searchBtn = document.createElement("button");
  searchBtn.className = "icon-btn";
  searchBtn.id = "topbarSearchBtn";
  searchBtn.type = "button";
  searchBtn.setAttribute("aria-label", "Rechercher");
  searchBtn.setAttribute("aria-expanded", "false");
  searchBtn.setAttribute("aria-controls", "topbarSearchPanel");
  searchBtn.innerHTML = searchIcon;

  const searchPanel = document.createElement("div");
  searchPanel.className = "topbar-search";
  searchPanel.id = "topbarSearchPanel";
  searchPanel.hidden = true;

  const searchForm = document.createElement("form");
  searchForm.className = "topbar-search__form";
  searchForm.id = "topbarSearchForm";
  searchForm.setAttribute("role", "search");

  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.id = "topbarSearchInput";
  searchInput.className = "topbar-search__input";
  searchInput.placeholder = "Rechercher";
  searchInput.setAttribute("aria-label", "Rechercher");
  searchInput.autocomplete = "off";

  const searchClose = document.createElement("button");
  searchClose.type = "button";
  searchClose.className = "icon-btn topbar-search__close";
  searchClose.id = "topbarSearchClose";
  searchClose.setAttribute("aria-label", "Fermer la recherche");
  searchClose.innerHTML = closeIcon;

  searchForm.append(searchInput, searchClose);
  searchPanel.appendChild(searchForm);

  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = "/";
  brand.setAttribute("aria-label", "Accueil RACÈLIA");
  brand.textContent = "RACÈLIA";

  const actions = document.createElement("div");
  actions.className = "topbar__actions";

  const cartBtn = document.createElement("button");
  cartBtn.className = "icon-btn topbar-cart-btn";
  cartBtn.id = "topbarCartBtn";
  cartBtn.type = "button";
  cartBtn.hidden = true;
  cartBtn.setAttribute("aria-label", "Panier");
  cartBtn.innerHTML = `
    ${cartIcon}
    <span class="topbar-cart-badge" id="topbarCartBadge">0</span>
  `;

  const accountBtn = document.createElement("button");
  accountBtn.className = "icon-btn js-account-open topbar-account-btn";
  accountBtn.id = "topbarAccountBtn";
  accountBtn.type = "button";
  accountBtn.setAttribute("aria-label", "Compte");
  accountBtn.innerHTML = `
    <span class="account-btn-icon">${accountIcon}</span>
    <span class="topbar-account-avatar avatar-wrap" hidden>
      <span class="avatar-placeholder"></span>
    </span>
  `;

  actions.append(cartBtn, accountBtn);
  header.append(menuBtn, searchBtn, brand, actions, searchPanel);
  return header;
}
