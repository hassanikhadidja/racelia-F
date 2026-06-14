import { eyeShowIcon, eyeHideIcon } from "./icons.js";

export function createAccountPanel() {
  const page = document.createElement("section");
  page.className = "account-page";
  page.id = "accountPage";
  page.hidden = true;

  page.innerHTML = `
    <div class="account-page__inner" role="dialog" aria-modal="true" aria-labelledby="accountTitle">
      <main class="account-main">
        <h1 class="account-title" id="accountTitle">ACCOUNT</h1>

        <div class="account-tabs" role="tablist">
          <button class="account-tab active" type="button" data-tab="signin" role="tab">SIGN IN</button>
          <button class="account-tab" type="button" data-tab="register" role="tab">REGISTER</button>
        </div>

        <section class="account-panel-section active" id="accountSignin">
          <div class="account-welcome">
            <h2>WELCOME BACK.</h2>
            <p>Sign in with your email and password.</p>
          </div>
          <form id="accountSigninForm">
            <div class="account-field">
              <input type="email" id="accountSiEmail" placeholder=" " required />
              <label for="accountSiEmail">Email</label>
            </div>
            <div class="account-field account-field--password">
              <input type="password" id="accountSiPass" placeholder=" " required />
              <label for="accountSiPass">Password</label>
              <button type="button" class="account-password-toggle" aria-label="Show password" aria-pressed="false">
                <span class="account-password-toggle__icon account-password-toggle__icon--show" aria-hidden="true">${eyeShowIcon}</span>
                <span class="account-password-toggle__icon account-password-toggle__icon--hide" aria-hidden="true">${eyeHideIcon}</span>
              </button>
            </div>
            <a href="#" class="account-forgot">Forgot password</a>

            <div class="account-checkbox-row">
              <input type="checkbox" id="accountRemember" class="account-chanel-check" />
              <label for="accountRemember">Remember me (optional)</label>
            </div>
            <p class="account-legal">By signing in, I agree to RACÈLIA's <a href="#">Privacy Policy</a> and <a href="#">Legal Statement</a>.</p>

            <button type="submit" class="account-btn">SIGN IN</button>
          </form>
        </section>

        <section class="account-panel-section" id="accountRegister">
          <p class="account-intro">Creating an international account will allow you to manage your personal information, personalise your experience online and across our selected boutiques around the world, and enjoy faster online checkout.</p>
          <p class="account-intro">If you do not wish to create an account, you will benefit from the RACÈLIA experience as a guest (subject to local regulations).</p>
          <p class="account-mandatory">All fields are mandatory.</p>

          <form id="accountRegisterForm">
            <div class="account-field">
              <input type="text" id="accountName" placeholder=" " required autocomplete="name" />
              <label for="accountName">Name</label>
            </div>
            <div class="account-field">
              <input type="email" id="accountEmail" placeholder=" " required />
              <label for="accountEmail">Email</label>
            </div>
            <div class="account-field">
              <input type="tel" id="accountPhone" placeholder=" " />
              <label for="accountPhone">Phone number (optional)</label>
            </div>
            <div class="account-field account-field--password">
              <input type="password" id="accountPass" placeholder=" " required />
              <label for="accountPass">Password</label>
              <button type="button" class="account-password-toggle" aria-label="Show password" aria-pressed="false">
                <span class="account-password-toggle__icon account-password-toggle__icon--show" aria-hidden="true">${eyeShowIcon}</span>
                <span class="account-password-toggle__icon account-password-toggle__icon--hide" aria-hidden="true">${eyeHideIcon}</span>
              </button>
            </div>
            <h3 class="account-section-title">BRAND COMMUNICATIONS</h3>

            <div class="account-consent-row">
              <input type="checkbox" class="account-chanel-check" id="accountConsent" checked />
              <label for="accountConsent">I consent to RACÈLIA to send me brand communications about new collections, products, services and events through email, phone, SMS and instant messaging.</label>
            </div>

            <div class="account-channels">
              <label><input type="checkbox" class="account-chanel-check" checked /> Email</label>
              <label><input type="checkbox" class="account-chanel-check" /> Phone</label>
              <label><input type="checkbox" class="account-chanel-check" checked /> SMS</label>
              <label><input type="checkbox" class="account-chanel-check" checked /> Instant Messaging</label>
            </div>

            <p class="account-fine">I consent to receive marketing texts (including SMS and MMS) from an automated system from RACÈLIA's corporate offices, at the phone number(s) provided. Standard messaging and data rates may apply.</p>

            <p class="account-ack">By creating a RACÈLIA account you acknowledge that RACÈLIA will collect, process, transfer and store your personal data as described in the <a href="#">Privacy Policy</a>.</p>
            <p class="account-ack">You can withdraw your consents at anytime. For any questions about your rights of access, deletion, objection etc. please contact us at <a href="#">privacy@racelia.com</a>.</p>
            <p class="account-ack">By proceeding, you confirm that you are at or above the age to create an account with RACÈLIA.</p>

            <button type="submit" class="account-btn">CONTINUE</button>
          </form>
        </section>
      </main>
    </div>
  `;

  return page;
}
