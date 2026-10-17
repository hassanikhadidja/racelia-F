import { wishlistIcon } from "./icons.js";
import { isProductUnavailableToBuy } from "../js/productCatalog.js";

export function createCategoryProduct(product) {
  const card = document.createElement("article");
  card.className = "category-product product js-product-open";
  card.dataset.productId = product.id;
  card.dataset.images = product.images.join("|");
  const unavailable = isProductUnavailableToBuy(product);

  const swatches = Array.isArray(product.swatches) ? product.swatches : [];
  const swatchesHtml = swatches
    .map(
      (color, index) => {
        const hex = typeof color === "string" ? color : color.hex;
        const colorIndex = typeof color === "object" ? color.index ?? index : index;
        const label =
          typeof color === "object" ? color.label || "Option de couleur" : "Option de couleur";
        return `<button type="button" class="category-product__swatch${index === 0 ? " is-selected" : ""}" data-color-index="${colorIndex}" style="background:${hex}" aria-label="${label}"></button>`;
      }
    )
    .join("");
  const swatchesBlock =
    swatches.length > 1
      ? `<div class="category-product__swatches-wrap">
      <div class="category-product__swatches">${swatchesHtml}</div>
    </div>`
      : "";

  const stockNotes = product.stockNotes?.length
    ? product.stockNotes
    : product.stockNote
      ? [product.stockNote]
      : [];
  const noteText = {
    "sold-out": "ÉPUISÉ",
    dispo: "DISPO",
    not: "NON",
    new: "NOUVEAU",
  };
  const noteHtml = [
    product.isPromo
      ? `<span class="category-product__note category-product__note--promo">PROMO</span>`
      : "",
    ...stockNotes
      .filter((note) => noteText[note])
      .map(
        (note) =>
          `<span class="category-product__note category-product__note--${note}">${noteText[note]}</span>`
      ),
  ].join("");
  const tagHtml = product.tag
    ? `<span class="category-product__tag">${product.tag}</span>`
    : "";
  const bestHtml = product.inSalesReport || stockNotes.includes("best-sellers")
    ? `<span class="category-product__tag">Best-sellers</span>`
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
        <span class="category-product__extras">${tagHtml}${bestHtml}${packHtml}</span>
      </div>
      <button class="wishlist-btn" type="button" aria-label="Ajouter à la liste de souhaits">
        ${wishlistIcon}
      </button>
    </div>
    ${swatchesBlock}
    <div class="category-product__price" data-price-eur="${product.priceEur ?? ""}">
      ${
        product.isPromo && product.compareAtPrice
          ? `<span class="category-product__price-was" data-price-eur="${product.compareAtEur ?? ""}">${product.compareAtPrice}</span><span class="category-product__price-now" data-price-eur="${product.priceEur ?? ""}">${product.price}</span>`
          : product.price
      }
    </div>
    ${
      unavailable
        ? `<button class="category-product__add is-disabled" type="button" disabled aria-label="Produit épuisé">
      <span class="category-product__add-label">Épuisé</span>
    </button>`
        : `<button class="category-product__add" type="button">
      <span class="category-product__add-label">Ajouter au panier</span>
    </button>`
    }
  `;

  return card;
}
