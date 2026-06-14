import { openProfileSheet, closeProfileSheet } from "./clientProfileSheets.js";
import {
  loadStyleLooks,
  saveStyleLooks,
  getProductDefaultImage,
  getProductLabel,
} from "./dashboardRaceliaStyleData.js";
import {
  getDashboardStyleOverlaysMarkup,
} from "./dashboardRaceliaStyleMarkup.js";
import { syncStyleLookUpsert, syncStyleLookDelete } from "./syncBackend.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function notifyStyleLooksUpdated(root) {
  root.dispatchEvent(new CustomEvent("racelia:style-looks-updated", { bubbles: true }));
}

function renderCreatorCard(look) {
  const count = look.products?.length || 0;
  return `<article class="racelia-card dashboard-style-creator-card" data-look-id="${escapeHtml(look.id)}">
    <div class="racelia-card-img dashboard-style-creator-img">
      <img src="${escapeHtml(look.image)}" alt="${escapeHtml(look.title)}" loading="lazy" />
      ${look.tag ? `<span class="racelia-card-tag">${escapeHtml(look.tag)}</span>` : ""}
    </div>
    <div class="racelia-card-body">
      <div class="racelia-card-title">${escapeHtml(look.title)}</div>
      <div class="racelia-card-meta">${count} product look${count === 1 ? "" : "s"}</div>
    </div>
    <button type="button" class="dashboard-style-delete js-dashboard-style-delete-creator" data-look-id="${escapeHtml(look.id)}">Delete</button>
  </article>`;
}

function renderProductRow(look, product) {
  return `<article class="dashboard-style-product-row" data-product-row-id="${escapeHtml(product.id)}">
    <img class="dashboard-style-product-thumb" src="${escapeHtml(product.image)}" alt="" loading="lazy" />
    <div class="dashboard-style-product-copy">
      <p class="dashboard-style-product-parent">${escapeHtml(look.title)}</p>
      <p class="dashboard-style-product-name">${escapeHtml(getProductLabel(product.productId))}</p>
      <p class="dashboard-style-product-id">${escapeHtml(product.productId)} · Opens product page</p>
    </div>
    <button type="button" class="dashboard-style-delete js-dashboard-style-delete-product" data-look-id="${escapeHtml(look.id)}" data-product-id="${escapeHtml(product.id)}">Delete</button>
  </article>`;
}

export function renderDashboardRaceliaStyle(page, root) {
  const looks = loadStyleLooks();
  const creatorsEl = page.querySelector("#dashboard-style-creators");
  const creatorsEmpty = page.querySelector("#dashboard-style-creators-empty");
  const productsEl = page.querySelector("#dashboard-style-products");
  const productsEmpty = page.querySelector("#dashboard-style-products-empty");

  if (creatorsEl) {
    creatorsEl.innerHTML = looks.map(renderCreatorCard).join("");
    if (creatorsEmpty) creatorsEmpty.hidden = looks.length > 0;
  }

  const productRows = [];
  looks.forEach((look) => {
    (look.products || []).forEach((p) => productRows.push(renderProductRow(look, p)));
  });

  if (productsEl) {
    productsEl.innerHTML = productRows.join("");
    if (productsEmpty) productsEmpty.hidden = productRows.length > 0;
  }

  creatorsEl?.querySelectorAll(".js-dashboard-style-delete-creator").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.lookId;
      if (!id || !window.confirm("Delete this creator look and its product looks?")) return;
      saveStyleLooks(loadStyleLooks().filter((l) => l.id !== id));
      syncStyleLookDelete(id).catch(() => {});
      renderDashboardRaceliaStyle(page, root);
      notifyStyleLooksUpdated(root);
    });
  });

  productsEl?.querySelectorAll(".js-dashboard-style-delete-product").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lookId = btn.dataset.lookId;
      const productRowId = btn.dataset.productId;
      if (!lookId || !productRowId) return;
      const next = loadStyleLooks().map((look) => {
        if (look.id !== lookId) return look;
        return {
          ...look,
          products: (look.products || []).filter((p) => p.id !== productRowId),
        };
      });
      saveStyleLooks(next);
      const updated = next.find((look) => look.id === lookId);
      if (updated) syncStyleLookUpsert(updated).catch(() => {});
      renderDashboardRaceliaStyle(page, root);
      notifyStyleLooksUpdated(root);
    });
  });
}

