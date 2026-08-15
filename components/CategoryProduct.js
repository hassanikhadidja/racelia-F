import { wishlistIcon, cartIcon } from "./icons.js";

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
        return `<button type="button" class="category-product__swatch${index === 0 ? " is-selected" : ""}" data-color-index="${colorIndex}" style="background:${hex}" aria-label="${typeof color === "object" ? color.label || "Option de couleur" : "Option de couleur"}"></button>`;
      }
    )
    .join("");

  const noteHtml = product.stockNote
    ? `<span class="category-product__note category-product__note--${product.stockNote}">${product.stockNote === "sold-out" ? "ÉPUISÉ" : product.stockNote === "dispo" ? "DISPO" : product.stockNote === "not" ? "NON" : "NOUVEAU"}</span>`
    : "";
  const tagHtml = product.tag
    ? `<span class="category-product__tag">${product.tag}</span>`
    : "";
  const packHtml = product.isPack
    ? `<span class="category-product__pack">${product.packLabel || "PACK"}</span>`
    : "";

  card.innerHTML = `
    <div class="category-product__visual">
      <div class="imgwrap">
        <div class="slides"></div>
        <div class="category-product__note-slot">${noteHtml}</div>
      </div>
    </div>
    <div class="underline">
      <div class="underline__track">
        <div class="underline__fill"></div>
      </div>
    </div>
    <div class="meta">
      <div class="category-product__copy">
        <span class="category-product__name">${product.name}</span>
        <span class="category-product__extras">${tagHtml}${packHtml}</span>
      </div>
      <button class="wishlist-btn" type="button" aria-label="Ajouter à la liste de souhaits">
        ${wishlistIcon}
      </button>
    </div>
    <div class="category-product__swatches-wrap">
      <div class="category-product__swatches">${swatchesHtml}</div>
    </div>
    <div class="category-product__price" data-price-eur="${product.priceEur ?? ""}">${product.price}</div>
    <button class="category-product__add" type="button">
      ${cartIcon}
      <span class="category-product__add-label">Ajouter au panier</span>
    </button>
  `;

  return card;
}
