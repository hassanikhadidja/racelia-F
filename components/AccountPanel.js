import { eyeShowIcon, eyeHideIcon } from "./icons.js";

export function createAccountPanel() {
  const page = document.createElement("section");
  page.className = "account-page";
  page.id = "accountPage";
  page.hidden = true;

  page.innerHTML = `
    <div class="account-page__inner" role="dialog" aria-modal="true" aria-labelledby="accountTitle">
      <main class="account-main">
        <h1 class="account-title" id="accountTitle">COMPTE</h1>

        <div class="account-tabs" role="tablist">
          <button class="account-tab active" type="button" data-tab="signin" role="tab">CONNEXION</button>
          <button class="account-tab" type="button" data-tab="register" role="tab">INSCRIPTION</button>
        </div>

        <section class="account-panel-section active" id="accountSignin">
          <div class="account-welcome">
            <h2>BON RETOUR.</h2>
            <p>Connectez-vous avec votre e-mail et votre mot de passe.</p>
          </div>
          <form id="accountSigninForm">
            <div class="account-field">
              <input type="email" id="accountSiEmail" placeholder=" " required />
              <label for="accountSiEmail">E-mail</label>
            </div>
            <div class="account-field account-field--password">
              <input type="password" id="accountSiPass" placeholder=" " required />
              <label for="accountSiPass">Mot de passe</label>
              <button type="button" class="account-password-toggle" aria-label="Afficher le mot de passe" aria-pressed="false">
                <span class="account-password-toggle__icon account-password-toggle__icon--show" aria-hidden="true">${eyeShowIcon}</span>
                <span class="account-password-toggle__icon account-password-toggle__icon--hide" aria-hidden="true">${eyeHideIcon}</span>
              </button>
            </div>
            <a href="#" class="account-forgot">Mot de passe oublié</a>

            <div class="account-checkbox-row">
              <input type="checkbox" id="accountRemember" class="account-chanel-check" />
              <label for="accountRemember">Se souvenir de moi (facultatif)</label>
            </div>
            <p class="account-legal">En me connectant, j'accepte la <a href="#confidentialite" class="js-account-privacy">Politique de confidentialité</a> et les <a href="#conditions" class="js-account-terms">Conditions d'utilisation</a> de RACÈLIA.</p>

            <button type="submit" class="account-btn">SE CONNECTER</button>
          </form>
        </section>

        <section class="account-panel-section" id="accountRegister">
          <p class="account-intro">La création d'un compte international vous permettra de gérer vos informations personnelles, de personnaliser votre expérience en ligne et dans nos boutiques sélectionnées à travers le monde, et de profiter d'un paiement en ligne plus rapide.</p>
          <p class="account-intro">Si vous ne souhaitez pas créer de compte, vous bénéficierez de l'expérience RACÈLIA en tant qu'invité (sous réserve des réglementations locales).</p>
          <p class="account-mandatory">Tous les champs sont obligatoires.</p>

          <form id="accountRegisterForm">
            <div class="account-field">
              <input type="text" id="accountName" placeholder=" " required autocomplete="name" />
              <label for="accountName">Nom</label>
            </div>
            <div class="account-field">
              <input type="email" id="accountEmail" placeholder=" " required />
              <label for="accountEmail">E-mail</label>
            </div>
            <div class="account-field">
              <input type="tel" id="accountPhone" placeholder=" " />
              <label for="accountPhone">Numéro de téléphone (facultatif)</label>
            </div>
            <div class="account-field account-field--password">
              <input type="password" id="accountPass" placeholder=" " required />
              <label for="accountPass">Mot de passe</label>
              <button type="button" class="account-password-toggle" aria-label="Afficher le mot de passe" aria-pressed="false">
                <span class="account-password-toggle__icon account-password-toggle__icon--show" aria-hidden="true">${eyeShowIcon}</span>
                <span class="account-password-toggle__icon account-password-toggle__icon--hide" aria-hidden="true">${eyeHideIcon}</span>
              </button>
            </div>
            <h3 class="account-section-title">COMMUNICATIONS DE LA MARQUE</h3>

            <div class="account-consent-row">
              <input type="checkbox" class="account-chanel-check" id="accountConsent" checked />
              <label for="accountConsent">J'accepte que RACÈLIA m'envoie des communications de la marque concernant les nouvelles collections, produits, services et événements par e-mail, téléphone, SMS et messagerie instantanée.</label>
            </div>

            <div class="account-channels">
              <label><input type="checkbox" class="account-chanel-check" checked /> E-mail</label>
              <label><input type="checkbox" class="account-chanel-check" /> Téléphone</label>
              <label><input type="checkbox" class="account-chanel-check" checked /> SMS</label>
              <label><input type="checkbox" class="account-chanel-check" checked /> Messagerie instantanée</label>
            </div>

            <p class="account-fine">J'accepte de recevoir des messages marketing (y compris SMS et MMS) issus d'un système automatisé des bureaux de RACÈLIA, aux numéros de téléphone fournis. Des frais de messagerie et de données standard peuvent s'appliquer.</p>

            <p class="account-ack">En créant un compte RACÈLIA, vous reconnaissez que RACÈLIA collectera, traitera, transférera et stockera vos données personnelles comme décrit dans la <a href="#">Politique de confidentialité</a>.</p>
            <p class="account-ack">Vous pouvez retirer vos consentements à tout moment. Pour toute question concernant vos droits d'accès, de suppression, d'opposition, etc., veuillez nous contacter à <a href="mailto:privacy@racelia.com">privacy@racelia.com</a>.</p>
            <p class="account-ack">En continuant, vous confirmez avoir l'âge requis pour créer un compte auprès de RACÈLIA.</p>

            <button type="submit" class="account-btn">CONTINUER</button>
          </form>
        </section>
      </main>
    </div>
  `;

  return page;
}
