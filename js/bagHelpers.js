import {
  formatPrice,
  parsePrice,
  parsePriceFromCatalog,
} from "./currency.js";
import { getCatalogProductById } from "./productCatalog.js";

export { formatPrice, parsePrice, parsePriceFromCatalog };

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=400&q=80";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildQtyOptions(selectedQty) {
  const qty = Math.min(5, Math.max(1, selectedQty));
  return [1, 2, 3, 4, 5]
    .map((n) => `<option value="${n}"${n === qty ? " selected" : ""}>${n}</option>`)
    .join("");
}

/**
 * Add or update a bag line for the active PDP product.
 * @param {"set"|"add"} mode — set quantity or add to existing
 */
export function upsertBagLineItem(root, { productId, name, price, priceEur, color, imageUrl, qty, mode = "set" }) {
  const bagPage = root.querySelector("#shoppingBagPage");
  const bagItems = bagPage?.querySelector(".bag-items");
  if (!bagItems || !productId) return false;

  const itemId = `item-pdp-${productId}`;
  const safeId = itemId.replace(/[^\w-]/g, "-");
  const amount =
    priceEur != null ? Number(priceEur) : parsePriceFromCatalog(price);
  const priceText = formatPrice(amount);
  const colorText = color ? `Color: ${color}` : "";
  const nextQty = Math.min(5, Math.max(1, Number(qty) || 1));

  let el = bagItems.querySelector(`#${CSS.escape(safeId)}`);
  if (el) {
    const select = el.querySelector(".qty-select");
    const priceEl = el.querySelector(".item-price");
    const current = parseInt(select?.value || "1", 10);
    const merged = mode === "add" ? Math.min(5, current + nextQty) : nextQty;
    if (select) select.innerHTML = buildQtyOptions(merged);
    if (priceEl) {
      priceEl.dataset.priceEur = String(amount);
      priceEl.textContent = priceText;
    }
    el.dataset.productId = productId;
    notifyCartChanged(root);
    return true;
  }

  const imgHtml = imageUrl
    ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" loading="lazy" />`
    : "";

  el = document.createElement("div");
  el.className = "bag-item";
  el.id = safeId;
  el.dataset.productId = productId;
  el.innerHTML = `
    <div class="item-image">${imgHtml}</div>
    <div class="item-details">
      <p class="item-name">${escapeHtml(name)}</p>
      ${colorText ? `<p class="item-color">${escapeHtml(colorText)}</p>` : ""}
      <div class="item-row">
        <select class="qty-select">${buildQtyOptions(nextQty)}</select>
        <span class="item-price" data-price-eur="${amount}">${priceText}</span>
      </div>
      <button type="button" class="save-btn" data-save-label="${escapeHtml(name)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        Save
      </button>
    </div>
    <button type="button" class="remove-btn" title="Remove item" aria-label="Remove item">✕</button>
  `;
  bagItems.appendChild(el);
  notifyCartChanged(root);
  return true;
}

function notifyCartChanged(root) {
  root?.dispatchEvent(new CustomEvent("racelia:cart-changed", { bubbles: true }));
}

export function addCategoryCardToBag(root, card, { qty = 1, mode = "add" } = {}) {
  if (!card) return false;

  const productId = card.dataset.productId;
  if (!productId) return false;

  const catalog = getCatalogProductById(productId);
  const name =
    card.querySelector(".category-product__name")?.textContent?.trim() ||
    catalog?.name ||
    "Product";
  const priceEl = card.querySelector(".category-product__price");
  const priceEur =
    parseFloat(priceEl?.dataset.priceEur) ||
    catalog?.priceEur ||
    parsePriceFromCatalog(priceEl?.textContent);
  const images = (card.dataset.images || "").split("|").filter(Boolean);
  const selectedSwatch = card.querySelector(".category-product__swatch.is-selected");
  const colorIndex = Number(selectedSwatch?.dataset.colorIndex ?? 0);
  const swatchLabel = selectedSwatch?.getAttribute("aria-label") || "";
  const color =
    swatchLabel && swatchLabel !== "Color option"
      ? swatchLabel
      : catalog?.swatches?.[colorIndex]?.label || "";
  const imageUrl = images[colorIndex] || images[0] || catalog?.images?.[0] || "";

  return upsertBagLineItem(root, {
    productId,
    name,
    priceEur,
    color,
    imageUrl,
    qty,
    mode,
  });
}

export function collectBagItems(root) {
  const page = root.querySelector("#shoppingBagPage");
  if (!page) return [];

  return [...page.querySelectorAll(".bag-item")].map((el, index) => {
    const qty = parseInt(el.querySelector(".qty-select")?.value || "1", 10);
    const priceEl = el.querySelector(".item-price");
    const unitPrice =
      parseFloat(priceEl?.dataset.priceEur) ||
      parsePrice(priceEl?.textContent);
    const id = el.id || `bag-item-${index}`;
    const img = el.querySelector(".item-image img");

    return {
      id,
      name: el.querySelector(".item-name")?.textContent.trim() || "Product",
      color: el.querySelector(".item-color")?.textContent.trim() || "",
      qty,
      unitPrice,
      lineTotal: qty * unitPrice,
      imageUrl: img?.src || DEFAULT_IMAGE,
      hasPhoto: Boolean(img?.src),
      imageHtml: img ? "" : el.querySelector(".item-image")?.innerHTML?.trim() || "",
    };
  });
}

export function refreshShoppingBagTotals(root) {
  const page = root.querySelector("#shoppingBagPage");
  if (!page) return;

  let total = 0;
  page.querySelectorAll(".bag-item").forEach((item) => {
    const qty = parseInt(item.querySelector(".qty-select")?.value || "1", 10);
    const priceEl = item.querySelector(".item-price");
    const unit =
      parseFloat(priceEl?.dataset.priceEur) ||
      parsePrice(priceEl?.textContent);
    total += qty * unit;
  });

  const formatted = formatPrice(total);
  const subtotal = page.querySelector("#subtotal");
  const totalEl = page.querySelector("#total");
  if (subtotal) subtotal.textContent = formatted;
  if (totalEl) totalEl.textContent = formatted;

  let count = 0;
  page.querySelectorAll(".bag-item").forEach((item) => {
    count += parseInt(item.querySelector(".qty-select")?.value || "1", 10);
  });
  const countEl = page.querySelector(".bag-header-count");
  const headerTotal = page.querySelector(".bag-header-total");
  const labelEl = page.querySelector(".bag-header-items-label");
  if (countEl) countEl.textContent = String(count);
  if (labelEl) labelEl.textContent = count === 1 ? "item" : "items";
  if (headerTotal) headerTotal.textContent = formatted;
}
