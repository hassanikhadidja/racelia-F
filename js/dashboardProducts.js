import {
  loadCatalogProducts,
  upsertCatalogProduct,
  deleteCatalogProduct,
  createEmptyCatalogProduct,
  getCatalogProductById,
  stockNoteLabel,
  notifyCatalogUpdated,
  isInSalesReport,
  PRODUCT_SECTIONS,
} from "./productCatalog.js";
import { formatDzdPrice, formatProductPrice, parseDzdInput } from "./currency.js";
import { emptyColorVariant } from "./productImages.js";
import { getDashboardProductsOverlaysMarkup } from "./dashboardProductsMarkup.js";
import { setFormStatus } from "./formStatus.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sectionLabels(sections) {
  return (sections || [])
    .map((id) => PRODUCT_SECTIONS.find((s) => s.id === id)?.label || id)
    .join(", ");
}

function renderProductCard(product) {
  const cover = product.cardCover || product.coverImage || product.cardImages?.[0] || "";
  const note = product.stockNote ? stockNoteLabel(product.stockNote) : "";
  const priceLabel = formatProductPrice(product);
  return `<article class="product-card dashboard-product-card" data-product-id="${escapeHtml(product.id)}">
    <div class="product-thumb-lg dashboard-product-thumb" style="background-image:url('${escapeHtml(cover)}')">
      ${note ? `<span class="dashboard-product-card__note dashboard-product-card__note--${escapeHtml(product.stockNote)}">${escapeHtml(note)}</span>` : ""}
      ${product.isNewArrival ? `<span class="dashboard-product-card__note dashboard-product-card__note--new">NEW ARRIVAL</span>` : ""}
      ${isInSalesReport(product) ? `<span class="dashboard-product-card__note dashboard-product-card__note--sales">SALES REPORT</span>` : ""}
    </div>
    <div class="product-card-body">
      <div class="product-card-name">${escapeHtml(product.name)}</div>
      <div class="product-card-meta">${escapeHtml(priceLabel)}${product.tag ? ` · ${escapeHtml(product.tag)}` : ""}</div>
      <div class="dashboard-product-card__sections">${escapeHtml(sectionLabels(product.sections))}</div>
    </div>
    <div class="dashboard-product-card__actions">
      <button type="button" class="edit-btn js-dashboard-product-edit" data-product-id="${escapeHtml(product.id)}">Edit</button>
      <button type="button" class="edit-btn js-dashboard-product-view" data-product-id="${escapeHtml(product.id)}">View PDP</button>
      <button type="button" class="edit-btn dashboard-product-card__delete js-dashboard-product-delete-card" data-product-id="${escapeHtml(product.id)}">Delete</button>
    </div>
  </article>`;
}

export function renderDashboardProducts(page) {
  const grid = page.querySelector("#dashboard-products-grid");
  const empty = page.querySelector("#dashboard-products-empty");
  if (!grid) return;

  const filter =
    page.querySelector(".dashboard-products-filter.active")?.dataset.productsFilter || "all";
  const products = loadCatalogProducts().filter((product) => {
    if (filter === "sales") return isInSalesReport(product);
    if (filter === "not-sales") return !isInSalesReport(product);
    return true;
  });
  grid.innerHTML = products.map(renderProductCard).join("");
  if (empty) {
    empty.hidden = products.length > 0;
    empty.textContent =
      filter === "all"
        ? "No products yet."
        : filter === "sales"
          ? "No products in the sales report."
          : "No products outside the sales report.";
  }

  grid.querySelectorAll(".js-dashboard-product-edit").forEach((btn) => {
    btn.addEventListener("click", () => openProductEditor(page, btn.dataset.productId));
  });
  grid.querySelectorAll(".js-dashboard-product-view").forEach((btn) => {
    btn.addEventListener("click", () => previewProduct(page, btn.dataset.productId));
  });
  grid.querySelectorAll(".js-dashboard-product-delete-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.productId;
      if (!id || !window.confirm("Delete this product from the catalog?")) return;
      deleteCatalogProduct(id);
      renderDashboardProducts(page);
      notifyCatalogUpdated(page.closest("#racelia-app"));
    });
  });
}

