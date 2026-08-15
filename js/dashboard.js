import { getDashboardTabFromHash, writeRoute, shouldIgnoreHashChange } from "./route.js";
import {
  initDashboardAccount,
  closeDashboardAccountOverlay,
} from "./dashboardAccount.js";
import {
  initDashboardReviews,
  closeDashboardReviewsOverlay,
} from "./dashboardReviews.js";
import {
  initDashboardRaceliaStyle,
  closeDashboardRaceliaStyleOverlay,
} from "./dashboardRaceliaStyle.js";
import {
  initDashboardUsers,
  closeDashboardUsersOverlay,
} from "./dashboardUsers.js";
import {
  initDashboardEmails,
  closeDashboardEmailsOverlay,
  renderDashboardEmails,
} from "./dashboardEmails.js";
import {
  initDashboardBlogs,
  closeDashboardBlogsOverlay,
} from "./dashboardBlogs.js";
import { initTargetOrders } from "./dashboardTargetOrders.js";
import { initDashboardOrders } from "./dashboardOrders.js";
import { initDashboardOverview, renderDashboardOverview } from "./dashboardOverview.js";
import { initDashboardAnalytics, renderDashboardAnalytics } from "./dashboardAnalytics.js";
import {
  initDashboardProducts,
  closeDashboardProductsOverlay,
} from "./dashboardProducts.js";

const TAB_STORAGE_KEY = "racelia-dashboard-tab";

function createTabNav(page) {
  const nav = page.querySelector(".bottom-nav");
  const indicator = page.querySelector(".nav-indicator");
  const tabs = [...page.querySelectorAll(".bottom-nav-item[role=tab]")];
  const panels = [...page.querySelectorAll("main .content")];

  const moveIndicator = (activeTab) => {
    const tab = activeTab || tabs.find((t) => t.classList.contains("active"));
    if (!tab || !indicator || !nav) return;
    indicator.style.width = `${tab.offsetWidth}px`;
    indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
  };

  const activate = (screenId, updateHash = true) => {
    const tab = tabs.find((t) => t.dataset.screen === screenId);
    const panel = page.querySelector(`#${CSS.escape(screenId)}`);
    if (!tab || !panel) return;

    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", String(on));
    });

    panels.forEach((p) => {
      const on = p === panel;
      p.classList.toggle("active", on);
      p.setAttribute("aria-hidden", String(!on));
    });

    moveIndicator(tab);
    tab.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });

    if (updateHash) {
      writeRoute({ view: "dashboard", dashboardTab: screenId });
    }
    sessionStorage.setItem(TAB_STORAGE_KEY, screenId);

    if (screenId === "overview") {
      renderDashboardOverview(page);
    }
    if (screenId === "analytics") {
      renderDashboardAnalytics(page);
    }
    if (screenId === "emails") {
      renderDashboardEmails(page);
    }
    page.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onKeydown = (event) => {
    const idx = tabs.findIndex((t) => t.classList.contains("active"));
    if (idx < 0) return;

    let next = idx;
    if (event.key === "ArrowRight") next = (idx + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;

    event.preventDefault();
    tabs[next].focus();
    activate(tabs[next].dataset.screen);
  };

  const validIds = new Set(tabs.map((t) => t.dataset.screen));
  const fromRoute = getDashboardTabFromHash();
  const saved = sessionStorage.getItem(TAB_STORAGE_KEY);
  const initial =
    fromRoute && validIds.has(fromRoute)
      ? fromRoute
      : validIds.has(saved)
        ? saved
        : "overview";

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab.dataset.screen));
  });

  nav?.addEventListener("keydown", onKeydown);
  window.addEventListener(
    "resize",
    () => {
      if (!page.hidden) moveIndicator();
    },
    { passive: true }
  );

  const onHashChange = () => {
    if (page.hidden || shouldIgnoreHashChange()) return;
    const id = getDashboardTabFromHash();
    if (id && validIds.has(id)) activate(id, false);
  };
  window.addEventListener("hashchange", onHashChange);

  activate(initial, false);
  requestAnimationFrame(() => moveIndicator());

  return { activate };
}

export function initDashboard(root) {
  const page = root.querySelector("#dashboardPage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  const leaveStore = () => {
    root.dispatchEvent(new CustomEvent("racelia:leave-dashboard"));
  };

  page.querySelector(".js-dashboard-store-btn")?.addEventListener("click", leaveStore);

  initDashboardAccount(page);
  initDashboardReviews(page);
  initDashboardRaceliaStyle(page, root);
  initDashboardUsers(page);
  initDashboardEmails(page);
  initDashboardBlogs(page);
  initDashboardOverview(page);
  initDashboardAnalytics(page);
  initTargetOrders(page);
  initDashboardOrders(page);
  initDashboardProducts(page, root);
  createTabNav(page);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !page.hidden) {
      if (closeDashboardProductsOverlay(page)) return;
      if (closeDashboardBlogsOverlay(page)) return;
      if (closeDashboardEmailsOverlay(page)) return;
      if (closeDashboardUsersOverlay(page)) return;
      if (closeDashboardRaceliaStyleOverlay(page)) return;
      if (closeDashboardReviewsOverlay(page)) return;
      if (closeDashboardAccountOverlay(page)) return;
      root.dispatchEvent(new CustomEvent("racelia:leave-dashboard"));
    }
  });
}
