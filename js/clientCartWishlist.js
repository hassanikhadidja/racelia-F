import { getAuthToken, getStoredUser } from "./api.js";
import { getCatalogProductById } from "./productCatalog.js";
import { getProductDetail } from "./productDetailData.js";
import { formatPrice, parsePriceFromCatalog, upsertBagLineItem, refreshShoppingBagTotals } from "./bagHelpers.js";
import { syncBagCountFromDom } from "./cart.js";

const CART_PREFIX = "raceliaClientCart:";
const WISHLIST_PREFIX = "raceliaClientWishlist:";

let wishlistItems = [];

function getUserKey() {
  if (!getAuthToken()) return null;
  const user = getStoredUser();
  return user?.id || user?._id || user?.email || null;
}

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getWishlistItems() {
  return wishlistItems;
}

export function isProductInWishlist(productId) {
  if (!productId) return false;
  return wishlistItems.some((item) => item.productId === productId);
}

function extractProductFromCard(card) {
  if (!card) return null;

  const productId = card.dataset.productId;
  if (!productId) return null;

  const catalog = getCatalogProductById(productId);
  const detail = getProductDetail(productId);
  const name =
    card.querySelector(".category-product__name")?.textContent?.trim() ||
    card.querySelector(".meta span")?.textContent?.trim() ||
    catalog?.name ||
    detail?.name ||
    "Product";

  const priceEl = card.querySelector(".category-product__price");
  const priceEur =
    parseFloat(priceEl?.dataset.priceEur) ||
    catalog?.priceEur ||
    detail?.priceEur ||
    parsePriceFromCatalog(priceEl?.textContent || catalog?.price);

  const images = (card.dataset.images || "").split("|").filter(Boolean);
  const selectedSwatch = card.querySelector(".category-product__swatch.is-selected");
  const colorIndex = Number(selectedSwatch?.dataset.colorIndex ?? 0);
  const swatchLabel = selectedSwatch?.getAttribute("aria-label") || "";
  const color =
    swatchLabel && swatchLabel !== "Color option"
      ? swatchLabel
      : catalog?.swatches?.[colorIndex]?.label || "";

  const imageUrl = images[colorIndex] || images[0] || catalog?.images?.[0] || detail?.images?.[0] || "";

  return {
    productId,
    name,
    priceEur: Number(priceEur) || 0,
    color,
    imageUrl,
  };
}

function extractProductFromPdp(root) {
  const page = root.querySelector("#productDetailPage");
  const productId = page?.dataset.activeProductId;
  if (!productId) return null;

  const product = getProductDetail(productId);
  const catalog = getCatalogProductById(productId);
  if (!product && !catalog) return null;

  const activeSwatch = page.querySelector(".pdp-swatch.is-active");
  const color =
    activeSwatch?.getAttribute("aria-label") ||
    activeSwatch?.dataset.color ||
    "";
  const heroImg = page.querySelector("#pdpSlides img");

  return {
    productId,
    name: product?.name || catalog?.name || "Product",
    priceEur: product?.priceEur || catalog?.priceEur || 0,
    color: color && color !== "Color option" ? color : "",
    imageUrl: heroImg?.getAttribute("src") || product?.images?.[0] || catalog?.images?.[0] || "",
  };
}

function resolveWishlistProduct(root, btn) {
  const card = btn.closest(".category-product, .product");
  if (card) return extractProductFromCard(card);

  const pdp = btn.closest("#productDetailPage");
  if (pdp) return extractProductFromPdp(root);

  return null;
}

function serializeBagFromDom(root) {
  const page = root.querySelector("#shoppingBagPage");
  const items = [];

  page?.querySelectorAll(".bag-item").forEach((el) => {
    const productId =
      el.dataset.productId ||
      (el.id?.startsWith("item-pdp-") ? el.id.slice("item-pdp-".length) : "");
    if (!productId) return;

    const qty = parseInt(el.querySelector(".qty-select")?.value || "1", 10);
    const priceEur = parseFloat(el.querySelector(".item-price")?.dataset.priceEur);
    const colorRaw = el.querySelector(".item-color")?.textContent?.trim() || "";
    const color = colorRaw.replace(/^Color:\s*/i, "");
    const img = el.querySelector(".item-image img");

    items.push({
      productId,
      name: el.querySelector(".item-name")?.textContent?.trim() || "Product",
      priceEur: Number.isFinite(priceEur) ? priceEur : 0,
      color,
      imageUrl: img?.src || "",
      qty: Math.min(5, Math.max(1, qty)),
    });
  });

  return { items, updatedAt: Date.now() };
}

function clearBagDom(root) {
  const bagItems = root.querySelector("#shoppingBagPage .bag-items");
  if (bagItems) bagItems.replaceChildren();
}

export function persistClientCart(root) {
  const userKey = getUserKey();
  if (!userKey || !root) return;
  writeStorage(`${CART_PREFIX}${userKey}`, serializeBagFromDom(root));
}

export function persistClientWishlist() {
  const userKey = getUserKey();
  if (!userKey) return;
  writeStorage(`${WISHLIST_PREFIX}${userKey}`, {
    items: wishlistItems,
    updatedAt: Date.now(),
  });
}

function restoreBagFromStorage(root, items = []) {
  clearBagDom(root);

  items.forEach((item) => {
    if (!item?.productId) return;
    upsertBagLineItem(root, {
      productId: item.productId,
      name: item.name,
      priceEur: item.priceEur,
      color: item.color,
      imageUrl: item.imageUrl,
      qty: item.qty,
      mode: "set",
    });
    const safeId = `item-pdp-${item.productId}`.replace(/[^\w-]/g, "-");
    const el = root.querySelector(`#${CSS.escape(safeId)}`);
    if (el) el.dataset.productId = item.productId;
  });

  refreshShoppingBagTotals(root);
  syncBagCountFromDom(root);
}

