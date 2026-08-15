import { getProductDetail } from "../js/productDetailData.js";
import { getCategoryProductById } from "../js/categoryData.js";
import { getCatalogProductById } from "../js/productCatalog.js";
import { getPdpImages, getCloserLookForColor } from "../js/productImages.js";
import { initPdpActionBar, updatePdpActionBar, resetPdpActionBar } from "./pdpActionBar.js";
import { syncBagCountFromDom } from "./cart.js";
import {
  refreshShoppingBagTotals,
  upsertBagLineItem,
} from "./bagHelpers.js";
import { syncWishlistHeartStates } from "./clientCartWishlist.js";
import { queueClientReviewForModeration } from "./dashboardReviewsData.js";
import { openPdpAddedOverlay } from "./cartAddedOverlay.js";
import { setFormStatus } from "./formStatus.js";

function starsHtml(count) {
  const n = Math.max(0, Math.min(5, Math.round(Number(count) || 0)));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function renderReviews(reviews, productName = "") {
  if (reviews.isEmpty) {
    return `
      <div class="pdp-reviews-empty">
        <div class="pdp-rs-score">0</div>
        <p class="pdp-reviews-empty__count">0 avis</p>
        <p class="pdp-reviews-empty__text">Aucun avis pour ${productName}. Soyez le premier à partager votre expérience.</p>
        <button class="pdp-add-review-btn" type="button" id="pdpAddReviewBtn">Écrire un avis</button>
      </div>
    `;
  }

  const bars = reviews.bars
    .map(
      (row) => `
      <div class="pdp-rs-row">
        <span class="pdp-rs-star">★ ${row.stars}</span>
        <span class="pdp-rs-bar"><span style="width:${row.pct}%"></span></span>
        <span class="pdp-rs-pct">${row.pct}%</span>
      </div>`
    )
    .join("");

  const chips = (reviews.chips || [])
    .map((chip) => `<span class="pdp-rs-chip">${chip}</span>`)
    .join("");

  const cards = reviews.items
    .map(
      (item) => `
      <div class="pdp-review-card">
        <div class="pdp-rv-meta"><span>${item.meta}</span><span>${starsHtml(item.stars)}</span></div>
        <div class="pdp-rv-title">${item.title}</div>
        <div class="pdp-rv-text">${item.text}</div>
        <span class="pdp-rv-verified">Avis vérifié</span>
      </div>`
    )
    .join("");

  return `
    <div class="pdp-reviews-summary">
      <div class="pdp-rs-top">
        <div class="pdp-rs-score">${reviews.score}</div>
        <div>
          <div class="pdp-rs-stars">${starsHtml(reviews.score)}</div>
          <div class="pdp-rs-count">${reviews.count}</div>
        </div>
      </div>
      ${chips ? `<div class="pdp-rs-label">Les clients décrivent ce produit comme :</div><div class="pdp-rs-chips">${chips}</div>` : ""}
      <div class="pdp-rs-bars">${bars}</div>
    </div>
    ${cards}
    <button class="pdp-add-review-btn pdp-add-review-btn--inline" type="button" id="pdpAddReviewBtn">Écrire un avis</button>
  `;
}

function applyPdpColorImages(root, colorIndex = 0) {
  const page = root.querySelector("#productDetailPage");
  const productId = page?.dataset.activeProductId;
  const catalogProduct = productId ? getCatalogProductById(productId) : null;
  if (!page || !catalogProduct) return;

  const images = getPdpImages(catalogProduct, colorIndex);
  const closer = getCloserLookForColor(catalogProduct, colorIndex);
  const slides = page.querySelector("#pdpSlides");
  if (slides && images.length) {
    slides.innerHTML = images
      .map(
        (src) =>
          `<img src="${src}" alt="${catalogProduct.name}" loading="lazy" onerror="this.style.visibility='hidden'" />`
      )
      .join("");
    slides.scrollTo({ left: 0 });
  }

  const closerSection = page.querySelector(".pdp-closer-look:not(.pdp-closer-look--frame)");
  if (closerSection) {
    const img = closerSection.querySelector("img");
    if (img && closer.image) img.src = closer.image;
  }

  page.querySelectorAll(".pdp-closer-look--frame").forEach((section, index) => {
    const img = section.querySelector("img");
    const src = closer.extra?.[index];
    if (img && src) img.src = src;
  });

  initProductDetailSlider(root);
}

function getPdpReviewOverlayHtml(productName) {
  return `
    <div class="pdp-review-overlay" id="pdpReviewOverlay" aria-hidden="true">
      <div class="pdp-review-sheet" role="dialog" aria-labelledby="pdp-review-title">
        <div class="pdp-review-sheet__head">
          <h3 id="pdp-review-title">Écrire un avis</h3>
          <button type="button" class="pdp-review-sheet__close" id="pdpReviewClose">Fermer</button>
        </div>
        <form id="pdpReviewForm" class="pdp-review-form">
          <input type="hidden" id="pdp-review-product-name" value="${productName.replace(/"/g, "&quot;")}" />
          <div class="pdp-review-field">
            <label for="pdp-review-author">Votre nom</label>
            <input type="text" id="pdp-review-author" required />
          </div>
          <div class="pdp-review-field">
            <label>Note</label>
            <div class="pdp-review-stars" id="pdp-review-stars">
              ${[1, 2, 3, 4, 5]
                .map(
                  (n) =>
                    `<button type="button" class="pdp-review-star" data-star="${n}" aria-label="${n} étoile${n > 1 ? "s" : ""}">★</button>`
                )
                .join("")}
            </div>
          </div>
          <div class="pdp-review-field">
            <label for="pdp-review-comment">Votre avis</label>
            <textarea id="pdp-review-comment" rows="4" required></textarea>
          </div>
          <button type="submit" class="pdp-review-submit">Envoyer pour validation</button>
        </form>
      </div>
    </div>
  `;
}

function bindPdpReviewOverlay(root) {
  const page = root.querySelector("#productDetailPage");
  if (!page || page.dataset.reviewBound === "true") return;

  let overlay = page.querySelector("#pdpReviewOverlay");
  if (!overlay) {
    page.insertAdjacentHTML("beforeend", getPdpReviewOverlayHtml(""));
    overlay = page.querySelector("#pdpReviewOverlay");
  }

  const open = () => {
    const productId = page.dataset.activeProductId;
    const product = productId ? getProductDetail(productId) : null;
    const nameInput = page.querySelector("#pdp-review-product-name");
    if (nameInput && product) nameInput.value = product.name;
    overlay?.classList.add("open");
    overlay?.setAttribute("aria-hidden", "false");
  };

  const close = () => {
    overlay?.classList.remove("open");
    overlay?.setAttribute("aria-hidden", "true");
  };

  page.addEventListener("click", (event) => {
    if (event.target.closest("#pdpAddReviewBtn")) {
      event.preventDefault();
      closePdpCommentsDrawer(root);
      open();
    }
    if (event.target.closest("#pdpReviewClose") || event.target === overlay) {
      close();
    }
  });

  const starsWrap = page.querySelector("#pdp-review-stars");
  let selectedStars = 5;
  starsWrap?.querySelectorAll(".pdp-review-star").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedStars = Number(btn.dataset.star) || 5;
      starsWrap.querySelectorAll(".pdp-review-star").forEach((star) => {
        star.classList.toggle("is-active", Number(star.dataset.star) <= selectedStars);
      });
    });
  });
  starsWrap?.querySelector('[data-star="5"]')?.classList.add("is-active");

  page.querySelector("#pdpReviewForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const productId = page.dataset.activeProductId;
    const product = productId ? getProductDetail(productId) : null;
    const author = page.querySelector("#pdp-review-author")?.value.trim();
    const comment = page.querySelector("#pdp-review-comment")?.value.trim();
    if (!author || !comment || !product) return;

    const review = {
      id: `review-${Date.now()}`,
      name: author,
      author,
      product: product.name,
      productSlug: product.id,
      stars: selectedStars,
      comment,
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    queueClientReviewForModeration(review);
    setFormStatus(event.target, "Merci. Votre avis a été envoyé pour validation.", "ok");
    event.target.reset();
    close();
  });

  page.dataset.reviewBound = "true";
}

