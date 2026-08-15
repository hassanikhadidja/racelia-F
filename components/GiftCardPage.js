import { createCtaDock } from "./CtaDock.js";

export const GIFT_CARD_HERO =
  "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1786811909/Design_sans_titre_-_2026-08-15T173821.490_vg0cpu.png";

export function createGiftCardPage() {
  const page = document.createElement("section");
  page.className = "gift-card-page";
  page.id = "giftCardPage";
  page.hidden = true;

  page.innerHTML = `
    <div class="gift-card-hero">
      <img src="${GIFT_CARD_HERO}" alt="Carte cadeau électronique RACÈLIA" />
    </div>
    <main class="gift-card-main" aria-label="Carte cadeau électronique RACÈLIA">
      <h1 class="gift-card-title">CARTE CADEAU ÉLECTRONIQUE</h1>
      <div class="gift-card-copy">
        <p>Choisissez le montant de votre carte cadeau, ajoutez un message personnalisé et indiquez les coordonnées du destinataire. Nous le contacterons directement pour lui transmettre les informations de la carte cadeau, de préférence par téléphone ou, si nécessaire, par e-mail.</p>
        <p>Les cartes cadeaux électroniques RACÈLIA peuvent être utilisées exclusivement sur notre site pour acheter les sacs et produits RACÈLIA disponibles en ligne.</p>
        <p>Veuillez noter que les cartes cadeaux électroniques ne sont ni remboursables ni échangeables contre de l'argent. Elles doivent être utilisées conformément aux conditions de vente RACÈLIA.</p>
        <p>Le solde de la carte cadeau ne peut pas être converti en espèces. La carte cadeau est valable selon les conditions indiquées lors de l'achat.</p>
      </div>

      <form class="gift-card-wizard" id="giftCardForm" novalidate>
        <div class="gift-card-stepper" role="list" aria-label="Étapes">
          <button type="button" class="gift-card-step is-active" data-step="1" role="listitem" aria-current="step">1</button>
          <span class="gift-card-step-line" aria-hidden="true"></span>
          <button type="button" class="gift-card-step" data-step="2" role="listitem">2</button>
          <span class="gift-card-step-line" aria-hidden="true"></span>
          <button type="button" class="gift-card-step" data-step="3" role="listitem">3</button>
        </div>

        <section class="gift-card-panel is-active" data-panel="1">
          <h2 class="gift-card-heading">CHOISIR UN MONTANT</h2>
          <p class="gift-card-currency-label">Devise</p>
          <div class="gift-card-currencies" role="radiogroup" aria-label="Devise">
            <button type="button" class="gift-card-chip is-selected" data-currency="DZD" aria-pressed="true">DZD</button>
            <button type="button" class="gift-card-chip" data-currency="EUR" aria-pressed="false">EUR</button>
            <button type="button" class="gift-card-chip" data-currency="USD" aria-pressed="false">USD</button>
          </div>
          <div class="gift-card-amounts" id="giftCardAmounts" role="radiogroup" aria-label="Montant"></div>
          <div class="gift-card-custom">
            <span class="gift-card-custom-prefix" id="giftCardPrefix">DA</span>
            <input type="text" inputmode="decimal" id="giftCardCustomAmount" name="custom_amount" placeholder="Autre montant" autocomplete="off" />
          </div>
          <button type="button" class="gift-card-btn" id="giftCardNext1" disabled>SUIVANT</button>
        </section>

        <section class="gift-card-panel" data-panel="2" hidden>
          <h2 class="gift-card-heading">AJOUTER UN MESSAGE PERSONNEL</h2>
          <div class="gift-card-underline-field">
            <input type="text" id="giftCardSender" name="sender" placeholder="Nom de l'expéditeur" maxlength="80" autocomplete="name" />
          </div>
          <div class="gift-card-underline-field">
            <input type="text" id="giftCardRecipient" name="recipient" placeholder="Nom du destinataire" maxlength="80" autocomplete="off" />
          </div>
          <div class="gift-card-underline-field">
            <textarea id="giftCardMessage" name="message" placeholder="Écrivez votre message" rows="3" maxlength="180"></textarea>
            <p class="gift-card-counter" id="giftCardCounter">180/180 caractères restants · 5/5 lignes restantes</p>
          </div>
          <button type="button" class="gift-card-btn" id="giftCardNext2" disabled>SUIVANT</button>
        </section>

        <section class="gift-card-panel" data-panel="3" hidden>
          <h2 class="gift-card-heading">ENVOYER PAR E-MAIL</h2>
          <p class="gift-card-lead">Saisissez l'e-mail du destinataire ci-dessous.</p>
          <div class="gift-card-underline-field">
            <label class="gift-card-float-label" for="giftCardEmail">E-mail du destinataire</label>
            <input type="email" id="giftCardEmail" name="email" autocomplete="email" />
          </div>
          <button type="submit" class="gift-card-btn" id="giftCardAddToBag" disabled>AJOUTER AU PANIER</button>
        </section>
      </form>
    </main>
  `;

  page.appendChild(createCtaDock({ sectionId: "giftCardCtaDock", slotId: "giftCardCtaDockSlot" }));
  return page;
}
