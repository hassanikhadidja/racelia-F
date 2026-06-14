export function initTopbarSearch(root) {
  const topbar = root.querySelector(".topbar");
  const searchBtn = root.querySelector("#topbarSearchBtn");
  const panel = root.querySelector("#topbarSearchPanel");
  const input = root.querySelector("#topbarSearchInput");
  const closeBtn = root.querySelector("#topbarSearchClose");
  const form = root.querySelector("#topbarSearchForm");

  if (!topbar || !searchBtn || !panel || !input) return;

  const isOpen = () => topbar.classList.contains("topbar--search-open");

  const openSearch = () => {
    topbar.classList.add("topbar--search-open", "scrolled");
    topbar.classList.remove("over-hero");
    panel.hidden = false;
    searchBtn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => input.focus());
  };

  const closeSearch = () => {
    topbar.classList.remove("topbar--search-open");
    panel.hidden = true;
    searchBtn.setAttribute("aria-expanded", "false");
    input.blur();
    updateTopbar(root);
  };

  searchBtn.addEventListener("click", () => {
    if (isOpen()) closeSearch();
    else openSearch();
  });

  closeBtn?.addEventListener("click", closeSearch);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    window.alert(`Search: ${query}`);
    closeSearch();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) closeSearch();
  });
}

export function updateTopbar(root) {
  const topbar = root.querySelector(".topbar");
  const hero = root.querySelector(".hero");
  if (!topbar) return;

  if (topbar.classList.contains("topbar--search-open")) {
    topbar.classList.add("scrolled");
    topbar.classList.remove("over-hero");
    return;
  }

  const pageMain = root.querySelector("#pageMain");
  const productDetailPage = root.querySelector("#productDetailPage");
  const pdpHero = root.querySelector("#pdpHero");
  const onPdp = productDetailPage && !productDetailPage.hidden;

  if (onPdp && pdpHero) {
    const heroBottom = pdpHero.getBoundingClientRect().bottom;
    if (heroBottom > 56) {
      topbar.classList.add("over-hero");
      topbar.classList.remove("scrolled");
    } else {
      topbar.classList.remove("over-hero");
      topbar.classList.add("scrolled");
    }
    return;
  }

  const onHome = pageMain && !pageMain.hidden;

  if (!onHome || !hero) {
    topbar.classList.remove("over-hero");
    topbar.classList.add("scrolled");
    return;
  }

  const heroBottom = hero.getBoundingClientRect().bottom;
  if (heroBottom > 56) {
    topbar.classList.add("over-hero");
    topbar.classList.remove("scrolled");
  } else {
    topbar.classList.remove("over-hero");
    topbar.classList.add("scrolled");
  }
}
