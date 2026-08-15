import { createCtaDock } from "./CtaDock.js";

export function createContactPage() {
  const page = document.createElement("section");
  page.className = "contact-page";
  page.id = "contactPage";
  page.hidden = true;

  page.innerHTML = `
    <main class="contact-main" aria-label="Contactez-nous">
      <h1 class="contact-title">CONTACTEZ-NOUS</h1>
      <p class="contact-intro">Veuillez renseigner les informations ci-dessous. Notre service client RACÈLIA se fera un plaisir de vous aider.</p>
      <p class="contact-required-note">*Champs obligatoires</p>

      <form class="contact-form" id="contactForm" action="#" method="post" novalidate>
        <h2 class="contact-section-title">Vos informations</h2>

        <div class="contact-field">
          <label class="contact-label" for="contact-name">Nom <span class="req">*</span></label>
          <input class="contact-input" type="text" id="contact-name" name="name" autocomplete="name" required />
        </div>

        <div class="contact-field">
          <label class="contact-label" for="contact-email">E-mail <span class="req">*</span></label>
          <input class="contact-input" type="email" id="contact-email" name="email" autocomplete="email" required />
        </div>

        <div class="contact-field">
          <label class="contact-label" for="contact-phone">Numéro de téléphone</label>
          <input class="contact-input" type="tel" id="contact-phone" name="phone" autocomplete="tel" />
        </div>

        <h2 class="contact-section-title">Votre demande</h2>

        <div class="contact-field">
          <label class="contact-label" for="contact-subject">Sujet <span class="req">*</span></label>
          <input class="contact-input" type="text" id="contact-subject" name="subject" required />
        </div>

        <div class="contact-field">
          <label class="contact-label" for="contact-message">Votre message <span class="req">*</span></label>
          <textarea class="contact-input contact-textarea" id="contact-message" name="message" rows="5" maxlength="200" required></textarea>
          <p class="contact-counter" id="contactCharCounter">200/200 caractères restants</p>
          <p class="contact-counter" id="contactLineCounter">5/5 lignes restantes</p>
        </div>

        <a class="contact-privacy js-contact-privacy" href="#confidentialite">Confidentialité</a>

        <button type="submit" class="contact-btn" id="contactSubmitBtn" disabled>Envoyer</button>
        <p class="contact-form-status" id="contactFormStatus" role="status"></p>
      </form>
    </main>
  `;

  page.appendChild(createCtaDock({ sectionId: "contactCtaDock", slotId: "contactCtaDockSlot" }));
  return page;
}
