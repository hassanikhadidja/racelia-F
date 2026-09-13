import { wishlistIcon, accountIcon, closeIcon, chevronIcon } from "./icons.js";
import { menuItems } from "../js/data.js";
import { AUDIENCES, KIDS_GROUPS } from "../js/audience.js";
import { createRaceliaStyleView } from "./RaceliaStyleView.js";

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

  const audiences = document.createElement("nav");
  audiences.className = "menu-audiences";
  audiences.setAttribute("aria-label", "Univers");
  audiences.setAttribute("data-i18n-aria", "nav.univers");
  AUDIENCES.forEach((audience) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "menu-audiences__btn js-menu-audience";
    btn.dataset.audience = audience.id;
    btn.dataset.i18n = `nav.${audience.id}`;
    btn.textContent = audience.label.toUpperCase();
    audiences.appendChild(btn);
  });

  const list = document.createElement("ul");
  list.className = "menu-list";
  list.id = "menuDefaultList";

  const adminList = document.createElement("ul");
  adminList.className = "menu-list menu-list--admin";

  const kidsList = document.createElement("ul");
  kidsList.className = "menu-kids";
  kidsList.id = "menuKidsList";
  kidsList.hidden = true;
  KIDS_GROUPS.forEach((group) => {
    const li = document.createElement("li");
    li.className = "menu-kids__item js-menu-category";
    li.dataset.page = group.id;
    li.innerHTML = `
      <img src="${group.image}" alt="" />
      <span class="menu-kids__copy">
        <span class="menu-kids__name">${group.label}</span>
        <span class="menu-kids__age">${group.age}</span>
      </span>
    `;
    kidsList.appendChild(li);
  });

  menuItems.forEach((item) => {
    const li = document.createElement("li");
    if (item.gap) li.classList.add("gap");
    if (item.sale) li.classList.add("sale");
    if (item.muted) li.classList.add("muted");
    if (item.submenu) li.classList.add("menu-list__group");
    if (item.action === "new-arrivals") li.classList.add("js-menu-new-arrivals");
    if (item.action === "dashboard") {
      li.classList.add("js-dashboard-open", "js-dashboard-menu-item", "muted");
      li.hidden = true;
      const dashLabel = document.createElement("span");
      if (item.i18n) dashLabel.dataset.i18n = item.i18n;
      dashLabel.textContent = item.label;
      li.appendChild(dashLabel);
      adminList.appendChild(li);
      return;
    }
    if (item.action === "client-profile") {
      li.classList.add("js-client-profile-open", "js-client-profile-menu-item");
      li.hidden = true;
    }
    if (item.action === "blogs") li.classList.add("js-menu-blogs-open");
    if (item.action === "boutiques") li.classList.add("js-menu-boutiques-open");
    if (item.page) {
      li.classList.add("js-menu-category");
      li.dataset.page = item.page;
    }

    if (item.submenu) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "menu-list__row js-menu-handbags-toggle";
      row.setAttribute("aria-expanded", "false");

      const label = document.createElement("span");
      if (item.i18n) label.dataset.i18n = item.i18n;
      label.textContent = item.label;
      row.appendChild(label);

      const chev = document.createElement("span");
      chev.className = "chev";
      chev.setAttribute("aria-hidden", "true");
      chev.innerHTML = chevronIcon;
      row.appendChild(chev);

      const sub = document.createElement("ul");
      sub.className = "menu-list__sub";

      item.submenu.forEach((subItem) => {
        const subLi = document.createElement("li");
        subLi.className = "js-menu-category";
        subLi.dataset.page = subItem.page;
        if (subItem.i18n) subLi.dataset.i18n = subItem.i18n;
        subLi.textContent = subItem.label;
        sub.appendChild(subLi);
      });

      li.append(row, sub);
    } else {
      const label = document.createElement("span");
      if (item.i18n) label.dataset.i18n = item.i18n;
      label.textContent = item.label;
      li.appendChild(label);

      if (item.tag) {
        const tag = document.createElement("span");
        tag.className = "new-tag";
        if (item.tagI18n) tag.dataset.i18n = item.tagI18n;
        tag.textContent = item.tag;
        li.appendChild(tag);
      } else if (item.chevron) {
        const chev = document.createElement("span");
        chev.className = "chev";
        chev.setAttribute("aria-hidden", "true");
        chev.innerHTML = chevronIcon;
        li.appendChild(chev);
      }
    }

    list.appendChild(li);
  });

  menuView.append(audiences, list, kidsList, adminList);
  panel.append(head, menuView, createRaceliaStyleView());

  const fragment = document.createDocumentFragment();
  fragment.append(backdrop, panel);
  return fragment;
}
