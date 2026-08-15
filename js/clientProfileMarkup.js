import { getProfileOrdersOverlayMarkup } from "./clientProfileOrders.js";
import { getProfileEgiftsOverlayMarkup } from "./clientProfileEgifts.js";
import {
  getProfileReviewOverlayMarkup,
  getReviewsSummaryText,
} from "./clientProfileReviews.js";

/** @generated from client profile.html */
export function getClientProfileMarkup() {
  return `<div class="client-profile-phone-frame"><!-- Top Bar -->
  <div class="top-bar">
    <button type="button" class="btn-icon js-client-profile-back" aria-label="Retour">
      <svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h1>Profil</h1>
    <button type="button" class="btn-icon" id="edit-profile-btn" aria-label="Modifier le profil">
      <svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    </button>
  </div>

  <!-- Avatar (initial letter only — not editable) -->
  <div class="avatar-section">
    <div class="avatar-wrap" id="avatar-wrap" aria-hidden="true">
      <div class="avatar-placeholder" id="avatar-placeholder">A</div>
    </div>
    <h2 id="profile-name">Alex Gilles</h2>
  </div>

  <!-- Contact Info -->
  <div class="card">
    <div class="info-row">
      <div class="row-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <rect x="7" y="2" width="10" height="20" rx="2"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
        </svg>
      </div>
      <div class="row-content">
        <div class="row-label">Téléphone</div>
        <div class="row-value" id="profile-phone">+213 555 XXX XX 11</div>
      </div>
    </div>

    <div class="info-row">
      <div class="row-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
      </div>
      <div class="row-content">
        <div class="row-label">E-mail</div>
        <div class="row-value" id="profile-email">alexg@gmail.com</div>
      </div>
    </div>

    <div class="info-row">
      <div class="row-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div class="row-content">
        <div class="row-label">Adresse</div>
        <div class="row-value" id="profile-address">Wilaya Alger, Commune Kouba</div>
      </div>
    </div>

    <div class="info-row info-row--static">
      <div class="row-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div class="row-content">
        <div class="row-label">Anniversaire</div>
        <div class="row-value" id="profile-birthday">—</div>
      </div>
    </div>
  </div>

  <!-- Loyalty Card Title -->
  <div class="section-title-row section-title-row--action js-loyalty-orders-toggle" role="button" tabindex="0" aria-expanded="false" aria-controls="profile-orders-overlay">
    <h3>Carte de fidélité</h3>
    <div class="chevron">
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </div>
  </div>

  <!-- Loyalty Flip Card -->
  <div class="loyalty-card-wrap">
    <div class="loyalty-scene">
      <div class="loyalty-flip-card" id="loyalty-card">
        <div class="loyalty-card-face">
          <img
            src="https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780493042/8_1_vf3lgz.png"
            alt="Recto de la carte de fidélité"
            id="loyalty-card-front-img"
          >
        </div>
        <div class="loyalty-card-face loyalty-card-back">
          <img
            src="https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780770797/Black_and_White_Typographic_Thank_You_Note_Card_1_tsrzna.png"
            alt="Verso de la carte de fidélité"
          >
          <div class="loyalty-stamp-overlay" aria-hidden="true">
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="loyalty-reward" id="loyalty-reward" hidden>
      <p class="loyalty-promo-message" id="loyalty-promo-message"></p>
      <div class="loyalty-promo-code-box" id="loyalty-promo-code" hidden></div>
      <form class="loyalty-birthday-form" id="loyalty-birthday-form" hidden>
        <label for="loyalty-birthday-input">Date de naissance</label>
        <input type="date" id="loyalty-birthday-input" name="birthday" required>
        <button type="submit" class="loyalty-birthday-confirm">Confirmer</button>
        <p class="loyalty-birthday-hint">Cette date ne pourra plus être modifiée.</p>
      </form>
      <p class="loyalty-birthday-confirmed" id="loyalty-birthday-confirmed" hidden></p>
    </div>
  </div>

  <!-- E-Gift Card Title -->
  <div class="section-title-row section-title-row--action js-egifts-toggle" role="button" tabindex="0" aria-expanded="false" aria-controls="profile-egifts-overlay">
    <h3>Carte cadeau électronique</h3>
    <div class="chevron">
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </div>
  </div>

  <!-- E-Gift Flip Card -->
  <div class="egift-card-wrap">
    <div class="egift-scene">
      <div class="egift-flip-card" id="egift-card">
        <div class="egift-card-face">
          <img
            src="https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780501038/7_1_e8s4xp.png"
            alt="Recto de la carte cadeau"
            id="egift-card-front-img"
          >
        </div>
        <div class="egift-card-face egift-card-back">
          <img
            src="https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780501044/8_1_bm4dwj.png"
            alt="Verso de la carte cadeau"
          >
          <div class="egift-fields-overlay">
            <input class="egift-field-box" type="text" id="egift-field-to" aria-label="Pour" placeholder=" " readonly tabindex="-1" />
            <input class="egift-field-box" type="text" id="egift-field-from" aria-label="De" placeholder=" " readonly tabindex="-1" />
            <input class="egift-field-box" type="text" id="egift-field-amount" aria-label="Montant" placeholder=" " readonly tabindex="-1" />
            <input class="egift-field-box" type="text" id="egift-field-expiry" aria-label="Expiration" placeholder=" " readonly tabindex="-1" />
          </div>
        </div>
      </div>
    </div>
    <p class="egift-card-caption">
      <a href="#carte-cadeau" class="js-profile-gift-card">Faites plaisir à vos proches avec une carte cadeau électronique RACÈLIA.</a>
    </p>
  </div>

  <!-- Reviews & Gift Points (under cards) -->
  <div class="card contact-card-below">
    <div class="info-row info-row--action js-profile-reviews-open">
      <div class="row-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <div class="row-content">
        <div class="row-label">Avis</div>
        <div class="row-value" id="profile-reviews-summary">${getReviewsSummaryText()}</div>
      </div>
      <div class="chevron">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l-6-6-6-6"/></svg>
      </div>
    </div>

    <div class="info-row info-row--static profile-newsletter-row">
      <div class="row-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
      </div>
      <div class="row-content">
        <div class="row-label">Newsletters</div>
        <div class="row-value">Recevoir les actualités RACÈLIA</div>
      </div>
      <div class="profile-newsletter-filter" role="radiogroup" aria-label="Accepter les newsletters">
        <button type="button" class="profile-newsletter-opt is-selected" data-newsletter="yes" aria-pressed="true">Oui</button>
        <button type="button" class="profile-newsletter-opt" data-newsletter="no" aria-pressed="false">Non</button>
      </div>
    </div>
  </div>

  <div class="profile-logout-section">
    <button type="button" class="profile-logout-btn" id="profile-logout-btn">Déconnecter</button>
  </div>

</div></div>${getProfileOrdersOverlayMarkup()}${getProfileEgiftsOverlayMarkup()}${getProfileReviewOverlayMarkup()}<div class="profile-edit-overlay" id="profile-edit-overlay" aria-hidden="true">
  <div class="profile-edit-sheet" role="dialog" aria-labelledby="profile-edit-title">
    <div class="profile-edit-header">
      <h3 id="profile-edit-title">Modifier le profil</h3>
      <button type="button" class="profile-edit-close" id="profile-edit-cancel">Annuler</button>
    </div>
    <form id="profile-edit-form">
      <div class="profile-edit-field">
        <label for="edit-name">Nom</label>
        <input type="text" id="edit-name" name="name" autocomplete="name" required>
      </div>
      <div class="profile-edit-field">
        <label for="edit-phone">Téléphone <span class="profile-edit-optional">(facultatif)</span></label>
        <input type="tel" id="edit-phone" name="phone" autocomplete="tel">
      </div>
      <div class="profile-edit-field">
        <label for="edit-email">E-mail</label>
        <input type="email" id="edit-email" name="email" autocomplete="email" required>
      </div>
      <div class="profile-edit-field">
        <label for="edit-address">Adresse <span class="profile-edit-optional">(facultatif)</span></label>
        <input type="text" id="edit-address" name="address" autocomplete="street-address">
      </div>
      <button type="submit" class="profile-edit-save">Enregistrer</button>
    </form>
  </div>
</div>`;
}