function readFileAsDataUrl(file, callback) {
  if (!file?.type?.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") callback(reader.result);
  };
  reader.readAsDataURL(file);
}

function imageUploadBtnHtml() {
  return `<label class="edit-btn dashboard-product-image-upload">From device<input type="file" class="dashboard-product-image-file" accept="image/*" hidden /></label>`;
}

function imageRowHtml(value = "", removeClass = "js-dashboard-product-remove-image") {
  return `<div class="dashboard-product-image-row">
    <input type="url" class="dashboard-product-image-input" value="${escapeHtml(value)}" placeholder="https://… or upload from device" />
    ${imageUploadBtnHtml()}
    <button type="button" class="edit-btn ${removeClass}" aria-label="Remove image">Remove</button>
  </div>`;
}

function applyUploadedImageToField(fileInput, dataUrl) {
  const row = fileInput.closest(".dashboard-product-image-row");
  const urlInput = row?.querySelector(
    ".dashboard-product-image-input, input[type='url'], .dashboard-color-input"
  );
  if (!urlInput) return;
  urlInput.value = dataUrl;
  urlInput.dispatchEvent(new Event("input", { bubbles: true }));
}

function bindProductImageUploads(page) {
  page.addEventListener("change", (event) => {
    const input = event.target;
    if (!input.classList.contains("dashboard-product-image-file")) return;
    const file = input.files?.[0];
    if (!file) return;
    readFileAsDataUrl(file, (dataUrl) => applyUploadedImageToField(input, dataUrl));
    input.value = "";
  });
}

function renderImageList(container, values = [], removeClass) {
  if (!container) return;
  container.innerHTML = values.length
    ? values.map((url) => imageRowHtml(url, removeClass)).join("")
    : imageRowHtml("", removeClass);
}

function readImageList(container) {
  if (!container) return [];
  return [...container.querySelectorAll(".dashboard-product-image-input")]
    .map((input) => input.value.trim())
    .filter(Boolean);
}

function coverRowHtml(field, value = "", placeholder = "https://… or upload from device") {
  return `<div class="dashboard-product-image-row dashboard-product-image-row--single">
    <input type="url" class="dashboard-color-input" data-field="${field}" value="${escapeHtml(value || "")}" placeholder="${escapeHtml(placeholder)}" />
    ${imageUploadBtnHtml()}
  </div>`;
}

function scrollListHtml(field, values = [], removeClass) {
  const rows = (values || []).length
    ? values.map((url) => imageRowHtml(url, removeClass)).join("")
    : imageRowHtml("", removeClass);
  return `<div class="dashboard-product-image-list dashboard-color-scroll-list" data-field="${field}">${rows}</div>`;
}

function imageGroupHtml({ title, hint, coverField, coverValue, coverPlaceholder, scrollField, scrollValues, scrollRemoveClass, addScrollClass, addScrollLabel, index }) {
  return `<div class="dashboard-image-group">
    <div class="dashboard-image-group__head">
      <h5 class="dashboard-image-group__title">${title}</h5>
      ${hint ? `<p class="dashboard-image-group__hint">${hint}</p>` : ""}
    </div>
    <div class="dashboard-product-field">
      <label>Cover</label>
      ${coverRowHtml(coverField, coverValue, coverPlaceholder)}
    </div>
    <div class="dashboard-product-field">
      <label>Scroll images</label>
      ${scrollListHtml(scrollField, scrollValues, scrollRemoveClass)}
      <button type="button" class="edit-btn ${addScrollClass}" data-color-index="${index}">${addScrollLabel}</button>
    </div>
  </div>`;
}

