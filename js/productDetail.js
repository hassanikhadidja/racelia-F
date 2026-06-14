import { getProductDetail } from "../js/productDetailData.js";
import { getCategoryProductById } from "../js/categoryData.js";
import { getCatalogProductById } from "../js/productCatalog.js";
import { getPdpImages, getCloserLookForColor } from "../js/productImages.js";
import { createCategoryProduct } from "../components/CategoryProduct.js";
import { initProductSliders } from "./productSliders.js";
import { initPdpActionBar, updatePdpActionBar } from "./pdpActionBar.js";
import { addToBag } from "./cart.js";
import { upsertBagLineItem } from "./bagHelpers.js";
import { queueClientReviewForModeration } from "./dashboardReviewsData.js";

function starsHtml(count) {
  const n = Math.max(0, Math.min(5, Math.round(Number(count) || 0)));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function renderReviews(reviews, productName = "") {
  if (reviews.isEmpty) {
    return `
      <div class="pdp-reviews-empty">
        <div class="pdp-rs-score">0</div>
        <p class="pdp-reviews-empty__count">0 Reviews</p>
        <p class="pdp-reviews-empty__text">No reviews yet for ${productName}. Be the first to share your experience.</p>
        <button class="pdp-add-review-btn" type="button" id="pdpAddReviewBtn">Write a review</button>
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
        <span class="pdp-rv-verified">Verified review</span>
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
      ${chips ? `<div class="pdp-rs-label">Customers describe this product as:</div><div class="pdp-rs-chips">${chips}</div>` : ""}
      <div class="pdp-rs-bars">${bars}</div>
    </div>
    ${cards}
    <button class="pdp-add-review-btn pdp-add-review-btn--inline" type="button" id="pdpAddReviewBtn">Write a review</button>
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
          <h3 id="pdp-review-title">Write a review</h3>
          <button type="button" class="pdp-review-sheet__close" id="pdpReviewClose">Close</button>
        </div>
        <form id="pdpReviewForm" class="pdp-review-form">
          <input type="hidden" id="pdp-review-product-name" value="${productName.replace(/"/g, "&quot;")}" />
          <div class="pdp-review-field">
            <label for="pdp-review-author">Your name</label>
            <input type="text" id="pdp-review-author" required />
          </div>
          <div class="pdp-review-field">
            <label>Rating</label>
            <div class="pdp-review-stars" id="pdp-review-stars">
              ${[1, 2, 3, 4, 5]
                .map(
                  (n) =>
                    `<button type="button" class="pdp-review-star" data-star="${n}" aria-label="${n} stars">★</button>`
                )
                .join("")}
            </div>
          </div>
          <div class="pdp-review-field">
            <label for="pdp-review-comment">Your review</label>
            <textarea id="pdp-review-comment" rows="4" required></textarea>
          </div>
          <button type="submit" class="pdp-review-submit">Submit for approval</button>
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
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    queueClientReviewForModeration(review);
    window.alert("Thank you! Your review was sent to our team for approval.");
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
        <img src="${src}" alt="${productName} detail ${index + 2}" loading="lazy" />
      </section>`
    )
    .join("");
}

function resetPdpQtyMenuPosition(qtyMenu) {
  qtyMenu.classList.remove("is-viewport-fixed");
  qtyMenu.style.position = "";
  qtyMenu.style.top = "";
  qtyMenu.style.left = "";
  qtyMenu.style.bottom = "";
  qtyMenu.style.maxHeight = "";
}

function positionPdpQtyMenu(page) {
  const qtyBtn = page.querySelector("#pdpQtyBtn");
  const qtyMenu = page.querySelector("#pdpQtyMenu");
  const bar = page.querySelector("#pdpActionBar");
  if (!qtyBtn || !qtyMenu || !bar || !qtyMenu.classList.contains("open")) return;

  if (!bar.classList.contains("is-fixed")) {
    resetPdpQtyMenuPosition(qtyMenu);
    return;
  }

  const rect = qtyBtn.getBoundingClientRect();
  const spaceAbove = rect.top - 8;

  qtyMenu.classList.add("is-viewport-fixed");
  qtyMenu.style.left = `${rect.left}px`;
  qtyMenu.style.top = "auto";
  qtyMenu.style.bottom = `${window.innerHeight - rect.top + 8}px`;
  qtyMenu.style.maxHeight = `${Math.max(160, spaceAbove - 8)}px`;
}

export function openPdpAddedOverlay(root, quantity) {
  const page = root.querySelector("#productDetailPage");
  const backdrop = root.querySelector("#pdpAddedBackdrop");
  const overlay = root.querySelector("#pdpAddedOverlay");
  const count = root.querySelector("#pdpAddedCount");
  if (!page || !backdrop || !overlay) return;

  const qtyMenu = page.querySelector("#pdpQtyMenu");
  const qtyBtn = page.querySelector("#pdpQtyBtn");
  if (qtyMenu?.classList.contains("open")) {
    qtyMenu.classList.remove("open");
    qtyBtn?.classList.remove("open");
    resetPdpQtyMenuPosition(qtyMenu);
  }

  if (count) count.textContent = String(quantity);
  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("pdp-added-open");
}

export function closePdpAddedOverlay(root) {
  const backdrop = root.querySelector("#pdpAddedBackdrop");
  const overlay = root.querySelector("#pdpAddedOverlay");
  if (!backdrop || !overlay) return;

  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("pdp-added-open");
}

function renderVirtualTryOnAction() {
  return `
    <button class="pdp-virtual-try-on" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M12 5a7 7 0 0 1 7 7c0 5-7 11-7 11S5 17 5 12a7 7 0 0 1 7-7z"/>
        <circle cx="12" cy="12" r="2.5"/>
      </svg>
      Virtual Try-On
    </button>`;
}

function renderAccordionItem(item) {
  const hasTryOn = item.virtualTryOn || item.title === "SEE BAG SIZE";
  const contentClass = hasTryOn ? "pdp-acc-content pdp-acc-content--with-vto" : "pdp-acc-content";

  return `
    <div class="pdp-acc-item${hasTryOn ? " pdp-acc-item--bag-size" : ""}">
      <button class="pdp-acc-header" type="button">${item.title} <span class="pdp-acc-plus">+</span></button>
      <div class="${contentClass}">
        <p class="pdp-acc-text">${item.body}</p>
        ${hasTryOn ? renderVirtualTryOnAction() : ""}
      </div>
    </div>`;
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
  const productTitle = page.querySelector(".pdp-title")?.textContent?.trim() || "RACÈLIA Bag";
  const activeSwatch = page.querySelector(".pdp-swatch.is-active");
  const colorLabel = activeSwatch?.getAttribute("aria-label") || activeSwatch?.dataset.color || "Selected color";

  img.src = heroImg?.getAttribute("src") || "";
  img.alt = `${productTitle} virtual try-on preview`;
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

  const accordions = product.accordions.map((item) => renderAccordionItem(item)).join("");

  const stockBadge = product.stockNote
    ? `<span class="pdp-badge pdp-badge--${product.stockNote}">${
        product.stockNote === "sold-out"
          ? "SOLD OUT"
          : product.stockNote === "dispo"
            ? "DISPO"
            : product.stockNote === "not"
              ? "NOT AVAILABLE"
              : "NEW"
      }</span>`
    : "";
  const tagBadge = product.tag ? `<span class="pdp-badge pdp-badge--tag">${product.tag}</span>` : "";
  const packBadge = product.isPack
    ? `<span class="pdp-badge pdp-badge--pack">${product.packLabel || "PACK"}</span>`
    : "";

  return `
    <section class="pdp-hero" id="pdpHero">
      <div class="pdp-hero__media">
        <div class="pdp-slides" id="pdpSlides">${images}</div>
      </div>
      <div class="pdp-hero__card">
        <div class="pdp-progress">
          <div class="pdp-progress-bar">
            <div class="pdp-progress-fill" id="pdpProgressFill"></div>
          </div>
        </div>
        <div class="pdp-hero__price" data-price-eur="${product.priceEur ?? ""}">${product.price}</div>
        <div class="pdp-swatches">${swatches}</div>
      </div>
    </section>

    <section class="pdp-sheet" id="pdpSheet">
      <div class="pdp-title-block">
        <div class="pdp-badges">${stockBadge}${tagBadge}${packBadge}</div>
        <h1 class="pdp-title">${product.name}</h1>
      </div>

      <div class="pdp-action-bar-wrap" id="pdpActionBarWrap">
        <div class="pdp-action-bar" id="pdpActionBar">
          <div class="pdp-qty" id="pdpQtyBtn">
            <span id="pdpQtyNum">1</span>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3,7 6,4 9,7"/></svg>
            <div class="pdp-qty-menu" id="pdpQtyMenu"></div>
          </div>
          <button class="pdp-add-btn" id="pdpAddBtn" type="button">Add to Bag</button>
          <button class="pdp-buy-btn" id="pdpBuyBtn" type="button">Buy Now</button>
        </div>
      </div>

      <div class="pdp-shipping">
        Shipping And Returns
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="8.01"/><path d="M11 12h1v4h1"/></svg>
      </div>

      <div class="pdp-tabs" role="tablist">
        <button class="pdp-tab active" type="button" data-tab="details" role="tab">Details</button>
        <button class="pdp-tab" type="button" data-tab="reviews" role="tab">Reviews</button>
        <button class="pdp-tab" type="button" data-tab="foryou" role="tab">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/></svg>
          For You
        </button>
      </div>

      <div class="pdp-accordion" id="pdpAccordion">${accordions}</div>

      <div class="pdp-tab-panel active" id="pdpPanelDetails"></div>

      <div class="pdp-tab-panel" id="pdpPanelReviews">${renderReviews(product.reviews, product.name)}</div>

      <div class="pdp-tab-panel" id="pdpPanelForyou">
        <div class="pdp-foryou-grid" id="pdpForYouGrid"></div>
      </div>

      <section class="pdp-closer-look">
        <img src="${product.closerLook.image}" alt="${product.closerLook.title}" loading="lazy" />
        <h2 class="pdp-cl-title">${product.closerLook.title}</h2>
        <p class="pdp-cl-text">${product.closerLook.text}</p>
      </section>

      ${renderCloserLookExtras(product.closerLookExtra, product.name)}

      <section class="pdp-similar">
        <h2 class="pdp-similar-title">Similar Styles</h2>
        <div class="pdp-similar-scroll" id="pdpSimilarGrid"></div>
      </section>

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

    const wishlist = event.target.closest(".wishlist-btn");
    if (wishlist && page.contains(wishlist)) {
      event.stopPropagation();
      wishlist.classList.toggle("active");
      return;
    }

    const accHeader = event.target.closest(".pdp-acc-header");
    if (accHeader) {
      accHeader.closest(".pdp-acc-item")?.classList.toggle("open");
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
      const qty = page.querySelector("#pdpQtyNum");
      const quantity = Number(qty?.textContent || 1);
      addToBag(root, quantity);
      openPdpAddedOverlay(root, quantity);
      return;
    }

    if (event.target.closest("#pdpAddedClose")) {
      closePdpAddedOverlay(root);
      return;
    }

    if (event.target.closest("#pdpBuyBtn")) {
      event.preventDefault();
      proceedToCheckoutFromPdp(root, { quantity: getPdpQuantity(root), mode: "set" });
      return;
    }

    if (event.target.closest(".pdp-added-checkout")) {
      event.preventDefault();
      const addedQty = Number(root.querySelector("#pdpAddedCount")?.textContent || 1);
      proceedToCheckoutFromPdp(root, { quantity: addedQty, mode: "add" });
      return;
    }

    if (event.target.closest(".pdp-added-view")) {
      event.preventDefault();
      const addedQty = Number(root.querySelector("#pdpAddedCount")?.textContent || 1);
      proceedToShoppingBagFromPdp(root, { quantity: addedQty, mode: "add" });
      return;
    }

    if (event.target.closest(".pdp-view-all")) {
      window.alert("View all reviews (demo)");
    }
  });

  page.addEventListener("click", (event) => {
    const qtyBtn = page.querySelector("#pdpQtyBtn");
    const qtyMenu = page.querySelector("#pdpQtyMenu");
    if (!qtyBtn || !qtyMenu) return;

    if (event.target.closest("#pdpQtyBtn")) {
      event.stopPropagation();
      const isOpen = qtyMenu.classList.contains("open");
      if (isOpen) {
        qtyMenu.classList.remove("open");
        qtyBtn.classList.remove("open");
        resetPdpQtyMenuPosition(qtyMenu);
      } else {
        qtyMenu.innerHTML = "";
        const current = Number(page.querySelector("#pdpQtyNum")?.textContent || 1);
        for (let i = 1; i <= 10; i += 1) {
          const opt = document.createElement("button");
          opt.type = "button";
          opt.className = `pdp-qty-option${i === current ? " is-selected" : ""}`;
          opt.textContent = String(i);
          opt.addEventListener("click", (e) => {
            e.stopPropagation();
            page.querySelector("#pdpQtyNum").textContent = String(i);
            qtyMenu.classList.remove("open");
            qtyBtn.classList.remove("open");
            resetPdpQtyMenuPosition(qtyMenu);
          });
          qtyMenu.appendChild(opt);
        }
        qtyMenu.classList.add("open");
        qtyBtn.classList.add("open");
        positionPdpQtyMenu(page);
      }
      return;
    }

    if (!event.target.closest("#pdpQtyBtn")) {
      qtyMenu.classList.remove("open");
      qtyBtn.classList.remove("open");
      resetPdpQtyMenuPosition(qtyMenu);
    }
  });

  const syncQtyMenuPosition = () => positionPdpQtyMenu(page);
  window.addEventListener("scroll", syncQtyMenuPosition, { passive: true });
  window.addEventListener("resize", syncQtyMenuPosition);
}

export function initProductDetailSlider(root) {
  const page = root.querySelector("#productDetailPage");
  const slides = page?.querySelector("#pdpSlides");
  const fill = page?.querySelector("#pdpProgressFill");
  if (!slides || !fill) return;

  const count = slides.querySelectorAll("img").length;
  if (!count) return;

  const setActive = (index) => {
    fill.style.width = `${100 / count}%`;
    fill.style.left = `${(index / count) * 100}%`;
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

  page.querySelector(".pdp-progress-bar")?.addEventListener("click", (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.min(count - 1, Math.max(0, Math.floor(ratio * count)));
    slides.scrollTo({ left: index * slides.clientWidth, behavior: "smooth" });
    setActive(index);
  });
}

function initPdpRelatedProductCards(root, scope) {
  scope.querySelectorAll(".category-product__swatch").forEach((swatch) => {
    swatch.addEventListener("click", (event) => {
      event.stopPropagation();
      const group = swatch.closest(".category-product__swatches");
      group?.querySelectorAll(".category-product__swatch").forEach((item) => {
        item.classList.remove("is-selected");
      });
      swatch.classList.add("is-selected");
    });
  });

  scope.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      btn.classList.toggle("active");
    });
  });

  scope.querySelectorAll(".category-product__add").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      addToBag(root, 1);
    });
  });
}

function mountRelatedProducts(root, product) {
  const forYouRoot = root.querySelector("#pdpForYouGrid");
  const similarRoot = root.querySelector("#pdpSimilarGrid");

  if (forYouRoot) {
    forYouRoot.replaceChildren();
    product.forYou.forEach((id) => {
      const item = getCategoryProductById(id);
      if (item) forYouRoot.appendChild(createCategoryProduct(item));
    });
    initPdpRelatedProductCards(root, forYouRoot);
    initProductSliders(root, forYouRoot);
  }

  if (similarRoot) {
    similarRoot.replaceChildren();
    product.similar.forEach((id) => {
      const item = getCategoryProductById(id);
      if (item) similarRoot.appendChild(createCategoryProduct(item));
    });
    initPdpRelatedProductCards(root, similarRoot);
    initProductSliders(root, similarRoot);
  }
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

function proceedToCheckoutFromPdp(root, { quantity, mode = "set" }) {
  const qty = Math.max(1, Number(quantity) || 1);
  syncPdpToBag(root, qty, mode);
  addToBag(root, qty);
  closePdpAddedOverlay(root);
  root.dispatchEvent(new CustomEvent("racelia:open-checkout"));
}

function proceedToShoppingBagFromPdp(root, { quantity, mode = "add" }) {
  const qty = Math.max(1, Number(quantity) || 1);
  syncPdpToBag(root, qty, mode);
  addToBag(root, qty);
  closePdpAddedOverlay(root);
  root.dispatchEvent(new CustomEvent("racelia:open-shopping-bag"));
}

export function mountProductDetail(root, productId) {
  const product = getProductDetail(productId);
  const pdpRoot = root.querySelector("#pdpRoot");
  if (!product || !pdpRoot) return false;

  const page = root.querySelector("#productDetailPage");
  if (page) page.dataset.activeProductId = productId;

  pdpRoot.innerHTML = renderProductDetail(product);
  initProductDetailSlider(root);
  bindPdpReviewOverlay(root);
  mountRelatedProducts(root, product);
  updatePdpActionBar(root);
  return true;
}
