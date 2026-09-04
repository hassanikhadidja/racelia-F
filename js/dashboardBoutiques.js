import {
  loadStores,
  getStoreById,
  upsertStore,
  deleteStore,
  createEmptyStore,
  storeTypeLabel,
  isOnlineStoreType,
  ONLINE_STORE_TYPE,
} from "./boutiquesData.js";
import {
  getDashboardBoutiquesOverlaysMarkup,
} from "./dashboardBoutiquesMarkup.js";
import { setFormStatus } from "./formStatus.js";
import { isAdminUser } from "./api.js";
import { syncBoutiqueUpsert, syncBoutiqueDelete } from "./syncBackend.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(name) {
  const slug = String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `store-${Date.now()}`;
}

function uniqueStoreId(name, existingId = "") {
  if (existingId) return existingId;
  const base = slugify(name);
  const used = new Set(loadStores().map((store) => store.id));
  if (!used.has(base)) return base;
  let i = 2;
  while (used.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

function renderBoutiqueCard(store) {
  const kind = storeTypeLabel(store.type);
  const location = store.location || (store.isOnlineStore ? "Vente en ligne" : "No location");
  return `<article class="dashboard-boutique-card" data-store-id="${escapeHtml(store.id)}">
    <div class="dashboard-boutique-card__body">
      <div class="dashboard-boutique-card__top">
        <h4 class="dashboard-boutique-card__title">${escapeHtml(store.name)}</h4>
        <span class="dashboard-boutique-card__badge${store.isOnlineStore ? " dashboard-boutique-card__badge--online" : ""}">${escapeHtml(kind)}</span>
      </div>
      <p class="dashboard-boutique-card__meta">${escapeHtml(location)}</p>
      ${store.phone ? `<p class="dashboard-boutique-card__meta">${escapeHtml(store.phone)}</p>` : ""}
      <div class="dashboard-product-card__actions">
        <button type="button" class="edit-btn js-dashboard-boutique-edit" data-store-id="${escapeHtml(store.id)}">Edit</button>
        <button type="button" class="edit-btn dashboard-product-card__delete js-dashboard-boutique-delete-card" data-store-id="${escapeHtml(store.id)}">Delete</button>
      </div>
    </div>
  </article>`;
}

export function renderDashboardBoutiques(page) {
  const list = page.querySelector("#dashboard-boutique-list");
  const empty = page.querySelector("#dashboard-boutique-empty");
  if (!list) return;

  const stores = loadStores();
  list.innerHTML = stores.map(renderBoutiqueCard).join("");
  if (empty) empty.hidden = stores.length > 0;

  list.querySelectorAll(".js-dashboard-boutique-edit").forEach((btn) => {
    btn.addEventListener("click", () => openBoutiqueEditor(page, btn.dataset.storeId));
  });
  list.querySelectorAll(".js-dashboard-boutique-delete-card").forEach((btn) => {
    btn.addEventListener("click", () => removeBoutique(page, btn.dataset.storeId));
  });
}

function syncOnlineStoreFields(page) {
  const type = page.querySelector("#dashboard-boutique-type")?.value;
  const online = isOnlineStoreType(type);
  const mapWrap = page.querySelector("#dashboard-boutique-map-wrap");
  const mapInput = page.querySelector("#dashboard-boutique-map");
  if (mapWrap) mapWrap.hidden = online;
  if (mapInput) mapInput.disabled = online;
}

function fillBoutiqueEditor(page, store) {
  const isEdit = Boolean(store?.id && getStoreById(store.id));
  page.querySelector("#dashboard-boutique-editor-title").textContent = isEdit
    ? "Edit boutique"
    : "Add boutique";
  page.querySelector("#dashboard-boutique-edit-id").value = store.id || "";
  page.querySelector("#dashboard-boutique-name").value = store.name || "";
  page.querySelector("#dashboard-boutique-type").value = store.isOnlineStore
    ? ONLINE_STORE_TYPE
    : store.type || "boutique";
  page.querySelector("#dashboard-boutique-location").value = store.location || "";
  page.querySelector("#dashboard-boutique-phone").value = store.phone || "";
  page.querySelector("#dashboard-boutique-hours").value = store.hours || "";
  page.querySelector("#dashboard-boutique-website").value = store.website || "";
  page.querySelector("#dashboard-boutique-note").value = store.note || "";
  page.querySelector("#dashboard-boutique-map").value = store.mapLink || "";
  const deleteBtn = page.querySelector(".js-dashboard-boutique-delete");
  if (deleteBtn) deleteBtn.hidden = !isEdit;
  setFormStatus(page.querySelector("#dashboard-boutique-form"), "");
  syncOnlineStoreFields(page);
}

function collectBoutiqueFromEditor(page) {
  const existingId = page.querySelector("#dashboard-boutique-edit-id")?.value.trim();
  const name = page.querySelector("#dashboard-boutique-name")?.value.trim();
  const type = page.querySelector("#dashboard-boutique-type")?.value || "boutique";
  const isOnlineStore = isOnlineStoreType(type);
  return {
    id: uniqueStoreId(name, existingId),
    name,
    type,
    location: page.querySelector("#dashboard-boutique-location")?.value.trim() || "",
    phone: page.querySelector("#dashboard-boutique-phone")?.value.trim() || "",
    hours: page.querySelector("#dashboard-boutique-hours")?.value.trim() || "",
    website: page.querySelector("#dashboard-boutique-website")?.value.trim() || "",
    note: page.querySelector("#dashboard-boutique-note")?.value.trim() || "",
    mapLink: isOnlineStore ? "" : page.querySelector("#dashboard-boutique-map")?.value.trim() || "",
    isOnlineStore,
  };
}

function openBoutiqueEditor(page, storeId = null) {
  const overlay = page.querySelector("#dashboard-boutique-editor-overlay");
  if (!overlay) return;
  const store = storeId ? getStoreById(storeId) : createEmptyStore();
  if (!store) return;
  fillBoutiqueEditor(page, store);
  page.classList.add("dashboard-product-editor-open");
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("dashboard-product-editor-open");
}

function closeBoutiqueEditor(page) {
  const overlay = page.querySelector("#dashboard-boutique-editor-overlay");
  overlay?.classList.remove("open");
  overlay?.setAttribute("aria-hidden", "true");
  page?.classList.remove("dashboard-product-editor-open");
  document.body.classList.remove("dashboard-product-editor-open");
}

async function removeBoutique(page, storeId) {
  if (!storeId || !window.confirm("Delete this boutique? This cannot be undone.")) return;
  const root = page.closest("#racelia-app");
  deleteStore(storeId, root);
  try {
    await syncBoutiqueDelete(storeId);
  } catch (error) {
    console.warn("Boutique deleted locally, but server sync failed:", error?.message || error);
  }
  closeBoutiqueEditor(page);
  renderDashboardBoutiques(page);
}

function bindBoutiqueEditor(page) {
  page.querySelector("#dashboard-boutique-editor-overlay")?.remove();
  page.insertAdjacentHTML("beforeend", getDashboardBoutiquesOverlaysMarkup());

  page.querySelector(".js-dashboard-boutique-add-open")?.addEventListener("click", () => {
    openBoutiqueEditor(page);
  });
  page.querySelector(".js-dashboard-boutique-editor-close")?.addEventListener("click", () => {
    closeBoutiqueEditor(page);
  });
  page.querySelector("#dashboard-boutique-editor-overlay")?.addEventListener("click", (event) => {
    if (event.target.id === "dashboard-boutique-editor-overlay") closeBoutiqueEditor(page);
  });
  page.querySelector("#dashboard-boutique-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    page.querySelector(".js-dashboard-boutique-save")?.click();
  });
  page.querySelector("#dashboard-boutique-type")?.addEventListener("change", () => {
    syncOnlineStoreFields(page);
  });
  page.querySelector(".js-dashboard-boutique-save")?.addEventListener("click", async () => {
    const form = page.querySelector("#dashboard-boutique-form");
    const data = collectBoutiqueFromEditor(page);
    if (!data.name) {
      setFormStatus(form, "Name is required.");
      return;
    }

    const saveBtn = page.querySelector(".js-dashboard-boutique-save");
    const saveLabel = saveBtn?.textContent || "Save";
    setFormStatus(form, "");
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = "Saving…";
    }

    const root = page.closest("#racelia-app");
    try {
      upsertStore(data, root);
      if (isAdminUser()) {
        const result = await syncBoutiqueUpsert(data);
        if (result?.boutique) upsertStore(result.boutique, root);
      }
      closeBoutiqueEditor(page);
      renderDashboardBoutiques(page);
    } catch (error) {
      setFormStatus(form, error?.message || "Saved on this device, but the server did not update.");
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = saveLabel;
      }
    }
  });
  page.querySelector(".js-dashboard-boutique-delete")?.addEventListener("click", () => {
    const id = page.querySelector("#dashboard-boutique-edit-id")?.value.trim();
    removeBoutique(page, id);
  });
}

export function closeDashboardBoutiquesOverlay(page) {
  const overlay = page.querySelector("#dashboard-boutique-editor-overlay");
  if (overlay?.classList.contains("open")) {
    closeBoutiqueEditor(page);
    return true;
  }
  return false;
}

export function initDashboardBoutiques(page) {
  const section = page.querySelector("#boutiques");
  if (!section || section.dataset.boutiquesBound === "true") return;
  section.dataset.boutiquesBound = "true";

  bindBoutiqueEditor(page);
  renderDashboardBoutiques(page);

  const root = page.closest("#racelia-app");
  root?.addEventListener("racelia:backend-synced", () => renderDashboardBoutiques(page));
  root?.addEventListener("racelia:boutiques-updated", () => renderDashboardBoutiques(page));

  page.querySelector('[data-screen="boutiques"]')?.addEventListener("click", () => {
    requestAnimationFrame(() => renderDashboardBoutiques(page));
  });
}
