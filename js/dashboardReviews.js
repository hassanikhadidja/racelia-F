import { openProfileSheet, closeProfileSheet } from "./clientProfileSheets.js";
import {
  loadPublishedReviews,
  savePublishedReviews,
  loadPendingReviews,
  savePendingReviews,
  starsToLabel,
  getReviewStats,
} from "./dashboardReviewsData.js";
import { loadCatalogProducts } from "./productCatalog.js";
import { getDashboardAddReviewOverlayMarkup } from "./dashboardReviewsMarkup.js";
import {
  syncReviewPublish,
  syncReviewDelete,
  syncPublishedReviewCreate,
} from "./syncBackend.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function renderPublishedCard(review) {
  const photoHtml = review.photo
    ? `<div class="dashboard-review-card__photo"><img src="${escapeHtml(review.photo)}" alt="" loading="lazy" /></div>`
    : "";
  const sourceLabel =
    review.source === "client" ? '<span class="dashboard-review-card__tag">Client</span>' : "";

  return `<article class="review-card dashboard-review-card" data-review-id="${escapeHtml(review.id)}">
    <div class="review-top">
      <div>
        <div class="review-author">${escapeHtml(review.author)} ${sourceLabel}</div>
        <div class="review-product">${escapeHtml(review.product)}</div>
      </div>
      <div class="dashboard-review-card__meta">
        <div class="review-stars">${starsToLabel(review.stars)}</div>
        <div class="review-date">${escapeHtml(review.date)}</div>
      </div>
    </div>
    <p class="review-text">${escapeHtml(review.comment)}</p>
    ${photoHtml}
    <div class="dashboard-review-card__actions">
      <button type="button" class="dashboard-review-delete js-dash-review-delete-published" data-review-id="${escapeHtml(review.id)}">Delete</button>
    </div>
  </article>`;
}

function renderPendingCard(review) {
  const photoHtml = review.photo
    ? `<div class="dashboard-review-card__photo"><img src="${escapeHtml(review.photo)}" alt="" loading="lazy" /></div>`
    : "";

  return `<article class="review-card dashboard-review-card dashboard-review-card--pending" data-review-id="${escapeHtml(review.id)}">
    <div class="review-top">
      <div>
        <div class="review-author">${escapeHtml(review.author)} <span class="dashboard-review-card__tag dashboard-review-card__tag--pending">Client submission</span></div>
        <div class="review-product">${escapeHtml(review.product)}</div>
      </div>
      <div class="dashboard-review-card__meta">
        <div class="review-stars">${starsToLabel(review.stars)}</div>
        <div class="review-date">${escapeHtml(review.date)}</div>
      </div>
    </div>
    <p class="review-text">${escapeHtml(review.comment)}</p>
    ${photoHtml}
    <div class="dashboard-review-card__actions">
      <button type="button" class="dashboard-review-approve js-dash-review-approve" data-review-id="${escapeHtml(review.id)}">Publish on site</button>
      <button type="button" class="dashboard-review-reject js-dash-review-reject" data-review-id="${escapeHtml(review.id)}">Decline</button>
    </div>
  </article>`;
}

function updateSummary(page, published, pending) {
  const stats = getReviewStats(published);
  const avgEl = page.querySelector(".js-dash-review-avg");
  const totalEl = page.querySelector(".js-dash-review-total");
  const pendingCountEl = page.querySelector(".js-dash-review-pending-count");
  if (avgEl) avgEl.textContent = stats.average;
  if (totalEl) totalEl.textContent = String(stats.total);
  if (pendingCountEl) pendingCountEl.textContent = String(pending.length);

  const badge = page.querySelector(".js-dash-review-pending-badge");
  if (badge) {
    badge.textContent = String(pending.length);
    badge.hidden = pending.length === 0;
  }
}

export function renderDashboardReviews(page) {
  const published = loadPublishedReviews();
  const pending = loadPendingReviews();

  const publishedList = page.querySelector("#dashboard-reviews-published");
  const pendingList = page.querySelector("#dashboard-reviews-pending");
  const publishedEmpty = page.querySelector("#dashboard-reviews-published-empty");
  const pendingEmpty = page.querySelector("#dashboard-reviews-pending-empty");

  updateSummary(page, published, pending);

  if (publishedList) {
    publishedList.innerHTML = published.map(renderPublishedCard).join("");
    if (publishedEmpty) publishedEmpty.hidden = published.length > 0;
  }

  if (pendingList) {
    pendingList.innerHTML = pending.map(renderPendingCard).join("");
    if (pendingEmpty) pendingEmpty.hidden = pending.length > 0;
  }

  publishedList?.querySelectorAll(".js-dash-review-delete-published").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.reviewId;
      if (!id || !window.confirm("Delete this published review?")) return;
      const next = loadPublishedReviews().filter((r) => r.id !== id);
      savePublishedReviews(next);
      syncReviewDelete(id).catch(() => {});
      renderDashboardReviews(page);
    });
  });

  pendingList?.querySelectorAll(".js-dash-review-approve").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.reviewId;
      if (!id) return;
      const pendingReviews = loadPendingReviews();
      const item = pendingReviews.find((r) => r.id === id);
      if (!item) return;
      const publishedReviews = loadPublishedReviews();
      publishedReviews.unshift({ ...item, source: "client" });
      savePublishedReviews(publishedReviews);
      savePendingReviews(pendingReviews.filter((r) => r.id !== id));
      syncReviewPublish(id).catch(() => {});
      renderDashboardReviews(page);
    });
  });

  pendingList?.querySelectorAll(".js-dash-review-reject").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.reviewId;
      if (!id || !window.confirm("Decline and remove this client review?")) return;
      savePendingReviews(loadPendingReviews().filter((r) => r.id !== id));
      syncReviewDelete(id).catch(() => {});
      renderDashboardReviews(page);
    });
  });
}

