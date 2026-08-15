import { createCtaDock } from "./CtaDock.js";

export function createTermsPage() {
  const page = document.createElement("section");
  page.className = "terms-page";
  page.id = "termsPage";
  page.hidden = true;

  page.innerHTML = `
    <main class="terms-main" aria-label="Conditions d'utilisation">
      <h1>Conditions d'utilisation</h1>
      <p class="terms-effective">Date d'entrée en vigueur : 14 août 2026</p>

      <div class="terms-notice">
        Avis important : En utilisant le site RACÈLIA, vous acceptez les présentes Conditions d'utilisation. Nous vous invitons à les lire attentivement avant d'utiliser nos services.
      </div>

      <div class="terms-toc">
        <h3>Sur cette page</h3>
        <ol>
          <li><a href="#terms-welcome">Bienvenue chez RACÈLIA</a></li>
          <li><a href="#terms-eligibility">Conditions d'accès</a></li>
          <li><a href="#terms-changes">Modification des conditions</a></li>
          <li><a href="#terms-accounts">Votre compte</a></li>
          <li><a href="#terms-conduct">Utilisation du site</a></li>
          <li><a href="#terms-orders">Commandes et prix</a></li>
          <li><a href="#terms-egift">Cartes cadeaux électroniques</a></li>
          <li><a href="#terms-shipping">Livraison</a></li>
          <li><a href="#terms-returns">Retours et échanges</a></li>
          <li><a href="#terms-content">Contenu partagé</a></li>
          <li><a href="#terms-ip">Propriété intellectuelle</a></li>
          <li><a href="#terms-disclaimer">Absence de garantie</a></li>
          <li><a href="#terms-liability">Limitation de responsabilité</a></li>
          <li><a href="#terms-disputes">Résolution des litiges</a></li>
          <li><a href="#terms-general">Dispositions générales</a></li>
          <li><a href="#terms-contact">Nous contacter</a></li>
        </ol>
      </div>

      <h2 id="terms-welcome">1. Bienvenue chez RACÈLIA</h2>
      <p>Les présentes Conditions d'utilisation constituent un accord entre vous et RACÈLIA concernant l'utilisation de notre site internet ainsi que de l'ensemble des services, fonctionnalités et contenus que nous proposons.</p>
      <p>En accédant au site, en créant un compte ou en passant une commande, vous acceptez les présentes Conditions d'utilisation.</p>
      <p>Si vous utilisez nos services au nom d'une entreprise ou d'une organisation, vous confirmez être autorisé à accepter ces conditions en son nom.</p>

      <h2 id="terms-eligibility">2. Conditions d'accès</h2>
      <p>L'utilisation de notre site est réservée aux personnes âgées d'au moins 18 ans ou aux mineurs utilisant le site sous la responsabilité d'un parent ou d'un représentant légal.</p>

      <h2 id="terms-changes">3. Modification des conditions</h2>
      <p>RACÈLIA peut modifier les présentes Conditions d'utilisation à tout moment afin de tenir compte de l'évolution de ses services ou de la réglementation applicable.</p>
      <p>Les nouvelles conditions seront publiées sur cette page avec leur date d'entrée en vigueur. En continuant à utiliser le site après leur publication, vous acceptez ces modifications.</p>

      <h2 id="terms-accounts">4. Votre compte</h2>
      <p>La création d'un compte peut être nécessaire pour effectuer une commande, suivre vos achats ou enregistrer vos produits favoris dans votre liste d'envies.</p>
      <p>Vous êtes responsable de la confidentialité de vos identifiants de connexion ainsi que de toutes les activités réalisées depuis votre compte.</p>
      <p>Si vous pensez que votre compte a été utilisé sans votre autorisation, veuillez nous contacter immédiatement.</p>

      <h2 id="terms-conduct">5. Utilisation du site</h2>
      <p>Afin d'assurer le bon fonctionnement de notre site, vous vous engagez à ne pas :</p>
      <ul>
        <li>revendre ou exploiter commercialement nos services sans notre autorisation écrite ;</li>
        <li>copier, reproduire ou modifier tout ou partie du site sans autorisation ;</li>
        <li>tenter d'accéder au compte d'un autre utilisateur ;</li>
        <li>utiliser des robots, scripts ou outils automatisés pour collecter les données du site ;</li>
        <li>introduire des virus, logiciels malveillants ou tout autre programme nuisible ;</li>
        <li>utiliser le site à des fins illégales ou portant atteinte aux droits d'autrui.</li>
      </ul>
      <p>En cas de non-respect de ces règles, RACÈLIA se réserve le droit de suspendre ou de supprimer l'accès au site.</p>

      <h2 id="terms-orders">6. Commandes et prix</h2>
      <p>Les prix affichés sur le site sont indiqués en dinars algériens (DZD). Une conversion peut être proposée à titre indicatif dans d'autres devises.</p>
      <p>Toute commande est soumise à la disponibilité des produits et à la validation par RACÈLIA.</p>
      <p>Malgré le soin apporté à nos informations, des erreurs de prix, de description ou de disponibilité peuvent exceptionnellement survenir. RACÈLIA se réserve le droit de les corriger et, si nécessaire, d'annuler une commande après avoir informé le client.</p>
      <p>Les commandes de cartes cadeaux électroniques sont également régies par l'article 7 des présentes Conditions.</p>

      <h2 id="terms-egift">7. Cartes cadeaux électroniques</h2>
      <p>La carte cadeau électronique RACÈLIA est un avoir numérique permettant d'acheter exclusivement, sur le site RACÈLIA, les sacs et produits RACÈLIA disponibles en ligne. Elle ne constitue ni un instrument de paiement au porteur, ni un compte bancaire, ni une monnaie électronique au sens de la réglementation applicable.</p>
      <p>En achetant une carte cadeau électronique, vous acceptez les présentes Conditions ainsi que les informations communiquées lors de l'achat. L'achat est réservé aux personnes âgées d'au moins 18 ans.</p>
      <p>Le montant choisi est débité selon le mode de paiement sélectionné au moment de la commande. La carte n'est émise qu'après validation et paiement effectif de la commande, le cas échéant.</p>
      <p>Vous devez indiquer avec exactitude le nom et les coordonnées du destinataire. RACÈLIA transmet les informations de la carte cadeau au destinataire, de préférence par téléphone ou, si nécessaire, par e-mail. RACÈLIA n'est pas responsable d'une transmission échouée ou erronée lorsque les coordonnées fournies sont inexactes, incomplètes ou hors d'usage.</p>
      <p>Une fois les informations de la carte transmises au destinataire, le risque de perte, de divulgation ou d'utilisation non autorisée est transféré à l'acheteur et au destinataire. RACÈLIA n'est pas tenu de remplacer une carte déjà communiquée, utilisée ou dont le code a été divulgué.</p>
      <p>Le message personnalisé est fourni sous votre responsabilité. Vous garantissez qu'il ne contient aucun contenu illicite, injurieux ou portant atteinte aux droits d'autrui. RACÈLIA peut refuser ou ne pas transmettre un message contraire à ces règles.</p>
      <p>La carte cadeau électronique n'est ni remboursable, ni échangeable, ni convertible en espèces, y compris pour le solde restant. Elle ne peut pas être revendue, cédée à titre onéreux, ni utilisée en dehors du site RACÈLIA.</p>
      <p>La carte peut être utilisée en une ou plusieurs fois jusqu'à épuisement du solde, dans la limite de sa période de validité. Cette période est celle indiquée lors de l'achat. À défaut d'indication contraire, la carte reste valable jusqu'à utilisation intégrale du solde, sous réserve de la législation algérienne applicable.</p>
      <p>Si le montant de la commande dépasse le solde de la carte, la différence doit être réglée par un autre moyen de paiement accepté. Si le montant de la commande est inférieur au solde, le reliquat demeure crédité sur la carte jusqu'à son expiration ou son épuisement.</p>
      <p>RACÈLIA peut refuser, suspendre ou annuler une carte cadeau en cas de fraude, d'erreur manifeste, de non-paiement, d'utilisation abusive ou de violation des présentes Conditions, sans préjudice des recours prévus par la loi.</p>
      <p>Les droits reconnus au consommateur par la législation algérienne, notamment la loi n° 09-03 relative à la protection du consommateur et la loi n° 18-05 relative au commerce électronique, s'appliquent dans les limites qu'elles prévoient. Dès lors que la carte cadeau électronique a été émise et communiquée au destinataire, elle constitue une prestation numérique déjà exécutée et n'est pas éligible au retour, à l'échange ou à la rétractation, sauf obligation légale contraire.</p>

      <h2 id="terms-shipping">8. Livraison</h2>
      <p>Les délais et frais de livraison sont donnés à titre indicatif et peuvent varier selon la wilaya, le transporteur ou des circonstances indépendantes de notre volonté.</p>
      <p>RACÈLIA met tout en œuvre pour respecter les délais annoncés, sans toutefois pouvoir les garantir.</p>

      <h2 id="terms-returns">9. Retours et échanges</h2>
      <p>Les retours et échanges sont acceptés conformément à notre politique de retour.</p>
      <p>Toute demande de retour ou d'échange doit être signalée à notre service client dans un délai de 7 jours suivant la réception de la commande.</p>
      <p>Les produits doivent être retournés dans leur état d'origine, non utilisés et dans leur emballage d'origine.</p>
      <p>Certains produits ne sont pas éligibles au retour ou à l'échange lorsqu'ils sont indiqués comme non retournables ou pour des raisons d'hygiène ou de sécurité. Les cartes cadeaux électroniques RACÈLIA ne sont ni retournables ni échangeables, conformément à l'article 7.</p>

      <h2 id="terms-content">10. Contenu partagé</h2>
      <p>Si vous publiez des avis, commentaires, photos ou tout autre contenu sur notre site ou nos réseaux sociaux, vous autorisez RACÈLIA à les utiliser à des fins de communication et de promotion.</p>
      <p>Vous garantissez être propriétaire de ces contenus et qu'ils ne portent atteinte à aucun droit de tiers.</p>
      <p>RACÈLIA se réserve le droit de supprimer tout contenu jugé inapproprié.</p>

      <h2 id="terms-ip">11. Propriété intellectuelle</h2>
      <p>L'ensemble des éléments présents sur RACÈLIA (logos, textes, images, illustrations, photographies, vidéos, graphismes et design) est protégé par les lois relatives à la propriété intellectuelle.</p>
      <p>Toute reproduction, diffusion, modification ou utilisation sans autorisation écrite de RACÈLIA est interdite.</p>

      <h2 id="terms-disclaimer">12. Absence de garantie</h2>
      <p>RACÈLIA met tout en œuvre pour assurer l'exactitude des informations publiées sur le site.</p>
      <p>Toutefois, nous ne garantissons pas que le site soit exempt d'erreurs, d'interruptions ou de dysfonctionnements.</p>
      <p>Les couleurs, dimensions ou emballages des produits peuvent légèrement différer des visuels présentés.</p>

      <h2 id="terms-liability">13. Limitation de responsabilité</h2>
      <p>Dans les limites prévues par la législation applicable, RACÈLIA ne pourra être tenu responsable des dommages indirects résultant de l'utilisation du site ou de l'achat de produits.</p>

      <h2 id="terms-disputes">14. Résolution des litiges</h2>
      <p>En cas de litige, nous vous invitons à contacter notre service client afin de rechercher une solution amiable.</p>
      <p>À défaut d'accord, le litige sera soumis aux juridictions compétentes conformément à la législation algérienne.</p>

      <h2 id="terms-general">15. Dispositions générales</h2>
      <p>Les présentes Conditions d'utilisation constituent l'intégralité de l'accord entre RACÈLIA et ses utilisateurs.</p>
      <p>Si l'une des dispositions est déclarée invalide ou inapplicable, les autres dispositions resteront pleinement en vigueur.</p>
      <p>Les présentes Conditions sont régies par les lois de la République Algérienne Démocratique et Populaire.</p>

      <h2 id="terms-contact">16. Nous contacter</h2>
      <p>Des questions concernant les présentes Conditions d'utilisation ?</p>
      <p>Notre Service Client RACÈLIA est à votre disposition.</p>
      <p>
        RACÈLIA<br />
        Service Client<br />
        E-mail : <a href="mailto:hello@racelia.com">hello@racelia.com</a>
      </p>
    </main>
  `;

  page.appendChild(createCtaDock({ sectionId: "termsCtaDock", slotId: "termsCtaDockSlot" }));
  return page;
}
