import { wishlistIcon } from "./icons.js";

export function createCategoryProduct(product) {
  const card = document.createElement("article");
  card.className = "category-product product js-product-open";
  card.dataset.productId = product.id;
  card.dataset.images = product.images.join("|");

  const swatchesHtml = product.swatches
    .map(
      (color, index) => {
        const hex = typeof color === "string" ? color : color.hex;
        const colorIndex = typeof color === "object" ? color.index ?? index : index;
        return `<button type="button" class="category-product__swatch${index === 0 ? " is-selected" : ""}" data-color-index="${colorIndex}" style="background:${hex}" aria-label="${typeof color === "object" ? color.label || "Color option" : "Color option"}"></button>`;
      }
    )
    .join("");

  const noteHtml = product.stockNote
    ? `<span class="category-product__note category-product__note--${product.stockNote}">${product.stockNote === "sold-out" ? "SOLD OUT" : product.stockNote === "dispo" ? "DISPO" : product.stockNote === "not" ? "NOT" : "NEW"}</span>`
    : "";
  const tagHtml = product.tag
    ? `<span class="category-product__tag">${product.tag}</span>`
    : "";
  const packHtml = product.isPack
    ? `<span class="category-product__pack">${product.packLabel || "PACK"}</span>`
    : "";

  card.innerHTML = `
    <div class="imgwrap">
      ${noteHtml}
      <div class="slides"></div>
    </div>
    <div class="underline">
      <div class="underline__track">
        <div class="underline__fill"></div>
      </div>
    </div>
    <div class="meta">
      <div class="category-product__name-row">
        <span class="category-product__name">${product.name}</span>
        ${tagHtml}
        ${packHtml}
      </div>
      <button class="wishlist-btn" type="button" aria-label="Add to wishlist">
        ${wishlistIcon}
      </button>
    </div>
    <div class="category-product__swatches-wrap">
      <div class="category-product__swatches">${swatchesHtml}</div>
    </div>
    <div class="category-product__price" data-price-eur="${product.priceEur ?? ""}">${product.price}</div>
    <button class="category-product__add" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8a3 3 0 1 1 6 0"/></svg>
      Add to Bag
    </button>
  `;

  return card;
}