function closerGroupHtml({ title, hint, mainValue, mainPlaceholder, extraValues, index, isDefault }) {
  return `<div class="dashboard-image-group">
    <div class="dashboard-image-group__head">
      <h5 class="dashboard-image-group__title">${title}</h5>
      ${hint ? `<p class="dashboard-image-group__hint">${hint}</p>` : ""}
    </div>
    <div class="dashboard-product-field">
      <label>Main picture</label>
      ${coverRowHtml("closerLookMain", mainValue, mainPlaceholder)}
    </div>
    <div class="dashboard-product-field">
      <label>Other pictures</label>
      ${scrollListHtml("closerLookExtra", extraValues, "js-dashboard-color-remove-closer")}
      <button type="button" class="edit-btn js-dashboard-color-add-closer" data-color-index="${index}">+ Add closer look image</button>
    </div>
  </div>`;
}

function colorImagePanelsHtml(variant, index, isDefault) {
  const v = variant || emptyColorVariant();
  const coverPh = isDefault ? "https://… or upload from device" : "Leave empty to use default (1st color)";
  const groups = [
    imageGroupHtml({
      title: "Card (catalogue)",
      hint: isDefault ? "Shown on product cards & grids." : "Override catalogue images for this color.",
      coverField: "cardCover",
      coverValue: v.cardCover,
      coverPlaceholder: coverPh,
      scrollField: "cardScroll",
      scrollValues: v.cardScroll,
      scrollRemoveClass: "js-dashboard-color-remove-scroll",
      addScrollClass: "js-dashboard-color-add-scroll",
      addScrollLabel: "+ Add card scroll",
      index,
    }),
    imageGroupHtml({
      title: "Product page (PDP)",
      hint: isDefault ? "Main gallery on the product detail page." : "Override PDP gallery for this color.",
      coverField: "pdpCover",
      coverValue: v.pdpCover,
      coverPlaceholder: coverPh,
      scrollField: "pdpScroll",
      scrollValues: v.pdpScroll,
      scrollRemoveClass: "js-dashboard-color-remove-pdp-scroll",
      addScrollClass: "js-dashboard-color-add-pdp-scroll",
      addScrollLabel: "+ Add PDP scroll",
      index,
    }),
    closerGroupHtml({
      title: "Closer look",
      hint: isDefault ? "Detail photos under the product description." : "Override closer-look images for this color.",
      mainValue: v.closerLookMain,
      mainPlaceholder: coverPh,
      extraValues: v.closerLookExtra,
      index,
      isDefault,
    }),
  ].join("");

  return `<div class="dashboard-color-variant__images">${groups}</div>`;
}

function mergeDefaultsIntoFirstVariant(variants = [], product = {}) {
  const list = variants.length ? variants.map((v) => ({ ...emptyColorVariant(), ...v })) : [emptyColorVariant()];
  const first = list[0];
  const hasOwnImages =
    first.cardCover ||
    first.pdpCover ||
    first.closerLookMain ||
    (first.cardScroll || []).length ||
    (first.pdpScroll || []).length ||
    (first.closerLookExtra || []).length;

  if (!hasOwnImages) {
    first.cardCover = product.cardCover || product.coverImage || "";
    first.cardScroll = Array.isArray(product.cardScroll) ? [...product.cardScroll] : [];
    first.pdpCover = product.pdpCover || first.cardCover || "";
    first.pdpScroll = Array.isArray(product.pdpScroll) ? [...product.pdpScroll] : [];
    first.closerLookMain = product.closerLookMain?.image || "";
    first.closerLookExtra = Array.isArray(product.closerLookExtra)
      ? [...product.closerLookExtra]
      : Array.isArray(product.closerLookImages)
        ? [...product.closerLookImages]
        : [];
  }
  return list;
}

