import {
  loadCatalogProducts,
  upsertCatalogProduct,
  deleteCatalogProduct,
  createEmptyCatalogProduct,
  getCatalogProductById,
  stockNoteLabel,
  notifyCatalogUpdated,
  PRODUCT_SECTIONS,
} from "./productCatalog.js";
import { formatDzdPrice, parseDzdInput } from "./currency.js";
import { emptyColorVariant } from "./productImages.js";
import { getDashboardProductsOverlaysMarkup } from "./dashboardProductsMarkup.js";

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
  const priceLabel = product.priceAmountDzd
    ? formatDzdPrice(product.priceAmountDzd)
    : product.price;
  return `<article class="product-card dashboard-product-card" data-product-id="${escapeHtml(product.id)}">
    <div class="product-thumb-lg dashboard-product-thumb" style="background-image:url('${escapeHtml(cover)}')">
      ${note ? `<span class="dashboard-product-card__note dashboard-product-card__note--${escapeHtml(product.stockNote)}">${escapeHtml(note)}</span>` : ""}
      ${product.isNewArrival ? `<span class="dashboard-product-card__note dashboard-product-card__note--new">NEW ARRIVAL</span>` : ""}
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

  const products = loadCatalogProducts();
  grid.innerHTML = products.map(renderProductCard).join("");
  if (empty) empty.hidden = products.length > 0;

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
    <input type="url" class="dashboard-product-image-input" value="${escapeHtml(value)}" placeholder="https://... or upload from device" />
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

function colorVariantRowHtml(variant = emptyColorVariant(), index = 0, showImages = false) {
  const v = variant || emptyColorVariant();
  const imageFields = showImages
    ? `
      <div class="dashboard-color-variant__images">
        <div class="dashboard-product-field">
          <label>Card cover override</label>
          <div class="dashboard-product-image-row dashboard-product-image-row--single">
            <input type="url" class="dashboard-color-input" data-field="cardCover" value="${escapeHtml(v.cardCover || "")}" placeholder="Leave empty to use default" />
            ${imageUploadBtnHtml()}
          </div>
        </div>
        <div class="dashboard-product-field">
          <label>Card scroll overrides</label>
          <div class="dashboard-product-image-list dashboard-color-scroll-list" data-field="cardScroll">${(v.cardScroll || []).map((url) => imageRowHtml(url, "js-dashboard-color-remove-scroll")).join("") || imageRowHtml("", "js-dashboard-color-remove-scroll")}</div>
          <button type="button" class="edit-btn js-dashboard-color-add-scroll" data-color-index="${index}">+ Add card scroll</button>
        </div>
        <div class="dashboard-product-field">
          <label>PDP cover override</label>
          <div class="dashboard-product-image-row dashboard-product-image-row--single">
            <input type="url" class="dashboard-color-input" data-field="pdpCover" value="${escapeHtml(v.pdpCover || "")}" placeholder="Leave empty to use default" />
            ${imageUploadBtnHtml()}
          </div>
        </div>
        <div class="dashboard-product-field">
          <label>PDP scroll overrides</label>
          <div class="dashboard-product-image-list dashboard-color-scroll-list" data-field="pdpScroll">${(v.pdpScroll || []).map((url) => imageRowHtml(url, "js-dashboard-color-remove-pdp-scroll")).join("") || imageRowHtml("", "js-dashboard-color-remove-pdp-scroll")}</div>
          <button type="button" class="edit-btn js-dashboard-color-add-pdp-scroll" data-color-index="${index}">+ Add PDP scroll</button>
        </div>
        <div class="dashboard-product-field">
          <label>Closer look main override</label>
          <div class="dashboard-product-image-row dashboard-product-image-row--single">
            <input type="url" class="dashboard-color-input" data-field="closerLookMain" value="${escapeHtml(v.closerLookMain || "")}" placeholder="Leave empty to use default" />
            ${imageUploadBtnHtml()}
          </div>
        </div>
        <div class="dashboard-product-field">
          <label>Closer look extra overrides</label>
          <div class="dashboard-product-image-list dashboard-color-scroll-list" data-field="closerLookExtra">${(v.closerLookExtra || []).map((url) => imageRowHtml(url, "js-dashboard-color-remove-closer")).join("") || imageRowHtml("", "js-dashboard-color-remove-closer")}</div>
          <button type="button" class="edit-btn js-dashboard-color-add-closer" data-color-index="${index}">+ Add closer look image</button>
        </div>
      </div>`
    : "";

  return `<div class="dashboard-color-variant" data-color-index="${index}">
    <div class="dashboard-color-variant__head">
      <div class="dashboard-product-field">
        <label>Color hex</label>
        <input type="text" class="dashboard-color-input" data-field="hex" value="${escapeHtml(v.hex || "#111111")}" placeholder="#111111" />
      </div>
      <div class="dashboard-product-field">
        <label>Label</label>
        <input type="text" class="dashboard-color-input" data-field="label" value="${escapeHtml(v.label || "")}" placeholder="Black" />
      </div>
      <button type="button" class="edit-btn js-dashboard-color-remove" aria-label="Remove color">Remove</button>
    </div>
    ${imageFields}
  </div>`;
}

function renderColorVariants(page, variants = [], showImages = false) {
  const container = page.querySelector("#dashboard-product-color-variants");
  if (!container) return;
  const list = variants.length ? variants : [emptyColorVariant()];
  container.innerHTML = list
    .map((variant, index) => colorVariantRowHtml(variant, index, showImages))
    .join("");
}

function readColorVariants(page) {
  const hasColorImages = page.querySelector("#dashboard-product-has-color-images")?.checked;
  return [...page.querySelectorAll(".dashboard-color-variant")].map((row) => {
    const readField = (field) =>
      row.querySelector(`.dashboard-color-input[data-field="${field}"]`)?.value.trim() || "";
    const readScroll = (field, removeClass) =>
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

    if (hasColorImages) {
      variant.cardCover = readField("cardCover");
      variant.cardScroll = readScroll("cardScroll", "js-dashboard-color-remove-scroll");
      variant.pdpCover = readField("pdpCover");
      variant.pdpScroll = readScroll("pdpScroll", "js-dashboard-color-remove-pdp-scroll");
      variant.closerLookMain = readField("closerLookMain");
      variant.closerLookExtra = readScroll("closerLookExtra", "js-dashboard-color-remove-closer");
    }

    return variant;
  });
}

function updateCardCoverPreview(page) {
  const url = page.querySelector("#dashboard-product-card-cover")?.value.trim();
  const preview = page.querySelector("#dashboard-product-card-cover-preview");
  if (!preview) return;
  preview.innerHTML = url ? `<img src="${escapeHtml(url)}" alt="" loading="lazy" />` : "";
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
  page.querySelector("#dashboard-product-has-color-images").checked = Boolean(product.hasColorImages);
  page.querySelector("#dashboard-product-pack-label").value = product.packLabel || "";
  page.querySelector("#dashboard-product-pack-wrap").hidden = !product.isPack;
  page.querySelector("#dashboard-product-description").value = product.description || "";
  page.querySelector("#dashboard-product-materials").value = product.materials || "";
  page.querySelector("#dashboard-product-size").value = product.size || "";
  page.querySelector("#dashboard-product-filters").value = (product.filters || []).join(", ");

  page.querySelector("#dashboard-product-card-cover").value = product.cardCover || product.coverImage || "";
  page.querySelector("#dashboard-product-pdp-cover").value = product.pdpCover || product.cardCover || "";
  page.querySelector("#dashboard-product-closer-title").value =
    product.closerLookMain?.title || "A Closer Look";
  page.querySelector("#dashboard-product-closer-text").value = product.closerLookMain?.text || "";
  page.querySelector("#dashboard-product-closer-main-image").value =
    product.closerLookMain?.image || "";

  page.querySelectorAll(".dashboard-product-section-check").forEach((input) => {
    input.checked = (product.sections || []).includes(input.value);
  });

  renderImageList(
    page.querySelector("#dashboard-product-card-scroll"),
    product.cardScroll || [],
    "js-dashboard-product-remove-card-scroll"
  );
  renderImageList(
    page.querySelector("#dashboard-product-pdp-scroll"),
    product.pdpScroll || [],
    "js-dashboard-product-remove-pdp-scroll"
  );
  renderImageList(
    page.querySelector("#dashboard-product-closer-images"),
    product.closerLookExtra || product.closerLookImages || [],
    "js-dashboard-product-remove-closer-image"
  );

  renderColorVariants(
    page,
    product.colorVariants?.length ? product.colorVariants : product.colors?.map((hex) => ({ hex })),
    Boolean(product.hasColorImages)
  );
  updateCardCoverPreview(page);

  const deleteBtn = page.querySelector(".js-dashboard-product-delete");
  if (deleteBtn) deleteBtn.hidden = !isEdit;
}

function collectProductFromEditor(page) {
  const existingId = page.querySelector("#dashboard-product-edit-id")?.value.trim();
  const slug = page.querySelector("#dashboard-product-id")?.value.trim().toLowerCase();
  const id = existingId && getCatalogProductById(existingId) ? existingId : slug;
  const priceAmountDzd = parseDzdInput(page.querySelector("#dashboard-product-price")?.value);
  const colorVariants = readColorVariants(page);
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
    hasColorImages: page.querySelector("#dashboard-product-has-color-images")?.checked,
    packLabel: page.querySelector("#dashboard-product-pack-label")?.value.trim(),
    description: page.querySelector("#dashboard-product-description")?.value.trim(),
    materials: page.querySelector("#dashboard-product-materials")?.value.trim(),
    size: page.querySelector("#dashboard-product-size")?.value.trim(),
    colors: colorVariants.map((v) => v.hex),
    colorVariants,
    filters: (page.querySelector("#dashboard-product-filters")?.value || "")
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean),
    sections: sections.length ? sections : ["all-selection"],
    cardCover: page.querySelector("#dashboard-product-card-cover")?.value.trim(),
    cardScroll: readImageList(page.querySelector("#dashboard-product-card-scroll")),
    pdpCover: page.querySelector("#dashboard-product-pdp-cover")?.value.trim(),
    pdpScroll: readImageList(page.querySelector("#dashboard-product-pdp-scroll")),
    closerLookExtra: readImageList(page.querySelector("#dashboard-product-closer-images")),
    closerLookMain: {
      image: page.querySelector("#dashboard-product-closer-main-image")?.value.trim(),
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

  page.querySelector("#dashboard-product-card-cover")?.addEventListener("input", () => {
    updateCardCoverPreview(page);
  });

  page.querySelector(".js-dashboard-product-add-card-scroll")?.addEventListener("click", () => {
    page
      .querySelector("#dashboard-product-card-scroll")
      ?.insertAdjacentHTML("beforeend", imageRowHtml("", "js-dashboard-product-remove-card-scroll"));
  });

  page.querySelector(".js-dashboard-product-add-pdp-scroll")?.addEventListener("click", () => {
    page
      .querySelector("#dashboard-product-pdp-scroll")
      ?.insertAdjacentHTML("beforeend", imageRowHtml("", "js-dashboard-product-remove-pdp-scroll"));
  });

  page.querySelector(".js-dashboard-product-add-closer-image")?.addEventListener("click", () => {
    page
      .querySelector("#dashboard-product-closer-images")
      ?.insertAdjacentHTML("beforeend", imageRowHtml("", "js-dashboard-product-remove-closer-image"));
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
      target.closest(".dashboard-color-variant")?.remove();
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
    if (!data.id || !/^[a-z0-9-]+$/.test(data.id)) {
      window.alert("Product ID must use lowercase letters, numbers, and hyphens.");
      return;
    }
    if (!data.name || !data.priceAmountDzd) {
      window.alert("Name and price (DZD) are required.");
      return;
    }
    if (!data.cardCover && !data.cardScroll.length && !data.pdpCover) {
      window.alert("Add at least a card cover or PDP cover image.");
      return;
    }

    const saveBtn = page.querySelector(".js-dashboard-product-save");
    const saveLabel = saveBtn?.textContent || "Save";
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
      window.alert(error?.message || "Could not save product.");
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
      window.alert(error?.message || "Could not save product.");
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

  page.querySelector('[data-screen="order"]')?.addEventListener("click", () => {
    requestAnimationFrame(() => renderDashboardProducts(page));
  });
}
