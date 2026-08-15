import { createCtaDock } from "./CtaDock.js";

export function createReturnsPage() {
  const page = document.createElement("section");
  page.className = "returns-page";
  page.id = "returnsPage";
  page.hidden = true;

  page.innerHTML = `
    <main class="gift-main" aria-label="Commencer un retour, un échange ou une réclamation">
      <h1 class="gift-title">Commencer un retour, un échange ou une réclamation</h1>
      <p class="gift-intro">Entrez vos informations pour retrouver votre commande.</p>

      <form class="gift-form" id="returnsForm" action="#" method="get" novalidate>
        <div class="gift-field gift-request-type">
          <p class="gift-label" id="returnsRequestTypeLabel">Type de demande <span class="req">*</span></p>
          <div class="gift-type-options" role="radiogroup" aria-labelledby="returnsRequestTypeLabel">
            <label class="gift-type-option">
              <input type="radio" name="request_type" value="retour" />
              <span>Retour</span>
            </label>
            <label class="gift-type-option">
              <input type="radio" name="request_type" value="echange" />
              <span>Échange</span>
            </label>
            <label class="gift-type-option">
              <input type="radio" name="request_type" value="reclamation" checked />
              <span>Réclamation</span>
            </label>
          </div>
        </div>

        <h2 class="gift-section-title">Vos coordonnées</h2>

        <div class="gift-field">
          <label class="gift-label" for="returns-name">Nom <span class="req">*</span></label>
          <input class="gift-input" type="text" id="returns-name" name="name" autocomplete="name" required />
        </div>

        <div class="gift-field">
          <label class="gift-label" for="returns-phone">Numéro de téléphone <span class="req">*</span></label>
          <input class="gift-input" type="tel" id="returns-phone" name="phone" autocomplete="tel" required />
        </div>

        <div class="gift-field">
          <label class="gift-label" for="returns-email">Email</label>
          <input class="gift-input" type="email" id="returns-email" name="email" autocomplete="email" />
        </div>

        <div class="gift-field">
          <label class="gift-label" id="returnsWilayaLabel">Wilaya</label>
          <button type="button" class="picker-trigger" id="returnsWilayaTrigger" aria-labelledby="returnsWilayaLabel" aria-haspopup="listbox">
            <span class="picker-value placeholder" id="returnsWilayaDisplay">Sélectionner une wilaya</span>
          </button>
          <input type="hidden" id="returns-wilaya" name="wilaya" />
        </div>

        <div class="gift-field">
          <label class="gift-label" for="returns-comment">Commentaire <span class="req">*</span></label>
          <textarea class="gift-input gift-textarea" id="returns-comment" name="comment" rows="4" required></textarea>
        </div>

        <div class="gift-field">
          <label class="gift-label" for="returns-picture">Photo</label>
          <input class="gift-file-input" type="file" id="returns-picture" name="picture" accept="image/*" />
          <button type="button" class="gift-attach-btn" id="returnsAttachBtn">Joindre une photo</button>
          <p class="gift-file-name" id="returnsPictureName" hidden></p>
        </div>

        <button type="submit" class="gift-btn" id="returnsSubmitBtn" disabled>Envoyer la demande</button>
        <p class="gift-form-status" id="returnsFormStatus" role="status"></p>
      </form>

      <hr class="gift-footer-rule" />
      <a class="gift-policy-link js-returns-policy" href="#conditions">Politique de retour/réclamation</a>
    </main>

    <div class="picker-overlay" id="returnsPickerOverlay" aria-hidden="true">
      <div class="picker-sheet" role="dialog" aria-modal="true" aria-labelledby="returnsPickerTitle">
        <div class="picker-handle" aria-hidden="true"></div>
        <div class="picker-header">
          <h3 id="returnsPickerTitle">Sélectionner une wilaya</h3>
          <button type="button" class="picker-close" id="returnsPickerClose" aria-label="Fermer">×</button>
        </div>
        <div class="picker-search-wrap">
          <input type="search" class="picker-search" id="returnsPickerSearch" placeholder="Rechercher une wilaya…" autocomplete="off" />
        </div>
        <ul class="picker-list" id="returnsPickerList" role="listbox"></ul>
      </div>
    </div>
  `;

  page.appendChild(createCtaDock({ sectionId: "returnsCtaDock", slotId: "returnsCtaDockSlot" }));
  return page;
}
