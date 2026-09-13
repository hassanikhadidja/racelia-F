import { searchProducts } from "./productCatalog.js";
import { getSelectedAudience } from "./audience.js";
import { t } from "./i18n.js";

function isPageVisible(el) {
  return Boolean(el && !el.hidden);
}

function getDesktopNavView(root) {
  if (isPageVisible(root.querySelector("#boutiquesPage"))) return { view: "boutiques" };
  if (isPageVisible(root.querySelector("#aboutPage"))) return { view: "about" };
  const categoryPage = root.querySelector("#categoryPage");
  if (isPageVisible(categoryPage)) {
    return { view: "category", categoryKey: categoryPage.dataset.page || "" };
  }
  if (isPageVisible(root.querySelector("#dashboardPage"))) return { view: "dashboard" };
  if (isPageVisible(root.querySelector("#pageMain"))) return { view: "home" };
  return { view: "" };
}

function updateDesktopNav(root) {
  const nav = root.querySelector("#topbarDesktopNav");
  if (!nav) return;

  const { view, categoryKey = "" } = getDesktopNavView(root);
  const audience = getSelectedAudience();
  const onHome = view === "home";

  nav.querySelectorAll(".topbar-nav__item").forEach((item) => {
    const btn = item.querySelector(":scope > .topbar-nav__btn");
    if (!btn) return;

    if (btn.classList.contains("js-desktop-audience")) {
      item.classList.toggle(
        "is-current",
        !onHome && Boolean(audience) && btn.dataset.audience === audience
      );
      return;
    }

    const page = btn.dataset.page;
    const isBoutiques = btn.classList.contains("js-menu-boutiques-open");
    const isAbout = btn.classList.contains("js-desktop-about-open");
    const isDashboard = item.classList.contains("js-dashboard-open");
    const current =
      !audience &&
      ((page && page === categoryKey) ||
        (isBoutiques && view === "boutiques") ||
        (isAbout && view === "about") ||
        (isDashboard && view === "dashboard"));

    item.classList.toggle("is-current", current);
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function initTopbarSearch(root) {
  const topbar = root.querySelector(".topbar");
  const searchBtn = root.querySelector("#topbarSearchBtn");
  const panel = root.querySelector("#topbarSearchPanel");
  const input = root.querySelector("#topbarSearchInput");
  const closeBtn = root.querySelector("#topbarSearchClose");
  const form = root.querySelector("#topbarSearchForm");
  const results = root.querySelector("#topbarSearchResults");
  const suggestions = root.querySelector("#topbarSearchSuggestions");

  if (!topbar || !searchBtn || !panel || !input) return;

  const isOpen = () => topbar.classList.contains("topbar--search-open");

  const showSuggestions = (visible) => {
    if (!suggestions) return;
    suggestions.hidden = !visible;
  };

  const hideResults = () => {
    if (!results) return;
    results.hidden = true;
    results.innerHTML = "";
  };

  const renderResults = (query) => {
    if (!results) return;
    const q = String(query || "").trim();
    if (!q) {
      hideResults();
      showSuggestions(true);
      return;
    }

    showSuggestions(false);

    const matches = searchProducts(q);
    const preview = matches.slice(0, 6);

    if (!matches.length) {
      results.innerHTML = `<p class="topbar-search__empty">${t("search.empty", { query: escapeHtml(q) })}</p>`;
      results.hidden = false;
      return;
    }

    const hits = preview
      .map((product) => {
        const image = product.images?.[0] || "";
        const tag = product.tag ? `<span class="topbar-search__hit-tag">${escapeHtml(product.tag)}</span>` : "";
        return `<button type="button" class="topbar-search__hit" role="option" data-product-id="${escapeHtml(product.id)}">
          <img class="topbar-search__hit-img" src="${escapeHtml(image)}" alt="" onerror="this.style.visibility='hidden'" />
          <span class="topbar-search__hit-copy">
            <span class="topbar-search__hit-name">${escapeHtml(product.name)}</span>
            ${tag}
          </span>
        </button>`;
      })
      .join("");

    const more =
      matches.length > preview.length
        ? `<button type="button" class="topbar-search__all" data-search-all="true">${t("search.seeCount", { count: matches.length })}</button>`
        : `<button type="button" class="topbar-search__all" data-search-all="true">${t("search.seeAll")}</button>`;

    results.innerHTML = hits + more;
    results.hidden = false;
  };

  const openSearch = () => {
    topbar.classList.add("topbar--search-open", "scrolled");
    topbar.classList.remove("over-hero");
    document.body.classList.add("search-open");
    panel.hidden = false;
    searchBtn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => input.focus());
    renderResults(input.value);
  };

  const closeSearch = () => {
    topbar.classList.remove("topbar--search-open");
    document.body.classList.remove("search-open");
    panel.hidden = true;
    searchBtn.setAttribute("aria-expanded", "false");
    hideResults();
    showSuggestions(true);
    input.blur();
    updateTopbar(root);
  };

  const submitSearch = (query = input.value) => {
    const q = String(query || "").trim();
    if (!q) return;
    closeSearch();
    root.dispatchEvent(new CustomEvent("racelia:open-search", { detail: { query: q } }));
  };

  searchBtn.addEventListener("click", () => {
    if (isOpen()) closeSearch();
    else openSearch();
  });

  closeBtn?.addEventListener("click", closeSearch);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    submitSearch();
  });

  input.addEventListener("input", () => {
    renderResults(input.value);
  });

  results?.addEventListener("click", (event) => {
    const hit = event.target.closest("[data-product-id]");
    if (hit) {
      event.preventDefault();
      closeSearch();
      root.dispatchEvent(
        new CustomEvent("racelia:open-product", { detail: { productId: hit.dataset.productId } })
      );
      return;
    }

    if (event.target.closest("[data-search-all]")) {
      event.preventDefault();
      submitSearch();
    }
  });

  suggestions?.addEventListener("click", (event) => {
    const item = event.target.closest("[data-suggest-page], [data-suggest-action]");
    if (!item) return;
    event.preventDefault();
    closeSearch();
    if (item.dataset.suggestPage) {
      root.dispatchEvent(
        new CustomEvent("racelia:open-category", { detail: { categoryKey: item.dataset.suggestPage } })
      );
      return;
    }
    if (item.dataset.suggestAction === "boutiques") {
      root.dispatchEvent(new CustomEvent("racelia:open-boutiques"));
      return;
    }
    if (item.dataset.suggestAction === "style") {
      root.dispatchEvent(new CustomEvent("racelia:open-style"));
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!isOpen()) return;
    if (topbar.contains(event.target)) return;
    closeSearch();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) closeSearch();
  });

  root.addEventListener("racelia:locale-changed", () => {
    if (isOpen()) renderResults(input.value);
  });
}

