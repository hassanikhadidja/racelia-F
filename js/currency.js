const CURRENCY_KEY = "raceliaDisplayCurrency";

export const EUR_TO_DZD = 280;
export const USD_TO_DZD = 260;

export const CURRENCY_OPTIONS = [
  { value: "DZD", label: "Algerian Dinar (DZD)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "USD", label: "US Dollar ($)" },
];

export function getCurrency() {
  try {
    const saved = localStorage.getItem(CURRENCY_KEY);
    if (saved === "EUR" || saved === "USD" || saved === "DZD") return saved;
  } catch {
    /* ignore */
  }
  return "DZD";
}

export function setCurrency(code) {
  const next = code === "EUR" || code === "USD" ? code : "DZD";
  try {
    localStorage.setItem(CURRENCY_KEY, next);
  } catch {
    /* ignore */
  }
  return next;
}

/** Parse catalog price — stored in DZD when priceAmountDzd is set. */
export function parseCatalogPriceEur(productOrText) {
  if (productOrText && typeof productOrText === "object") {
    const dzd = Number(productOrText.priceAmountDzd);
    if (dzd > 0) return dzd / EUR_TO_DZD;
    const text = String(productOrText.price || "");
    if (/dzd/i.test(text)) {
      return (parseFloat(text.replace(/[^\d.]/g, "")) || 0) / EUR_TO_DZD;
    }
    return parsePriceFromCatalog(text);
  }
  const text = String(productOrText || "");
  if (/dzd/i.test(text)) {
    return (parseFloat(text.replace(/[^\d.]/g, "")) || 0) / EUR_TO_DZD;
  }
  return parsePriceFromCatalog(text);
}

export function parseDzdInput(text) {
  return Math.round(parseFloat(String(text).replace(/[^\d.]/g, "")) || 0);
}

export function formatDzdPrice(dzd) {
  const amount = Math.round(Number(dzd) || 0);
  return `${amount.toLocaleString("fr-FR")} DZD`;
}

/** @deprecated use parseCatalogPriceEur */
export function parsePriceFromCatalog(text) {
  return parseFloat(String(text).replace(/[^\d.]/g, "")) || 0;
}

export function eurToDzd(eur) {
  return eur * EUR_TO_DZD;
}

export function eurToUsd(eur) {
  return eurToDzd(eur) / USD_TO_DZD;
}

export function displayAmountToEur(amount, currency = getCurrency()) {
  if (currency === "EUR") return amount;
  if (currency === "USD") return (amount * USD_TO_DZD) / EUR_TO_DZD;
  return amount / EUR_TO_DZD;
}

export function formatPrice(eurAmount) {
  const currency = getCurrency();
  const eur = Number(eurAmount) || 0;

  if (currency === "EUR") {
    const rounded = Math.round(eur * 100) / 100;
    return `€ ${rounded.toLocaleString("en-GB", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  if (currency === "USD") {
    const usd = eurToUsd(eur);
    const rounded = Math.round(usd * 100) / 100;
    return `$ ${rounded.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  const dzd = Math.round(eurToDzd(eur));
  return `${dzd.toLocaleString("fr-FR")} DZD`;
}

/** Parse a displayed price back to EUR for cart/checkout math. */
export function parsePrice(text) {
  const amount = parseFloat(String(text).replace(/[^\d.]/g, "")) || 0;
  return displayAmountToEur(amount);
}

export function formatProductPrice(priceTextOrEurOrProduct) {
  if (priceTextOrEurOrProduct && typeof priceTextOrEurOrProduct === "object") {
    const dzd = Number(priceTextOrEurOrProduct.priceAmountDzd);
    if (dzd > 0) return formatDzdPrice(dzd);
    return formatPrice(parseCatalogPriceEur(priceTextOrEurOrProduct));
  }
  const eur =
    typeof priceTextOrEurOrProduct === "number"
      ? priceTextOrEurOrProduct
      : parseCatalogPriceEur(priceTextOrEurOrProduct);
  return formatPrice(eur);
}

export function refreshDisplayedPrices(root = document) {
  root.querySelectorAll("[data-price-eur]").forEach((el) => {
    const eur = parseFloat(el.dataset.priceEur) || 0;
    el.textContent = formatPrice(eur);
  });
}

export function initCurrencyControls(root) {
  const select = root.querySelector("#footerCurrencySelect");
  if (!select || select.dataset.bound === "true") return;
  select.dataset.bound = "true";

  select.value = getCurrency();

  select.addEventListener("change", () => {
    setCurrency(select.value);
    refreshDisplayedPrices(root);
    root.dispatchEvent(new CustomEvent("racelia:currency-changed", { bubbles: true }));
  });
}
