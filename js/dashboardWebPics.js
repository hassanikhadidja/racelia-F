import { openProfileSheet, closeProfileSheet } from "./clientProfileSheets.js";
import {
  loadWebPics,
  saveWebPics,
  getDeviceLabel,
  getSectionLabel,
  getDeviceSize,
  WEBPIC_DEVICES,
} from "./dashboardWebPicsData.js";
import {
  getDashboardWebPicsSectionMarkup,
  getDashboardAddWebPicOverlayMarkup,
} from "./dashboardWebPicsMarkup.js";
import { syncWebPicCreate, syncWebPicDelete } from "./syncBackend.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderWebPicCard(pic) {
  const linkMeta = pic.linksToProduct && pic.productId
    ? `Links to product · ${escapeHtml(pic.productId)}`
    : "No product link";

  return `<article class="webpics-item dashboard-webpic-card" data-webpic-id="${escapeHtml(pic.id)}" data-device="${escapeHtml(pic.device)}">
    <img src="${escapeHtml(pic.image)}" alt="${escapeHtml(pic.title || "Web picture")}" loading="lazy" />
    <div class="webpics-item-info">
      <span class="webpics-item-title">${escapeHtml(pic.title || "Untitled")}</span>
      <span class="webpics-item-meta">
        <span class="dashboard-webpic-badge">${escapeHtml(getDeviceLabel(pic.device))}</span>
        <span class="dashboard-webpic-badge">${escapeHtml(getSectionLabel(pic.section))}</span>
      </span>
      <span class="webpics-item-size">${escapeHtml(getDeviceSize(pic.device))}</span>
      <span class="webpics-item-link">${linkMeta}</span>
    </div>
    <button type="button" class="dashboard-webpic-delete js-dashboard-webpic-delete" data-webpic-id="${escapeHtml(pic.id)}">Delete</button>
  </article>`;
}

export function renderDashboardWebPics(page, filter = "all") {
  const grid = page.querySelector("#dashboard-webpics-grid");
  const empty = page.querySelector("#dashboard-webpics-empty");
  if (!grid) return;

  let pics = loadWebPics();
  if (filter !== "all") {
    pics = pics.filter((p) => p.device === filter);
  }

  grid.innerHTML = pics.map(renderWebPicCard).join("");

  if (empty) empty.hidden = pics.length > 0;

  grid.querySelectorAll(".js-dashboard-webpic-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.webpicId;
      if (!id || !window.confirm("Delete this picture?")) return;
      saveWebPics(loadWebPics().filter((p) => p.id !== id));
      syncWebPicDelete(id).catch(() => {});
      const activeFilter =
        page.querySelector(".dashboard-webpics-filter.active")?.dataset.webpicsFilter || "all";
      renderDashboardWebPics(page, activeFilter);
    });
  });
}

function bindWebPicFilters(page) {
  page.querySelectorAll(".dashboard-webpics-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      page.querySelectorAll(".dashboard-webpics-filter").forEach((b) => {
        b.classList.toggle("active", b === btn);
      });
      renderDashboardWebPics(page, btn.dataset.webpicsFilter || "all");
    });
  });
}