function colorVariantRowHtml(variant = emptyColorVariant(), index = 0, showOverrides = false) {
  const v = variant || emptyColorVariant();
  const isDefault = index === 0;
  const showImages = isDefault || showOverrides;
  const badge = isDefault
    ? `<span class="dashboard-color-badge dashboard-color-badge--default">1 · Default pictures</span>`
    : `<span class="dashboard-color-badge">Color ${index + 1}</span>`;
  const removeBtn = isDefault
    ? `<button type="button" class="edit-btn js-dashboard-color-remove" disabled title="Default color cannot be removed">Default</button>`
    : `<button type="button" class="edit-btn js-dashboard-color-remove" aria-label="Remove color">Remove</button>`;

  return `<div class="dashboard-color-variant${isDefault ? " is-default" : ""}" data-color-index="${index}">
    <div class="dashboard-color-variant__head">
      <div class="dashboard-color-variant__badge">${badge}</div>
      <div class="dashboard-product-field">
        <label>Color hex</label>
        <input type="text" class="dashboard-color-input" data-field="hex" value="${escapeHtml(v.hex || "#111111")}" placeholder="#111111" />
      </div>
      <div class="dashboard-product-field">
        <label>Label</label>
        <input type="text" class="dashboard-color-input" data-field="label" value="${escapeHtml(v.label || "")}" placeholder="Black" />
      </div>
      ${removeBtn}
    </div>
    ${
      isDefault
        ? `<p class="dashboard-color-variant__note">These pictures are used for every color unless an override is set below.</p>`
        : showOverrides
          ? `<p class="dashboard-color-variant__note">Optional overrides — leave empty to keep the default (1st color) pictures.</p>`
          : `<p class="dashboard-color-variant__note">Uses default pictures from color 1. Enable “Different pictures per color” to override.</p>`
    }
    ${showImages ? colorImagePanelsHtml(v, index, isDefault) : ""}
  </div>`;
}

function renderColorVariants(page, variants = [], showOverrides = false) {
  const container = page.querySelector("#dashboard-product-color-variants");
  if (!container) return;
  const list = variants.length ? variants : [emptyColorVariant()];
  container.innerHTML = list
    .map((variant, index) => colorVariantRowHtml(variant, index, showOverrides))
    .join("");
}

function readColorVariants(page) {
  const showOverrides = page.querySelector("#dashboard-product-has-color-images")?.checked;
  return [...page.querySelectorAll(".dashboard-color-variant")].map((row, index) => {
    const readField = (field) =>
      row.querySelector(`.dashboard-color-input[data-field="${field}"]`)?.value.trim() || "";
    const readScroll = (field) =>
      readImageList(row.querySelector(`.dashboard-color-scroll-list[data-field="${field}"]`));

    const variant = {
      hex: readField("hex") || "#111111",
      label: readField("label"),
      cardCover: "",
      cardScroll: [],
      pdpCover: "",
      pdpScroll: [],
      closerLookMain: "",
      closerLookExtra: [],
    };

    const isDefault = index === 0;
    if (isDefault || showOverrides) {
      variant.cardCover = readField("cardCover");
      variant.cardScroll = readScroll("cardScroll");
      variant.pdpCover = readField("pdpCover");
      variant.pdpScroll = readScroll("pdpScroll");
      variant.closerLookMain = readField("closerLookMain");
      variant.closerLookExtra = readScroll("closerLookExtra");
    }

    return variant;
  });
}

function updateCardCoverPreview(page) {
  /* preview lives on first color cover now — optional no-op kept for callers */
  void page;
}

