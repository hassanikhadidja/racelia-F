import { loadClientOrders } from "./clientProfileData.js";
import { formatPrice } from "./currency.js";

export const PURCHASED_EGIFTS_KEY = "raceliaPurchasedEgifts";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isEgiftLine(item = {}) {
  const slug = String(item.productSlug || item.productId || item.id || "").toLowerCase();
  const name = String(item.name || "").toLowerCase();
  return (
    item.isGiftCard === true ||
    slug.includes("egift-card") ||
    name.includes("carte cadeau électronique")
  );
}

function isPaidOrder(order = {}) {
  const status = String(order.status || "").toLowerCase();
  const mode = String(order.paymentMode || "").toLowerCase();
  return status === "received" || status === "delivered" || mode === "online";
}

function loadStoredEgifts() {
  try {
    const saved = localStorage.getItem(PURCHASED_EGIFTS_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredEgifts(list) {
  try {
    localStorage.setItem(PURCHASED_EGIFTS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function recordPurchasedEgifts(items = [], meta = {}) {
  const next = loadStoredEgifts();
  items.filter(isEgiftLine).forEach((item) => {
    const recipient = String(item.giftRecipient || item.color || "")
      .replace(/^(Couleur|Pour)\s*:\s*/gi, "")
      .trim();
    const entry = {
      id: `${meta.orderId || "local"}-${item.id || item.productSlug || Date.now()}`,
      orderId: meta.orderId || "",
      date: meta.date || new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      recipient,
      sender: item.giftSender || "",
      email: item.giftEmail || "",
      amountEur: Number(item.unitPrice || item.price || 0),
      paid: Boolean(meta.paid),
      paymentMode: meta.paymentMode || "",
    };
    if (!next.some((row) => row.id === entry.id)) next.unshift(entry);
  });
  saveStoredEgifts(next);
  return next;
}

function egiftsFromOrders(orders = loadClientOrders()) {
  return orders.flatMap((order) => {
    const lines = Array.isArray(order.items) ? order.items : [];
    return lines.filter(isEgiftLine).map((item, index) => {
      const recipient = String(item.giftRecipient || item.color || "")
        .replace(/^(Couleur|Pour)\s*:\s*/gi, "")
        .trim();
      return {
        id: `${order.id || "order"}-${item.productSlug || item.name || index}`,
        orderId: order.id || "",
        date: order.date || "",
        recipient,
        sender: item.giftSender || "",
        email: item.giftEmail || "",
        amountEur: Number(item.price || item.unitPrice || 0),
        paid: isPaidOrder(order),
        paymentMode: order.paymentMode || "",
      };
    });
  });
}

function giftKey(row) {
  return `${row.orderId || ""}|${String(row.recipient || "").toLowerCase()}|${Number(row.amountEur) || 0}`;
}

export function getPurchasedEgifts() {
  const merged = [];
  const seen = new Map();
  [...egiftsFromOrders(), ...loadStoredEgifts()].forEach((row) => {
    const key = giftKey(row);
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, row);
      merged.push(row);
      return;
    }
    if (row.paid && !existing.paid) {
      existing.paid = true;
      existing.paymentMode = row.paymentMode || existing.paymentMode;
    }
  });
  return merged;
}

export function renderPurchasedEgiftsList(gifts = getPurchasedEgifts()) {
  if (!gifts.length) {
    return `<p class="profile-orders-empty">Vous n'avez pas encore acheté de carte cadeau électronique RACÈLIA.</p>`;
  }

  return gifts
    .map((gift) => {
      const status = gift.paid ? "Payée" : "Commandée";
      const statusClass = gift.paid ? "delivered" : "processing";
      const pour = gift.recipient ? `Pour : ${gift.recipient}` : "Carte cadeau électronique";
      return `<article class="profile-order">
        <div class="profile-order__head">
          <div>
            <p class="profile-order__id">${escapeHtml(gift.orderId || "Carte cadeau")}</p>
            <p class="profile-order__date">${escapeHtml(gift.date || "")}</p>
          </div>
          <span class="profile-order__status profile-order__status--${statusClass}">${status}</span>
        </div>
        <p class="profile-order__product">${escapeHtml(pour)}</p>
        <p class="profile-order__total">${escapeHtml(formatPrice(gift.amountEur))}</p>
      </article>`;
    })
    .join("");
}

export function refreshPurchasedEgiftsList(page) {
  const list = page?.querySelector("#profile-egifts-list");
  if (list) list.innerHTML = renderPurchasedEgiftsList();
}

export function getProfileEgiftsOverlayMarkup() {
  return `<div class="profile-orders-overlay" id="profile-egifts-overlay" aria-hidden="true">
  <div class="profile-orders-sheet profile-sheet" role="dialog" aria-labelledby="profile-egifts-title">
    <div class="profile-sheet-header">
      <h3 id="profile-egifts-title">Mes cartes cadeaux</h3>
      <button type="button" class="profile-sheet-close" data-close="profile-egifts-overlay">Fermer</button>
    </div>
    <div class="profile-orders-list" id="profile-egifts-list">
      ${renderPurchasedEgiftsList()}
    </div>
  </div>
</div>`;
}
