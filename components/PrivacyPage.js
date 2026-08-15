import { createCtaDock } from "./CtaDock.js";

export function createPrivacyPage() {
  const page = document.createElement("section");
  page.className = "privacy-page";
  page.id = "privacyPage";
  page.hidden = true;

  page.innerHTML = `
    <main class="privacy-main" aria-label="Politique de confidentialité">
      <h1>Politique de confidentialité</h1>
      <p class="privacy-effective">Date de dernière mise à jour : 14 août 2026</p>

      <div class="privacy-toc">
        <h3>Sur cette page</h3>
        <ol>
          <li><a href="#privacy-intro">Introduction</a></li>
          <li><a href="#privacy-scope">Champ d'application</a></li>
          <li><a href="#privacy-kids">Protection des mineurs</a></li>
          <li><a href="#privacy-collect">Les informations que nous collectons</a></li>
          <li><a href="#privacy-cookies">Cookies et technologies similaires</a></li>
          <li><a href="#privacy-why">Pourquoi nous collectons vos informations</a></li>
          <li><a href="#privacy-disclose">Partage de vos données</a></li>
          <li><a href="#privacy-ads">Publicité et personnalisation</a></li>
          <li><a href="#privacy-automated">Décisions automatisées</a></li>
          <li><a href="#privacy-retention">Durée de conservation des données</a></li>
          <li><a href="#privacy-choices">Vos choix</a></li>
          <li><a href="#privacy-international">Utilisateurs hors d'Algérie</a></li>
          <li><a href="#privacy-links">Liens vers des sites tiers</a></li>
          <li><a href="#privacy-security">Sécurité</a></li>
          <li><a href="#privacy-rights">Vos droits en matière de confidentialité</a></li>
          <li><a href="#privacy-changes">Modifications de cette politique</a></li>
          <li><a href="#privacy-contact">Nous contacter</a></li>
        </ol>
      </div>

      <h2 id="privacy-intro">1. Introduction</h2>
      <p>Chez RACÈLIA, nous accordons une grande importance à la protection de vos données personnelles.</p>
      <p>La présente Politique de confidentialité explique quelles informations nous collectons, pourquoi nous les collectons, comment elles sont utilisées et les choix dont vous disposez concernant vos données.</p>

      <h2 id="privacy-scope">2. Champ d'application</h2>
      <p>Cette politique s'applique à notre site internet ainsi qu'à l'ensemble des services proposés par RACÈLIA (boutique en ligne, compte client, liste d'envies, commandes et services associés).</p>

      <h2 id="privacy-kids">3. Protection des mineurs</h2>
      <p>Notre site est destiné aux adultes souhaitant découvrir et acheter les sacs et accessoires RACÈLIA.</p>
      <p>Nous ne collectons pas volontairement de données personnelles auprès de mineurs sans l'autorisation de leurs parents ou représentants légaux.</p>

      <h2 id="privacy-collect">4. Les informations que nous collectons</h2>
      <p>Selon votre utilisation du site, nous pouvons collecter les informations suivantes :</p>
      <ul>
        <li>Les informations que vous nous fournissez, telles que votre nom, votre adresse e-mail, votre numéro de téléphone, votre adresse de livraison et les informations nécessaires au traitement de votre commande.</li>
        <li>Les informations collectées automatiquement, telles que votre adresse IP, le type d'appareil utilisé, votre navigateur et votre navigation sur notre site.</li>
        <li>Les informations provenant de partenaires, notamment les transporteurs ou les prestataires de paiement nécessaires au traitement de vos commandes.</li>
      </ul>

      <h2 id="privacy-cookies">5. Cookies et technologies similaires</h2>
      <p>Nous utilisons des cookies afin de :</p>
      <ul>
        <li>mémoriser votre panier ;</li>
        <li>enregistrer vos préférences (par exemple la devise) ;</li>
        <li>améliorer votre expérience de navigation ;</li>
        <li>analyser l'utilisation de notre site.</li>
      </ul>
      <p>Vous pouvez modifier les paramètres des cookies directement depuis votre navigateur.</p>

      <h2 id="privacy-why">6. Pourquoi nous collectons vos informations</h2>
      <p>Vos données sont utilisées afin de :</p>
      <ul>
        <li>traiter vos commandes ;</li>
        <li>assurer le service après-vente ;</li>
        <li>livrer vos produits ;</li>
        <li>répondre à vos demandes ;</li>
        <li>améliorer nos services ;</li>
        <li>vous envoyer des offres promotionnelles si vous y avez consenti ;</li>
        <li>prévenir les fraudes ;</li>
        <li>respecter nos obligations légales.</li>
      </ul>

      <h2 id="privacy-disclose">7. Partage de vos données</h2>
      <p>Vos informations peuvent être communiquées uniquement aux partenaires nécessaires au bon fonctionnement de nos services, notamment :</p>
      <ul>
        <li>les sociétés de livraison ;</li>
        <li>les prestataires de paiement ;</li>
        <li>les fournisseurs de services techniques ;</li>
        <li>les outils d'analyse de notre site.</li>
      </ul>
      <p>RACÈLIA ne vend jamais vos données personnelles à des tiers.</p>

      <h2 id="privacy-ads">8. Publicité et personnalisation</h2>
      <p>Nous pouvons utiliser certaines informations afin de vous proposer des offres, promotions ou recommandations adaptées à vos centres d'intérêt.</p>
      <p>Vous pouvez à tout moment vous désinscrire de nos communications promotionnelles.</p>

      <h2 id="privacy-automated">9. Décisions automatisées</h2>
      <p>Certaines opérations automatisées peuvent être utilisées pour détecter les commandes suspectes ou améliorer nos recommandations de produits.</p>
      <p>Ces outils assistent notre équipe mais ne remplacent pas une vérification humaine lorsque cela est nécessaire.</p>

      <h2 id="privacy-retention">10. Durée de conservation des données</h2>
      <p>Nous conservons vos données personnelles uniquement pendant la durée nécessaire au traitement de vos commandes, au respect de nos obligations légales ou à la gestion de notre relation commerciale.</p>
      <p>Lorsque ces informations ne sont plus nécessaires, elles sont supprimées ou rendues anonymes.</p>

      <h2 id="privacy-choices">11. Vos choix</h2>
      <p>Vous pouvez à tout moment :</p>
      <ul>
        <li>modifier les informations de votre compte ;</li>
        <li>demander la suppression de votre compte ;</li>
        <li>vous désinscrire des e-mails promotionnels ;</li>
        <li>gérer les cookies via votre navigateur.</li>
      </ul>

      <h2 id="privacy-international">12. Utilisateurs hors d'Algérie</h2>
      <p>Notre site est principalement destiné aux utilisateurs situés en Algérie.</p>
      <p>Si vous accédez au site depuis un autre pays, vos données seront traitées conformément à la législation algérienne.</p>

      <h2 id="privacy-links">13. Liens vers des sites tiers</h2>
      <p>Notre site peut contenir des liens vers d'autres sites internet.</p>
      <p>RACÈLIA n'est pas responsable de leurs pratiques en matière de confidentialité. Nous vous invitons à consulter leurs politiques respectives.</p>

      <h2 id="privacy-security">14. Sécurité</h2>
      <p>Nous mettons en œuvre des mesures techniques et organisationnelles afin de protéger vos données personnelles contre tout accès non autorisé, toute perte ou toute utilisation abusive.</p>
      <p>Toutefois, aucune méthode de transmission ou de stockage des données ne peut garantir une sécurité absolue.</p>

      <h2 id="privacy-rights">15. Vos droits en matière de confidentialité</h2>
      <p>Vous pouvez nous contacter afin de :</p>
      <ul>
        <li>connaître les données personnelles que nous détenons à votre sujet ;</li>
        <li>demander leur correction ;</li>
        <li>demander leur suppression lorsque cela est légalement possible ;</li>
        <li>vous opposer à certaines utilisations de vos données.</li>
      </ul>

      <h3>Catégories de données collectées</h3>
      <table class="privacy-table">
        <thead>
          <tr>
            <th>Catégorie</th>
            <th>Utilisation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Informations d'identification (nom, e-mail, téléphone, adresse)</td>
            <td>Traitement des commandes, livraison et service client</td>
          </tr>
          <tr>
            <td>Historique des commandes</td>
            <td>Gestion des achats et service après-vente</td>
          </tr>
          <tr>
            <td>Données de navigation (adresse IP, navigateur, appareil)</td>
            <td>Analyse du site et amélioration des services</td>
          </tr>
          <tr>
            <td>Préférences d'achat</td>
            <td>Personnalisation des offres et recommandations</td>
          </tr>
          <tr>
            <td>Données sensibles (biométriques, médicales, etc.)</td>
            <td><strong>RACÈLIA ne collecte pas ce type de données.</strong></td>
          </tr>
        </tbody>
      </table>

      <h2 id="privacy-changes">16. Modifications de cette politique</h2>
      <p>RACÈLIA peut modifier la présente Politique de confidentialité à tout moment.</p>
      <p>La version mise à jour sera publiée sur cette page avec sa nouvelle date de mise à jour.</p>

      <h2 id="privacy-contact">17. Nous contacter</h2>
      <p>Pour toute question concernant cette Politique de confidentialité ou le traitement de vos données personnelles, vous pouvez nous contacter :</p>
      <div class="privacy-contact-block">
        <strong>RACÈLIA</strong><br />
        Service Client<br />
        E-mail : <a href="mailto:privacy@racelia.com">privacy@racelia.com</a>
      </div>
    </main>
  `;

  page.appendChild(createCtaDock({ sectionId: "privacyCtaDock", slotId: "privacyCtaDockSlot" }));
  return page;
}
