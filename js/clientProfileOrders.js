import { loadClientOrders } from "./clientProfileData.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getProfileOrders() {
  return loadClientOrders();
}

export function renderProfileOrdersList(orders = getProfileOrders()) {
  if (!orders.length) {
    return `<p class="profile-orders-empty">Aucune commande pour le moment. Vos achats apparaîtront ici.</p>`;
  }

  return orders
    .map((order) => {
      const promoHtml = order.promoUsed
        ? `<p class="profile-order__promo">
            <span class="profile-order__promo-label">Promo utilisée</span>
            <span class="profile-order__promo-code">${escapeHtml(order.promoUsed.code)}</span>
            <span class="profile-order__promo-detail">${escapeHtml(order.promoUsed.label)}</span>
          </p>`
        : `<p class="profile-order__promo profile-order__promo--none">Aucun code promo utilisé</p>`;

      return `<article class="profile-order" data-order-id="${escapeHtml(order.id)}">
        <div class="profile-order__head">
          <div>
            <p class="profile-order__id">${escapeHtml(order.id)}</p>
            <p class="profile-order__date">${escapeHtml(order.date)}</p>
          </div>
          <span class="profile-order__status profile-order__status--${escapeHtml(order.status)}">${escapeHtml(order.statusLabel || order.status)}</span>
        </div>
        <p class="profile-order__product">${escapeHtml(order.product)}</p>
        <p class="profile-order__total">${escapeHtml(order.total)}</p>
        ${promoHtml}
      </article>`;
    })
    .join("");
}

export function refreshProfileOrdersList(page) {
  const list = page?.querySelector("#profile-orders-list");
  if (list) list.innerHTML = renderProfileOrdersList();
}

export function getProfileOrdersOverlayMarkup() {
  return `<div class="profile-orders-overlay" id="profile-orders-overlay" aria-hidden="true">
  <div class="profile-orders-sheet profile-sheet" role="dialog" aria-labelledby="profile-orders-title">
    <div class="profile-sheet-header">
      <h3 id="profile-orders-title">Mes commandes</h3>
      <button type="button" class="profile-sheet-close" data-close="profile-orders-overlay">Fermer</button>
    </div>
    <div class="profile-orders-list" id="profile-orders-list">
      ${renderProfileOrdersList()}
    </div>
  </div>
</div>`;
}
