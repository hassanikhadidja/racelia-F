import {
  FAQ_CATEGORIES,
  getCategoryById,
  getArticleById,
  getArticlesByCategory,
  searchFaqArticles,
} from "./faqData.js";
import { writeRoute, goBackInApp } from "./route.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function categoryCardHtml(cat) {
  const count = getArticlesByCategory(cat.id).length;
  return `<button type="button" class="faq-cat-card" data-faq-cat="${escapeHtml(cat.id)}">
    <h3>${escapeHtml(cat.title)}</h3>
    <p>${escapeHtml(cat.description)}</p>
    <span class="faq-cat-card__count">${count} article${count === 1 ? "" : "s"}</span>
  </button>`;
}

function articleCardHtml(article) {
  return `<button type="button" class="faq-article-card" data-faq-article="${escapeHtml(article.id)}">
    <h3>${escapeHtml(article.title)}</h3>
    <p>${escapeHtml(article.excerpt)}</p>
  </button>`;
}

export function faqStateToRoute(state) {
  const view = state?.view || "home";
  if (view === "all") return { view: "faq", faqView: "all" };
  if (view === "search") {
    return { view: "faq", faqView: "search", faqQuery: state.query || "" };
  }
  if (view === "article" && state.articleId) {
    return {
      view: "faq",
      faqView: "article",
      faqCategoryId: state.categoryId,
      faqArticleId: state.articleId,
    };
  }
  if (view === "category" && state.categoryId) {
    return { view: "faq", faqView: "category", faqCategoryId: state.categoryId };
  }
  return { view: "faq", faqView: "home" };
}

