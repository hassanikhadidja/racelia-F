import { BLOG_TEMPLATES } from "./dashboardBlogsData.js";
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
      (p) => `<label class="dashboard-blog-product-opt">
        <input type="checkbox" class="dashboard-blog-product-check" value="${escapeHtml(p.id)}" data-name="${escapeHtml(p.name)}" data-image="${escapeHtml(p.images?.[0] || "")}" />
        <img src="${escapeHtml(p.images?.[0] || "")}" alt="" loading="lazy" />
        <span class="dashboard-blog-product-opt__copy">
          <strong>${escapeHtml(p.name)}</strong>
          <small>${escapeHtml(p.id)}</small>
        </span>
      </label>`
    )
    .join("");
}

export function getDashboardBlogsSectionMarkup() {
  return `
      <div class="page-head">
        <div>
          <h1 class="page-title">Blogs</h1>
          <p class="page-sub">Create, preview, and publish articles linked to your products.</p>
        </div>
        <button type="button" class="primary-btn js-dashboard-blog-create-open">+ Create blog</button>
      </div>
      <div class="dashboard-blog-list" id="dashboard-blog-list"></div>
      <p class="dashboard-blog-empty" id="dashboard-blog-empty" hidden>No blog posts yet. Create one from a template.</p>
  `;
}

export function getDashboardBlogsOverlaysMarkup() {
  const templates = BLOG_TEMPLATES.map(
    (t) => `<button type="button" class="dashboard-blog-template-card js-dashboard-blog-template-pick" data-template-id="${escapeHtml(t.id)}">
      <span class="dashboard-blog-template-card__name">${escapeHtml(t.name)}</span>
      <span class="dashboard-blog-template-card__desc">${escapeHtml(t.description)}</span>
    </button>`
  ).join("");

  const products = productPickerHtml();

  return `
  <div class="dashboard-sheet-overlay dashboard-blog-overlay" id="dashboard-blog-template-overlay" aria-hidden="true">
    <div class="dashboard-sheet profile-sheet dashboard-blog-template-sheet" role="dialog" aria-labelledby="dashboard-blog-template-title">
      <div class="dashboard-sheet-header">
        <h3 id="dashboard-blog-template-title">Choose a template</h3>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-blog-template-overlay">Close</button>
      </div>
      <div class="dashboard-blog-template-grid">${templates}</div>
    </div>
  </div>

  <div class="dashboard-blog-editor-overlay" id="dashboard-blog-editor-overlay" aria-hidden="true">
    <div class="dashboard-blog-editor" role="dialog" aria-labelledby="dashboard-blog-editor-title">
      <header class="dashboard-blog-editor__head">
        <div>
          <h3 id="dashboard-blog-editor-title">Edit blog</h3>
          <p class="dashboard-blog-editor__status" id="dashboard-blog-editor-status">Draft</p>
        </div>
        <div class="dashboard-blog-editor__head-actions">
          <button type="button" class="edit-btn js-dashboard-blog-save-draft">Save draft</button>
          <button type="button" class="edit-btn js-dashboard-blog-preview">Preview</button>
          <button type="button" class="primary-btn js-dashboard-blog-publish">Publish</button>
          <button type="button" class="edit-btn js-dashboard-blog-unpublish" hidden>Unpublish</button>
          <button type="button" class="dashboard-sheet-close js-dashboard-blog-editor-close">Close</button>
        </div>
      </header>
      <div class="dashboard-blog-editor__body">
        <div class="dashboard-blog-editor__form">
          <input type="hidden" id="dashboard-blog-edit-id" value="" />
          <div class="dashboard-blog-field">
            <label>Cover image</label>
            <div class="dashboard-blog-dropzone" id="dashboard-blog-cover-drop" data-drop-target="cover">
              <img id="dashboard-blog-cover-preview" alt="" hidden />
              <p class="dashboard-blog-dropzone__hint">Drag &amp; drop or <label for="dashboard-blog-cover-input" class="dashboard-blog-dropzone__link">browse</label></p>
              <input type="file" id="dashboard-blog-cover-input" accept="image/*" hidden />
            </div>
          </div>
          <div class="dashboard-blog-field">
            <label for="dashboard-blog-title">Title</label>
            <input type="text" id="dashboard-blog-title" required />
          </div>
          <div class="dashboard-blog-field">
            <label for="dashboard-blog-subtitle">Subtitle (optional)</label>
            <input type="text" id="dashboard-blog-subtitle" />
          </div>
          <div class="dashboard-blog-field">
            <div class="dashboard-blog-field__row">
              <label>Content sections</label>
              <div class="dashboard-blog-section-add">
                <button type="button" class="edit-btn js-dashboard-blog-add-section" data-section-type="heading">+ Heading</button>
                <button type="button" class="edit-btn js-dashboard-blog-add-section" data-section-type="text">+ Text</button>
                <button type="button" class="edit-btn js-dashboard-blog-add-section" data-section-type="image">+ Image</button>
              </div>
            </div>
            <div id="dashboard-blog-sections" class="dashboard-blog-sections"></div>
          </div>
          <div class="dashboard-blog-field">
            <label for="dashboard-blog-cta-text">CTA button text</label>
            <input type="text" id="dashboard-blog-cta-text" placeholder="e.g. Shop the bag" />
          </div>
          <div class="dashboard-blog-field">
            <label>Link products</label>
            <p class="dashboard-blog-hint">Select one or more products. CTA opens the first selected product page.</p>
            <div class="dashboard-blog-product-picker" id="dashboard-blog-product-picker">${products}</div>
            <div class="dashboard-blog-linked-preview" id="dashboard-blog-linked-preview"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="dashboard-blog-preview-overlay" id="dashboard-blog-preview-overlay" aria-hidden="true">
    <div class="dashboard-blog-preview-shell" role="dialog" aria-labelledby="dashboard-blog-preview-title">
      <header class="dashboard-blog-preview__head">
        <h3 id="dashboard-blog-preview-title">Blog preview</h3>
        <div class="dashboard-blog-preview__devices" role="tablist">
          <button type="button" class="dashboard-blog-preview__device active" data-preview-device="desktop" role="tab" aria-selected="true">Desktop</button>
          <button type="button" class="dashboard-blog-preview__device" data-preview-device="mobile" role="tab" aria-selected="false">Mobile</button>
        </div>
        <button type="button" class="dashboard-sheet-close" data-close="dashboard-blog-preview-overlay">Close</button>
      </header>
      <div class="dashboard-blog-preview__frame" id="dashboard-blog-preview-frame"></div>
    </div>
  </div>
`;
}
