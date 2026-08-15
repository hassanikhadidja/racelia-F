import { loadClientOrders, loadClientProfile, saveClientProfileLocal } from "./clientProfileData.js";
import { getStoredUser, setStoredUser } from "./api.js";

const STAMP_ICON =
  "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780497556/1_1_v6ic5b.png";

const REWARDS_KEY = "raceliaLoyaltyRewards";
const APPLIED_KEY = "raceliaAppliedLoyaltyPromo";
const MAX_STAMPS = 8;

export const LOYALTY_REWARDS = {
  3: {
    type: "percent10",
    percent: 0.1,
    prefix: "RC10",
    message:
      "Vous avez gagné une promotion de −10 % ! Utilisez le code promo ci-dessous sur votre prochaine commande pour profiter de votre réduction. Le code est valable pendant 3 mois à compter de sa date d’obtention. Passé ce délai, il expirera automatiquement.",
  },
  6: {
    type: "percent50",
    percent: 0.5,
    prefix: "RC50",
    message:
      "Félicitations ! Vous avez gagné une réduction de 50 % ! Utilisez le code promo ci-dessous sur votre prochaine commande pour profiter de votre avantage. Le code est valable pendant 3 mois à compter de sa date d’obtention. Passé ce délai, il expirera automatiquement.",
  },
  8: {
    type: "free_item",
    prefix: "RCFREE",
    message:
      "Félicitations ! Vous avez gagné un article gratuit ! Choisissez un article éligible lors de votre prochaine commande et utilisez le code promo ci-dessous pour en profiter. Offre valable pour un seul article. Le code est valable pendant 3 mois à compter de sa date d’obtention. Passé ce délai, il expirera automatiquement.",
  },
};

export const BIRTHDAY_STAMP = 4;
export const BIRTHDAY_MESSAGE =
  "Félicitations ! Vous avez débloqué votre avantage anniversaire ! Indiquez votre date de naissance ci-dessous et confirmez-la. Attention : cette date ne pourra plus être modifiée après confirmation. Vous recevrez votre avantage anniversaire chaque année à cette date.";
export const BIRTHDAY_CONFIRMED_MESSAGE =
  "Votre date de naissance est enregistrée. Vous recevrez votre avantage anniversaire chaque année à cette date.";

function userKey(profile = loadClientProfile()) {
  return String(profile?.email || profile?.id || profile?._id || "guest").toLowerCase();
}

