import { REVIEW_PRODUCTS } from "./dashboardReviewsData.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function productOptionsHtml() {
  return REVIEW_PRODUCTS.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("");
}

export function getDashboardReviewsSectionMarkup() {
  return `
      <div class="page-head">
        <div>
          <h1 class="page-title">Reviews</h1>
          <p class="page-sub">Moderate client feedback and publish store reviews.</p>
        </div>
        <button type="button" class="primary-btn js-dashboard-review-add-open">+ Add review</button>
      </div>
      <div class="reviews-summary" id="dashboard-reviews-summary">
        <div class="review-stat"><div class="review-stat-num js-dash-review-avg">4.8</div><div class="review-stat-label">Average rating</div></div>
        <div class="review-stat"><div class="review-stat-num js-dash-review-total">0</div><div class="review-stat-label">Published</div></div>
        <div class="review-stat"><div class="review-stat-num js-dash-review-pending-count">0</div><div class="review-stat-label">Awaiting approval</div></div>
      </div>
      <div class="dashboard-reviews-tabs" role="tablist" aria-label="Review lists">
        <button type="button" class="dashboard-reviews-tab active" role="tab" aria-selected="true" data-reviews-tab="published" id="dash-reviews-tab-published">Published</button>
        <button type="button" class="dashboard-reviews-tab" role="tab" aria-selected="false" data-reviews-tab="pending" id="dash-reviews-tab-pending">
          Client submissions <span class="dashboard-reviews-tab-badge js-dash-review-pending-badge" hidden>0</span>
        </button>
      </div>
      <div class="reviews-list" id="dashboard-reviews-published" role="tabpanel" aria-labelledby="dash-reviews-tab-published"></div>
      <div class="reviews-list" id="dashboard-reviews-pending" role="tabpanel" aria-labelledby="dash-reviews-tab-pending" hidden></div>
      <p class="dashboard-reviews-empty" id="dashboard-reviews-published-empty" hidden>No published reviews yet.</p>
      <p class="dashboard-reviews-empty" id="dashboard-reviews-pending-empty" hidden>No client reviews waiting for approval.</p>
  `;
}

export function getDashboardAddReviewOverlayMarkup() {
  const products = productOptionsHtml();
  return `
  <div class="dashboard-sheet-overlay" id="dashboard-add-review-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet" role="dialog" aria-labelledby="dashboard-add-review-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-add-review-title">Add review</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-add-review-overlay">Close</button>
      </div>
      <form class="dashboard-review-form" id="dashboard-add-review-form">
        <div class="dashboard-review-field">
          <label class="dashboard-review-field-label" for="dash-review-author">Client name</label>
          <input type="text" id="dash-review-author" name="author" required autocomplete="name" />
        </div>
        <div class="dashboard-review-field">
          <label class="dashboard-review-field-label" for="dash-review-product">Product</label>
          <select id="dash-review-product" name="product" required>
            <option value="" disabled selected>Select product</option>
            ${products}
          </select>
        </div>
        <div class="dashboard-review-field">
          <span class="dashboard-review-field-label">Rating</span>
          <div class="dashboard-review-stars" id="dash-review-stars" role="radiogroup" aria-label="Star rating">
            ${[1, 2, 3, 4, 5]
              .map(
                (n) =>
                  `<button type="button" class="dashboard-review-star" data-star="${n}" aria-label="${n} stars">★</button>`
              )
              .join("")}
          </div>
          <input type="hidden" id="dash-review-stars-value" name="stars" value="5" />
        </div>
        <div class="dashboard-review-field">
          <label class="dashboard-review-field-label" for="dash-review-comment">Comment</label>
          <textarea id="dash-review-comment" name="comment" rows="4" required></textarea>
        </div>
        <div class="dashboard-review-field">
          <span class="dashboard-review-field-label" id="dash-review-photo-label">Picture (optional)</span>
          <label class="edit-btn dashboard-review-photo-upload">
            Choose photo
            <input type="file" id="dash-review-photo" name="photo" accept="image/*" hidden aria-labelledby="dash-review-photo-label" />
          </label>
          <div class="dashboard-review-photo-preview" id="dash-review-photo-preview" hidden>
            <img id="dash-review-photo-img" alt="Review photo preview" />
            <button type="button" class="dashboard-review-photo-remove" id="dash-review-photo-remove">Remove photo</button>
          </div>
        </div>
        <button type="submit" class="dashboard-review-submit">Publish review</button>
      </form>
    </div>
  </div>
`;
}
