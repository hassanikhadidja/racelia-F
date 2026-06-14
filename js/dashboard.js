const chartData = {
  Weekly: [
    { dark: 55, light: 75, label: "$75K" },
    { dark: 40, light: 65, label: "$65K" },
    { dark: 48, light: 70, label: "$70K" },
    { dark: 70, light: 88, label: "$88K" },
    { dark: 52, light: 72, label: "$72K" },
    { dark: 60, light: 80, label: "$80K" },
    { dark: 45, light: 62, label: "$62K" },
  ],
  Today: [
    { dark: 30, light: 50, label: "$50K" },
    { dark: 60, light: 80, label: "$80K" },
    { dark: 45, light: 65, label: "$65K" },
    { dark: 70, light: 90, label: "$90K" },
    { dark: 35, light: 55, label: "$55K" },
    { dark: 50, light: 70, label: "$70K" },
    { dark: 40, light: 60, label: "$60K" },
  ],
  Monthly: [
    { dark: 65, light: 85, label: "$85K" },
    { dark: 55, light: 78, label: "$78K" },
    { dark: 72, light: 92, label: "$92K" },
    { dark: 48, light: 68, label: "$68K" },
    { dark: 60, light: 82, label: "$82K" },
    { dark: 42, light: 60, label: "$60K" },
    { dark: 68, light: 88, label: "$88K" },
  ],
};

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
  initDashboardWebPics,
  closeDashboardWebPicsOverlay,
} from "./dashboardWebPics.js";
import {
  initDashboardRaceliaStyle,
  closeDashboardRaceliaStyleOverlay,
} from "./dashboardRaceliaStyle.js";
import {
  initDashboardUsers,
  closeDashboardUsersOverlay,
} from "./dashboardUsers.js";
import {
  initDashboardBlogs,
  closeDashboardBlogsOverlay,
} from "./dashboardBlogs.js";
import { initTargetOrders } from "./dashboardTargetOrders.js";
import {
  initDashboardProducts,
  closeDashboardProductsOverlay,
} from "./dashboardProducts.js";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TAB_STORAGE_KEY = "racelia-dashboard-tab";

function createTabNav(page) {
  let currentPeriod = "Weekly";

  const renderChart = () => {
    const container = page.querySelector("#chart");
    if (!container) return;

    const data = chartData[currentPeriod];
    const barsHtml = data
      .map(
        (d) => `
    <div class="bar-group">
      <div class="bar-tooltip">${d.label}</div>
      <div class="bar light" style="height:0%"></div>
      <div class="bar dark" style="height:0%"></div>
    </div>
  `
      )
      .join("");

    container.innerHTML = `
    <div class="chart-labels-y"><span>$100k</span><span>$80k</span><span>$60k</span><span>$40k</span><span>$20k</span></div>
    <div class="bars-area">${barsHtml}</div>
    <div class="chart-labels-x">${days.map((d) => `<span>${d}</span>`).join("")}</div>
  `;

    requestAnimationFrame(() => {
      container.querySelectorAll(".bar-group").forEach((group, i) => {
        group.querySelector(".bar.light").style.height = `${data[i].light}%`;
        group.querySelector(".bar.dark").style.height = `${data[i].dark}%`;
      });
    });
  };

  const switchPeriod = (period) => {
    currentPeriod = period;
    page.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.period === period);
    });
    renderChart();
  };

  page.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchPeriod(tab.dataset.period));
  });

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

    if (screenId === "overview" && page.querySelector("#chart")) {
      renderChart();
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
  renderChart();

  return { activate, renderChart };
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
  initDashboardWebPics(page);
  initDashboardRaceliaStyle(page, root);
  initDashboardUsers(page);
  initDashboardBlogs(page);
  initTargetOrders(page);
  initDashboardProducts(page, root);
  createTabNav(page);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !page.hidden) {
      if (closeDashboardProductsOverlay(page)) return;
      if (closeDashboardBlogsOverlay(page)) return;
      if (closeDashboardUsersOverlay(page)) return;
      if (closeDashboardRaceliaStyleOverlay(page)) return;
      if (closeDashboardWebPicsOverlay(page)) return;
      if (closeDashboardReviewsOverlay(page)) return;
      if (closeDashboardAccountOverlay(page)) return;
      root.dispatchEvent(new CustomEvent("racelia:leave-dashboard"));
    }
  });
}
