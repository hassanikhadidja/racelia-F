import { getAllSelectionProducts } from "./categoryData.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function productPickerHtml() {
  return getAllSelectionProducts()
    .map(
      (p) => `<button type="button" class="dashboard-style-product-opt" role="option" data-product-id="${escapeHtml(p.id)}" aria-selected="false">
        <span class="dashboard-style-product-opt__name">${escapeHtml(p.name)}</span>
        <span class="dashboard-style-product-opt__id">${escapeHtml(p.id)}</span>
      </button>`
    )
    .join("");
}

export function getDashboardRaceliaStyleSectionMarkup() {
  return `
      <div class="racelia-hero">
        <h2>RACÈLIASTYLE</h2>
        <p>Creator look images and shoppable product looks for #RACÈLIASTYLE on the storefront.</p>
      </div>
      <div class="page-head dashboard-style-head">
        <div>
          <h1 class="page-title">Creator &amp; looks</h1>
          <p class="page-sub">Add creator hero looks and product images that open product pages.</p>
        </div>
        <div class="dashboard-style-head-actions">
          <button type="button" class="primary-btn js-dashboard-style-creator-open">+ Creator look</button>
          <button type="button" class="edit-btn js-dashboard-style-product-open">+ Product look</button>
        </div>
      </div>
      <h3 class="dashboard-style-subtitle">Creator style looks</h3>
      <div class="racelia-grid" id="dashboard-style-creators"></div>
      <p class="dashboard-style-empty" id="dashboard-style-creators-empty" hidden>No creator looks yet.</p>
      <h3 class="dashboard-style-subtitle">Product looks (link to PDP)</h3>
      <div class="dashboard-style-products" id="dashboard-style-products"></div>
      <p class="dashboard-style-empty" id="dashboard-style-products-empty" hidden>No product looks yet. Add one and link it to a creator look.</p>
  `;
}

export function getDashboardStyleOverlaysMarkup() {
  const productOpts = productPickerHtml();
  return `
  <div class="dashboard-sheet-overlay" id="dashboard-style-creator-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet dashboard-style-sheet" role="dialog" aria-labelledby="dashboard-style-creator-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-style-creator-title">Add creator look</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-style-creator-overlay">Close</button>
      </div>
      <form class="dashboard-style-form" id="dashboard-style-creator-form">
        <div class="dashboard-style-field">
          <label class="dashboard-style-field-label" for="style-creator-title">Title</label>
          <input type="text" id="style-creator-title" name="title" required placeholder="e.g. Urban Edge" />
        </div>
        <div class="dashboard-style-field">
          <label class="dashboard-style-field-label" for="style-creator-tag">Tag (optional)</label>
          <input type="text" id="style-creator-tag" name="tag" placeholder="e.g. SS26" />
        </div>
        <div class="dashboard-style-field">
          <span class="dashboard-style-field-label" id="style-creator-image-label">Creator look picture</span>
          <label class="edit-btn dashboard-style-photo-upload">
            Choose photo
            <input type="file" id="style-creator-image" accept="image/*" hidden required aria-labelledby="style-creator-image-label" />
          </label>
          <div class="dashboard-style-preview" id="style-creator-preview" hidden>
            <img id="style-creator-preview-img" alt="" />
          </div>
        </div>
        <button type="submit" class="dashboard-style-submit">Save creator look</button>
      </form>
    </div>
  </div>

  <div class="dashboard-sheet-overlay" id="dashboard-style-product-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet dashboard-style-sheet" role="dialog" aria-labelledby="dashboard-style-product-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-style-product-title">Add product look</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-style-product-overlay">Close</button>
      </div>
      <form class="dashboard-style-form" id="dashboard-style-product-form">
        <div class="dashboard-style-field">
          <span class="dashboard-style-field-label" id="style-parent-label">Creator look</span>
          <input type="hidden" id="style-product-parent-id" value="" />
          <div class="dashboard-style-parent-picker" id="style-parent-picker" role="listbox" aria-labelledby="style-parent-label" tabindex="0"></div>
        </div>
        <div class="dashboard-style-field">
          <span class="dashboard-style-field-label" id="style-product-label">Product (opens detail page)</span>
          <p class="dashboard-style-hint">Scroll and tap a product.</p>
          <input type="hidden" id="style-product-id" value="" />
          <div class="dashboard-style-product-picker" id="style-product-picker" role="listbox" aria-labelledby="style-product-label" tabindex="0">
            ${productOpts}
          </div>
        </div>
        <div class="dashboard-style-field">
          <span class="dashboard-style-field-label" id="style-product-image-label">Picture (optional)</span>
          <label class="edit-btn dashboard-style-photo-upload">
            Choose photo
            <input type="file" id="style-product-image" accept="image/*" hidden aria-labelledby="style-product-image-label" />
          </label>
          <div class="dashboard-style-preview" id="style-product-preview" hidden>
            <img id="style-product-preview-img" alt="" />
          </div>
        </div>
        <button type="submit" class="dashboard-style-submit">Save product look</button>
      </form>
    </div>
  </div>
`;
}
