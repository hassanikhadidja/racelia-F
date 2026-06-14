import { addGiftPointsEntry, getDeliveredProductsForReview } from "./clientProfileGiftPoints.js";
import { queueClientReviewForModeration } from "./dashboardReviewsData.js";
import { loadCatalogProducts } from "./productCatalog.js";

const REVIEWS_STORAGE_KEY = "raceliaProfileReviews";
const REVIEW_POINTS = 150;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function loadProfileReviews() {
  try {
    const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return [];
}

export function saveProfileReviews(reviews) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    /* ignore */
  }
}

export function getReviewsSummaryText() {
  const reviews = loadProfileReviews();
  if (!reviews.length) return "Add your first review";
  const avg =
    reviews.reduce((s, r) => s + (r.stars || 0), 0) / reviews.length;
  return `${avg.toFixed(1)} · ${reviews.length} review${reviews.length === 1 ? "" : "s"}`;
}

function productOptionsMarkup() {
  const products = getDeliveredProductsForReview();
  const opts = products.length
    ? products.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("")
    : `<option value="" disabled>No delivered orders yet</option>`;
  return `<option value="" disabled selected>Select product</option>${opts}<option value="_other">Other product</option>`;
}

export function getProfileReviewOverlayMarkup() {
  return `<div class="profile-review-overlay" id="profile-review-overlay" aria-hidden="true">
  <div class="profile-review-sheet profile-sheet" role="dialog" aria-labelledby="profile-review-title">
    <div class="profile-sheet-header">
      <h3 id="profile-review-title">Add a review</h3>
      <button type="button" class="profile-sheet-close" data-close="profile-review-overlay">Close</button>
    </div>
    <form class="profile-review-form" id="profile-review-form">
      <div class="profile-review-field">
        <label for="review-name">Your name</label>
        <input type="text" id="review-name" name="name" autocomplete="name" required placeholder=" " />
      </div>
      <div class="profile-review-field">
        <label for="review-product">Product</label>
        <select id="review-product" name="product" required>
          ${productOptionsMarkup()}
        </select>
      </div>
      <div class="profile-review-field profile-review-field--other" id="review-product-other-wrap" hidden>
        <label for="review-product-other">Product name</label>
        <input type="text" id="review-product-other" name="productOther" placeholder=" " />
      </div>
      <div class="profile-review-field">
        <label>Rating</label>
        <div class="profile-review-stars" id="review-stars" role="radiogroup" aria-label="Star rating">
          ${[1, 2, 3, 4, 5]
            .map(
              (n) =>
                `<button type="button" class="profile-review-star" data-star="${n}" aria-label="${n} star${n > 1 ? "s" : ""}">★</button>`
            )
            .join("")}
        </div>
        <input type="hidden" id="review-stars-value" name="stars" value="5" required />
      </div>
      <div class="profile-review-field">
        <label for="review-comment">Comment</label>
        <textarea id="review-comment" name="comment" rows="4" required placeholder="Share your experience…"></textarea>
      </div>
      <div class="profile-review-field">
        <label for="review-photo">Picture (optional)</label>
        <input type="file" id="review-photo" name="photo" accept="image/*" />
        <div class="profile-review-photo-preview" id="review-photo-preview" hidden>
          <img id="review-photo-img" alt="Review photo preview" />
          <button type="button" class="profile-review-photo-remove" id="review-photo-remove">Remove photo</button>
        </div>
      </div>
      <button type="submit" class="profile-review-submit">Submit review</button>
    </form>
  </div>
</div>`;
}

export function initProfileReviewForm(page, { onSubmitted } = {}) {
  const overlay = page.querySelector("#profile-review-overlay");
  const form = page.querySelector("#profile-review-form");
  const starsWrap = page.querySelector("#review-stars");
  const starsInput = page.querySelector("#review-stars-value");
  const productSelect = page.querySelector("#review-product");
  const otherWrap = page.querySelector("#review-product-other-wrap");
  const photoInput = page.querySelector("#review-photo");
  const photoPreview = page.querySelector("#profile-review-photo-preview");
  const photoImg = page.querySelector("#review-photo-img");
  const photoRemove = page.querySelector("#review-photo-remove");
  const nameInput = page.querySelector("#review-name");

  if (!overlay || !form) return;

  const profileName = page.querySelector("#profile-name")?.textContent?.trim();
  if (nameInput && profileName) nameInput.value = profileName;

  let selectedStars = 5;
  let photoDataUrl = "";

  const setStars = (value) => {
    selectedStars = value;
    if (starsInput) starsInput.value = String(value);
    starsWrap?.querySelectorAll(".profile-review-star").forEach((btn) => {
      const star = Number(btn.dataset.star);
      btn.classList.toggle("is-active", star <= value);
      btn.classList.toggle("is-selected", star === value);
    });
  };

  setStars(5);

  starsWrap?.querySelectorAll(".profile-review-star").forEach((btn) => {
    btn.addEventListener("click", () => setStars(Number(btn.dataset.star)));
  });

  productSelect?.addEventListener("change", () => {
    const isOther = productSelect.value === "_other";
    if (otherWrap) otherWrap.hidden = !isOther;
  });

  photoInput?.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        photoDataUrl = reader.result;
        if (photoImg) photoImg.src = photoDataUrl;
        if (photoPreview) photoPreview.hidden = false;
      }
    };
    reader.readAsDataURL(file);
  });

  photoRemove?.addEventListener("click", () => {
    photoDataUrl = "";
    if (photoInput) photoInput.value = "";
    if (photoPreview) photoPreview.hidden = true;
    if (photoImg) photoImg.removeAttribute("src");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let product =
      productSelect?.value === "_other"
        ? page.querySelector("#review-product-other")?.value.trim()
        : productSelect?.value;
    if (!product) product = page.querySelector("#review-product-other")?.value.trim() || "Product";

    const catalogMatch = loadCatalogProducts().find(
      (p) => String(p.name).toLowerCase() === String(product).toLowerCase()
    );

    const review = {
      id: `rev-${Date.now()}`,
      name: page.querySelector("#review-name")?.value.trim() || "Guest",
      product,
      productSlug: catalogMatch?.id || "",
      comment: page.querySelector("#review-comment")?.value.trim() || "",
      stars: selectedStars,
      photo: photoDataUrl || null,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    const reviews = loadProfileReviews();
    reviews.unshift(review);
    saveProfileReviews(reviews);
    queueClientReviewForModeration(review);

    addGiftPointsEntry({
      source: "review",
      label: `Review after delivery — ${product}`,
      points: REVIEW_POINTS,
      date: review.date,
    });

    form.reset();
    setStars(5);
    photoDataUrl = "";
    if (photoPreview) photoPreview.hidden = true;
    if (nameInput && profileName) nameInput.value = profileName;
    if (otherWrap) otherWrap.hidden = true;

    onSubmitted?.(review);
    window.alert(`Thank you! You earned ${REVIEW_POINTS} gift points for your review.`);
  });
}
