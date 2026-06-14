import { createCtaDock } from "./CtaDock.js";

export function createCategoryPage() {
  const page = document.createElement("section");
  page.className = "category-page";
  page.id = "categoryPage";
  page.hidden = true;

  page.innerHTML = `
    <h1 class="category-page__title" id="categoryPageTitle"></h1>
    <p class="category-page__sub" id="categoryPageSub"></p>

    <div class="category-page__bar">
      <span class="category-page__bar-label" id="categoryPageBar"></span>
      <button class="category-page__filter-toggle" id="categoryFilterOpen" type="button" aria-label="Open filters">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2" fill="#fff"/>
          <line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2" fill="#fff"/>
          <line x1="4" y1="17" x2="20" y2="17"/><circle cx="11" cy="17" r="2" fill="#fff"/>
        </svg>
      </button>
    </div>

    <div class="category-page__products" id="categoryProducts"></div>

    <div class="category-page__filter" id="categoryFilter" aria-hidden="true">
      <button class="category-page__filter-close" id="categoryFilterClose" type="button" aria-label="Close filters">✕</button>
      <div class="category-page__filter-body">
        <div class="category-page__filter-item">
          <label class="category-page__check-row">
            <input type="checkbox" />
            <span class="category-page__check-box"></span>
            <span>On a look</span>
          </label>
        </div>

        <div class="category-page__filter-item category-page__accordion">
          <button class="category-page__accordion-head" type="button">
            <span class="category-page__accordion-label">COLLECTION</span>
            <span class="category-page__chev-icon" aria-hidden="true"></span>
          </button>
          <div class="category-page__accordion-content">
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>2026 Métiers d'art</span></label>
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Spring Summer 2026</span></label>
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Spring Summer 2026 Pre-collection</span></label>
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>The Emblematics</span></label>
          </div>
        </div>

        <div class="category-page__filter-item category-page__accordion">
          <button class="category-page__accordion-head" type="button">
            <span class="category-page__accordion-label">MATERIAL</span>
            <span class="category-page__chev-icon" aria-hidden="true"></span>
          </button>
          <div class="category-page__accordion-content">
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Leather</span></label>
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Tweed &amp; Fabrics</span></label>
          </div>
        </div>

        <div class="category-page__filter-item category-page__accordion">
          <button class="category-page__accordion-head" type="button">
            <span class="category-page__accordion-label">COLOR</span>
            <span class="category-page__chev-icon" aria-hidden="true"></span>
          </button>
          <div class="category-page__accordion-content">
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Black</span></label>
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Beige</span></label>
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Blue</span></label>
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Red</span></label>
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Yellow</span></label>
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Other colors</span></label>
          </div>
        </div>

        <div class="category-page__filter-item category-page__accordion">
          <button class="category-page__accordion-head" type="button">
            <span class="category-page__accordion-label">HARDWARE</span>
            <span class="category-page__chev-icon" aria-hidden="true"></span>
          </button>
          <div class="category-page__accordion-content">
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Gold-Tone</span></label>
            <label class="category-page__check-row"><input type="checkbox"/><span class="category-page__check-box"></span><span>Silver-Tone</span></label>
          </div>
        </div>
      </div>

      <div class="category-page__filter-actions">
        <button class="category-page__filter-clear" id="categoryFilterClear" type="button">CLEAR</button>
        <button class="category-page__filter-results" id="categoryFilterResults" type="button">RESULTS</button>
      </div>
    </div>
  `;

  const filter = page.querySelector("#categoryFilter");
  page.insertBefore(
    createCtaDock({ sectionId: "categoryCtaDock", slotId: "categoryCtaDockSlot" }),
    filter
  );

  return page;
}