function bindAddWebPicSheet(page) {
  let overlay = page.querySelector("#dashboard-add-webpic-overlay");
  if (!overlay) {
    page.insertAdjacentHTML("beforeend", getDashboardAddWebPicOverlayMarkup());
    overlay = page.querySelector("#dashboard-add-webpic-overlay");
  }

  const form = page.querySelector("#dashboard-add-webpic-form");
  const imageInput = page.querySelector("#webpic-image");
  const preview = page.querySelector("#webpic-image-preview");
  const previewImg = page.querySelector("#webpic-image-preview-img");
  const linksCheck = page.querySelector("#webpic-links-product");
  const productWrap = page.querySelector("#webpic-product-wrap");
  const productInput = page.querySelector("#webpic-product-id");
  const productPicker = page.querySelector("#webpic-product-picker");
  const productOptions = productPicker
    ? [...productPicker.querySelectorAll(".dashboard-webpic-product-opt")]
    : [];

  let imageDataUrl = "";

  const clearProductSelection = () => {
    if (productInput) {
      productInput.value = "";
      productInput.disabled = true;
    }
    productOptions.forEach((btn) => {
      btn.classList.remove("is-selected");
      btn.setAttribute("aria-selected", "false");
    });
  };

  const setProductSelection = (productId) => {
    if (!productId) {
      clearProductSelection();
      return;
    }
    if (productInput) {
      productInput.value = productId;
      productInput.disabled = false;
    }
    productOptions.forEach((btn) => {
      const on = btn.dataset.productId === productId;
      btn.classList.toggle("is-selected", on);
      btn.setAttribute("aria-selected", String(on));
    });
  };

  productOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      setProductSelection(btn.dataset.productId || "");
      btn.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  });

  const open = () => {
    openProfileSheet(page, "dashboard-add-webpic-overlay");
    page.querySelector("#webpic-title")?.focus();
  };

  const close = () => closeProfileSheet(page, "dashboard-add-webpic-overlay");

  page.querySelectorAll(".js-dashboard-webpic-add-open").forEach((btn) => {
    btn.addEventListener("click", open);
  });

  overlay?.querySelectorAll('[data-close="dashboard-add-webpic-overlay"]').forEach((btn) => {
    btn.addEventListener("click", close);
  });

  overlay?.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  overlay?.querySelector(".profile-sheet")?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  linksCheck?.addEventListener("change", () => {
    const on = linksCheck.checked;
    if (productWrap) productWrap.hidden = !on;
    if (!on) {
      clearProductSelection();
    } else if (productInput) {
      productInput.disabled = false;
      requestAnimationFrame(() => {
        productWrap?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    }
  });

  imageInput?.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      imageDataUrl = reader.result;
      if (previewImg) previewImg.src = imageDataUrl;
      if (preview) preview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const device = form.querySelector('input[name="webpic-device"]:checked')?.value;
    const section = page.querySelector("#webpic-section")?.value;
    const title = page.querySelector("#webpic-title")?.value.trim();
    const linksToProduct = linksCheck?.checked === true;
    const productId = linksToProduct ? productInput?.value || null : null;

    if (!device || !section || !imageDataUrl) {
      imageInput?.focus();
      return;
    }
    if (linksToProduct && !productId) {
      productPicker?.focus();
      productPicker?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      return;
    }

    const pic = {
      id: `webpic-${Date.now()}`,
      title: title || `${getDeviceLabel(device)} · ${getSectionLabel(section)}`,
      image: imageDataUrl,
      device,
      section,
      linksToProduct,
      productId,
      createdAt: Date.now(),
    };

    const pics = loadWebPics();
    pics.unshift(pic);
    saveWebPics(pics);
    syncWebPicCreate(pic).catch(() => {});

    form.reset();
    imageDataUrl = "";
    if (preview) preview.hidden = true;
    if (previewImg) previewImg.removeAttribute("src");
    if (productWrap) productWrap.hidden = true;
    clearProductSelection();
    const mobileRadio = form.querySelector('input[name="webpic-device"][value="mobile"]');
    if (mobileRadio) mobileRadio.checked = true;

    close();
    const activeFilter =
      page.querySelector(".dashboard-webpics-filter.active")?.dataset.webpicsFilter || "all";
    renderDashboardWebPics(page, activeFilter);
  });

  return { close };
}

export function closeDashboardWebPicsOverlay(page) {
  const overlay = page.querySelector("#dashboard-add-webpic-overlay");
  if (overlay?.classList.contains("open")) {
    closeProfileSheet(page, "dashboard-add-webpic-overlay");
    return true;
  }
  return false;
}

export function initDashboardWebPics(page) {
  const section = page.querySelector("#webpics");
  if (!section || section.dataset.webpicsBound === "true") return;
  section.dataset.webpicsBound = "true";

  renderDashboardWebPics(page);
  bindWebPicFilters(page);
  bindAddWebPicSheet(page);

  page.querySelector('[data-screen="webpics"]')?.addEventListener("click", () => {
    requestAnimationFrame(() => {
      const filter =
        page.querySelector(".dashboard-webpics-filter.active")?.dataset.webpicsFilter || "all";
      renderDashboardWebPics(page, filter);
    });
  });
}