function readStore() {
  try {
    const raw = localStorage.getItem(REWARDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(REWARDS_KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

function getUserRecord(profile) {
  const store = readStore();
  const key = userKey(profile);
  return store[key] || { rewards: {}, birthdayConfirmedAt: null };
}

function saveUserRecord(record, profile) {
  const store = readStore();
  store[userKey(profile)] = record;
  writeStore(store);
}

export function isReceivedOrder(order) {
  const status = String(order?.status || "").toLowerCase();
  return status === "delivered" || status === "received";
}

export function getLoyaltyProgress(orders = loadClientOrders()) {
  const received = (orders || []).filter(isReceivedOrder).length;
  if (received <= 0) return { received: 0, cycle: 0, stamps: 0 };
  return {
    received,
    cycle: Math.floor((received - 1) / MAX_STAMPS),
    stamps: ((received - 1) % MAX_STAMPS) + 1,
  };
}

export function getLoyaltyStampCount(orders = loadClientOrders()) {
  return getLoyaltyProgress(orders).stamps;
}

export function isBirthdayLocked(profile = loadClientProfile()) {
  return Boolean(profile?.birthday || getUserRecord(profile).birthdayConfirmedAt);
}

export function formatLoyaltyDate(value) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function generatePromoCode(prefix) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (let i = 0; i < 6; i += 1) {
    body += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${body}`;
}

export function ensureLoyaltyRewards(orders = loadClientOrders(), profile = loadClientProfile()) {
  const { cycle, stamps } = getLoyaltyProgress(orders);
  const record = getUserRecord(profile);
  let changed = false;

  for (const stamp of [3, 6, 8]) {
    if (stamps < stamp) continue;
    const key = `${cycle}:${stamp}`;
    if (record.rewards[key]) continue;
    const spec = LOYALTY_REWARDS[stamp];
    const createdAt = new Date();
    record.rewards[key] = {
      stamp,
      cycle,
      type: spec.type,
      percent: spec.percent || 0,
      code: generatePromoCode(spec.prefix),
      createdAt: createdAt.toISOString(),
      expiresAt: addMonths(createdAt, 3).toISOString(),
      usedAt: null,
      usedOrderId: null,
    };
    changed = true;
  }

  if (profile?.birthday && !record.birthdayConfirmedAt) {
    record.birthdayConfirmedAt = new Date().toISOString();
    changed = true;
  }

  if (changed) saveUserRecord(record, profile);
  return record;
}

export function getLoyaltyReward(stamp, profile = loadClientProfile(), orders = loadClientOrders()) {
  const { cycle } = getLoyaltyProgress(orders);
  const record = getUserRecord(profile);
  return record.rewards[`${cycle}:${stamp}`] || record.rewards[stamp] || null;
}

export function findLoyaltyRewardByCode(code, profile = loadClientProfile()) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return null;
  const record = getUserRecord(profile);
  return (
    Object.values(record.rewards || {}).find(
      (reward) => String(reward.code || "").toUpperCase() === normalized
    ) || null
  );
}

export function isRewardUsable(reward) {
  if (!reward?.code) return false;
  if (reward.usedAt) return false;
  const expires = new Date(reward.expiresAt);
  return !Number.isNaN(expires.getTime()) && expires.getTime() > Date.now();
}

export function rewardStatusLabel(reward) {
  if (!reward) return "";
  if (reward.usedAt) return "Utilisé";
  const expires = new Date(reward.expiresAt);
  if (!Number.isNaN(expires.getTime()) && expires.getTime() <= Date.now()) return "Expiré";
  return "";
}

export function getAppliedLoyaltyPromo() {
  try {
    const raw = localStorage.getItem(APPLIED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAppliedLoyaltyPromo(promo) {
  try {
    if (promo) localStorage.setItem(APPLIED_KEY, JSON.stringify(promo));
    else localStorage.removeItem(APPLIED_KEY);
  } catch {
    /* ignore */
  }
}

export function clearAppliedLoyaltyPromo() {
  setAppliedLoyaltyPromo(null);
}

export function applyLoyaltyCode(code) {
  const reward = findLoyaltyRewardByCode(code);
  if (!reward) return { ok: false, error: "Ce code promo n’est pas valide." };
  if (reward.usedAt) return { ok: false, error: "Ce code promo a déjà été utilisé." };
  if (!isRewardUsable(reward)) return { ok: false, error: "Ce code promo a expiré." };

  setAppliedLoyaltyPromo({
    code: reward.code,
    type: reward.type,
    stamp: reward.stamp,
    freeItemId: null,
  });
  return { ok: true, reward };
}

export function setFreeItemSelection(itemId) {
  const applied = getAppliedLoyaltyPromo();
  if (!applied || applied.type !== "free_item") return applied;
  const next = { ...applied, freeItemId: itemId || null };
  setAppliedLoyaltyPromo(next);
  return next;
}

export function markLoyaltyRewardUsed(code, orderId = "") {
  const profile = loadClientProfile();
  const record = getUserRecord(profile);
  const reward = Object.values(record.rewards || {}).find(
    (item) => String(item.code || "").toUpperCase() === String(code || "").toUpperCase()
  );
  if (!reward) return;
  reward.usedAt = new Date().toISOString();
  reward.usedOrderId = orderId || null;
  saveUserRecord(record, profile);
  clearAppliedLoyaltyPromo();
}

function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export function computeLoyaltyDiscount(items, promo = getAppliedLoyaltyPromo()) {
  if (!promo?.code) return 0;
  const reward = findLoyaltyRewardByCode(promo.code);
  if (!isRewardUsable(reward)) return 0;

  const subtotal = (items || []).reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);

  if (reward.type === "percent10") return roundMoney(subtotal * 0.1);
  if (reward.type === "percent50") return roundMoney(subtotal * 0.5);
  if (reward.type === "free_item") {
    const item = (items || []).find((entry) => entry.id === promo.freeItemId);
    if (!item) return 0;
    return roundMoney(item.unitPrice);
  }
  return 0;
}

export function loyaltyDiscountLabel(promo = getAppliedLoyaltyPromo()) {
  if (!promo) return "Code promo";
  if (promo.type === "percent10") return `Code promo ${promo.code} (−10 %)`;
  if (promo.type === "percent50") return `Code promo ${promo.code} (−50 %)`;
  if (promo.type === "free_item") return `Code promo ${promo.code} (article offert)`;
  return `Code promo ${promo.code}`;
}

export function stampSlotMarkup(stampCount, { birthdayLocked = false } = {}) {
  const count = Math.max(0, Math.min(MAX_STAMPS, Number(stampCount) || 0));
  return Array.from({ length: MAX_STAMPS }, (_, index) => {
    const stamped = index < count;
    const classes = ["loyalty-stamp-slot"];
    if (stamped) classes.push("is-stamped");
    if (index === 3 && birthdayLocked) classes.push("has-white-bg");
    if (index === 4 && stamped) classes.push("has-white-bg");
    const icon = stamped
      ? `<img class="loyalty-stamp-icon" src="${STAMP_ICON}" alt="" />`
      : "";
    return `<span class="${classes.join(" ")}">${icon}</span>`;
  }).join("");
}

export function refreshLoyaltyCard(page, orders = loadClientOrders(), profile = loadClientProfile()) {
  if (!page) return;
  const { stamps } = getLoyaltyProgress(orders);
  const birthdayLocked = isBirthdayLocked(profile);
  ensureLoyaltyRewards(orders, profile);

  const overlay = page.querySelector(".loyalty-stamp-overlay");
  if (overlay) overlay.innerHTML = stampSlotMarkup(stamps, { birthdayLocked });

  const rewardWrap = page.querySelector("#loyalty-reward");
  const messageEl = page.querySelector("#loyalty-promo-message");
  const codeEl = page.querySelector("#loyalty-promo-code");
  const form = page.querySelector("#loyalty-birthday-form");
  const confirmedEl = page.querySelector("#loyalty-birthday-confirmed");
  if (!rewardWrap || !messageEl) return;

  const spec = LOYALTY_REWARDS[stamps];
  const showBirthday = stamps === BIRTHDAY_STAMP && !birthdayLocked;

  if (!spec && !showBirthday) {
    rewardWrap.hidden = true;
    if (codeEl) codeEl.hidden = true;
    if (form) form.hidden = true;
    if (confirmedEl) confirmedEl.hidden = true;
    return;
  }

  rewardWrap.hidden = false;

  if (showBirthday) {
    if (codeEl) codeEl.hidden = true;
    messageEl.textContent = BIRTHDAY_MESSAGE;
    if (form) form.hidden = false;
    if (confirmedEl) confirmedEl.hidden = true;
    return;
  }

  if (form) form.hidden = true;
  if (confirmedEl) confirmedEl.hidden = true;
  messageEl.textContent = spec.message;

  const reward = getLoyaltyReward(stamps, profile, orders);
  if (codeEl) {
    if (reward?.code) {
      const status = rewardStatusLabel(reward);
      codeEl.hidden = false;
      codeEl.textContent = status ? `${reward.code} · ${status}` : reward.code;
    } else {
      codeEl.hidden = true;
    }
  }
}

export function confirmLoyaltyBirthday(isoDate, profile = loadClientProfile()) {
  if (profile?.birthday) {
    return { ok: false, error: "La date de naissance est déjà enregistrée." };
  }
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "Veuillez indiquer une date de naissance valide." };
  }
  if (date > new Date() || date < new Date(1900, 0, 1)) {
    return { ok: false, error: "Veuillez indiquer une date de naissance valide." };
  }

  const updated = { ...profile, birthday: date.toISOString() };
  saveClientProfileLocal(updated);
  const stored = getStoredUser();
  if (stored) setStoredUser({ ...stored, birthday: updated.birthday });

  const record = getUserRecord(updated);
  record.birthdayConfirmedAt = new Date().toISOString();
  saveUserRecord(record, updated);

  return { ok: true, profile: updated };
}