function bindReviewsTabs(page) {
  const tabs = page.querySelectorAll(".dashboard-reviews-tab[data-reviews-tab]");
  const publishedPanel = page.querySelector("#dashboard-reviews-published");
  const pendingPanel = page.querySelector("#dashboard-reviews-pending");
  const publishedEmpty = page.querySelector("#dashboard-reviews-published-empty");
  const pendingEmpty = page.querySelector("#dashboard-reviews-pending-empty");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const which = tab.dataset.reviewsTab;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", String(on));
      });
      const showPublished = which === "published";
      if (publishedPanel) publishedPanel.hidden = !showPublished;
      if (pendingPanel) pendingPanel.hidden = showPublished;
      if (publishedEmpty && showPublished) {
        publishedEmpty.hidden = loadPublishedReviews().length > 0;
      }
      if (pendingEmpty && !showPublished) {
        pendingEmpty.hidden = loadPendingReviews().length > 0;
      }
    });
  });
}

function bindAddReviewSheet(page) {
  let overlay = page.querySelector("#dashboard-add-review-overlay");
  if (!overlay) {
    page.insertAdjacentHTML("beforeend", getDashboardAddReviewOverlayMarkup());
    overlay = page.querySelector("#dashboard-add-review-overlay");
  }

  const form = page.querySelector("#dashboard-add-review-form");
  const starsWrap = page.querySelector("#dash-review-stars");
  const starsInput = page.querySelector("#dash-review-stars-value");
  const photoInput = page.querySelector("#dash-review-photo");
  const photoPreview = page.querySelector("#dash-review-photo-preview");
  const photoImg = page.querySelector("#dash-review-photo-img");
  const photoRemove = page.querySelector("#dash-review-photo-remove");

  let photoDataUrl = "";

  const clearPhoto = () => {
    photoDataUrl = "";
    if (photoInput) photoInput.value = "";
    if (photoPreview) photoPreview.hidden = true;
    if (photoImg) photoImg.removeAttribute("src");
  };

  const open = () => {
    const select = page.querySelector("#dash-review-product");
    if (select) {
      const products = loadCatalogProducts();
      select.innerHTML = products.length
        ? products
            .map(
              (p) =>
                `<option value="${String(p.name).replace(/"/g, "&quot;")}">${String(p.name).replace(/</g, "&lt;")}</option>`
            )
            .join("")
        : `<option value="" disabled>No products in catalog</option>`;
    }
    openProfileSheet(page, "dashboard-add-review-overlay");
    page.querySelector("#dash-review-author")?.focus();
  };

  const close = () => closeProfileSheet(page, "dashboard-add-review-overlay");

  page.querySelectorAll(".js-dashboard-review-add-open").forEach((btn) => {
    btn.addEventListener("click", open);
  });

  overlay?.querySelectorAll('[data-close="dashboard-add-review-overlay"]').forEach((btn) => {
    btn.addEventListener("click", close);
  });

  overlay?.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  overlay?.querySelector(".profile-sheet")?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  let selectedStars = 5;
  const setStars = (value) => {
    selectedStars = value;
    if (starsInput) starsInput.value = String(value);
    starsWrap?.querySelectorAll(".dashboard-review-star").forEach((btn) => {
      const star = Number(btn.dataset.star);
      btn.classList.toggle("is-active", star <= value);
      btn.classList.toggle("is-selected", star === value);
    });
  };

  setStars(5);
  starsWrap?.querySelectorAll(".dashboard-review-star").forEach((btn) => {
    btn.addEventListener("click", () => setStars(Number(btn.dataset.star)));
  });

  photoInput?.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      photoDataUrl = reader.result;
      if (photoImg) photoImg.src = photoDataUrl;
      if (photoPreview) photoPreview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  photoRemove?.addEventListener("click", clearPhoto);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const author = page.querySelector("#dash-review-author")?.value.trim();
    const product = page.querySelector("#dash-review-product")?.value;
    const comment = page.querySelector("#dash-review-comment")?.value.trim();
    if (!author || !product || !comment) return;

    const review = {
      id: `pub-${Date.now()}`,
      author,
      product,
      stars: selectedStars,
      comment,
      date: formatDate(),
      photo: photoDataUrl || null,
      source: "admin",
    };

    const published = loadPublishedReviews();
    published.unshift(review);
    savePublishedReviews(published);
    syncPublishedReviewCreate(review).catch(() => {});
    form.reset();
    setStars(5);
    clearPhoto();
    close();
    renderDashboardReviews(page);
  });

  return { close };
}

export function closeDashboardReviewsOverlay(page) {
  const overlay = page.querySelector("#dashboard-add-review-overlay");
  if (overlay?.classList.contains("open")) {
    closeProfileSheet(page, "dashboard-add-review-overlay");
    return true;
  }
  return false;
}

export function initDashboardReviews(page) {
  const section = page.querySelector("#reviews");
  if (!section || section.dataset.reviewsBound === "true") return;
  section.dataset.reviewsBound = "true";

  renderDashboardReviews(page);
  bindReviewsTabs(page);
  bindAddReviewSheet(page);

  page.querySelector('[data-screen="reviews"]')?.addEventListener("click", () => {
    requestAnimationFrame(() => renderDashboardReviews(page));
  });
}
