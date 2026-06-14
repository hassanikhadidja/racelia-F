export function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-top">
      <div class="accordion">
        <button class="accordion-header" type="button" aria-expanded="false">
          CONTACT AN ADVISOR
          <span class="chevron"></span>
        </button>
        <div class="accordion-body">
          <p>RACÈLIA Client Care is available Monday to Friday, 9 AM to 10 PM ET, Saturday and Sunday 10 AM to 6 PM ET to answer all your questions.</p>
          <p>Please <a href="#">email us</a>, call <a href="#">1.800.550.0005</a> or <a href="#">live chat</a> with a RACÈLIA Advisor.</p>
        </div>
      </div>

      <div class="accordion">
        <button class="accordion-header" type="button" aria-expanded="false">
          FIND A BOUTIQUE
          <span class="chevron"></span>
        </button>
        <div class="accordion-body">
          <p>Enter a location to find the closest RACÈLIA boutiques</p>
          <div class="store-search">
            <input type="text" placeholder="City or zip code" />
            <button class="footer-icon-btn" type="button" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <div class="divider-v"></div>
            <button class="footer-icon-btn" type="button" aria-label="Use my location">
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
          <p>Subscribe to receive news from RACÈLIA</p>
          <button type="button" class="subscribe-link" id="openSubscribe">Subscribe</button>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-inner">
        <div class="brand-logo">RACÈLIA</div>

        <div class="columns">
          <div class="col">
            <h3>Explore RACÈLIA</h3>
            <ul>
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#blogs" class="js-footer-blogs">Métiers d'Art 2026</a></li>
              <li><a href="#">Handbags</a></li>
              <li><a href="#">All Selection</a></li>
              <li><a href="#">#RACÈLIASTYLE</a></li>
            </ul>
            <h3 class="group-title">Handbags</h3>
            <ul>
              <li><a href="#">Mini Bags</a></li>
              <li><a href="#">The RACÈLIA Handbag</a></li>
              <li><a href="#">Moms Bags</a></li>
            </ul>
          </div>

          <div class="col">
            <h3 class="group-title group-title--first">Boutique Services</h3>
            <ul>
              <li><a href="#">Boutiques</a></li>
              <li><a href="#">Book an Appointment</a></li>
            </ul>
          </div>

          <div class="col">
            <h3>Online Services</h3>
            <ul>
              <li><a href="#">Payment Methods</a></li>
              <li><a href="#">Shipping Options</a></li>
              <li><a href="#">My Account</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Care &amp; Services</a></li>
            </ul>
            <h3 class="group-title">The House of RACÈLIA</h3>
            <ul>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Legal</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div class="contrast-row">
          <span>Enable high contrast</span>
          <button class="toggle" id="contrastToggle" type="button" aria-label="Toggle high contrast"></button>
        </div>

        <div class="lang-row">
          <span class="label">Change languages</span>
          <div class="lang-select">
            <select id="footerLangSelect" class="lang-select__native" aria-label="Language">
              <option value="en" selected>English</option>
              <option value="fr">French</option>
            </select>
            <span class="chev" aria-hidden="true"></span>
          </div>
        </div>

        <div class="lang-row currency-row">
          <span class="label">Change currency</span>
          <div class="lang-select">
            <select id="footerCurrencySelect" class="lang-select__native" aria-label="Currency">
              <option value="DZD" selected>Algerian Dinar (DZD)</option>
              <option value="EUR">Euro (€)</option>
              <option value="USD">US Dollar ($)</option>
            </select>
            <span class="chev" aria-hidden="true"></span>
          </div>
        </div>

        <div class="socials">
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
          <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg></a>
          <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2s-.2-1.6-.9-2.3c-.8-.9-1.8-.9-2.2-1C16.7 3.5 12 3.5 12 3.5s-4.7 0-7.9.4c-.4.1-1.4.1-2.2 1C1.2 5.6 1 7.2 1 7.2S.8 9.1.8 11v1.9c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.7.3 7.7.3s4.7 0 7.9-.4c.4-.1 1.4-.1 2.2-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.8 14.6V8.3l6.1 3.2-6.1 3.1z"/></svg></a>
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
      <button class="subscribe-modal-close" id="closeSubscribe" type="button" aria-label="Close"></button>
      <h2 id="subTitle">SUBSCRIBE TO RECEIVE<br/>NEWS FROM RACÈLIA</h2>
      <p class="subscribe-modal-intro">
        Your information may be used by RACÈLIA to personalize your experience online and across select RACÈLIA boutiques. You can opt out anytime using the unsubscribe link at the bottom of each email.<br/>
        All fields are mandatory.
      </p>

      <form id="subscribeForm" novalidate>
        <div class="field">
          <label for="firstName">First name</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>
        <div class="field">
          <label for="lastName">Last name</label>
          <input type="text" id="lastName" name="lastName" required />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>

        <p class="legal">
          By clicking "subscribe," you agree to the RACÈLIA <a href="#">Privacy Policy</a> and <a href="#">Legal Statement</a>. You also confirm that you are of legal age to subscribe.
        </p>

        <button type="submit" class="submit-btn">SUBSCRIBE</button>
      </form>
    </div>
  `;

  const fragment = document.createDocumentFragment();
  fragment.append(footer, subscribeOverlay);
  return fragment;
}