function renderCloserLookExtras(extras, productName) {
  return extras
    .map(
      (src, index) => `
      <section class="pdp-closer-look pdp-closer-look--frame">
        <img src="${src}" alt="${productName} détail ${index + 2}" loading="lazy" />
      </section>`
    )
    .join("");
}

export function openPdpVirtualTryOn(root) {
  const page = root.querySelector("#productDetailPage");
  const backdrop = root.querySelector("#pdpVtoBackdrop");
  const panel = root.querySelector("#pdpVtoPanel");
  const img = root.querySelector("#pdpVtoImg");
  const title = root.querySelector("#pdpVtoTitle");
  const color = root.querySelector("#pdpVtoColor");
  if (!page || page.hidden || !backdrop || !panel || !img) return;

  const heroImg = page.querySelector("#pdpSlides img");
  const productTitle = page.querySelector(".pdp-title")?.textContent?.trim() || "Sac RACÈLIA";
  const activeSwatch = page.querySelector(".pdp-swatch.is-active");
  const colorLabel = activeSwatch?.getAttribute("aria-label") || activeSwatch?.dataset.color || "Couleur sélectionnée";

  img.src = heroImg?.getAttribute("src") || "";
  img.alt = `${productTitle} — aperçu essayage virtuel`;
  if (title) title.textContent = productTitle;
  if (color) color.textContent = colorLabel;

  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  document.body.classList.add("pdp-vto-open");
}

