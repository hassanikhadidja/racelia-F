import { wishlistIcon, accountIcon, closeIcon, searchIcon } from "./icons.js";
import { menuItems } from "../js/data.js";
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
  wishlistBtn.setAttribute("aria-label", "Wishlist");
  wishlistBtn.innerHTML = wishlistIcon;

  const accountBtn = document.createElement("button");
  accountBtn.className = "icon-btn js-account-open menu-account-btn";
  accountBtn.id = "menuAccountBtn";
  accountBtn.type = "button";
  accountBtn.setAttribute("aria-label", "Account");
  accountBtn.innerHTML = `<span class="account-btn-icon">${accountIcon}</span>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "icon-btn";
  closeBtn.id = "menuClose";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.innerHTML = closeIcon;

  head.append(menuTab, styleTab, spacer, wishlistBtn, accountBtn, closeBtn);

  const menuView = document.createElement("div");
  menuView.className = "menu-view is-active";
  menuView.id = "menuView";

  const search = document.createElement("div");
  search.className = "menu-search";
  search.innerHTML = `<input type="text" placeholder="Search">${searchIcon}`;

  const list = document.createElement("ul");
  list.className = "menu-list";

  menuItems.forEach((item) => {
    const li = document.createElement("li");
    if (item.gap) li.classList.add("gap");
    if (item.sale) li.classList.add("sale");
    if (item.muted) li.classList.add("muted");
    if (item.submenu) li.classList.add("menu-list__group");
    if (item.action === "new-arrivals") li.classList.add("js-menu-new-arrivals");
    if (item.action === "dashboard") {
      li.classList.add("js-dashboard-open", "js-dashboard-menu-item");
      li.hidden = true;
    }
    if (item.action === "blogs") li.classList.add("js-menu-blogs-open");

    if (item.submenu) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "menu-list__row js-menu-handbags-toggle";
      row.setAttribute("aria-expanded", "false");

      const label = document.createElement("span");
      label.textContent = item.label;
      row.appendChild(label);

      const chev = document.createElement("span");
      chev.className = "chev";
      chev.setAttribute("aria-hidden", "true");
      row.appendChild(chev);

      const sub = document.createElement("ul");
      sub.className = "menu-list__sub";

      item.submenu.forEach((subItem) => {
        const subLi = document.createElement("li");
        subLi.className = "js-menu-category";
        subLi.dataset.page = subItem.page;
        subLi.textContent = subItem.label;
        sub.appendChild(subLi);
      });

      li.append(row, sub);
    } else {
      const label = document.createElement("span");
      label.textContent = item.label;
      li.appendChild(label);

      if (item.tag) {
        const tag = document.createElement("span");
        tag.className = "new-tag";
        tag.textContent = item.tag;
        li.appendChild(tag);
      } else if (item.chevron) {
        const chev = document.createElement("span");
        chev.className = "chev";
        li.appendChild(chev);
      }
    }

    list.appendChild(li);
  });

  menuView.append(search, list);
  panel.append(head, menuView, createRaceliaStyleView());

  const fragment = document.createDocumentFragment();
  fragment.append(backdrop, panel);
  return fragment;
}
