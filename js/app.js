import { initFooter } from "./footer.js";
import { initCtaDock, updateCtaDock } from "./ctaDock.js";
import { initRaceliaStyle, ensureStyleGrid, closeStyleSheet } from "./raceliaStyle.js";
import { initAccount } from "./account.js";
import { initCart } from "./cart.js";
import { showHome, showCategory, showBlogs, showDashboard, showClientProfile, showWishlist, initPages } from "./pages.js";
import { defaultSelection } from "./data.js";
import { initProductSliders } from "./productSliders.js";
import { initTopbarSearch, updateTopbar } from "./topbar.js";
import { refreshStyleGrid } from "./raceliaStyle.js";
import { notifyCatalogUpdated } from "./productCatalog.js";
import { renderHomeNewArrivals } from "./homeNewArrivals.js";
import { initClientCartWishlist, syncWishlistHeartStates } from "./clientCartWishlist.js";

function goHome(root) {
  showHome(root, { selectionLabel: defaultSelection });
}

function initTopbar(root) {
  const topbar = root.querySelector(".topbar");
  const brand = root.querySelector(".brand");
  if (!topbar) return;

  brand?.addEventListener("click", (event) => {
    if (window.location.pathname === "/") {
      event.preventDefault();
      goHome(root);
    }
  });

  initTopbarSearch(root);
  updateTopbar(root);
  window.addEventListener("scroll", () => updateTopbar(root), { passive: true });
  window.addEventListener("resize", () => updateTopbar(root));
}

function revealHomeContent(root) {
  root.querySelectorAll("#pageMain .reveal").forEach((el) => {
    el.classList.add("in");
  });
}

function initReveal(root) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  root.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
  revealHomeContent(root);

  root.addEventListener("racelia:reveal", () => revealHomeContent(root));
}

function initStars(root) {
  syncWishlistHeartStates(root);
}

function updateScrollLine(root) {
  const listWrap = root.querySelector("#modalListWrap");
  const scrollLine = root.querySelector("#modalScrollLine");
  if (!listWrap || !scrollLine) return;

  const canScroll = listWrap.scrollHeight > listWrap.clientHeight + 1;
  const atBottom =
    listWrap.scrollTop + listWrap.clientHeight >= listWrap.scrollHeight - 1;
  scrollLine.classList.toggle("visible", canScroll && !atBottom);
}

function initModalScroll(root) {
  const listWrap = root.querySelector("#modalListWrap");
  if (!listWrap) return;

  listWrap.addEventListener(
    "scroll",
    () => updateScrollLine(root),
    { passive: true }
  );

  window.addEventListener("resize", () => updateScrollLine(root));
}