function bindProductPicker(page, hiddenInput, options, onSelect) {
  const clear = () => {
    if (hiddenInput) hiddenInput.value = "";
    options.forEach((btn) => {
      btn.classList.remove("is-selected");
      btn.setAttribute("aria-selected", "false");
    });
  };

  const select = (productId) => {
    if (!productId) {
      clear();
      return;
    }
    if (hiddenInput) hiddenInput.value = productId;
    options.forEach((btn) => {
      const on = btn.dataset.productId === productId;
      btn.classList.toggle("is-selected", on);
      btn.setAttribute("aria-selected", String(on));
    });
    onSelect?.(productId);
  };

  options.forEach((btn) => {
    btn.addEventListener("click", () => {
      select(btn.dataset.productId || "");
      btn.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  });

  return { clear, select };
}

function renderParentPicker(page) {
  const picker = page.querySelector("#style-parent-picker");
  if (!picker) return;

  const looks = loadStyleLooks();
  if (!looks.length) {
    picker.innerHTML = `<p class="dashboard-style-hint">Add a creator look first.</p>`;
    return;
  }

  picker.innerHTML = looks
    .map(
      (look) =>
        `<button type="button" class="dashboard-style-parent-opt" role="option" data-look-id="${escapeHtml(look.id)}" aria-selected="false">${escapeHtml(look.title)}</button>`
    )
    .join("");
}

function bindStyleSheets(page, root) {
  let overlaysReady = page.querySelector("#dashboard-style-creator-overlay");
  if (!overlaysReady) {
    page.insertAdjacentHTML("beforeend", getDashboardStyleOverlaysMarkup());
    overlaysReady = true;
  }

  const creatorForm = page.querySelector("#dashboard-style-creator-form");
  const creatorImageInput = page.querySelector("#style-creator-image");
  const creatorPreview = page.querySelector("#style-creator-preview");
  const creatorPreviewImg = page.querySelector("#style-creator-preview-img");
  let creatorImageData = "";

  const productForm = page.querySelector("#dashboard-style-product-form");
  const parentInput = page.querySelector("#style-product-parent-id");
  const productInput = page.querySelector("#style-product-id");
  const productImageInput = page.querySelector("#style-product-image");
  const productPreview = page.querySelector("#style-product-preview");
  const productPreviewImg = page.querySelector("#style-product-preview-img");
  let productImageData = "";

  const productPickerEl = page.querySelector("#style-product-picker");
  const productOpts = productPickerEl
    ? [...productPickerEl.querySelectorAll(".dashboard-style-product-opt")]
    : [];
  const productPicker = bindProductPicker(page, productInput, productOpts);

  const bindParentOptions = () => {
    renderParentPicker(page);
    const parentOpts = page.querySelectorAll(".dashboard-style-parent-opt");
    parentOpts.forEach((btn) => {
      btn.addEventListener("click", () => {
        parentOpts.forEach((b) => {
          b.classList.toggle("is-selected", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });
        if (parentInput) parentInput.value = btn.dataset.lookId || "";
      });
    });
  };

  const openCreator = () => {
    openProfileSheet(page, "dashboard-style-creator-overlay");
    page.querySelector("#style-creator-title")?.focus();
  };

  const closeCreator = () => closeProfileSheet(page, "dashboard-style-creator-overlay");

  const openProduct = () => {
    bindParentOptions();
    productPicker.clear();
    productImageData = "";
    if (productPreview) productPreview.hidden = true;
    if (productPreviewImg) productPreviewImg.removeAttribute("src");
    if (parentInput) parentInput.value = "";
    openProfileSheet(page, "dashboard-style-product-overlay");
  };

  const closeProduct = () => closeProfileSheet(page, "dashboard-style-product-overlay");

  page.querySelectorAll(".js-dashboard-style-creator-open").forEach((btn) => {
    btn.addEventListener("click", openCreator);
  });
  page.querySelectorAll(".js-dashboard-style-product-open").forEach((btn) => {
    btn.addEventListener("click", openProduct);
  });

  page.querySelectorAll('[data-close="dashboard-style-creator-overlay"]').forEach((btn) => {
    btn.addEventListener("click", closeCreator);
  });
  page.querySelectorAll('[data-close="dashboard-style-product-overlay"]').forEach((btn) => {
    btn.addEventListener("click", closeProduct);
  });

  page.querySelector("#dashboard-style-creator-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "dashboard-style-creator-overlay") closeCreator();
  });
  page.querySelector("#dashboard-style-product-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "dashboard-style-product-overlay") closeProduct();
  });

  creatorImageInput?.addEventListener("change", () => {
    const file = creatorImageInput.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      creatorImageData = reader.result;
      if (creatorPreviewImg) creatorPreviewImg.src = creatorImageData;
      if (creatorPreview) creatorPreview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  productImageInput?.addEventListener("change", () => {
    const file = productImageInput.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      productImageData = reader.result;
      if (productPreviewImg) productPreviewImg.src = productImageData;
      if (productPreview) productPreview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  creatorForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = page.querySelector("#style-creator-title")?.value.trim();
    const tag = page.querySelector("#style-creator-tag")?.value.trim();
    if (!title || !creatorImageData) return;

    const looks = loadStyleLooks();
    const newLook = {
      id: `style-${Date.now()}`,
      title,
      tag: tag || "",
      image: creatorImageData,
      products: [],
      createdAt: Date.now(),
    };
    looks.unshift(newLook);
    saveStyleLooks(looks);
    syncStyleLookUpsert(newLook).catch(() => {});
    creatorForm.reset();
    creatorImageData = "";
    if (creatorPreview) creatorPreview.hidden = true;
    closeCreator();
    renderDashboardRaceliaStyle(page, root);
    notifyStyleLooksUpdated(root);
  });

  productForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const parentId = parentInput?.value;
    const productId = productInput?.value;
    if (!parentId || !productId) {
      if (!parentId) page.querySelector("#style-parent-picker")?.focus();
      else productPickerEl?.focus();
      return;
    }

    const image =
      productImageData || getProductDefaultImage(productId) || productPickerEl?.querySelector(".is-selected img")?.src;
    if (!image) {
      productImageInput?.focus();
      return;
    }

    const looks = loadStyleLooks().map((look) => {
      if (look.id !== parentId) return look;
      const products = [...(look.products || [])];
      products.push({
        id: `style-p-${Date.now()}`,
        productId,
        image,
      });
      return { ...look, products };
    });

    saveStyleLooks(looks);
    const updatedLook = looks.find((look) => look.id === parentId);
    if (updatedLook) syncStyleLookUpsert(updatedLook).catch(() => {});
    productForm.reset();
    productPicker.clear();
    productImageData = "";
    if (productPreview) productPreview.hidden = true;
    closeProduct();
    renderDashboardRaceliaStyle(page, root);
    notifyStyleLooksUpdated(root);
  });
}

export function closeDashboardRaceliaStyleOverlay(page) {
  if (page.querySelector("#dashboard-style-creator-overlay")?.classList.contains("open")) {
    closeProfileSheet(page, "dashboard-style-creator-overlay");
    return true;
  }
  if (page.querySelector("#dashboard-style-product-overlay")?.classList.contains("open")) {
    closeProfileSheet(page, "dashboard-style-product-overlay");
    return true;
  }
  return false;
}

export function initDashboardRaceliaStyle(page, root) {
  const section = page.querySelector("#raceliastyle");
  if (!section || section.dataset.styleBound === "true") return;
  section.dataset.styleBound = "true";

  bindStyleSheets(page, root);
  renderDashboardRaceliaStyle(page, root);

  page.querySelector('[data-screen="raceliastyle"]')?.addEventListener("click", () => {
    requestAnimationFrame(() => renderDashboardRaceliaStyle(page, root));
  });
}
