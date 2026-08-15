import {
  buildGiftPointsLedger,
  getClientGiftPointsTotal,
  loadClientOrders,
  loadClientProfile,
} from "./clientProfileData.js";

export const GIFT_POINTS_PROMO_THRESHOLD = 2000;
const EXTRA_LEDGER_KEY = "raceliaGiftPointsLedger";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadExtraLedger() {
  try {
    const saved = localStorage.getItem(EXTRA_LEDGER_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return [];
}

export function getGiftPointsLedger() {
  const orders = loadClientOrders();
  return buildGiftPointsLedger(orders, loadExtraLedger());
}

export function getTotalGiftPoints() {
  return getClientGiftPointsTotal(loadClientProfile());
}

export function addGiftPointsEntry(entry) {
  if (!entry?.points) return;
  try {
    const list = loadExtraLedger();
    list.push(entry);
    localStorage.setItem(EXTRA_LEDGER_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

function renderLedgerRows() {
  return getGiftPointsLedger()
    .filter((row) => row.points > 0)
    .map(
      (row) => `<li class="profile-points__row profile-points__row--${escapeHtml(row.source)}">
        <div class="profile-points__row-main">
          <span class="profile-points__source">${row.source === "review" ? "Avis" : "Commande"}</span>
          <span class="profile-points__label">${escapeHtml(row.label)}</span>
          <span class="profile-points__date">${escapeHtml(row.date)}</span>
        </div>
        <span class="profile-points__pts">+${row.points} pts</span>
      </li>`
    )
    .join("");
}

export function renderGiftPointsSummary(total = getTotalGiftPoints()) {
  const threshold = GIFT_POINTS_PROMO_THRESHOLD;
  const remaining = Math.max(0, threshold - total);
  const unlocked = total >= threshold;
  const pct = Math.min(100, Math.round((total / threshold) * 100));

  const promoBlock = unlocked
    ? `<div class="profile-points__promo-earned">
        <p class="profile-points__promo-title">Code promo débloqué</p>
        <p class="profile-points__promo-copy">Vous avez atteint ${threshold.toLocaleString("fr-FR")} points. Utilisez ce code sur votre prochaine commande :</p>
        <div class="profile-points__promo-code">RACELIA10</div>
      </div>`
    : `<div class="profile-points__promo-progress">
        <p class="profile-points__promo-copy">${remaining.toLocaleString("fr-FR")} pts avant votre prochain code promo</p>
        <div class="profile-points__bar" role="progressbar" aria-valuenow="${total}" aria-valuemin="0" aria-valuemax="${threshold}">
          <span class="profile-points__bar-fill" style="width:${pct}%"></span>
        </div>
        <p class="profile-points__promo-hint">Gagnez des points grâce aux commandes et aux avis après réception. À ${threshold.toLocaleString("fr-FR")} pts, vous recevez un code promo personnel.</p>
      </div>`;

  const ledger = getGiftPointsLedger();
  const orderPts = ledger.filter((r) => r.source === "order").reduce((s, r) => s + r.points, 0);
  const reviewPts = ledger.filter((r) => r.source === "review").reduce((s, r) => s + r.points, 0);

  return `<div class="profile-points__hero">
      <p class="profile-points__total-label">Votre solde</p>
      <p class="profile-points__total">${total.toLocaleString("fr-FR")} <span>pts</span></p>
      <div class="profile-points__split">
        <span><strong>${orderPts.toLocaleString("fr-FR")}</strong> issus des commandes</span>
        <span><strong>${reviewPts.toLocaleString("fr-FR")}</strong> issus des avis</span>
      </div>
    </div>
    ${promoBlock}
    <h4 class="profile-points__history-title">Historique des points</h4>
    <ul class="profile-points__list">${renderLedgerRows() || `<li class="profile-points__empty">Aucun point pour le moment.</li>`}</ul>`;
}

export function getDeliveredProductsForReview() {
  const delivered = loadClientOrders()
    .filter((o) => o.status === "delivered")
    .map((o) => o.product);
  if (delivered.length) return [...new Set(delivered)];
  return [...new Set(loadClientOrders().map((o) => o.product).filter(Boolean))];
}

export function getProfileGiftPointsOverlayMarkup() {
  const total = getTotalGiftPoints();
  return `<div class="profile-points-overlay" id="profile-points-overlay" aria-hidden="true">
  <div class="profile-points-sheet profile-sheet" role="dialog" aria-labelledby="profile-points-title">
    <div class="profile-sheet-header">
      <h3 id="profile-points-title">Points cadeau</h3>
      <button type="button" class="profile-sheet-close" data-close="profile-points-overlay">Fermer</button>
    </div>
    <div class="profile-points-body" id="profile-points-body">
      ${renderGiftPointsSummary(total)}
    </div>
  </div>
</div>`;
}

export function refreshGiftPointsSummary(page) {
  const body = page?.querySelector("#profile-points-body");
  const summary = page?.querySelector("#profile-gift-points-summary");
  const total = getTotalGiftPoints();
  if (body) body.innerHTML = renderGiftPointsSummary(total);
  if (summary) summary.textContent = `${total.toLocaleString("fr-FR")} pts`;
}