function renderWishlistItem(item) {
  const colorHtml = item.color
    ? `<p class="wishlist-color">Color: ${escapeHtml(item.color)}</p>`
    : "";
  const imageHtml = item.imageUrl
    ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" loading="lazy" />`
    : `<svg class="bag-svg" viewBox="0 0 120 96" aria-hidden="true"><rect x="8" y="24" width="104" height="64" rx="4" fill="#e8e8e8"/></svg>`;

  const el = document.createElement("div");
  el.className = "wishlist-item";
  el.dataset.productId = item.productId;
  el.innerHTML = `
    <div class="wishlist-image">${imageHtml}</div>
    <div class="wishlist-details">
      <p class="wishlist-name">${escapeHtml(item.name)}</p>
      ${colorHtml}
      <p class="wishlist-price">${escapeHtml(formatPrice(item.priceEur))}</p>
      <div class="wishlist-actions">
        <a href="#" class="js-wishlist-move-to-bag">Move to Bag</a>
        <a href="#" class="js-wishlist-remove">Remove</a>
      </div>
    </div>
  `;
  return el;
}

export function renderWishlistPage(root) {
  const list = root.querySelector("#wishlistList");
  const empty = root.querySelector("#wishlistEmpty");
  if (!list) return;

  list.replaceChildren();
  wishlistItems.forEach((item) => {
    list.appendChild(renderWishlistItem(item));
  });

  const count = wishlistItems.length;
  list.hidden = count === 0;
  if (empty) empty.hidden = count > 0;

  const countEl = root.querySelector("#wishlistPage .wishlist-count");
  const labelEl = root.querySelector("#wishlistPage .wishlist-count-label");
  if (countEl) countEl.textContent = String(count);
  if (labelEl) labelEl.textContent = count === 1 ? "item" : "items";
  root.querySelector("#wishlistPage .wishlist-footer")?.toggleAttribute("hidden", count === 0);
}

export function syncWishlistHeartStates(root) {
  root.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const card = btn.closest(".category-product, .product");
    const productId =
      card?.dataset.productId ||
      (btn.closest("#productDetailPage") ? root.querySelector("#productDetailPage")?.dataset.activeProductId : null);
    btn.classList.toggle("active", Boolean(productId && isProductInWishlist(productId)));
  });
}

export function addWishlistItem(item) {
  if (!item?.productId) return false;
  if (isProductInWishlist(item.productId)) return false;
  wishlistItems.push(item);
  return true;
}

export function removeWishlistItem(productId) {
  const before = wishlistItems.length;
  wishlistItems = wishlistItems.filter((item) => item.productId !== productId);
  return wishlistItems.length !== before;
}

export function toggleWishlistProduct(root, btn) {
  const product = resolveWishlistProduct(root, btn);
  if (!product) return false;

  const wasActive = btn.classList.contains("active");
  if (wasActive) {
    removeWishlistItem(product.productId);
    btn.classList.remove("active");
  } else {
    addWishlistItem(product);
    btn.classList.add("active");
  }

  renderWishlistPage(root);
  syncWishlistHeartStates(root);
  persistClientWishlist();
  return true;
}

export function moveWishlistItemToBag(root, productId) {
  const item = wishlistItems.find((entry) => entry.productId === productId);
  if (!item) return false;

  upsertBagLineItem(root, {
    productId: item.productId,
    name: item.name,
    priceEur: item.priceEur,
    color: item.color,
    imageUrl: item.imageUrl,
    qty: 1,
    mode: "add",
  });

  const safeId = `item-pdp-${item.productId}`.replace(/[^\w-]/g, "-");
  const el = root.querySelector(`#${CSS.escape(safeId)}`);
  if (el) el.dataset.productId = item.productId;

  refreshShoppingBagTotals(root);
  syncBagCountFromDom(root);
  persistClientCart(root);
  return true;
}

export function restoreClientSession(root) {
  const userKey = getUserKey();
  if (!userKey || !root) return;

  const cartData = readStorage(`${CART_PREFIX}${userKey}`);
  if (Array.isArray(cartData?.items)) {
    restoreBagFromStorage(root, cartData.items);
  }

  const wishlistData = readStorage(`${WISHLIST_PREFIX}${userKey}`);
  wishlistItems = Array.isArray(wishlistData?.items) ? wishlistData.items : [];
  renderWishlistPage(root);
  syncWishlistHeartStates(root);
}

export function clearSessionCartWishlist(root) {
  wishlistItems = [];
  clearBagDom(root);
  refreshShoppingBagTotals(root);
  syncBagCountFromDom(root);
  renderWishlistPage(root);
  syncWishlistHeartStates(root);
}

export function initClientCartWishlist(root) {
  if (root.dataset.clientCartWishlistBound === "true") return;
  root.dataset.clientCartWishlistBound = "true";

  restoreClientSession(root);

  root.addEventListener("click", (event) => {
    const btn = event.target.closest(".wishlist-btn");
    if (!btn || btn.closest(".save-btn")) return;
    event.stopPropagation();
    toggleWishlistProduct(root, btn);
  });

  root.addEventListener("racelia:cart-changed", () => {
    persistClientCart(root);
  });

  root.addEventListener("racelia:client-synced", () => {
    restoreClientSession(root);
  });

  window.addEventListener("racelia:auth-cleared", () => {
    clearSessionCartWishlist(root);
  });

  window.addEventListener("beforeunload", () => {
    if (!getUserKey()) return;
    persistClientCart(root);
    persistClientWishlist();
  });
}
