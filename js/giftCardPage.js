import { displayAmountToEur } from "./currency.js";
import { upsertBagLineItem, refreshShoppingBagTotals } from "./bagHelpers.js";
import { syncBagCountFromDom } from "./cart.js";
import { openPdpAddedOverlay } from "./cartAddedOverlay.js";
import { GIFT_CARD_HERO } from "../components/GiftCardPage.js";

const PRESETS = {
  DZD: [15000, 30000, 50000, 100000, 250000],
  EUR: [50, 100, 150, 200, 500],
  USD: [50, 100, 150, 200, 500],
};

const PREFIX = {
  DZD: "DA",
  EUR: "€",
  USD: "$",
};

const MESSAGE_MAX = 180;
const MESSAGE_LINES = 5;

function formatPreset(amount, currency) {
  if (currency === "DZD") return `${amount.toLocaleString("fr-FR")} DZD`;
  if (currency === "EUR") return `€${amount}`;
  return `$${amount}`;
}

function parseAmount(value) {
  const normalized = String(value || "").replace(/\s/g, "").replace(",", ".");
  const amount = parseFloat(normalized.replace(/[^\d.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function messageStats(text) {
  const value = String(text || "");
  const chars = value.length;
  const lines = value.split(/\n/).length;
  return {
    charsLeft: Math.max(0, MESSAGE_MAX - chars),
    linesLeft: Math.max(0, MESSAGE_LINES - lines),
  };
}

export function initGiftCardPage(root) {
  const page = root.querySelector("#giftCardPage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  const form = page.querySelector("#giftCardForm");
  const amountsWrap = page.querySelector("#giftCardAmounts");
  const customInput = page.querySelector("#giftCardCustomAmount");
  const prefixEl = page.querySelector("#giftCardPrefix");
  const senderInput = page.querySelector("#giftCardSender");
  const recipientInput = page.querySelector("#giftCardRecipient");
  const messageInput = page.querySelector("#giftCardMessage");
  const counterEl = page.querySelector("#giftCardCounter");
  const emailInput = page.querySelector("#giftCardEmail");
  const next1 = page.querySelector("#giftCardNext1");
  const next2 = page.querySelector("#giftCardNext2");
  const addBtn = page.querySelector("#giftCardAddToBag");

  const state = {
    step: 1,
    currency: "DZD",
    amount: PRESETS.DZD[0],
    custom: false,
  };

  const setStep = (step) => {
    if (step > state.step && !canLeave(state.step)) return;
    state.step = step;
    page.querySelectorAll(".gift-card-panel").forEach((panel) => {
      const on = Number(panel.dataset.panel) === step;
      panel.hidden = !on;
      panel.classList.toggle("is-active", on);
    });
    page.querySelectorAll(".gift-card-step").forEach((btn) => {
      const n = Number(btn.dataset.step);
      btn.classList.toggle("is-active", n === step);
      btn.classList.toggle("is-done", n < step);
      if (n === step) btn.setAttribute("aria-current", "step");
      else btn.removeAttribute("aria-current");
    });
  };

  const canLeave = (step) => {
    if (step === 1) return state.amount > 0;
    if (step === 2) {
      return Boolean(senderInput?.value.trim() && recipientInput?.value.trim());
    }
    return true;
  };

  const renderAmounts = () => {
    const presets = PRESETS[state.currency] || PRESETS.DZD;
    if (!state.custom && !presets.includes(state.amount)) {
      state.amount = presets[0];
    }
    amountsWrap.innerHTML = presets
      .map((amount) => {
        const selected = !state.custom && state.amount === amount;
        return `<button type="button" class="gift-card-amount${selected ? " is-selected" : ""}" data-amount="${amount}" aria-pressed="${selected}">${formatPreset(amount, state.currency)}</button>`;
      })
      .join("");
    if (prefixEl) prefixEl.textContent = PREFIX[state.currency] || "DA";
    if (state.custom && customInput) {
      customInput.value = String(state.amount || "");
    } else if (customInput) {
      customInput.value = "";
    }
    validateStep1();
  };

  const validateStep1 = () => {
    if (next1) next1.disabled = !(state.amount > 0);
  };

  const validateStep2 = () => {
    if (next2) next2.disabled = !canLeave(2);
  };

  const validateStep3 = () => {
    if (addBtn) addBtn.disabled = !isValidEmail(emailInput?.value);
  };

  const updateCounter = () => {
    if (!counterEl) return;
    const stats = messageStats(messageInput?.value);
    counterEl.textContent = `${stats.charsLeft}/${MESSAGE_MAX} caractères restants · ${stats.linesLeft}/${MESSAGE_LINES} lignes restantes`;
  };

  page.querySelectorAll("[data-currency]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.currency = btn.dataset.currency || "DZD";
      state.custom = false;
      state.amount = PRESETS[state.currency][0];
      page.querySelectorAll("[data-currency]").forEach((item) => {
        const on = item === btn;
        item.classList.toggle("is-selected", on);
        item.setAttribute("aria-pressed", String(on));
      });
      renderAmounts();
    });
  });

  amountsWrap?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-amount]");
    if (!btn) return;
    state.custom = false;
    state.amount = Number(btn.dataset.amount) || 0;
    renderAmounts();
  });

  customInput?.addEventListener("input", () => {
    const amount = parseAmount(customInput.value);
    state.custom = customInput.value.trim().length > 0;
    state.amount = amount;
    amountsWrap.querySelectorAll(".gift-card-amount").forEach((btn) => {
      btn.classList.remove("is-selected");
      btn.setAttribute("aria-pressed", "false");
    });
    validateStep1();
  });

  senderInput?.addEventListener("input", validateStep2);
  recipientInput?.addEventListener("input", validateStep2);
  messageInput?.addEventListener("input", () => {
    const lines = String(messageInput.value || "").split(/\n/);
    if (lines.length > MESSAGE_LINES) {
      messageInput.value = lines.slice(0, MESSAGE_LINES).join("\n");
    }
    updateCounter();
  });
  emailInput?.addEventListener("input", validateStep3);

  next1?.addEventListener("click", () => setStep(2));
  next2?.addEventListener("click", () => setStep(3));

  page.querySelectorAll(".gift-card-step").forEach((btn) => {
    btn.addEventListener("click", () => {
      const step = Number(btn.dataset.step);
      if (step < state.step || (step === state.step + 1 && canLeave(state.step))) {
        setStep(step);
      }
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canLeave(1) || !canLeave(2) || !isValidEmail(emailInput?.value)) return;

    const priceEur = displayAmountToEur(state.amount, state.currency);
    const recipient = recipientInput.value.trim();
    const sender = senderInput.value.trim();
    const added = upsertBagLineItem(root, {
      productId: `egift-card-${Date.now()}`,
      name: "Carte cadeau électronique RACÈLIA",
      priceEur,
      color: `Pour : ${recipient}`,
      imageUrl: GIFT_CARD_HERO,
      qty: 1,
      mode: "add",
    });
    if (!added) return;

    const item = root.querySelector("#shoppingBagPage .bag-items .bag-item:last-child");
    if (item) {
      item.dataset.giftCard = "true";
      item.dataset.giftSender = sender;
      item.dataset.giftRecipient = recipient;
      item.dataset.giftMessage = messageInput.value.trim();
      item.dataset.giftEmail = emailInput.value.trim();
      item.dataset.giftCurrency = state.currency;
      item.dataset.giftAmount = String(state.amount);
    }

    syncBagCountFromDom(root);
    refreshShoppingBagTotals(root);
    openPdpAddedOverlay(root, 1);

    form.reset();
    state.step = 1;
    state.currency = "DZD";
    state.amount = PRESETS.DZD[0];
    state.custom = false;
    page.querySelectorAll("[data-currency]").forEach((item) => {
      const on = item.dataset.currency === "DZD";
      item.classList.toggle("is-selected", on);
      item.setAttribute("aria-pressed", String(on));
    });
    renderAmounts();
    updateCounter();
    validateStep2();
    validateStep3();
    setStep(1);
  });

  renderAmounts();
  updateCounter();
  validateStep2();
  validateStep3();
}
