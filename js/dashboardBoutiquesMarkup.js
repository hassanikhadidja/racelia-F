import { STORE_TYPES } from "./boutiquesData.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function typeOptionsHtml() {
  return STORE_TYPES.map(
    (type) => `<option value="${escapeHtml(type.value)}">${escapeHtml(type.label)}</option>`
  ).join("");
}

export function getDashboardBoutiquesSectionMarkup() {
  return `
      <div class="page-head">
        <div>
          <h1 class="page-title">Boutiques</h1>
          <p class="page-sub">Add, edit, and remove store locations shown on the Boutiques page.</p>
        </div>
        <button type="button" class="primary-btn js-dashboard-boutique-add-open">+ Add boutique</button>
      </div>
      <div class="dashboard-boutique-list" id="dashboard-boutique-list"></div>
      <p class="dashboard-boutique-empty" id="dashboard-boutique-empty" hidden>No boutiques yet.</p>
  `;
}

export function getDashboardBoutiquesOverlaysMarkup() {
  return `
  <div class="dashboard-product-editor-overlay" id="dashboard-boutique-editor-overlay" aria-hidden="true">
    <div class="dashboard-product-editor" role="dialog" aria-labelledby="dashboard-boutique-editor-title">
      <header class="dashboard-product-editor__head">
        <div>
          <h3 id="dashboard-boutique-editor-title">Edit boutique</h3>
          <p class="dashboard-product-editor__sub">Optional fields stay hidden on the storefront when left empty. Online stores do not show “Voir sur la carte”.</p>
        </div>
        <div class="dashboard-product-editor__head-actions">
          <button type="button" class="primary-btn js-dashboard-boutique-save">Save</button>
          <button type="button" class="dashboard-sheet-close js-dashboard-boutique-editor-close">Close</button>
        </div>
      </header>
      <form class="dashboard-product-editor__body" id="dashboard-boutique-form">
        <input type="hidden" id="dashboard-boutique-edit-id" value="" />
        <p class="form-status js-form-status" hidden></p>
        <div class="dashboard-product-field">
          <label for="dashboard-boutique-name">Name</label>
          <input type="text" id="dashboard-boutique-name" required placeholder="RACÈLIA Alger — Didouche Mourad" />
        </div>
        <div class="dashboard-product-field">
          <label for="dashboard-boutique-type">Type</label>
          <select id="dashboard-boutique-type">${typeOptionsHtml()}</select>
          <p class="dashboard-product-hint">“Vente en ligne” hides the “Voir sur la carte” button.</p>
        </div>
        <div class="dashboard-product-field">
          <label for="dashboard-boutique-location">Location (optional)</label>
          <input type="text" id="dashboard-boutique-location" placeholder="24 boulevard Didouche Mourad, Alger Centre · Alger 16000" />
        </div>
        <div class="dashboard-product-editor__grid">
          <div class="dashboard-product-field">
            <label for="dashboard-boutique-phone">Phone number (optional)</label>
            <input type="text" id="dashboard-boutique-phone" placeholder="+213 21 00 00 01" />
          </div>
          <div class="dashboard-product-field">
            <label for="dashboard-boutique-hours">Work time (optional)</label>
            <input type="text" id="dashboard-boutique-hours" placeholder="Lun–Sam 10h–19h · Dim 11h–17h" />
          </div>
        </div>
        <div class="dashboard-product-field">
          <label for="dashboard-boutique-website">Website link (optional)</label>
          <input type="text" id="dashboard-boutique-website" placeholder="https://racelia.com" />
        </div>
        <div class="dashboard-product-field">
          <label for="dashboard-boutique-note">Small note</label>
          <textarea id="dashboard-boutique-note" rows="3" placeholder="Boutique phare — collection complète et services personnalisés."></textarea>
        </div>
        <div class="dashboard-product-field" id="dashboard-boutique-map-wrap">
          <label for="dashboard-boutique-map">Map link</label>
          <input type="text" id="dashboard-boutique-map" placeholder="https://maps.google.com/?q=36.7753,3.0588" />
          <p class="dashboard-product-hint">Used by the “Voir sur la carte” button. Hidden for online stores.</p>
        </div>
        <div class="dashboard-product-editor__footer">
          <button type="button" class="edit-btn dashboard-product-card__delete js-dashboard-boutique-delete" hidden>Delete boutique</button>
        </div>
      </form>
    </div>
  </div>
  `;
}
