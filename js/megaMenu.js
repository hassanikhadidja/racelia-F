import { setSelectedAudience } from "./audience.js";
import { t } from "./i18n.js";
import { applyResponsiveImage } from "./imageDelivery.js";

const AUDIENCE_COLUMNS = [
  {
    heading: "mega.featured",
    links: [
      { label: "mega.new", page: "nouveautes" },
      { label: "mega.metiers", page: "nouveautes" },
    ],
  },
  {
    heading: "mega.categories",
    links: [
      { label: "mega.bags", page: "sacs" },
      { label: "mega.miniBags", page: "mini-bags" },
      { label: "mega.raceliaBags", page: "racelia-handbag" },
      { label: "mega.catalogueLink", page: "catalogue-grossiste" },
    ],
  },
  {
    heading: "mega.services",
    links: [
      { label: "mega.stores", action: "boutiques" },
      { label: "mega.contact", action: "contact" },
    ],
  },
];

function audiencePanel(audience, image, extraColumn) {
  return {
    audience,
    image,
    mediaLinks: [
      { label: "mega.homeAudience", page: "nouveautes" },
      { label: "mega.appointment", action: "contact" },
    ],
    columns: extraColumn ? [...AUDIENCE_COLUMNS, extraColumn] : AUDIENCE_COLUMNS,
  };
}

const MEGA_PANELS = {
  femme: audiencePanel(
    "femme",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
  ),
  homme: audiencePanel(
    "homme",
    "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1200&q=80"
  ),
  enfants: audiencePanel(
    "enfants",
    "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=1200&q=80",
    {
      heading: "mega.ages",
      links: [
        { label: "mega.girl614", page: "fille-6-14" },
        { label: "mega.boy614", page: "garcon-6-14" },
        { label: "mega.girl06", page: "fille-0-6" },
        { label: "mega.boy06", page: "garcon-0-6" },
      ],
    }
  ),
  mariee: audiencePanel(
    "mariee",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
  ),
  hammam: audiencePanel(
    "hammam",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80"
  ),
  catalogue: {
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80",
    mediaLinks: [
      { label: "mega.catalogueHome", page: "catalogue-grossiste", clearAudience: true },
      { label: "mega.contactArrow", action: "contact", clearAudience: true },
    ],
    columns: [
      {
        heading: "mega.catalogue",
        links: [
          { label: "mega.catalogueLink", page: "catalogue-grossiste", clearAudience: true },
          { label: "mega.new", page: "nouveautes", clearAudience: true },
        ],
      },
      {
        heading: "mega.categories",
        links: [
          { label: "mega.miniBags", page: "mini-bags", clearAudience: true },
          { label: "mega.raceliaBags", page: "racelia-handbag", clearAudience: true },
          { label: "mega.momsBags", page: "moms-bags", clearAudience: true },
        ],
      },
      {
        heading: "mega.services",
        links: [
          { label: "mega.stores", action: "boutiques", clearAudience: true },
          { label: "mega.contact", action: "contact", clearAudience: true },
        ],
      },
    ],
  },
  boutiques: {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    mediaLinks: [
      { label: "mega.allStores", action: "boutiques", clearAudience: true },
      { label: "mega.contactArrow", action: "contact", clearAudience: true },
    ],
    columns: [
      {
        heading: "mega.boutiques",
        links: [{ label: "mega.findStore", action: "boutiques", clearAudience: true }],
      },
      {
        heading: "mega.services",
        links: [
          { label: "mega.contact", action: "contact", clearAudience: true },
          { label: "mega.faq", action: "faq", clearAudience: true },
          { label: "mega.shipping", action: "shipping", clearAudience: true },
        ],
      },
    ],
  },
  style: {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    mediaLinks: [
      { label: "mega.styleArrow", action: "style", clearAudience: true },
      { label: "mega.newArrow", page: "nouveautes", clearAudience: true },
    ],
    columns: [
      {
        heading: "mega.featured",
        links: [
          { label: "nav.style", action: "style", clearAudience: true },
          { label: "mega.new", page: "nouveautes", clearAudience: true },
        ],
      },
      {
        heading: "mega.services",
        links: [
          { label: "mega.stores", action: "boutiques", clearAudience: true },
          { label: "mega.contact", action: "contact", clearAudience: true },
        ],
      },
    ],
  },
  about: {
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
    mediaLinks: [
      { label: "mega.aboutArrow", action: "about", clearAudience: true },
      { label: "mega.contactArrow", action: "contact", clearAudience: true },
    ],
    columns: [
      {
        heading: "mega.about",
        links: [
          { label: "mega.about", action: "about", clearAudience: true },
          { label: "mega.contact", action: "contact", clearAudience: true },
        ],
      },
      {
        heading: "mega.services",
        links: [
          { label: "mega.faq", action: "faq", clearAudience: true },
          { label: "mega.shipping", action: "shipping", clearAudience: true },
          { label: "mega.findStore", action: "boutiques", clearAudience: true },
        ],
      },
    ],
  },
};

