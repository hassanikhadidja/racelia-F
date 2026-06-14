import { PRODUCT_SECTIONS, STOCK_NOTES } from "./productCatalog.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sectionCheckboxesHtml() {
  return PRODUCT_SECTIONS.map(
    (section) => `<label class="dashboard-product-section-opt">
      <input type="checkbox" class="dashboard-product-section-check" value="${escapeHtml(section.id)}" />
      <span>${escapeHtml(section.label)}</span>
    </label>`
  ).join("");
}

function stockNoteOptionsHtml(selected = "") {
  return STOCK_NOTES.map(
    (note) =>
      `<option value="${escapeHtml(note.id)}"${note.id === selected ? " selected" : ""}>${escapeHtml(note.label)}</option>`
  ).join("");
}

export function getDashboardProductsSectionMarkup() {
  return `
      <div class="page-head">
        <div>
          <h1 class="page-title">Products</h1>
          <p class="page-sub">Add, edit, and organize bags across storefront sections.</p>
        </div>
        <button type="button" class="primary-btn js-dashboard-product-add-open">+ Add product</button>
      </div>
      <div class="panel">
        <div class="product-grid" id="dashboard-products-grid"></div>
        <p class="dashboard-products-empty" id="dashboard-products-empty" hidden>No products yet.</p>
      </div>
  `;
}