export function closePdpVirtualTryOn(root) {
  const backdrop = root.querySelector("#pdpVtoBackdrop");
  const panel = root.querySelector("#pdpVtoPanel");
  if (!backdrop || !panel) return;

  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("pdp-vto-open");
}

function openPdpCommentsDrawer(root) {
  /* legacy no-op: comments now live in-page under FAQ */
}

function closePdpCommentsDrawer(root) {
  document.body.classList.remove("pdp-comments-open");
}

function scrollToPdpComments(root) {
  const page = root.querySelector("#productDetailPage");
  const section = page?.querySelector("#pdpComments");
  if (!section) return;
  const top = section.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function renderProductDescription(product) {
  const description =
    product.description ||
    `${product.name} — pièce signature RACÈLIA, conçue pour le quotidien avec une finition raffinée.`;

  const details = Array.isArray(product.details) ? product.details.filter(Boolean) : [];
  const detailsHtml = details.length
    ? details.map((line) => `<li>${line}</li>`).join("")
    : `<li>Détails à venir.</li>`;

  return `
    <section class="pdp-description">
      <h2 class="pdp-description__title">Description du produit</h2>
      <p class="pdp-description__text">${description}</p>
      <h3 class="pdp-description__subtitle">Détails du produit</h3>
      <ul class="pdp-description__list">${detailsHtml}</ul>
    </section>`;
}

function renderPdpFaq() {
  const items = [
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8l8-5 8 5v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/><path d="M4 8l8 5 8-5"/></svg>`,
      q: "Quand recevrai-je ma commande ?",
      a: "Les commandes sont préparées sous 24–48 h. La livraison standard prend généralement 2 à 5 jours ouvrés selon votre wilaya.",
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 14l-4-4 4-4"/><path d="M5 10h11a4 4 0 0 1 0 8h-3"/></svg>`,
      q: "Quelle est la politique de retour ?",
      a: "Vous pouvez retourner un article non utilisé sous 14 jours après réception. Contactez le service client pour organiser le retour.",
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.6 13.5l-1.2-6.2A2 2 0 0 0 17.4 5.5H6.6a2 2 0 0 0-2 1.8l-1.2 6.2"/><path d="M4 13.5h16v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2z"/><circle cx="8.5" cy="16.5" r=".8" fill="currentColor"/><circle cx="15.5" cy="16.5" r=".8" fill="currentColor"/></svg>`,
      q: "Est-ce que tous les achats sont des ventes finales ?",
      a: "Non. Seuls les articles soldés ou personnalisés peuvent être exclus des retours. Les autres articles restent éligibles selon notre politique.",
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>`,
      q: "Quels sont les délais de traitement ?",
      a: "Chaque commande est vérifiée et emballée avec soin. Le traitement prend en moyenne 1 à 2 jours ouvrés avant expédition.",
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="1" style="fill:currentColor;stroke:none"/></svg>`,
      q: "Où sont fabriqués vos produits ?",
      a: "Nos pièces RACÈLIA sont conçues avec attention et fabriquées par des ateliers partenaires sélectionnés pour leur savoir-faire.",
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1" y="8" width="12" height="8" rx="1"/><path d="M13 10h4l3 3v3h-7v-6z"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
      q: "Combien coûte la livraison ?",
      a: "Les frais de livraison dépendent de votre wilaya et sont calculés au moment du paiement. Certaines offres peuvent inclure la livraison offerte.",
    },
  ];

  return `
    <section class="pdp-faq" id="pdpFaq">
      <h2 class="pdp-faq__title">Foire aux questions</h2>
      <div class="pdp-faq__list">
        ${items
          .map(
            (item, index) => `
          <div class="pdp-faq__item">
            <button type="button" class="pdp-faq__question" aria-expanded="false" aria-controls="pdpFaqAnswer${index}">
              <span class="pdp-faq__icon" aria-hidden="true">${item.icon}</span>
              <span class="pdp-faq__q-text">${item.q}</span>
              <span class="pdp-faq__chev" aria-hidden="true"></span>
            </button>
            <div class="pdp-faq__answer" id="pdpFaqAnswer${index}" hidden>
              <p>${item.a}</p>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </section>`;
}

function bagPlusIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6"/><path d="M12 9v4"/><path d="M10 11h4"/></svg>`;
}