function initModal(root) {
  const widget = root.querySelector("#selectionWidget");
  const panel = root.querySelector("#animatedPanel");
  const cta = root.querySelector("#ctaBtn");
  const backdrop = root.querySelector("#backdrop");
  const closeBtn = root.querySelector("#closeModal");

  if (!widget || !panel || !cta || !backdrop || !closeBtn) return;

  let isAnimating = false;
  let openTimer = null;
  let closeTimer = null;

  const clearTimers = () => {
    if (openTimer) window.clearTimeout(openTimer);
    if (closeTimer) window.clearTimeout(closeTimer);
    openTimer = null;
    closeTimer = null;
  };

  const openModal = () => {
    if (isAnimating || widget.classList.contains("modal-animated-container--open")) {
      return;
    }

    clearTimers();
    isAnimating = true;
    widget.classList.remove("modal-animated-container--closing");
    backdrop.classList.add("open");

    const listWrap = root.querySelector("#modalListWrap");
    if (listWrap) listWrap.scrollTop = 0;

    requestAnimationFrame(() => {
      widget.classList.add("modal-animated-container--open");
    });

    openTimer = window.setTimeout(finishOpen, 500);
  };

  const finishOpen = () => {
    if (!widget.classList.contains("modal-animated-container--open")) return;
    if (widget.classList.contains("modal-animated-container--content-visible")) return;

    widget.classList.add("modal-animated-container--content-visible");
    isAnimating = false;
    openTimer = null;
    updateScrollLine(root);
  };

  const closeModal = () => {
    if (isAnimating || !widget.classList.contains("modal-animated-container--open")) {
      return;
    }

    clearTimers();
    isAnimating = true;
    widget.classList.add("modal-animated-container--closing");
    widget.classList.remove("modal-animated-container--content-visible");

    window.setTimeout(() => {
      widget.classList.remove("modal-animated-container--open");
      closeTimer = window.setTimeout(finishClose, 500);
    }, 180);
  };

  const finishClose = () => {
    if (!widget.classList.contains("modal-animated-container--closing")) return;

    backdrop.classList.remove("open");
    widget.classList.remove(
      "modal-animated-container--open",
      "modal-animated-container--closing"
    );
    isAnimating = false;
    closeTimer = null;
    updateCtaDock(root);
  };

  panel.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "height" || event.target !== panel) return;

    if (
      widget.classList.contains("modal-animated-container--open") &&
      !widget.classList.contains("modal-animated-container--content-visible") &&
      !widget.classList.contains("modal-animated-container--closing")
    ) {
      if (openTimer) window.clearTimeout(openTimer);
      openTimer = null;
      finishOpen();
      return;
    }

    if (
      widget.classList.contains("modal-animated-container--closing") &&
      !widget.classList.contains("modal-animated-container--open")
    ) {
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = null;
      finishClose();
    }
  });

  cta.addEventListener("click", openModal);
  backdrop.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);

  initModalScroll(root);

  const applySelection = (label, { page = null } = {}) => {
    if (page === "home") {
      closeModal();
      showHome(root, { selectionLabel: label, scrollToGrid: true });
      return;
    }

    if (page) {
      closeModal();
      showCategory(root, page);
      return;
    }

    closeModal();
  };

  root.querySelectorAll("#modalListWrap li").forEach((item) => {
    item.addEventListener("click", () => {
      applySelection(item.textContent, {
        page: item.dataset.page || null,
      });
    });
  });

  root.querySelector("#modalHeading")?.addEventListener("click", () => {
    applySelection("TOUTE LA SÉLECTION", { page: "home" });
  });

  root.querySelectorAll("#modalView .tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      root
        .querySelectorAll("#modalView .tabs button")
        .forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function initMenu(root) {
  const menuPanel = root.querySelector("#menuPanel");
  const menuBackdrop = root.querySelector("#menuBackdrop");
  const menuBtn = root.querySelector("#menuBtn");
  const menuClose = root.querySelector("#menuClose");
  const menuTab = root.querySelector("#menuTab");
  const styleTab = root.querySelector("#styleTab");
  const menuView = root.querySelector("#menuView");
  const styleView = root.querySelector("#styleView");

  if (!menuPanel || !menuBackdrop || !menuBtn || !menuClose) return;

  const showMenu = () => {
    menuPanel.classList.remove("menu-panel--style");
    menuTab?.classList.add("active");
    menuTab?.classList.remove("muted");
    styleTab?.classList.remove("active");
    styleTab?.classList.add("muted");
    menuView?.classList.add("is-active");
    styleView?.classList.remove("is-active");
    closeStyleSheet(root);
  };

  const showStyle = () => {
    menuPanel.classList.add("menu-panel--style");
    styleTab?.classList.add("active");
    styleTab?.classList.remove("muted");
    menuTab?.classList.remove("active");
    menuTab?.classList.add("muted");
    menuView?.classList.remove("is-active");
    styleView?.classList.add("is-active");
    ensureStyleGrid(root);
  };

  const openMenu = () => {
    menuPanel.classList.add("open");
    menuPanel.setAttribute("aria-hidden", "false");
    menuBackdrop.classList.add("open");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    menuPanel.classList.remove("open");
    menuPanel.setAttribute("aria-hidden", "true");
    menuBackdrop.classList.remove("open");
    document.body.classList.remove("menu-open");
    closeStyleSheet(root);
    showMenu();
  };

  menuBtn.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  menuBackdrop.addEventListener("click", closeMenu);
  menuTab?.addEventListener("click", (event) => {
    event.stopPropagation();
    showMenu();
  });
  styleTab?.addEventListener("click", (event) => {
    event.stopPropagation();
    showStyle();
  });

  root.addEventListener("racelia:open-style", () => {
    openMenu();
    showStyle();
  });

  root.querySelectorAll(".js-dashboard-open").forEach((item) => {
    item.addEventListener("click", () => {
      closeMenu();
      showDashboard(root);
    });
  });

  root.querySelectorAll(".js-client-profile-open").forEach((item) => {
    item.addEventListener("click", () => {
      closeMenu();
      showClientProfile(root);
    });
  });

  root.querySelector("#menuWishlistBtn")?.addEventListener("click", () => {
    closeMenu();
    showWishlist(root);
  });

  root.querySelectorAll(".js-menu-new-arrivals").forEach((item) => {
    item.addEventListener("click", () => {
      closeMenu();
      showCategory(root, "nouveautes");
    });
  });

  root.querySelectorAll(".js-menu-blogs-open").forEach((item) => {
    item.addEventListener("click", () => {
      closeMenu();
      showBlogs(root);
    });
  });

  root.querySelectorAll(".js-menu-handbags-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const group = toggle.closest(".menu-list__group");
      if (!group) return;
      const isOpen = group.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });

  root.querySelectorAll(".js-menu-category").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      const page = item.dataset.page;
      if (!page) return;
      closeMenu();
      showCategory(root, page);
    });
  });
}

export function initApp(root) {
  initTopbar(root);
  initReveal(root);
  initStars(root);
  initModal(root);
  initMenu(root);
  initProductSliders(root);
  initFooter(root);
  initCtaDock(root);
  initCart(root);
  initClientCartWishlist(root);
  initRaceliaStyle(root);
  initAccount(root);
  initPages(root);
  renderHomeNewArrivals(root);
  root.dispatchEvent(new CustomEvent("racelia:reveal"));

  root.addEventListener("racelia:backend-synced", () => {
    refreshStyleGrid(root);
    notifyCatalogUpdated(root);
    renderHomeNewArrivals(root);
    syncWishlistHeartStates(root);
  });
}