export function getDashboardProductsOverlaysMarkup() {
  return `
  <div class="dashboard-product-editor-overlay" id="dashboard-product-editor-overlay" aria-hidden="true">
    <div class="dashboard-product-editor" role="dialog" aria-labelledby="dashboard-product-editor-title">
      <header class="dashboard-product-editor__head">
        <div>
          <h3 id="dashboard-product-editor-title">Edit product</h3>
          <p class="dashboard-product-editor__sub">Cover, card slider, closer look, details, and section placement.</p>
        </div>
        <div class="dashboard-product-editor__head-actions">
          <button type="button" class="edit-btn js-dashboard-product-preview">View PDP</button>
          <button type="button" class="primary-btn js-dashboard-product-save">Save</button>
          <button type="button" class="dashboard-sheet-close js-dashboard-product-editor-close">Close</button>
        </div>
      </header>
      <form class="dashboard-product-editor__body" id="dashboard-product-form">
        <input type="hidden" id="dashboard-product-edit-id" value="" />
        <div class="dashboard-product-editor__grid">
          <div class="dashboard-product-field">
            <label for="dashboard-product-name">Name</label>
            <input type="text" id="dashboard-product-name" required />
          </div>
          <div class="dashboard-product-field">
            <label for="dashboard-product-id">Product ID (slug)</label>
            <input type="text" id="dashboard-product-id" required pattern="[a-z0-9-]+" />
          </div>
          <div class="dashboard-product-field">
            <label for="dashboard-product-tag">Tag</label>
            <input type="text" id="dashboard-product-tag" placeholder="e.g. Métiers d'Art, SS26" />
          </div>
          <div class="dashboard-product-field">
            <label for="dashboard-product-price">Price (DZD)</label>
            <input type="text" id="dashboard-product-price" placeholder="1 106 000 DZD" required />
            <p class="dashboard-product-hint">Enter the price in Algerian dinars.</p>
          </div>
          <div class="dashboard-product-field">
            <label for="dashboard-product-stock-note">Stock note</label>
            <select id="dashboard-product-stock-note">${stockNoteOptionsHtml()}</select>
          </div>
          <div class="dashboard-product-field dashboard-product-field--check">
            <label class="dashboard-product-pack-toggle">
              <input type="checkbox" id="dashboard-product-is-new-arrival" />
              <span>Show on home New Arrivals (name + scroll only)</span>
            </label>
          </div>
          <div class="dashboard-product-field dashboard-product-field--check">
            <label class="dashboard-product-pack-toggle">
              <input type="checkbox" id="dashboard-product-is-pack" />
              <span>This product is a pack</span>
            </label>
          </div>
          <div class="dashboard-product-field dashboard-product-field--check">
            <label class="dashboard-product-pack-toggle">
              <input type="checkbox" id="dashboard-product-has-color-images" />
              <span>Different pictures per color</span>
            </label>
          </div>
        </div>

        <div class="dashboard-product-field" id="dashboard-product-pack-wrap" hidden>
          <label for="dashboard-product-pack-label">Pack description</label>
          <input type="text" id="dashboard-product-pack-label" placeholder="e.g. Tote + clutch + pouch" />
        </div>

        <div class="dashboard-product-field">
          <label for="dashboard-product-description">Description</label>
          <textarea id="dashboard-product-description" rows="3"></textarea>
        </div>
        <div class="dashboard-product-editor__grid">
          <div class="dashboard-product-field">
            <label for="dashboard-product-materials">Materials</label>
            <input type="text" id="dashboard-product-materials" />
          </div>
          <div class="dashboard-product-field">
            <label for="dashboard-product-size">Size</label>
            <input type="text" id="dashboard-product-size" />
          </div>
        </div>

        <div class="dashboard-product-field" id="dashboard-product-color-variants-wrap">
          <label>Colors</label>
          <p class="dashboard-product-hint">Add each color. When “Different pictures per color” is on, set which images change for that swatch.</p>
          <div id="dashboard-product-color-variants"></div>
          <button type="button" class="edit-btn js-dashboard-product-add-color">+ Add color</button>
        </div>

        <div class="dashboard-product-field">
          <label for="dashboard-product-filters">Filter tags (comma-separated)</label>
          <input type="text" id="dashboard-product-filters" placeholder="Leather, Black, Gold-Tone" />
        </div>

        <fieldset class="dashboard-product-fieldset">
          <legend>Sections</legend>
          <div class="dashboard-product-section-grid">${sectionCheckboxesHtml()}</div>
        </fieldset>

        <div class="dashboard-product-images">
          <h4 class="dashboard-product-images__title">Default pictures (used for all colors unless overridden)</h4>
          <div class="dashboard-product-field">
            <label for="dashboard-product-card-cover">Product card — cover</label>
            <div class="dashboard-product-image-row dashboard-product-image-row--single">
              <input type="url" id="dashboard-product-card-cover" placeholder="https://... or upload from device" />
              <label class="edit-btn dashboard-product-image-upload">From device<input type="file" class="dashboard-product-image-file" accept="image/*" hidden /></label>
            </div>
            <div class="dashboard-product-image-preview" id="dashboard-product-card-cover-preview"></div>
          </div>
          <div class="dashboard-product-field">
            <label>Product card — scroll images</label>
            <div class="dashboard-product-image-list" id="dashboard-product-card-scroll"></div>
            <button type="button" class="edit-btn js-dashboard-product-add-card-scroll">+ Add card scroll image</button>
          </div>
          <div class="dashboard-product-field">
            <label for="dashboard-product-pdp-cover">Product detail — cover</label>
            <div class="dashboard-product-image-row dashboard-product-image-row--single">
              <input type="url" id="dashboard-product-pdp-cover" placeholder="https://... or upload from device" />
              <label class="edit-btn dashboard-product-image-upload">From device<input type="file" class="dashboard-product-image-file" accept="image/*" hidden /></label>
            </div>
          </div>
          <div class="dashboard-product-field">
            <label>Product detail — scroll images</label>
            <div class="dashboard-product-image-list" id="dashboard-product-pdp-scroll"></div>
            <button type="button" class="edit-btn js-dashboard-product-add-pdp-scroll">+ Add PDP scroll image</button>
          </div>
          <div class="dashboard-product-field">
            <label for="dashboard-product-closer-main-image">Closer look — main picture</label>
            <div class="dashboard-product-image-row dashboard-product-image-row--single">
              <input type="url" id="dashboard-product-closer-main-image" placeholder="https://... or upload from device" />
              <label class="edit-btn dashboard-product-image-upload">From device<input type="file" class="dashboard-product-image-file" accept="image/*" hidden /></label>
            </div>
          </div>
          <div class="dashboard-product-field">
            <label>Closer look — other pictures</label>
            <div class="dashboard-product-image-list" id="dashboard-product-closer-images"></div>
            <button type="button" class="edit-btn js-dashboard-product-add-closer-image">+ Add closer look image</button>
          </div>
          <div class="dashboard-product-field">
            <label for="dashboard-product-closer-title">Closer look title</label>
            <input type="text" id="dashboard-product-closer-title" value="A Closer Look" />
          </div>
          <div class="dashboard-product-field">
            <label for="dashboard-product-closer-text">Closer look text</label>
            <textarea id="dashboard-product-closer-text" rows="2"></textarea>
          </div>
        </div>

        <div class="dashboard-product-editor__footer">
          <button type="button" class="dashboard-product-delete js-dashboard-product-delete" hidden>Delete product</button>
        </div>
      </form>
    </div>
  </div>
  `;
}