function rateStarIcon() {
  return `<svg class="pdp-comments-btn__star" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.5 7.2 18.1l.9-5.4-3.9-3.8 5.4-.8L12 3.2z"/></svg>`;
}

function renderCommentsSection(product) {
  const reviews = product.reviews || {};
  const total = Number(reviews.totalCount || 0);
  const score = reviews.score || "0";
  const items = reviews.items || [];

  const listHtml = items.length
    ? items
        .map((item) => {
          const initial = (item.author || "G").trim().charAt(0).toUpperCase();
          const photo = item.photo
            ? `<img class="pdp-comments__avatar-img" src="${item.photo}" alt="" />`
            : `<span class="pdp-comments__avatar-fallback">${initial}</span>`;
          return `
            <article class="pdp-comments__card">
              <div class="pdp-comments__card-head">
                <div class="pdp-comments__avatar">${photo}</div>
                <div class="pdp-comments__meta">
                  <p class="pdp-comments__name">${item.author || "Invité"}</p>
                  <p class="pdp-comments__stars" aria-label="${item.stars} étoile${item.stars > 1 ? "s" : ""}">${starsHtml(item.stars)}</p>
                </div>
              </div>
              <p class="pdp-comments__text">${item.text || ""}</p>
            </article>`;
        })
        .join("")
    : `<p class="pdp-comments__empty">Aucun avis pour le moment. Soyez le premier à partager votre expérience.</p>`;

  return `
    <section class="pdp-comments" id="pdpComments">
      <div class="pdp-comments__head">
        <h2 class="pdp-comments__title">Avis</h2>
        <p class="pdp-comments__summary">
          <span class="pdp-comments__score">${score}</span>
          <span class="pdp-comments__summary-stars">${starsHtml(Number(score) || 0)}</span>
          <span class="pdp-comments__count">${total} avis</span>
        </p>
      </div>
      <div class="pdp-comments__list">${listHtml}</div>
      <button type="button" class="pdp-comments__write" id="pdpAddReviewBtn">Écrire un avis</button>
    </section>`;
}

