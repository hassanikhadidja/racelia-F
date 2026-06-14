export const PROFILE_CARD_ASSETS = {
  loyaltyFront:
    "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780493042/8_1_vf3lgz.png",
  loyaltyBack:
    "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780770797/Black_and_White_Typographic_Thank_You_Note_Card_1_tsrzna.png",
  stampIcon:
    "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780497556/1_1_v6ic5b.png",
  egiftFront:
    "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780501038/7_1_e8s4xp.png",
  egiftBack:
    "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780501044/8_1_bm4dwj.png",
};

export const GIFT_POINTS_PROMO_THRESHOLD = 2000;
export const EGIFT_STORAGE_KEY = "raceliaEgiftCard";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loyaltyStampSlots(stampCount) {
  const count = Math.max(0, Math.min(8, Number(stampCount) || 0));
  return Array.from({ length: 8 }, (_, index) => {
    const icon =
      index < count
        ? `<img class="loyalty-stamp-icon" src="${PROFILE_CARD_ASSETS.stampIcon}" alt="" />`
        : "";
    return `<span class="loyalty-stamp-slot">${icon}</span>`;
  }).join("");
}

export function getUserPromoCode(points = 0) {
  if (points >= GIFT_POINTS_PROMO_THRESHOLD) return "RACELIA10";
  if (points >= 500) return "RACELIA5";
  return "—";
}

export function getUserPromoMessage(points = 0) {
  if (points >= GIFT_POINTS_PROMO_THRESHOLD) {
    return "This customer unlocked a 10% promo code from gift points.";
  }
  if (points >= 500) {
    return "This customer earned a 5% loyalty promotion from their activity.";
  }
  return "No promo code unlocked yet. Stamps fill as orders are delivered.";
}

export function formatEgiftDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return formatEgiftDate(new Date());
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getDefaultEgiftFields(userName = "") {
  return {
    to: "",
    from: String(userName || "").trim(),
    amount: "0 DZD",
    expiry: formatEgiftDate(new Date()),
  };
}

export function loadClientEgiftFields(profile) {
  try {
    const saved = localStorage.getItem(EGIFT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.used) {
        return {
          to: parsed.to ?? "",
          from: parsed.from ?? getDefaultEgiftFields(profile?.name).from,
          amount: parsed.amount ?? "0 DZD",
          expiry: parsed.expiry ?? formatEgiftDate(new Date()),
        };
      }
    }
  } catch {
    /* ignore */
  }
  return getDefaultEgiftFields(profile?.name);
}

export function saveClientEgiftFields(fields) {
  try {
    localStorage.setItem(
      EGIFT_STORAGE_KEY,
      JSON.stringify({
        to: fields.to ?? "",
        from: fields.from ?? "",
        amount: fields.amount ?? "0 DZD",
        expiry: fields.expiry ?? formatEgiftDate(new Date()),
        used: true,
      })
    );
  } catch {
    /* ignore */
  }
}

export function applyEgiftFieldsToPage(page, fields) {
  if (!page || !fields) return;
  const to = page.querySelector("#egift-field-to");
  const from = page.querySelector("#egift-field-from");
  const amount = page.querySelector("#egift-field-amount");
  const expiry = page.querySelector("#egift-field-expiry");
  if (to) to.value = fields.to ?? "";
  if (from) from.value = fields.from ?? "";
  if (amount) amount.value = fields.amount ?? "0 DZD";
  if (expiry) expiry.value = fields.expiry ?? formatEgiftDate(new Date());
}

export function readEgiftFieldsFromPage(page) {
  return {
    to: page.querySelector("#egift-field-to")?.value?.trim() ?? "",
    from: page.querySelector("#egift-field-from")?.value?.trim() ?? "",
    amount: page.querySelector("#egift-field-amount")?.value?.trim() ?? "0 DZD",
    expiry: page.querySelector("#egift-field-expiry")?.value?.trim() ?? formatEgiftDate(new Date()),
  };
}

export function getUserStampCount(orders = []) {
  return orders.filter((order) => order.status === "delivered").length;
}

export function getUserEgiftFields(user = {}) {
  return getDefaultEgiftFields(user.name);
}