function fillProductEditor(page, product) {
  const isEdit = Boolean(product?.id && getCatalogProductById(product.id));
  page.querySelector("#dashboard-product-editor-title").textContent = isEdit
    ? "Edit product"
    : "Add product";
  page.querySelector("#dashboard-product-edit-id").value = product.id || "";
  page.querySelector("#dashboard-product-name").value = product.name || "";
  page.querySelector("#dashboard-product-id").value = product.id || "";
  page.querySelector("#dashboard-product-id").readOnly = isEdit;
  page.querySelector("#dashboard-product-tag").value = product.tag || "";
  page.querySelector("#dashboard-product-price").value = product.priceAmountDzd
    ? String(product.priceAmountDzd)
    : product.price || "";
  page.querySelector("#dashboard-product-stock-note").value = product.stockNote || "";
  page.querySelector("#dashboard-product-is-pack").checked = Boolean(product.isPack);
  page.querySelector("#dashboard-product-is-new-arrival").checked = Boolean(product.isNewArrival);
  const salesSelect = page.querySelector("#dashboard-product-sales-report");
  if (salesSelect) salesSelect.value = isInSalesReport(product) ? "yes" : "no";
  page.querySelector("#dashboard-product-has-color-images").checked = Boolean(product.hasColorImages);
  page.querySelector("#dashboard-product-pack-label").value = product.packLabel || "";
  page.querySelector("#dashboard-product-pack-wrap").hidden = !product.isPack;
  page.querySelector("#dashboard-product-description").value = product.description || "";
  page.querySelector("#dashboard-product-details").value = (product.details || []).join("\n");
  page.querySelector("#dashboard-product-filters").value = (product.filters || []).join(", ");

  page.querySelector("#dashboard-product-closer-title").value =
    product.closerLookMain?.title || "A Closer Look";
  page.querySelector("#dashboard-product-closer-text").value = product.closerLookMain?.text || "";

  page.querySelectorAll(".dashboard-product-section-check").forEach((input) => {
    input.checked = (product.sections || []).includes(input.value);
  });

  const rawVariants = product.colorVariants?.length
    ? product.colorVariants
    : product.colors?.map((hex) => ({ hex }));
  const variants = mergeDefaultsIntoFirstVariant(rawVariants, product);

  renderColorVariants(page, variants, Boolean(product.hasColorImages));

  const deleteBtn = page.querySelector(".js-dashboard-product-delete");
  if (deleteBtn) deleteBtn.hidden = !isEdit;
}

function collectProductFromEditor(page) {
  const existingId = page.querySelector("#dashboard-product-edit-id")?.value.trim();
  const slug = page.querySelector("#dashboard-product-id")?.value.trim().toLowerCase();
  const id = existingId && getCatalogProductById(existingId) ? existingId : slug;
  const priceAmountDzd = parseDzdInput(page.querySelector("#dashboard-product-price")?.value);
  const colorVariants = readColorVariants(page);
  const first = colorVariants[0] || emptyColorVariant();
  const sections = [...page.querySelectorAll(".dashboard-product-section-check:checked")].map(
    (input) => input.value
  );

  return {
    id: existingId || id,
    name: page.querySelector("#dashboard-product-name")?.value.trim(),
    tag: page.querySelector("#dashboard-product-tag")?.value.trim(),
    priceAmountDzd,
    price: formatDzdPrice(priceAmountDzd),
    stockNote: page.querySelector("#dashboard-product-stock-note")?.value || "",
    isPack: page.querySelector("#dashboard-product-is-pack")?.checked,
    isNewArrival: page.querySelector("#dashboard-product-is-new-arrival")?.checked,
    inSalesReport: page.querySelector("#dashboard-product-sales-report")?.value === "yes",
    hasColorImages: page.querySelector("#dashboard-product-has-color-images")?.checked,
    packLabel: page.querySelector("#dashboard-product-pack-label")?.value.trim(),
    description: page.querySelector("#dashboard-product-description")?.value.trim(),
    details: (page.querySelector("#dashboard-product-details")?.value || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    colors: colorVariants.map((v) => v.hex),
    colorVariants,
    filters: (page.querySelector("#dashboard-product-filters")?.value || "")
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean),
    sections: sections.length ? sections : ["all-selection"],
    /* Defaults always come from the first color */
    cardCover: first.cardCover || "",
    cardScroll: first.cardScroll || [],
    pdpCover: first.pdpCover || first.cardCover || "",
    pdpScroll: first.pdpScroll || [],
    closerLookExtra: first.closerLookExtra || [],
    closerLookMain: {
      image: first.closerLookMain || "",
      title: page.querySelector("#dashboard-product-closer-title")?.value.trim() || "A Closer Look",
      text: page.querySelector("#dashboard-product-closer-text")?.value.trim() || "",
    },
  };
}