export function initFaqPage(root, route = null) {
  const page = root.querySelector("#faqPage");
  if (!page) return;

  const state = page.__faqState || {
    view: "home",
    categoryId: null,
    articleId: null,
    query: "",
    layout: "grid",
  };
  page.__faqState = state;

  const views = {
    home: page.querySelector("#faq-view-home"),
    all: page.querySelector("#faq-view-all"),
    search: page.querySelector("#faq-view-search"),
    category: page.querySelector("#faq-view-category"),
    article: page.querySelector("#faq-view-article"),
  };

  const showView = (name) => {
    state.view = name;
    Object.entries(views).forEach(([key, el]) => {
      if (!el) return;
      const active = key === name;
      el.hidden = !active;
      el.classList.toggle("is-active", active);
    });
  };

  const syncFaqRoute = ({ replace = false } = {}) => {
    writeRoute(faqStateToRoute(state), { replace });
  };

  const renderHomeCategories = () => {
    const list = page.querySelector("#faq-cat-list-home");
    if (!list) return;
    list.classList.toggle("is-grid", state.layout === "grid");
    list.classList.toggle("is-list", state.layout === "list");
    list.innerHTML = FAQ_CATEGORIES.map(categoryCardHtml).join("");
  };

  const renderAllCategories = () => {
    const list = page.querySelector("#faq-cat-list-all");
    if (!list) return;
    list.innerHTML = FAQ_CATEGORIES.map(categoryCardHtml).join("");
  };

  const openHome = ({ replace = false } = {}) => {
    state.categoryId = null;
    state.articleId = null;
    state.query = "";
    renderHomeCategories();
    showView("home");
    const input = page.querySelector("#faq-search-home");
    if (input) input.value = "";
    page.querySelectorAll(".faq-search input").forEach((other) => {
      other.value = "";
    });
    syncFaqRoute({ replace });
  };

  const openAll = ({ replace = false } = {}) => {
    state.articleId = null;
    state.query = "";
    renderAllCategories();
    showView("all");
    syncFaqRoute({ replace });
  };

  const openCategory = (categoryId, { replace = false } = {}) => {
    const cat = getCategoryById(categoryId);
    if (!cat) return false;
    state.categoryId = categoryId;
    state.articleId = null;
    const title = page.querySelector("#faq-cat-title");
    const sub = page.querySelector("#faq-cat-sub");
    const crumb = page.querySelector("#faq-breadcrumb-cat");
    const list = page.querySelector("#faq-article-list");
    if (title) title.textContent = cat.title;
    if (sub) sub.textContent = cat.description;
    if (crumb) crumb.textContent = cat.title;
    if (list) {
      const articles = getArticlesByCategory(categoryId);
      list.innerHTML = articles.length
        ? articles.map(articleCardHtml).join("")
        : `<p class="faq-empty">Aucun article dans cette catégorie.</p>`;
    }
    showView("category");
    syncFaqRoute({ replace });
    return true;
  };

  const openArticle = (articleId, { replace = false } = {}) => {
    const article = getArticleById(articleId);
    if (!article) return false;
    const cat = getCategoryById(article.categoryId);
    state.articleId = articleId;
    state.categoryId = article.categoryId;
    const title = page.querySelector("#faq-article-title");
    const body = page.querySelector("#faq-article-body");
    const crumbArt = page.querySelector("#faq-breadcrumb-article");
    const crumbCat = page.querySelector("#faq-breadcrumb-cat-art");
    if (title) title.textContent = article.title;
    if (body) body.innerHTML = article.body;
    if (crumbArt) crumbArt.textContent = article.title;
    if (crumbCat) {
      crumbCat.textContent = cat?.title || "";
      crumbCat.dataset.faqCat = article.categoryId;
    }
    showView("article");
    syncFaqRoute({ replace });
    return true;
  };

  const openSearch = (query, { replace = false } = {}) => {
    const q = String(query || "").trim();
    const container = page.querySelector("#faq-search-results");
    const searchInput = page.querySelector("#faq-view-search input");
    if (searchInput && searchInput.value !== q) searchInput.value = q;

    if (!q) {
      openHome({ replace: true });
      return;
    }

    const wasSearch = state.view === "search";
    state.query = q;
    const hits = searchFaqArticles(q);
    if (container) {
      if (!hits.length) {
        container.innerHTML = `<p class="faq-empty">Aucun résultat pour « ${escapeHtml(q)} ».</p>`;
      } else {
        container.innerHTML = `<p class="faq-search-count">${hits.length} résultat${hits.length === 1 ? "" : "s"}</p><div class="faq-article-list">${hits.map(articleCardHtml).join("")}</div>`;
      }
    }
    showView("search");
    syncFaqRoute({ replace: replace || wasSearch });
  };

  const setLayout = (layout) => {
    state.layout = layout === "list" ? "list" : "grid";
    const gridBtn = page.querySelector(".js-faq-view-grid");
    const listBtn = page.querySelector(".js-faq-view-list");
    gridBtn?.classList.toggle("is-active", state.layout === "grid");
    listBtn?.classList.toggle("is-active", state.layout === "list");
    gridBtn?.setAttribute("aria-pressed", String(state.layout === "grid"));
    listBtn?.setAttribute("aria-pressed", String(state.layout === "list"));
    renderHomeCategories();
  };

  const stepBackFaq = () => {
    if (state.view === "home") return;
    if (goBackInApp()) return;
    if (state.view === "article" && state.categoryId) {
      openCategory(state.categoryId, { replace: true });
      return;
    }
    openHome({ replace: true });
  };

  const applyRoute = (nextRoute) => {
    const view = nextRoute?.faqView || "home";
    if (view === "article" && nextRoute.faqArticleId) {
      if (openArticle(nextRoute.faqArticleId)) return;
    }
    if (view === "category" && nextRoute.faqCategoryId) {
      if (openCategory(nextRoute.faqCategoryId)) return;
    }
    if (view === "all") {
      openAll();
      return;
    }
    if (view === "search") {
      const q = nextRoute.faqQuery || "";
      if (q.trim()) {
        openSearch(q);
        return;
      }
    }
    openHome();
  };

  if (page.dataset.bound !== "true") {
    page.dataset.bound = "true";

    page.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (target.closest(".js-faq-home")) {
        stepBackFaq();
        return;
      }
      if (target.closest(".js-faq-all")) {
        openAll();
        return;
      }
      if (target.closest(".js-faq-view-grid")) {
        setLayout("grid");
        return;
      }
      if (target.closest(".js-faq-view-list")) {
        setLayout("list");
        return;
      }
      if (target.closest(".js-faq-report")) {
        root.dispatchEvent(new CustomEvent("racelia:open-returns"));
        return;
      }

      const crumbCat = target.closest("#faq-breadcrumb-cat-art");
      if (crumbCat?.dataset.faqCat) {
        if (goBackInApp()) return;
        openCategory(crumbCat.dataset.faqCat, { replace: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const catBtn = target.closest("[data-faq-cat]");
      if (catBtn && page.contains(catBtn)) {
        openCategory(catBtn.dataset.faqCat);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const artBtn = target.closest("[data-faq-article]");
      if (artBtn && page.contains(artBtn)) {
        openArticle(artBtn.dataset.faqArticle);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    page.querySelectorAll(".faq-search input").forEach((input) => {
      input.addEventListener("input", () => {
        const value = input.value;
        page.querySelectorAll(".faq-search input").forEach((other) => {
          if (other !== input) other.value = value;
        });
        if (value.trim()) openSearch(value);
        else if (state.view === "search") openHome({ replace: true });
      });
    });
  }

  if (route) {
    applyRoute(route);
    return;
  }

  if (state.view === "article" && state.articleId) openArticle(state.articleId, { replace: true });
  else if (state.view === "category" && state.categoryId) openCategory(state.categoryId, { replace: true });
  else if (state.view === "all") openAll({ replace: true });
  else if (state.view === "search") {
    const q = state.query || page.querySelector("#faq-view-search input")?.value || "";
    if (q.trim()) openSearch(q, { replace: true });
    else openHome({ replace: true });
  } else openHome({ replace: true });
}
