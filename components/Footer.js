export function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-top">
      <div class="accordion">
        <button class="accordion-header" type="button" aria-expanded="false">
          CONTACTER UN CONSEILLER
          <span class="chevron"></span>
        </button>
        <div class="accordion-body">
          <p>Le Service Client RACÈLIA est disponible du samedi au jeudi, de 9 h à 22 h, et le vendredi à partir de 14 h 30, pour répondre à toutes vos questions.</p>
          <p>Veuillez <a href="#contact" class="js-footer-contact">nous écrire</a>, appeler le <a href="tel:+21300000000">+213 00 00 000 00</a> ou <a href="https://wa.me/21300000000?text=${encodeURIComponent("Bonjour, je souhaite discuter avec un conseiller RACÈLIA.")}" class="js-footer-whatsapp" target="_blank" rel="noopener noreferrer">discuter en direct</a> avec un Conseiller RACÈLIA.</p>
        </div>
      </div>

      <div class="accordion">
        <button class="accordion-header" type="button" aria-expanded="false">
          TROUVER UNE BOUTIQUE
          <span class="chevron"></span>
        </button>
        <div class="accordion-body">
          <p>Saisissez un lieu pour trouver les points de vente partenaires RACÈLIA les plus proches.</p>
          <div class="store-search">
            <input type="text" placeholder="Ville ou code postal" />
            <button class="footer-icon-btn" type="button" aria-label="Rechercher">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <div class="divider-v"></div>
            <button class="footer-icon-btn" type="button" aria-label="Utiliser ma position">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="accordion open">
        <button class="accordion-header" type="button" aria-expanded="true">
          NEWSLETTER
          <span class="chevron"></span>
        </button>
        <div class="accordion-body">
          <p>Abonnez-vous pour recevoir les actualités de RACÈLIA</p>
          <button type="button" class="subscribe-link" id="openSubscribe">S'abonner</button>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-inner">
        <div class="brand-logo">RACÈLIA</div>

        <div class="columns">
          <div class="col">
            <h3>Explorer RACÈLIA</h3>
            <ul>
              <li><a href="#">Nouveautés</a></li>
              <li><a href="#blogs" class="js-footer-blogs">Métiers d'Art 2026</a></li>
              <li><a href="#">Toute la sélection</a></li>
              <li><a href="#carte-cadeau" class="js-footer-gift-card">Carte cadeau électronique RACÈLIA</a></li>
              <li><a href="#raceliastyle" class="js-footer-style">#RACÈLIASTYLE</a></li>
            </ul>
            <h3 class="group-title">Sacs</h3>
            <ul>
              <li><a href="#">Mini sacs</a></li>
              <li><a href="#">Le sac RACÈLIA</a></li>
              <li><a href="#">Sacs Mom</a></li>
            </ul>
          </div>

          <div class="col">
            <h3>Services en ligne</h3>
            <ul>
              <li><a href="#">Modes de paiement</a></li>
              <li><a href="#livraison" class="js-footer-shipping">Options de livraison</a></li>
              <li><a href="#account" class="js-footer-account">Mon compte</a></li>
              <li><a href="#retours" class="js-footer-returns">Retours</a></li>
              <li><a href="#faq" class="js-footer-faq">FAQ</a></li>
            </ul>
            <h3 class="group-title">La Maison RACÈLIA</h3>
            <ul>
              <li><a href="#">Carrières</a></li>
              <li><a href="#conditions" class="js-footer-terms">Conditions d'utilisation</a></li>
              <li><a href="#confidentialite" class="js-footer-privacy">Confidentialité</a></li>
              <li><a href="#boutiques" class="js-footer-boutiques">Boutiques</a></li>
            </ul>
          </div>
        </div>

        <div class="contrast-row">
          <span>Activer le contraste élevé</span>
          <button class="toggle" id="contrastToggle" type="button" aria-label="Basculer le contraste élevé"></button>
        </div>

        <div class="lang-row">
          <span class="label">Changer de langue</span>
          <div class="lang-select">
            <select id="footerLangSelect" class="lang-select__native" aria-label="Langue">
              <option value="en">English</option>
              <option value="fr" selected>Français</option>
            </select>
            <span class="chev" aria-hidden="true"></span>
          </div>
        </div>

        <div class="lang-row currency-row">
          <span class="label">Changer de devise</span>
          <div class="lang-select">
            <select id="footerCurrencySelect" class="lang-select__native" aria-label="Devise">
              <option value="DZD" selected>Dinar algérien (DZD)</option>
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar américain ($)</option>
            </select>
            <span class="chev" aria-hidden="true"></span>
          </div>
        </div>

        <div class="socials">
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
          <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg></a>
          <a href="#" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 7.8a5.5 5.5 0 0 1-3.2-1V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v2.7a2.8 2.8 0 1 0 2 2.7V2.5h2.6a5.5 5.5 0 0 0 3.2 3.5v1.8z"/></svg></a>
          <a href="#" aria-label="Pinterest"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.2-2 0-2.9.2-.8 1.3-5.4 1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.5 1.9 1.5 1.9 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.8-4.2-4.3-4.2-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.2c0 .2-.2.2-.3.1-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2-.5-2.4-1.2l-.6 2.5c-.2.9-.9 2-1.3 2.7 1 .3 2 .5 3.1.5 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg></a>
          <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5V9h3v10zM6.5 7.7A1.7 1.7 0 1 1 6.5 4.3a1.7 1.7 0 0 1 0 3.4zM19 19h-3v-5c0-1.2-.5-2-1.6-2-.9 0-1.4.6-1.6 1.2-.1.2-.1.5-.1.8V19h-3V9h3v1.3c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1V19z"/></svg></a>
        </div>
      </div>
    </div>
  `;

  const subscribeOverlay = document.createElement("div");
  subscribeOverlay.className = "subscribe-overlay";
  subscribeOverlay.id = "subscribeModal";
  subscribeOverlay.setAttribute("role", "dialog");
  subscribeOverlay.setAttribute("aria-modal", "true");
  subscribeOverlay.setAttribute("aria-labelledby", "subTitle");
  subscribeOverlay.innerHTML = `
    <div class="subscribe-modal">
      <button class="subscribe-modal-close" id="closeSubscribe" type="button" aria-label="Fermer"></button>
      <h2 id="subTitle">S'ABONNER POUR RECEVOIR<br/>LES ACTUALITÉS DE RACÈLIA</h2>
      <p class="subscribe-modal-intro">
        Vos informations peuvent être utilisées par RACÈLIA pour personnaliser votre expérience en ligne et dans certaines boutiques RACÈLIA. Vous pouvez vous désabonner à tout moment via le lien de désinscription en bas de chaque e-mail.<br/>
        Tous les champs sont obligatoires.
      </p>

      <form id="subscribeForm" novalidate>
        <div class="field">
          <label for="lastName">Nom</label>
          <input type="text" id="lastName" name="lastName" required />
        </div>
        <div class="field">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" required />
        </div>

        <p class="legal">
          En cliquant sur « s'abonner », vous acceptez la <a href="#confidentialite" class="js-footer-privacy">Politique de confidentialité</a> et les <a href="#conditions" class="js-footer-terms">Conditions d'utilisation</a> de RACÈLIA. Vous confirmez également avoir l'âge légal pour vous abonner.
        </p>

        <button type="submit" class="submit-btn">S'ABONNER</button>
      </form>
    </div>
  `;

  const fragment = document.createDocumentFragment();
  fragment.append(footer, subscribeOverlay);
  return fragment;
}
