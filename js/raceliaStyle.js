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
      const label = meta?.name || "Produit";
      const image = meta?.images?.[0] || product.image || "";
      return `<button type="button" class="style-product" data-product-id="${escapeHtml(product.id)}" aria-label="Voir ${escapeHtml(label)}">
        <span class="style-product__media">
          <img src="${escapeHtml(image)}" alt="" loading="lazy" />
        </span>
        <span class="style-product__meta">
          <span class="style-product__name">${escapeHtml(label)}</span>
        </span>
      </button>`;
    })
    .join("");
}

function lockStyleSheetPage(root) {
  const styleView = root.querySelector("#styleView");
  if (styleView) {
    styleView.dataset.lockedScrollTop = String(styleView.scrollTop);
  }
  document.body.classList.add("style-sheet-locked");
}

function unlockStyleSheetPage(root) {
  document.body.classList.remove("style-sheet-locked");
  document.documentElement.classList.remove("style-sheet-locked");
  const styleView = root.querySelector("#styleView");
  if (styleView) {
    styleView.scrollTop = Number(styleView.dataset.lockedScrollTop || 0);
  }
}

function closeStyleSheet(root) {
  const overlay = root.querySelector("#styleSheetOverlay");
  const sheet = root.querySelector("#styleSheet");
  if (!overlay || !sheet) return;

  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
  unlockStyleSheetPage(root);
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
  const countNum = root.querySelector("#styleSheetCountNum");
  const countLabel = root.querySelector("#styleSheetCountLabel");
  const tagEl = root.querySelector("#styleSheetTag");
  const eyebrowEl = root.querySelector("#styleSheetEyebrow");
  const closeBtn = root.querySelector("#styleSheetClose");
  const searchForm = root.querySelector("#styleSearchForm");

  if (!overlay || !sheet || !heroImg || !productsEl) return;

  const openSheet = (index) => {
    const look = raceliaLooks[index];
    const count = look.products.length;
    heroImg.src = look.img;
    heroImg.alt = look.title || `RACÈLIASTYLE look ${index + 1}`;
    productsEl.innerHTML = renderStyleProducts(look);
    if (countNum) countNum.textContent = String(count);
    if (countLabel) countLabel.textContent = count > 1 ? "produits" : "produit";
    if (tagEl) {
      tagEl.textContent = look.tag || "Demo";
      tagEl.hidden = !look.tag && !look.title;
    }
    if (eyebrowEl) {
      eyebrowEl.textContent = look.title
        ? `#RACÈLIASTYLE · ${look.title}`
        : "#RACÈLIASTYLE";
    }
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    sheet.querySelector(".style-sheet-scroll")?.scrollTo(0, 0);
    lockStyleSheetPage(root);
  };

  raceliaLooks.forEach((look, index) => {
    const cell = document.createElement("div");
    cell.className = "style-cell" + (index === 0 ? " style-cell--span-2" : "");
    cell.innerHTML = `<img src="${look.img}" alt="Look ${index + 1}" loading="lazy" />`;
    cell.addEventListener("click", () => openSheet(index));
    grid.appendChild(cell);
  });

  closeBtn?.addEventListener("click", () => closeStyleSheet(root));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeStyleSheet(root);
  });

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
    if (query) closeStyleSheet(root);
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