export function getProfileCardsMarkup({
  prefix = "profile-card",
  stampCount = 0,
  promoCode = "—",
  promoMessage = "",
  egift = {},
} = {}) {
  const message =
    promoMessage ||
    "Customer loyalty card. Tap the card to flip and view stamps on the back.";

  return `
    <div class="profile-cards-block">
      <h4 class="profile-cards-block__title">Loyalty card</h4>
      <div class="loyalty-card-wrap">
        <div class="loyalty-scene">
          <div class="loyalty-flip-card" id="${prefix}-loyalty-card">
            <div class="loyalty-card-face">
              <img src="${PROFILE_CARD_ASSETS.loyaltyFront}" alt="Loyalty card front" class="${prefix}-loyalty-front-img" />
            </div>
            <div class="loyalty-card-face loyalty-card-back">
              <img src="${PROFILE_CARD_ASSETS.loyaltyBack}" alt="Loyalty card back" />
              <div class="loyalty-stamp-overlay" aria-hidden="true">
                ${loyaltyStampSlots(stampCount)}
              </div>
            </div>
          </div>
        </div>
        <p class="loyalty-promo-message">${escapeHtml(message)}</p>
        <div class="loyalty-promo-code-box">${escapeHtml(promoCode)}</div>
      </div>
    </div>

    <div class="profile-cards-block">
      <h4 class="profile-cards-block__title">E-Gift card</h4>
      <div class="egift-card-wrap">
        <div class="egift-scene">
          <div class="egift-flip-card" id="${prefix}-egift-card">
            <div class="egift-card-face">
              <img src="${PROFILE_CARD_ASSETS.egiftFront}" alt="E-Gift card front" class="${prefix}-egift-front-img" />
            </div>
            <div class="egift-card-face egift-card-back">
              <img src="${PROFILE_CARD_ASSETS.egiftBack}" alt="E-Gift card back" />
              <div class="egift-fields-overlay">
                <div class="egift-field-box egift-field-box--readonly">${escapeHtml(egift.to ?? "")}</div>
                <div class="egift-field-box egift-field-box--readonly">${escapeHtml(egift.from ?? "")}</div>
                <div class="egift-field-box egift-field-box--readonly">${escapeHtml(egift.amount ?? "0 DZD")}</div>
                <div class="egift-field-box egift-field-box--readonly">${escapeHtml(egift.expiry ?? formatEgiftDate(new Date()))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initProfileCardFlips(root, prefix = "profile-card") {
  if (!root) return;

  const loyaltyCard = root.querySelector(`#${prefix}-loyalty-card`);
  const egiftCard = root.querySelector(`#${prefix}-egift-card`);
  const loyaltyFrontImg = root.querySelector(`.${prefix}-loyalty-front-img`);
  const egiftFrontImg = root.querySelector(`.${prefix}-egift-front-img`);

  root.querySelector(".loyalty-scene")?.addEventListener("click", () => {
    loyaltyCard?.classList.toggle("flipped");
  });

  root.querySelector(".egift-scene")?.addEventListener("click", () => {
    egiftCard?.classList.toggle("flipped");
  });

  const setLoyaltyRatio = () => {
    if (!loyaltyCard || !loyaltyFrontImg?.naturalWidth) return;
    loyaltyCard.style.setProperty(
      "--loyalty-card-ratio",
      String(loyaltyFrontImg.naturalWidth / loyaltyFrontImg.naturalHeight)
    );
  };

  const setEgiftRatio = () => {
    if (!egiftCard || !egiftFrontImg?.naturalWidth) return;
    egiftCard.style.setProperty(
      "--egift-card-ratio",
      String(egiftFrontImg.naturalWidth / egiftFrontImg.naturalHeight)
    );
  };

  loyaltyFrontImg?.addEventListener("load", setLoyaltyRatio);
  if (loyaltyFrontImg?.complete) setLoyaltyRatio();

  egiftFrontImg?.addEventListener("load", setEgiftRatio);
  if (egiftFrontImg?.complete) setEgiftRatio();
}

export function renderUserProfileCards(user, prefix = "dashboard-user-card") {
  const points = Number(user.points || 0);
  return getProfileCardsMarkup({
    prefix,
    stampCount: getUserStampCount(user.orders),
    promoCode: getUserPromoCode(points),
    promoMessage: getUserPromoMessage(points),
    egift: getUserEgiftFields(user),
  });
}
