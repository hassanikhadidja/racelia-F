import { getCategoryProductById } from "./categoryData.js";
import { getStorefrontStyleLooks } from "./dashboardRaceliaStyleData.js";
import { openStyleLook } from "./raceliaStyle.js";
import { deliverySrc } from "./imageDelivery.js";

const CHIP_TONES = ["#f4f4f4", "#b7e6a8", "#e4d8fb", "#ffd0e4", "#f4eadf", "#d9e7ff", "#ffe6bf", "#f7f7f7"];
const PIN_RATIOS = ["3 / 4", "1 / 1", "4 / 5", "2 / 3", "5 / 4", "3 / 5", "4 / 3"];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toChipLabel(name) {
  const cleaned = String(name || "")
    .replace(/^the\s+/i, "")
    .replace(/rac[eè]lia/gi, "")
    .replace(/\bbag\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  return cleaned
    .toLowerCase()
    .replace(/(^|\s)([a-zà-ÿ])/gi, (match) => match.toUpperCase());
}

function buildChips(looks) {
  const chips = [];
  const seen = new Set();

  looks.forEach((look) => {
    (look.products || []).forEach((product) => {
      const meta = getCategoryProductById(product.id);
      const label = toChipLabel(meta?.name || "");
      const key = String(product.id || label).toLowerCase();
      if (!label || seen.has(key)) return;
      seen.add(key);
      chips.push({
        id: product.id,
        label,
        image: meta?.images?.[0] || product.image || look.img,
      });
    });
  });

  return chips;
}

function collectPins(looks) {
  const pins = [];

  looks.forEach((look) => {
    if (look.img) {
      pins.push({
        lookId: look.id,
        src: look.img,
        alt: look.title || "Look RACÈLIASTYLE",
      });
    }

    (look.products || []).forEach((product) => {
      const meta = getCategoryProductById(product.id);
      const src = meta?.images?.[0] || product.image;
      if (!src || src === look.img) return;
      pins.push({
        lookId: look.id,
        src,
        alt: meta?.name || look.title || "Look RACÈLIASTYLE",
      });
    });
  });

  return pins.map((pin, index) => ({
    ...pin,
    ratio: PIN_RATIOS[index % PIN_RATIOS.length],
  }));
}

function renderChips(root, chips) {
  const list = root.querySelector("#styleBoardChips");
  const page = root.querySelector("#styleBoardPage");
  if (!list || !page) return;

  const active = page.dataset.chip || "";
  list.replaceChildren();

  chips.forEach((chip, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "style-board__chip" + (chip.id === active ? " is-active" : "");
    button.dataset.styleChip = chip.id;
    button.setAttribute("aria-pressed", String(chip.id === active));
    button.style.setProperty("--chip-tone", CHIP_TONES[index % CHIP_TONES.length]);
    button.innerHTML = `
      <img src="${escapeHtml(deliverySrc(chip.image, 96))}" alt="" width="48" height="48" decoding="async" />
      <span>${escapeHtml(chip.label)}</span>
    `;
    button.querySelector("img")?.addEventListener("error", (event) => {
      event.currentTarget.remove();
    });
    list.appendChild(button);
  });
}

function renderPins(root, pins) {
  const masonry = root.querySelector("#styleBoardMasonry");
  const empty = root.querySelector("#styleBoardEmpty");
  if (!masonry) return;

  masonry.replaceChildren();

  pins.forEach((pin) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "style-board__pin";
    button.dataset.styleLookId = pin.lookId || "";
    button.style.setProperty("--pin-ratio", pin.ratio);
    button.setAttribute("aria-label", pin.alt);
    button.innerHTML = `
      <img src="${escapeHtml(deliverySrc(pin.src, 640))}" alt="" loading="lazy" decoding="async" />
      <span class="style-board__more" aria-hidden="true">
        <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>
      </span>
    `;
    button.querySelector("img")?.addEventListener("error", () => {
      button.remove();
      const empty = root.querySelector("#styleBoardEmpty");
      const masonryEl = root.querySelector("#styleBoardMasonry");
      if (empty && masonryEl) empty.hidden = masonryEl.childElementCount > 0;
    });
    masonry.appendChild(button);
  });

  if (empty) empty.hidden = pins.length > 0;
}

export function renderStyleBoard(root) {
  const page = root.querySelector("#styleBoardPage");
  if (!page) return;

  const looks = getStorefrontStyleLooks();
  const chips = buildChips(looks);
  if (page.dataset.chip && !chips.some((chip) => chip.id === page.dataset.chip)) {
    delete page.dataset.chip;
  }

  const active = page.dataset.chip || "";
  const visibleLooks = active
    ? looks.filter((look) => (look.products || []).some((product) => product.id === active))
    : looks;

  renderChips(root, chips);
  renderPins(root, collectPins(visibleLooks));
}

export function initStyleBoard(root) {
  const page = root.querySelector("#styleBoardPage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  page.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-style-chip]");
    if (chip) {
      const id = chip.dataset.styleChip;
      if (page.dataset.chip === id) delete page.dataset.chip;
      else page.dataset.chip = id;
      renderStyleBoard(root);
      return;
    }

    const pin = event.target.closest("[data-style-look-id]");
    if (!pin) return;
    const looks = getStorefrontStyleLooks();
    const index = looks.findIndex((look) => look.id === pin.dataset.styleLookId);
    const look = looks[index];
    if (!look) return;
    openStyleLook(root, look, index);
  });
}
