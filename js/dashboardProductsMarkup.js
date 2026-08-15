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
      <div class="dashboard-products-filters" role="tablist" aria-label="Filter products by sales report">
        <button type="button" class="dashboard-products-filter active" data-products-filter="all">All</button>
        <button type="button" class="dashboard-products-filter" data-products-filter="sales">In sales report</button>
        <button type="button" class="dashboard-products-filter" data-products-filter="not-sales">Not in sales report</button>
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
          <div class="dashboard-product-field">
            <label for="dashboard-product-sales-report">Sales report</label>
            <select id="dashboard-product-sales-report">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            <p class="dashboard-product-hint">Choose whether this product appears in the Orders sales report.</p>
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
              <span>Different pictures per color (overrides on color 2+)</span>
            </label>
          </div>
        </div>

        <div class="dashboard-product-field" id="dashboard-product-pack-wrap" hidden>
          <label for="dashboard-product-pack-label">Pack description</label>
          <input type="text" id="dashboard-product-pack-label" placeholder="e.g. Tote + clutch + pouch" />
        </div>

        <div class="dashboard-product-field">
          <label for="dashboard-product-description">Description</label>
          <textarea id="dashboard-product-description" rows="3" placeholder="Texte de description du produit"></textarea>
        </div>
        <div class="dashboard-product-field">
          <label for="dashboard-product-details">Détails du produit</label>
          <textarea id="dashboard-product-details" rows="5" placeholder="Un point par ligne&#10;Ex. : Cuir grainé&#10;Fermeture à zip&#10;Bandoulière amovible"></textarea>
          <p class="dashboard-product-hint">One detail per line — shown as bullet points on the product page.</p>
        </div>

        <div class="dashboard-product-field" id="dashboard-product-color-variants-wrap">
          <label>Colors &amp; pictures</label>
          <p class="dashboard-product-hint">
            The <strong>first color</strong> holds the default pictures (card, product page, closer look).
            Extra colors only need overrides when “Different pictures per color” is on.
          </p>
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

        <div class="dashboard-product-closer-copy">
          <h4 class="dashboard-product-images__title">Closer look — text</h4>
          <div class="dashboard-product-editor__grid">
            <div class="dashboard-product-field">
              <label for="dashboard-product-closer-title">Title</label>
              <input type="text" id="dashboard-product-closer-title" value="A Closer Look" />
            </div>
            <div class="dashboard-product-field">
              <label for="dashboard-product-closer-text">Description</label>
              <textarea id="dashboard-product-closer-text" rows="2"></textarea>
            </div>
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