function translateLabel(key, audience) {
  if (key === "mega.homeAudience") {
    return t(key, { name: t(`audience.${audience}`) });
  }
  return t(key);
}

function linkMarkup(link, audience, extraClass = "") {
  const page = link.page ? ` data-mega-page="${link.page}"` : "";
  const action = link.action ? ` data-mega-action="${link.action}"` : "";
  const aud = audience ? ` data-mega-audience="${audience}"` : "";
  const clear = link.clearAudience ? ` data-mega-clear="true"` : "";
  return `<button type="button" class="topbar-mega__link${extraClass}"${page}${action}${aud}${clear}>${translateLabel(link.label, audience)}</button>`;
}

function renderColumns(panel, audience) {
  return (panel.columns || [])
    .map((column) => {
      const heading = column.heading
        ? `<p class="topbar-mega__heading">${t(column.heading)}</p>`
        : "";
      const links = column.links.map((link) => linkMarkup(link, audience)).join("");
      return `<div class="topbar-mega__col">${heading}${links}</div>`;
    })
    .join("");
}

function renderMediaLinks(panel, audience) {
  return (panel.mediaLinks || [])
    .map((link) => linkMarkup(link, audience, " topbar-mega__media-link"))
    .join("");
}

export function initMegaMenu(root) {
  const topbar = root.querySelector(".topbar");
  const mega = root.querySelector("#topbarMega");
  const columnsEl = root.querySelector("#topbarMegaColumns");
  const mediaLinksEl = root.querySelector("#topbarMegaMediaLinks");
  const imageEl = root.querySelector("#topbarMegaImage");
  const closeBtn = root.querySelector("#topbarMegaClose");
  if (!topbar || !mega || !columnsEl || !imageEl) return;

  let activeKey = "";

  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

  const setExpanded = (key) => {
    topbar.querySelectorAll("[data-mega] .topbar-nav__btn").forEach((btn) => {
      const item = btn.closest("[data-mega]");
      btn.setAttribute("aria-expanded", String(item?.dataset.mega === key));
    });
  };

  const closeMega = () => {
    activeKey = "";
    topbar.classList.remove("is-mega-open");
    document.body.classList.remove("mega-open");
    topbar.querySelectorAll(".topbar-nav__item.is-mega-active").forEach((item) => {
      item.classList.remove("is-mega-active");
    });
    setExpanded("");
    mega.hidden = true;
  };

  const showPanel = (key, trigger) => {
    if (!isDesktop() || topbar.classList.contains("topbar--search-open")) {
      closeMega();
      return;
    }
    const panel = MEGA_PANELS[key];
    if (!panel) {
      closeMega();
      return;
    }

    const audience = panel.audience || "";
    if (activeKey !== key) {
      activeKey = key;
      if (imageEl.dataset.origin !== panel.image) {
        applyResponsiveImage(imageEl, panel.image, {
          eager: true,
          keepOrigin: true,
          width: 900,
          widths: [480, 900],
          sizes: "420px",
        });
      }
      imageEl.alt = "";
    }
    columnsEl.innerHTML = renderColumns(panel, audience);
    if (mediaLinksEl) mediaLinksEl.innerHTML = renderMediaLinks(panel, audience);

    topbar.classList.add("is-mega-open", "is-nav-reveal");
    document.body.classList.add("mega-open");
    mega.hidden = false;
    topbar.querySelectorAll(".topbar-nav__item.is-mega-active").forEach((item) => {
      item.classList.remove("is-mega-active");
    });
    trigger?.closest(".topbar-nav__item")?.classList.add("is-mega-active");
    setExpanded(key);
  };

  root.querySelector("#topbarSearchBtn")?.addEventListener("click", closeMega);
  closeBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeMega();
  });

  topbar.addEventListener("mouseenter", () => {
    if (!isDesktop() || topbar.classList.contains("topbar--search-open")) return;
    topbar.classList.add("is-nav-reveal");
  });

  topbar.addEventListener("mouseleave", () => {
    if (topbar.classList.contains("is-mega-open")) return;
    topbar.classList.remove("is-nav-reveal");
  });

  root.querySelectorAll("[data-mega] .topbar-nav__btn").forEach((btn) => {
    const item = btn.closest("[data-mega]");
    if (!item) return;
    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", (event) => {
      if (!isDesktop()) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (item.dataset.mega === "style") {
        closeMega();
        setSelectedAudience("");
        root.dispatchEvent(new CustomEvent("racelia:audience-changed"));
        root.dispatchEvent(new CustomEvent("racelia:open-style"));
        return;
      }

      const key = item.dataset.mega;
      if (activeKey === key) {
        closeMega();
        return;
      }
      showPanel(key, btn);
    });
  });

  mega.addEventListener("click", (event) => {
    const link = event.target.closest("[data-mega-page], [data-mega-action]");
    if (!link) return;
    event.preventDefault();

    if (link.dataset.megaClear === "true") setSelectedAudience("");
    if (link.dataset.megaAudience) setSelectedAudience(link.dataset.megaAudience);
    root.dispatchEvent(new CustomEvent("racelia:audience-changed"));
    closeMega();

    if (link.dataset.megaPage) {
      root.dispatchEvent(
        new CustomEvent("racelia:open-category", { detail: { categoryKey: link.dataset.megaPage } })
      );
      return;
    }

    const action = link.dataset.megaAction;
    if (action === "boutiques") root.dispatchEvent(new CustomEvent("racelia:open-boutiques"));
    if (action === "style") root.dispatchEvent(new CustomEvent("racelia:open-style"));
    if (action === "about") root.dispatchEvent(new CustomEvent("racelia:open-about"));
    if (action === "contact") root.dispatchEvent(new CustomEvent("racelia:open-contact"));
    if (action === "faq") root.dispatchEvent(new CustomEvent("racelia:open-faq"));
    if (action === "shipping") root.dispatchEvent(new CustomEvent("racelia:open-shipping"));
  });

  document.addEventListener("pointerdown", (event) => {
    if (!topbar.classList.contains("is-mega-open")) return;
    if (mega.contains(event.target)) return;
    if (event.target.closest?.("[data-mega] .topbar-nav__btn")) return;
    if (event.target.closest?.(".topbar-lang")) return;
    closeMega();
  });

  root.addEventListener("racelia:locale-changed", () => {
    if (!activeKey) return;
    const trigger = topbar.querySelector(".topbar-nav__item.is-mega-active .topbar-nav__btn");
    showPanel(activeKey, trigger);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMega();
  });

  window.addEventListener("resize", () => {
    if (!isDesktop()) closeMega();
  });
}
