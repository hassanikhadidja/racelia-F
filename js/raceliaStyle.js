import { getCategoryProductById } from "./categoryData.js";
import { getStorefrontStyleLooks } from "./dashboardRaceliaStyleData.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderStyleProducts(look) {
  return look.products
    .map((product) => {
      const meta = getCategoryProductById(product.id);
      const label = meta?.name || "Product";
      return `<button type="button" class="style-product" data-product-id="${escapeHtml(product.id)}" aria-label="View ${escapeHtml(label)}">
        <img src="${escapeHtml(product.image)}" alt="" loading="lazy" />
      </button>`;
    })
    .join("");
}

function closeStyleSheet(root) {
  const overlay = root.querySelector("#styleSheetOverlay");
  const sheet = root.querySelector("#styleSheet");
  if (!overlay || !sheet) return;

  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
  document.body.classList.remove("style-sheet-locked");
}

export function refreshStyleGrid(root) {
  const grid = root.querySelector("#styleGrid");
  if (grid) {
    grid.replaceChildren();
    delete grid.dataset.ready;
  }
  ensureStyleGrid(root);
}

export function ensureStyleGrid(root) {
  const grid = root.querySelector("#styleGrid");
  if (!grid || grid.dataset.ready === "true") return;

  const raceliaLooks = getStorefrontStyleLooks();
  if (!raceliaLooks.length) return;

  const overlay = root.querySelector("#styleSheetOverlay");
  const sheet = root.querySelector("#styleSheet");
  const heroImg = root.querySelector("#styleHeroImg");
  const productsEl = root.querySelector("#styleSheetProducts");
  const countEl = root.querySelector("#styleSheetCount");
  const closeBtn = root.querySelector("#styleSheetClose");
  const searchForm = root.querySelector("#styleSearchForm");

  if (!overlay || !sheet || !heroImg || !productsEl || !countEl) return;

  const openSheet = (index) => {
    const look = raceliaLooks[index];
    heroImg.src = look.img;
    heroImg.alt = `RACÈLIASTYLE look ${index + 1}`;
    productsEl.innerHTML = renderStyleProducts(look);
    countEl.textContent = `${look.products.length} PRODUCT${look.products.length > 1 ? "S" : ""}`;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.classList.add("style-sheet-locked");
  };

  raceliaLooks.forEach((look, index) => {
    const cell = document.createElement("div");
    cell.className = "style-cell" + (index === 0 ? " style-cell--span-2" : "");
    cell.innerHTML = `<img src="${look.img}" alt="Look ${index + 1}" loading="lazy" />`;
    cell.addEventListener("click", () => openSheet(index));
    grid.appendChild(cell);
  });

  closeBtn?.addEventListener("click", () => closeStyleSheet(root));
  overlay.addEventListener("click", () => closeStyleSheet(root));

  if (!sheet.dataset.productNavBound) {
    sheet.dataset.productNavBound = "true";
    sheet.addEventListener("click", (event) => {
      const productBtn = event.target.closest(".style-product[data-product-id]");
      if (!productBtn) return;
      event.stopPropagation();
      const productId = productBtn.dataset.productId;
      if (!productId) return;
      closeStyleSheet(root);
      root.dispatchEvent(
        new CustomEvent("racelia:open-product", { detail: { productId } })
      );
    });
  }

  if (!root.dataset.styleKeyListener) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sheet.classList.contains("open")) {
        closeStyleSheet(root);
      }
    });
    root.dataset.styleKeyListener = "true";
  }

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = root.querySelector("#styleSearchInput")?.value.trim();
    if (query) window.alert(`Search: ${query}`);
  });

  grid.dataset.ready = "true";
}

export function initRaceliaStyle(root) {
  ensureStyleGrid(root);
  if (!root.dataset.styleLooksListener) {
    root.addEventListener("racelia:style-looks-updated", () => refreshStyleGrid(root));
    root.dataset.styleLooksListener = "true";
  }
}

export { closeStyleSheet };
