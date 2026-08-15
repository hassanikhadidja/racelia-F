import { RACELIA_STORES, storeTypeLabel } from "./boutiquesData.js";

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

const PIN_SVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const PHONE_SVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>';
const CLOCK_SVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const LINK_SVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/></svg>';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ensureLeaflet() {
  if (window.L) return Promise.resolve(window.L);

  if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
  }

  if (window.__raceliaLeafletPromise) return window.__raceliaLeafletPromise;

  window.__raceliaLeafletPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      existing.addEventListener("error", reject);
      if (window.L) resolve(window.L);
      return;
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return window.__raceliaLeafletPromise;
}

function mapsUrl(store) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${store.lat},${store.lng}`
  )}`;
}

function renderStoreCard(store) {
  const note = store.note
    ? `<p class="boutiques-note">${escapeHtml(store.note)}</p>`
    : "";
  return `<article class="boutiques-store-card" data-store-id="${escapeHtml(store.id)}">
    <h2>${escapeHtml(store.name)}</h2>
    <div class="boutiques-meta">${PIN_SVG}<span>${escapeHtml(store.address)} · ${escapeHtml(store.city)} ${escapeHtml(store.postal)}</span></div>
    <div class="boutiques-meta">${PHONE_SVG}<a href="tel:${escapeHtml(store.phone.replace(/\s/g, ""))}">${escapeHtml(store.phone)}</a></div>
    <div class="boutiques-meta">${CLOCK_SVG}<span>${escapeHtml(store.hours)} · ${escapeHtml(storeTypeLabel(store.type))}</span></div>
    <div class="boutiques-meta">${LINK_SVG}<a class="website-link" href="${escapeHtml(store.website)}" target="_blank" rel="noopener noreferrer">racelia.com</a></div>
    ${note}
    <a class="boutiques-btn-map" href="${mapsUrl(store)}" target="_blank" rel="noopener noreferrer">Voir sur la carte</a>
  </article>`;
}

function filterStores(query, type) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  return RACELIA_STORES.filter((store) => {
    if (type && store.type !== type) return false;
    if (!q) return true;
    const hay = `${store.name} ${store.city} ${store.postal} ${store.address}`.toLowerCase();
    return hay.includes(q);
  });
}

export function initBoutiquesPage(root) {
  const page = root.querySelector("#boutiquesPage");
  if (!page) return;

  const listEl = page.querySelector("#boutiquesStoreList");
  const zipInput = page.querySelector("#boutiquesZipInput");
  const typeSelect = page.querySelector("#boutiquesTypeSelect");
  const searchBtn = page.querySelector("#boutiquesSearchBtn");
  const mapEl = page.querySelector("#boutiquesMap");

  const state = page.__boutiquesState || {
    map: null,
    markersLayer: null,
    markerById: new Map(),
  };
  page.__boutiquesState = state;

  const runSearch = () => {
    const stores = filterStores(zipInput?.value, typeSelect?.value);
    renderList(stores);
    updateMarkers(stores);
  };

  const renderList = (stores) => {
    if (!listEl) return;
    if (!stores.length) {
      listEl.innerHTML = `<p class="boutiques-empty">Aucune boutique ne correspond à votre recherche.</p>`;
      return;
    }
    listEl.innerHTML = stores.map(renderStoreCard).join("");
  };

  const focusStore = (storeId) => {
    const store = RACELIA_STORES.find((s) => s.id === storeId);
    if (!store || !state.map) return;
    state.map.setView([store.lat, store.lng], 14, { animate: true });
    const marker = state.markerById.get(storeId);
    marker?.openPopup();
    listEl?.querySelectorAll(".boutiques-store-card").forEach((card) => {
      card.classList.toggle("is-active", card.dataset.storeId === storeId);
    });
  };

  const updateMarkers = (stores) => {
    if (!state.map || !window.L) return;
    if (state.markersLayer) {
      state.markersLayer.clearLayers();
    } else {
      state.markersLayer = window.L.layerGroup().addTo(state.map);
    }
    state.markerById = new Map();

    const pinIcon = window.L.divIcon({
      className: "racelia-store-pin",
      html: `<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true"><path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.3 21.7 0 14 0z" fill="#111"/><circle cx="14" cy="14" r="5" fill="#fff"/></svg>`,
      iconSize: [28, 36],
      iconAnchor: [14, 36],
      popupAnchor: [0, -32],
    });

    stores.forEach((store) => {
      const marker = window.L.marker([store.lat, store.lng], { icon: pinIcon })
        .bindPopup(`<strong>${escapeHtml(store.name)}</strong><br/>${escapeHtml(store.city)}`)
        .addTo(state.markersLayer);
      marker.on("click", () => focusStore(store.id));
      state.markerById.set(store.id, marker);
    });

    if (stores.length) {
      const bounds = window.L.latLngBounds(stores.map((s) => [s.lat, s.lng]));
      state.map.fitBounds(bounds.pad(0.2));
    }
  };

  const initMap = async () => {
    if (!mapEl) return;
    if (state.map) {
      state.map.invalidateSize();
      return;
    }
    try {
      const L = await ensureLeaflet();
      state.map = L.map(mapEl, { scrollWheelZoom: false }).setView([36.7, 3.0], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap",
      }).addTo(state.map);
      requestAnimationFrame(() => state.map.invalidateSize());
    } catch {
      if (listEl) {
        listEl.innerHTML = `<p class="boutiques-empty">Carte indisponible. Voici la liste des boutiques.</p>${RACELIA_STORES.map(renderStoreCard).join("")}`;
      }
    }
  };

  if (page.dataset.bound !== "true") {
    page.dataset.bound = "true";

    searchBtn?.addEventListener("click", runSearch);
    zipInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        runSearch();
      }
    });
    typeSelect?.addEventListener("change", runSearch);

    listEl?.addEventListener("click", (event) => {
      const card = event.target.closest(".boutiques-store-card");
      if (!card || event.target.closest("a")) return;
      focusStore(card.dataset.storeId);
    });
  }

  renderList(filterStores(zipInput?.value, typeSelect?.value));
  initMap().then(() => {
    runSearch();
    state.map?.invalidateSize?.();
  });
}