let lastBrandScrollY = 0;

function updateBrandScroll(root, topbar) {
  const y = window.scrollY || 0;
  const desktop = window.matchMedia("(min-width: 1024px)").matches;
  const onHome = isPageVisible(root.querySelector("#pageMain"));
  const jumped = Math.abs(y - lastBrandScrollY) > 200;
  const goingUp = !jumped && y < lastBrandScrollY - 4;
  lastBrandScrollY = y;

  if (!desktop || !onHome || topbar.classList.contains("topbar--search-open")) {
    topbar.classList.remove("is-brand-hidden", "is-section-title");
    return;
  }

  const marker =
    root.querySelector("#metiersArtSection .eyebrow") || root.querySelector("#metiersArtSection");
  const headerBottom = topbar.getBoundingClientRect().bottom;
  const passed = Boolean(marker && marker.getBoundingClientRect().top <= headerBottom);

  if (y <= 8) {
    topbar.classList.remove("is-brand-hidden", "is-section-title");
    return;
  }

  topbar.classList.add("is-brand-hidden");

  if (passed && !goingUp) {
    topbar.classList.add("is-section-title");
    return;
  }

  topbar.classList.remove("is-section-title");
}

export function updateTopbar(root) {
  const topbar = root.querySelector(".topbar");
  const hero = root.querySelector(".hero");
  if (!topbar) return;

  updateBrandScroll(root, topbar);

  if (window.matchMedia("(min-width: 1024px)").matches) {
    updateDesktopNav(root);
    if (topbar.classList.contains("topbar--search-open")) {
      topbar.classList.add("scrolled");
      topbar.classList.remove("over-hero");
      return;
    }

    const onHome = isPageVisible(root.querySelector("#pageMain"));
    const homeHero = root.querySelector(".hero");
    const overHomeHero =
      onHome &&
      homeHero &&
      homeHero.getBoundingClientRect().bottom > topbar.getBoundingClientRect().bottom;

    topbar.classList.toggle("over-hero", Boolean(overHomeHero));
    topbar.classList.toggle("scrolled", !overHomeHero);
    return;
  }

  if (topbar.classList.contains("topbar--search-open")) {
    topbar.classList.add("scrolled");
    topbar.classList.remove("over-hero");
    return;
  }

  const pageMain = root.querySelector("#pageMain");
  const productDetailPage = root.querySelector("#productDetailPage");
  const pdpHero = root.querySelector("#pdpHero");
  const onPdp = isPageVisible(productDetailPage);
  const onHome = isPageVisible(pageMain);

  topbar.classList.toggle("topbar--pdp", onPdp);

  // Non-home / non-PDP surfaces are always light — never keep white hero icons.
  if (!onHome && !onPdp) {
    topbar.classList.remove("over-hero");
    topbar.classList.add("scrolled");
    return;
  }

  if (onPdp && pdpHero) {
    const heroBottom = pdpHero.getBoundingClientRect().bottom;
    if (heroBottom > 64) {
      topbar.classList.add("over-hero");
      topbar.classList.remove("scrolled");
    } else {
      topbar.classList.remove("over-hero");
      topbar.classList.add("scrolled");
    }
    return;
  }

  if (!onHome || !hero) {
    topbar.classList.remove("over-hero");
    topbar.classList.add("scrolled");
    return;
  }

  const heroBottom = hero.getBoundingClientRect().bottom;
  if (heroBottom > 64) {
    topbar.classList.add("over-hero");
    topbar.classList.remove("scrolled");
  } else {
    topbar.classList.remove("over-hero");
    topbar.classList.add("scrolled");
  }
}
