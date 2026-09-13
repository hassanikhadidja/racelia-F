import { createCtaDock } from "./CtaDock.js";

export function createAboutPage() {
  const page = document.createElement("section");
  page.className = "about-page";
  page.id = "aboutPage";
  page.hidden = true;

  page.innerHTML = `
    <main class="about-main" aria-label="About RACÈLIA">
      <p class="about-eyebrow">La Maison</p>
      <h1>ABOUT RACÈLIA</h1>
      <p>RACÈLIA est une maison de création dédiée à l'élégance, à la matière et aux savoir-faire. Chaque pièce est pensée comme un objet de caractère, entre héritage artisanal et allure contemporaine.</p>
      <p>La collection Métiers d'Art 2026 prolonge cette exigence : des sacs, des détails précieux et une silhouette immédiate, destinés à accompagner le quotidien comme les grands moments.</p>
      <p>De la femme à l'homme, des enfants à la mariée et au hammam, RACÈLIA imagine des univers distincts, unis par le même soin du geste.</p>

      <h2>La Maison</h2>
      <ul class="about-links">
        <li><a href="#contact" class="js-footer-contact">Nous contacter</a></li>
        <li><a href="#boutiques" class="js-footer-boutiques">Boutiques</a></li>
        <li><a href="#faq" class="js-footer-faq">FAQ</a></li>
        <li><a href="#livraison" class="js-footer-shipping">Livraison</a></li>
        <li><a href="#conditions" class="js-footer-terms">Conditions d'utilisation</a></li>
        <li><a href="#confidentialite" class="js-footer-privacy">Confidentialité</a></li>
      </ul>
    </main>
  `;

  page.appendChild(createCtaDock({ sectionId: "aboutCtaDock", slotId: "aboutCtaDockSlot" }));
  return page;
}