export function renderProductDetail(product) {
  const swatches = product.swatches
    .map(
      (swatch, index) =>
        `<button type="button" class="pdp-swatch${swatch.active || index === 0 ? " is-active" : ""}" style="background:${swatch.style}" data-color="${swatch.label}" data-color-index="${swatch.index ?? index}" aria-label="${swatch.label}"></button>`
    )
    .join("");

  const images = product.images
    .map((src) => `<img src="${src}" alt="${product.name}" loading="lazy" onerror="this.style.visibility='hidden'" />`)
    .join("");

  const dots = product.images
    .map(
      (_, index) =>
        `<button type="button" class="pdp-dot${index === 0 ? " is-active" : ""}" data-dot-index="${index}" aria-label="Image ${index + 1}"></button>`
    )
    .join("");

  const stockBadge = product.stockNote
    ? `<span class="pdp-badge pdp-badge--${product.stockNote}">${
        product.stockNote === "sold-out"
          ? "ÉPUISÉ"
          : product.stockNote === "dispo"
            ? "DISPO"
            : product.stockNote === "not"
              ? "INDISPONIBLE"
              : "NOUVEAU"
      }</span>`
    : "";
  const tagBadge = product.tag ? `<span class="pdp-badge pdp-badge--tag">${product.tag}</span>` : "";
  const packBadge = product.isPack
    ? `<span class="pdp-badge pdp-badge--pack">${product.packLabel || "PACK"}</span>`
    : "";

  const reviewScore = product.reviews?.score || "0";

  return `
    <section class="pdp-hero" id="pdpHero">
      <div class="pdp-hero__media">
        <div class="pdp-slides" id="pdpSlides">${images}</div>
      </div>
      <div class="pdp-dots" id="pdpDots" role="tablist" aria-label="Images du produit">${dots}</div>
    </section>

    <section class="pdp-sheet" id="pdpSheet">
      <div class="pdp-title-block">
        <div class="pdp-badges">${stockBadge}${tagBadge}${packBadge}</div>
        <h1 class="pdp-title">${product.name}</h1>
        <div class="pdp-price" data-price-eur="${product.priceEur ?? ""}">${product.price}</div>
        <div class="pdp-swatches">${swatches}</div>
      </div>

      <div class="pdp-action-bar-wrap" id="pdpActionBarWrap">
        <div class="pdp-action-bar" id="pdpActionBar">
          <div class="pdp-qty" id="pdpQtyBtn">
            <button type="button" class="pdp-qty__btn" id="pdpQtyMinus" aria-label="Diminuer la quantité">−</button>
            <span id="pdpQtyNum">1</span>
            <button type="button" class="pdp-qty__btn" id="pdpQtyPlus" aria-label="Augmenter la quantité">+</button>
          </div>
          <button class="pdp-add-btn" id="pdpAddBtn" type="button">AJOUTER LE PRODUIT</button>
          <button type="button" class="pdp-comments-btn" id="pdpCommentsBtn" aria-label="Voir la note et les avis">
            ${rateStarIcon()}
            <span class="pdp-comments-btn__score">${reviewScore}</span>
          </button>
        </div>
      </div>

      ${renderProductDescription(product)}

      <section class="pdp-closer-look">
        <img src="${product.closerLook.image}" alt="${product.closerLook.title}" loading="lazy" />
        <h2 class="pdp-cl-title">${product.closerLook.title}</h2>
        <p class="pdp-cl-text">${product.closerLook.text}</p>
      </section>

      ${renderCloserLookExtras(product.closerLookExtra, product.name)}

      <section class="pdp-also-like">
        <h2 class="pdp-also-like__title">Vous aimerez aussi</h2>
        <div class="pdp-also-like__grid" id="pdpAlsoLikeGrid"></div>
      </section>

      ${renderPdpFaq()}

      ${renderCommentsSection(product)}

      <div class="pdp-footer-space"></div>
    </section>
  `;
}

