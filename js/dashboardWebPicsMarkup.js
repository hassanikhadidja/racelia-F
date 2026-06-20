import { WEBPIC_DEVICES, WEBPIC_SECTIONS } from "./dashboardWebPicsData.js";
import { products } from "./data.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getDashboardWebPicsSectionMarkup() {
  const deviceFilters = WEBPIC_DEVICES.map(
    (d) =>
      `<button type="button" class="dashboard-webpics-filter" data-webpics-filter="${escapeHtml(d.value)}">${escapeHtml(d.label)}</button>`
  ).join("");

  return `
      <div class="page-head">
        <div>
          <h1 class="page-title">Web Pics</h1>
          <p class="page-sub">Home page images by device screen and section placement.</p>
        </div>
        <button type="button" class="primary-btn js-dashboard-webpic-add-open">+ Add picture</button>
      </div>
      <div class="dashboard-webpics-filters" role="tablist" aria-label="Filter by device">
        <button type="button" class="dashboard-webpics-filter active" data-webpics-filter="all">All</button>
        ${deviceFilters}
      </div>
      <div class="webpics-grid" id="dashboard-webpics-grid"></div>
      <p class="dashboard-webpics-empty" id="dashboard-webpics-empty" hidden>No pictures yet. Add one for mobile, tablet, or laptop.</p>
  `;
}

export function getDashboardAddWebPicOverlayMarkup() {
  const deviceOptions = WEBPIC_DEVICES.map(
    (d) =>
      `<label class="dashboard-webpic-device-opt"><input type="radio" name="webpic-device" value="${escapeHtml(d.value)}" ${d.value === "mobile" ? "checked" : ""} /><span>${escapeHtml(d.label)}</span><small>${escapeHtml(d.size)}</small></label>`
  ).join("");

  const sectionOptions = WEBPIC_SECTIONS.map(
    (s) => `<option value="${escapeHtml(s.value)}">${escapeHtml(s.label)}</option>`
  ).join("");

  const productPickerItems = products
    .map(
      (p) => `<button type="button" class="dashboard-webpic-product-opt" role="option" data-product-id="${escapeHtml(p.id)}" aria-selected="false">
        <span class="dashboard-webpic-product-opt__name">${escapeHtml(p.name)}</span>
        <span class="dashboard-webpic-product-opt__id">${escapeHtml(p.id)}</span>
      </button>`
    )
    .join("");

  return `
  <div class="dashboard-sheet-overlay" id="dashboard-add-webpic-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet dashboard-webpic-sheet" role="dialog" aria-labelledby="dashboard-add-webpic-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-add-webpic-title">Add picture</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-add-webpic-overlay">Close</button>
      </div>
      <form class="dashboard-webpic-form" id="dashboard-add-webpic-form">
        <div class="dashboard-webpic-field">
          <label class="dashboard-webpic-field-label" for="webpic-title">Label (optional)</label>
          <input type="text" id="webpic-title" name="title" placeholder="e.g. Summer hero mobile" />
        </div>
        <div class="dashboard-webpic-field">
          <span class="dashboard-webpic-field-label">Device screen</span>
          <div class="dashboard-webpic-device-group" role="radiogroup" aria-label="Device screen">
            ${deviceOptions}
          </div>
        </div>
        <div class="dashboard-webpic-field">
          <label class="dashboard-webpic-field-label" for="webpic-section">Home page section</label>
          <select id="webpic-section" name="section" required>
            ${sectionOptions}
          </select>
        </div>
        <div class="dashboard-webpic-field">
          <span class="dashboard-webpic-field-label" id="webpic-image-label">Picture</span>
          <label class="edit-btn dashboard-webpic-photo-upload">
            Choose photo
            <input type="file" id="webpic-image" name="image" accept="image/*" hidden required aria-labelledby="webpic-image-label" />
          </label>
          <div class="dashboard-webpic-preview" id="webpic-image-preview" hidden>
            <img id="webpic-image-preview-img" alt="" />
          </div>
        </div>
        <div class="dashboard-webpic-field dashboard-webpic-field--row">
          <label class="dashboard-webpic-check">
            <input type="checkbox" id="webpic-links-product" name="linksToProduct" />
            <span>Links to a product detail page</span>
          </label>
        </div>
        <div class="dashboard-webpic-field" id="webpic-product-wrap" hidden>
          <span class="dashboard-webpic-field-label" id="webpic-product-label">Product</span>
          <p class="dashboard-webpic-product-hint">Scroll the list and tap a product. The full name and id stay visible.</p>
          <input type="hidden" id="webpic-product-id" name="productId" value="" disabled />
          <div class="dashboard-webpic-product-picker" id="webpic-product-picker" role="listbox" aria-labelledby="webpic-product-label" tabindex="0">
            ${productPickerItems}
          </div>
        </div>
        <button type="submit" class="dashboard-webpic-submit">Save picture</button>
      </form>
    </div>
  </div>
`;
}