function openProductEditor(page, productId = null) {
  const overlay = page.querySelector("#dashboard-product-editor-overlay");
  if (!overlay) return;

  const product = productId
    ? getCatalogProductById(productId)
    : createEmptyCatalogProduct();
  if (!product) return;

  fillProductEditor(page, product);
  page.classList.add("dashboard-product-editor-open");
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("dashboard-product-editor-open");
}

function closeProductEditor(page) {
  const overlay = page.querySelector("#dashboard-product-editor-overlay");
  overlay?.classList.remove("open");
  overlay?.setAttribute("aria-hidden", "true");
  page?.classList.remove("dashboard-product-editor-open");
  document.body.classList.remove("dashboard-product-editor-open");
}

function previewProduct(page, productId) {
  const root = page.closest("#racelia-app");
  if (!root || !productId) return;
  root.dispatchEvent(new CustomEvent("racelia:open-product", { detail: { productId } }));
}

function bindProductEditor(page, root) {
  page.querySelector("#dashboard-product-editor-overlay")?.remove();
  page.insertAdjacentHTML("beforeend", getDashboardProductsOverlaysMarkup());
  bindProductImageUploads(page);

  page.querySelector(".js-dashboard-product-add-open")?.addEventListener("click", () => {
    openProductEditor(page);
  });

  page.querySelector(".js-dashboard-product-editor-close")?.addEventListener("click", () => {
    closeProductEditor(page);
  });

  page.querySelector("#dashboard-product-editor-overlay")?.addEventListener("click", (event) => {
    if (event.target.id === "dashboard-product-editor-overlay") closeProductEditor(page);
  });

  page.querySelector("#dashboard-product-is-pack")?.addEventListener("change", (event) => {
    const wrap = page.querySelector("#dashboard-product-pack-wrap");
    if (wrap) wrap.hidden = !event.target.checked;
  });

  page.querySelector("#dashboard-product-has-color-images")?.addEventListener("change", () => {
    const variants = readColorVariants(page);
    renderColorVariants(
      page,
      variants,
      page.querySelector("#dashboard-product-has-color-images")?.checked
    );
  });

  page.querySelector(".js-dashboard-product-add-color")?.addEventListener("click", () => {
    const variants = readColorVariants(page);
    variants.push(emptyColorVariant());
    renderColorVariants(
      page,
      variants,
      page.querySelector("#dashboard-product-has-color-images")?.checked
    );
  });

  page.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("js-dashboard-product-remove-card-scroll")) {
      target.closest(".dashboard-product-image-row")?.remove();
    }
    if (target.classList.contains("js-dashboard-product-remove-pdp-scroll")) {
      target.closest(".dashboard-product-image-row")?.remove();
    }
    if (target.classList.contains("js-dashboard-product-remove-closer-image")) {
      target.closest(".dashboard-product-image-row")?.remove();
    }
    if (target.classList.contains("js-dashboard-color-remove")) {
      if (target.disabled) return;
      const variants = readColorVariants(page);
      const row = target.closest(".dashboard-color-variant");
      const index = Number(row?.dataset.colorIndex ?? -1);
      if (index <= 0) return;
      variants.splice(index, 1);
      renderColorVariants(
        page,
        variants.length ? variants : [emptyColorVariant()],
        page.querySelector("#dashboard-product-has-color-images")?.checked
      );
    }
    if (target.classList.contains("js-dashboard-color-remove-scroll")) {
      target.closest(".dashboard-product-image-row")?.remove();
    }
    if (target.classList.contains("js-dashboard-color-remove-pdp-scroll")) {
      target.closest(".dashboard-product-image-row")?.remove();
    }
    if (target.classList.contains("js-dashboard-color-remove-closer")) {
      target.closest(".dashboard-product-image-row")?.remove();
    }
    if (target.classList.contains("js-dashboard-color-add-scroll")) {
      const row = target.closest(".dashboard-color-variant");
      row
        ?.querySelector('.dashboard-color-scroll-list[data-field="cardScroll"]')
        ?.insertAdjacentHTML("beforeend", imageRowHtml("", "js-dashboard-color-remove-scroll"));
    }
    if (target.classList.contains("js-dashboard-color-add-pdp-scroll")) {
      const row = target.closest(".dashboard-color-variant");
      row
        ?.querySelector('.dashboard-color-scroll-list[data-field="pdpScroll"]')
        ?.insertAdjacentHTML("beforeend", imageRowHtml("", "js-dashboard-color-remove-pdp-scroll"));
    }
    if (target.classList.contains("js-dashboard-color-add-closer")) {
      const row = target.closest(".dashboard-color-variant");
      row
        ?.querySelector('.dashboard-color-scroll-list[data-field="closerLookExtra"]')
        ?.insertAdjacentHTML("beforeend", imageRowHtml("", "js-dashboard-color-remove-closer"));
    }
  });

  page.querySelector(".js-dashboard-product-save")?.addEventListener("click", async () => {
    const data = collectProductFromEditor(page);
    const editor = page.querySelector("#dashboard-product-editor") || page;
    if (!data.id || !/^[a-z0-9-]+$/.test(data.id)) {
      setFormStatus(editor, "Product ID must use lowercase letters, numbers, and hyphens.");
      return;
    }
    if (!data.name || !data.priceAmountDzd) {
      setFormStatus(editor, "Name and price (DZD) are required.");
      return;
    }
    if (!data.cardCover && !data.cardScroll.length && !data.pdpCover) {
      setFormStatus(editor, "Add at least a card cover or PDP cover image on the first (default) color.");
      return;
    }

    const saveBtn = page.querySelector(".js-dashboard-product-save");
    const saveLabel = saveBtn?.textContent || "Save";
    setFormStatus(editor, "");
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = "Saving…";
    }

    try {
      await upsertCatalogProduct(data);
      closeProductEditor(page);
      renderDashboardProducts(page);
      notifyCatalogUpdated(root);
    } catch (error) {
      setFormStatus(editor, error?.message || "Could not save product.");
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = saveLabel;
      }
    }
  });

  page.querySelector(".js-dashboard-product-preview")?.addEventListener("click", async () => {
    const data = collectProductFromEditor(page);
    if (!data.id) return;
    try {
      await upsertCatalogProduct(data);
      previewProduct(page, data.id);
    } catch (error) {
      setFormStatus(
        page.querySelector("#dashboard-product-editor") || page,
        error?.message || "Could not save product."
      );
    }
  });

  page.querySelector(".js-dashboard-product-delete")?.addEventListener("click", () => {
    const id = page.querySelector("#dashboard-product-edit-id")?.value.trim();
    if (!id || !window.confirm("Delete this product?")) return;
    deleteCatalogProduct(id);
    closeProductEditor(page);
    renderDashboardProducts(page);
    notifyCatalogUpdated(root);
  });
}

export function closeDashboardProductsOverlay(page) {
  const overlay = page.querySelector("#dashboard-product-editor-overlay");
  if (overlay?.classList.contains("open")) {
    closeProductEditor(page);
    return true;
  }
  return false;
}

export function initDashboardProducts(page, root) {
  const section = page.querySelector("#order");
  if (!section || section.dataset.productsBound === "true") return;
  section.dataset.productsBound = "true";

  bindProductEditor(page, root);
  renderDashboardProducts(page);

  page.querySelectorAll(".dashboard-products-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      page.querySelectorAll(".dashboard-products-filter").forEach((item) => {
        item.classList.toggle("active", item === btn);
      });
      renderDashboardProducts(page);
    });
  });

  page.querySelector('[data-screen="order"]')?.addEventListener("click", () => {
    requestAnimationFrame(() => renderDashboardProducts(page));
  });
}