export function initProductDetailPage(root, { onProductSelect } = {}) {
  const page = root.querySelector("#productDetailPage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  initPdpActionBar(root);

  page.addEventListener("click", (event) => {
    const productCard = event.target.closest(".js-product-open");
    if (productCard?.dataset.productId && page.contains(productCard)) {
      if (event.target.closest("button")) return;
      onProductSelect?.(productCard.dataset.productId);
      return;
    }

    const swatch = event.target.closest(".pdp-swatch");
    if (swatch) {
      page.querySelectorAll(".pdp-swatch").forEach((item) => item.classList.remove("is-active"));
      swatch.classList.add("is-active");
      applyPdpColorImages(root, Number(swatch.dataset.colorIndex || 0));
      return;
    }

    const tab = event.target.closest(".pdp-tab");
    if (tab) {
      page.querySelectorAll(".pdp-tab").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      const accordion = page.querySelector("#pdpAccordion");
      if (accordion) accordion.hidden = target !== "details";
      page.querySelectorAll(".pdp-tab-panel").forEach((panel) => panel.classList.remove("active"));
      const panelMap = {
        details: "pdpPanelDetails",
        reviews: "pdpPanelReviews",
        foryou: "pdpPanelForyou",
      };
      page.querySelector(`#${panelMap[target]}`)?.classList.add("active");
      return;
    }

    const accHeader = event.target.closest(".pdp-acc-header");
    if (accHeader) {
      accHeader.closest(".pdp-acc-item")?.classList.toggle("open");
      return;
    }

    const faqBtn = event.target.closest(".pdp-faq__question");
    if (faqBtn) {
      const item = faqBtn.closest(".pdp-faq__item");
      const answer = item?.querySelector(".pdp-faq__answer");
      const open = faqBtn.getAttribute("aria-expanded") === "true";
      page.querySelectorAll(".pdp-faq__question").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        btn.closest(".pdp-faq__item")?.classList.remove("is-open");
        const ans = btn.closest(".pdp-faq__item")?.querySelector(".pdp-faq__answer");
        if (ans) ans.hidden = true;
      });
      if (!open && answer) {
        faqBtn.setAttribute("aria-expanded", "true");
        item?.classList.add("is-open");
        answer.hidden = false;
      }
      return;
    }

    if (event.target.closest("#pdpCommentsBtn")) {
      scrollToPdpComments(root);
      return;
    }

    if (event.target.closest("#pdpQtyMinus")) {
      event.stopPropagation();
      const qtyEl = page.querySelector("#pdpQtyNum");
      if (qtyEl) qtyEl.textContent = String(Math.max(1, Number(qtyEl.textContent || 1) - 1));
      return;
    }

    if (event.target.closest("#pdpQtyPlus")) {
      event.stopPropagation();
      const qtyEl = page.querySelector("#pdpQtyNum");
      if (qtyEl) qtyEl.textContent = String(Math.min(99, Number(qtyEl.textContent || 1) + 1));
      return;
    }

    if (event.target.closest(".pdp-virtual-try-on")) {
      event.stopPropagation();
      openPdpVirtualTryOn(root);
      return;
    }

    if (event.target.closest("#pdpVtoClose") || event.target.closest("#pdpVtoBackdrop")) {
      closePdpVirtualTryOn(root);
      return;
    }

    if (event.target.closest("#pdpAddBtn")) {
      const quantity = getPdpQuantity(root);
      syncPdpToBag(root, quantity, "add");
      syncBagCountFromDom(root);
      refreshShoppingBagTotals(root);
      openPdpAddedOverlay(root, quantity);
      return;
    }

    if (event.target.closest(".pdp-view-all")) {
      return;
    }
  });
}

export function initProductDetailSlider(root) {
  const page = root.querySelector("#productDetailPage");
  const slides = page?.querySelector("#pdpSlides");
  const dots = page?.querySelector("#pdpDots");
  if (!slides) return;

  const images = [...slides.querySelectorAll("img")];
  const count = images.length;
  if (!count) return;

  const setActive = (index) => {
    const safe = Math.min(count - 1, Math.max(0, index));
    dots?.querySelectorAll(".pdp-dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === safe);
    });
  };

  setActive(0);
  slides.scrollLeft = 0;

  let raf;
  slides.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const index = Math.round(slides.scrollLeft / slides.clientWidth);
        setActive(index);
      });
    },
    { passive: true }
  );

  dots?.addEventListener("click", (event) => {
    const dot = event.target.closest(".pdp-dot");
    if (!dot) return;
    const index = Number(dot.dataset.dotIndex || 0);
    slides.scrollTo({ left: index * slides.clientWidth, behavior: "smooth" });
    setActive(index);
  });
}

