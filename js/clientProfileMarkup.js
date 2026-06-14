import { getProfileOrdersOverlayMarkup } from "./clientProfileOrders.js";
import { getProfileGiftPointsOverlayMarkup } from "./clientProfileGiftPoints.js";
import {
  getProfileReviewOverlayMarkup,
  getReviewsSummaryText,
} from "./clientProfileReviews.js";
import { getTotalGiftPoints } from "./clientProfileGiftPoints.js";

/** @generated from client profile.html */
export function getClientProfileMarkup() {
  return `<div class="client-profile-phone-frame"><!-- Top Bar -->
  <div class="top-bar">
    <button type="button" class="btn-icon js-client-profile-back" aria-label="Back">
      <svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h1>Profile</h1>
    <button type="button" class="btn-icon" id="edit-profile-btn" aria-label="Edit profile">
      <svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    </button>
  </div>

  <!-- Avatar -->
  <div class="avatar-section">
    <div class="avatar-wrap" id="avatar-wrap">
      <div class="avatar-placeholder" id="avatar-placeholder">AG</div>
      <img class="avatar-image" id="avatar-image" alt="Profile photo" />
      <input
        type="file"
        id="avatar-file-input"
        class="avatar-file-input"
        accept="image/*"
        aria-label="Choose profile photo"
      >
      <button type="button" class="edit-badge" id="edit-badge" aria-label="Change profile photo">
        <svg viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
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
        <div class="row-label">Phone</div>
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
        <div class="row-label">Email</div>
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
        <div class="row-label">Address</div>
        <div class="row-value" id="profile-address">Wilaya Alger, Commune Kouba</div>
      </div>
    </div>
  </div>

  <!-- Loyalty Card Title -->
  <div class="section-title-row section-title-row--action js-loyalty-orders-toggle" role="button" tabindex="0" aria-expanded="false" aria-controls="profile-orders-overlay">
    <h3>Loyalty card</h3>
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
            alt="Loyalty card front"
            id="loyalty-card-front-img"
          >
        </div>
        <div class="loyalty-card-face loyalty-card-back">
          <img
            src="https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780770797/Black_and_White_Typographic_Thank_You_Note_Card_1_tsrzna.png"
            alt="Loyalty card back"
          >
          <div class="loyalty-stamp-overlay" aria-hidden="true">
            <span class="loyalty-stamp-slot">
              <img
                class="loyalty-stamp-icon"
                src="https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780497556/1_1_v6ic5b.png"
                alt=""
              >
            </span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot">
              <img
                class="loyalty-stamp-icon"
                src="https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780497556/1_1_v6ic5b.png"
                alt=""
              >
            </span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
            <span class="loyalty-stamp-slot"></span>
          </div>
        </div>
      </div>
    </div>
    <p class="loyalty-promo-message">
      You have earned a 5% discount promotion. Use the promo code provided below on your next order to receive your discount!
    </p>
    <div class="loyalty-promo-code-box">CODE</div>
  </div>

  <!-- E-Gift Card Title -->
  <div class="section-title-row">
    <h3>E-Gift Card</h3>
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
            alt="E-Gift card front"
            id="egift-card-front-img"
          >
        </div>
        <div class="egift-card-face egift-card-back">
          <img
            src="https://res.cloudinary.com/dbtkfjrvd/image/upload/v1780501044/8_1_bm4dwj.png"
            alt="E-Gift card back"
          >
          <div class="egift-fields-overlay">
            <input class="egift-field-box" type="text" id="egift-field-to" aria-label="To" placeholder=" ">
            <input class="egift-field-box" type="text" id="egift-field-from" aria-label="From" placeholder=" ">
            <input class="egift-field-box" type="text" id="egift-field-amount" aria-label="Amount" placeholder=" ">
            <input class="egift-field-box" type="text" id="egift-field-expiry" aria-label="Expiry" placeholder=" ">
          </div>
        </div>
      </div>
    </div>
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
        <div class="row-label">Reviews</div>
        <div class="row-value" id="profile-reviews-summary">${getReviewsSummaryText()}</div>
      </div>
      <div class="chevron">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>

    <div class="info-row info-row--action js-profile-points-open">
      <div class="row-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
        </svg>
      </div>
      <div class="row-content">
        <div class="row-label">Gift points</div>
        <div class="row-value" id="profile-gift-points-summary">${getTotalGiftPoints().toLocaleString()} pts</div>
      </div>
      <div class="chevron">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
  </div>

  <div class="profile-logout-section">
    <button type="button" class="profile-logout-btn" id="profile-logout-btn">Déconnecter</button>
  </div>

</div></div>${getProfileOrdersOverlayMarkup()}${getProfileReviewOverlayMarkup()}${getProfileGiftPointsOverlayMarkup()}<div class="profile-edit-overlay" id="profile-edit-overlay" aria-hidden="true">
  <div class="profile-edit-sheet" role="dialog" aria-labelledby="profile-edit-title">
    <div class="profile-edit-header">
      <h3 id="profile-edit-title">Edit profile</h3>
      <button type="button" class="profile-edit-close" id="profile-edit-cancel">Cancel</button>
    </div>
    <form id="profile-edit-form">
      <div class="profile-edit-field">
        <label for="edit-name">Name</label>
        <input type="text" id="edit-name" name="name" autocomplete="name" required>
      </div>
      <div class="profile-edit-field">
        <label for="edit-phone">Phone <span class="profile-edit-optional">(optional)</span></label>
        <input type="tel" id="edit-phone" name="phone" autocomplete="tel">
      </div>
      <div class="profile-edit-field">
        <label for="edit-email">Email</label>
        <input type="email" id="edit-email" name="email" autocomplete="email" required>
      </div>
      <div class="profile-edit-field">
        <label for="edit-address">Address <span class="profile-edit-optional">(optional)</span></label>
        <input type="text" id="edit-address" name="address" autocomplete="street-address">
      </div>
      <button type="submit" class="profile-edit-save">Save</button>
    </form>
  </div>
</div>`;
}