function createAlsoLikeCard(product) {
  const card = document.createElement("article");
  card.className = "pdp-like-card js-product-open";
  card.dataset.productId = product.id;
  const image = product.images?.[0] || "";
  card.innerHTML = `
    <div class="pdp-like-card__media">
      <img src="${image}" alt="${product.name}" loading="lazy" onerror="this.style.visibility='hidden'" />
      <button type="button" class="pdp-like-card__add" aria-label="Ajouter ${product.name} au panier">
        ${bagPlusIcon()}
      </button>
    </div>
    <h3 class="pdp-like-card__name">${product.name}</h3>
    <p class="pdp-like-card__price" data-price-eur="${product.priceEur ?? ""}">${product.price}</p>
  `;
  return card;
}

function mountRelatedProducts(root, product) {
  const alsoLikeRoot = root.querySelector("#pdpAlsoLikeGrid");
  if (!alsoLikeRoot) return;

  alsoLikeRoot.replaceChildren();
  const ids = [...new Set([...(product.forYou || []), ...(product.similar || [])])].slice(0, 4);
  ids.forEach((id) => {
    const item = getCategoryProductById(id);
    if (item) alsoLikeRoot.appendChild(createAlsoLikeCard(item));
  });

  alsoLikeRoot.querySelectorAll(".pdp-like-card__add").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const card = btn.closest(".pdp-like-card");
      const productId = card?.dataset.productId;
      const detail = productId ? getProductDetail(productId) : null;
      if (!detail) return;
      upsertBagLineItem(root, {
        productId: detail.id,
        name: detail.name,
        priceEur: detail.priceEur,
        color: "",
        imageUrl: detail.images?.[0] || "",
        qty: 1,
        mode: "add",
      });
      syncBagCountFromDom(root);
      refreshShoppingBagTotals(root);
      openPdpAddedOverlay(root, 1);
    });
  });
}

function getPdpColorLabel(root) {
  const page = root.querySelector("#productDetailPage");
  const activeSwatch = page?.querySelector(".pdp-swatch.is-active");
  return activeSwatch?.getAttribute("aria-label") || activeSwatch?.dataset.color || "";
}

function getPdpQuantity(root) {
  const qty = root.querySelector("#productDetailPage #pdpQtyNum");
  return Math.max(1, Number(qty?.textContent || 1));
}

function syncPdpToBag(root, quantity, mode = "set") {
  const page = root.querySelector("#productDetailPage");
  const productId = page?.dataset.activeProductId;
  const product = productId ? getProductDetail(productId) : null;
  if (!product) return false;

  const heroImg = page.querySelector("#pdpSlides img");
  return upsertBagLineItem(root, {
    productId: product.id,
    name: product.name,
    priceEur: product.priceEur,
    color: getPdpColorLabel(root),
    imageUrl: heroImg?.getAttribute("src") || product.images?.[0] || "",
    qty: quantity,
    mode,
  });
}

export function mountProductDetail(root, productId) {
  const product = getProductDetail(productId);
  const pdpRoot = root.querySelector("#pdpRoot");
  if (!product || !pdpRoot) return false;

  const page = root.querySelector("#productDetailPage");
  if (page) page.dataset.activeProductId = productId;

  /* Clear docked/orphan bars before re-render (dock lives outside #pdpRoot). */
  resetPdpActionBar(root);
  root.querySelectorAll(".pdp-action-bar").forEach((el) => {
    if (!pdpRoot.contains(el)) el.remove();
  });

  pdpRoot.innerHTML = renderProductDetail(product);
  initProductDetailSlider(root);
  bindPdpReviewOverlay(root);
  mountRelatedProducts(root, product);
  updatePdpActionBar(root);
  syncWishlistHeartStates(root);
  return true;
}
