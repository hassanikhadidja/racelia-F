import { createCtaDock } from "./CtaDock.js";

export function createShippingPage() {
  const page = document.createElement("section");
  page.className = "shipping-page";
  page.id = "shippingPage";
  page.hidden = true;

  page.innerHTML = `
    <main class="livraison-main" aria-label="Options de livraison">
      <h1 class="livraison-title1">Livraison</h1>
      <h2 class="livraison-title2">Informations sur la livraison RACÈLIA</h2>
      <p class="livraison-text">RACÈLIA propose actuellement la livraison standard.</p>
      <ul class="livraison-text livraison-text-2">
        <li>Les frais et les délais de livraison standard sont indiqués ci-dessous :</li>
      </ul>

      <div class="livraison-table-wrap">
        <table class="livraison-table">
          <thead>
            <tr>
              <th scope="col">Mode de livraison</th>
              <th scope="col">Coût</th>
              <th scope="col">Délai de livraison</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Livraison standard</td>
              <td>Gratuite pour les commandes supérieures à 6 500 DZD</td>
              <td>2 à 5 jours ouvrables</td>
            </tr>
            <tr>
              <td>Livraison standard</td>
              <td>Tarif fixe pour les commandes inférieures à 6 500 DZD. Les tarifs varient selon la société de livraison partenaire et la wilaya de destination (de 350 à 1 200 DZD).</td>
              <td>2 à 5 jours ouvrables</td>
            </tr>
            <tr>
              <td>Livraison standard (communes sélectionnées d'Alger-Centre)</td>
              <td>Gratuite pour les communes de Birtouta, Douéra, Baraki, Sidi Moussa, Khraïcia et Ouled Chebel</td>
              <td>1 à 3 jours ouvrables</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="livraison-text">Les commandes sont traitées et expédiées dans un délai de 1 à 2 jours ouvrables après la confirmation du paiement.</p>

      <div class="livraison-table-wrap">
        <table class="livraison-table">
          <thead>
            <tr>
              <th scope="col">Mode de livraison</th>
              <th scope="col">Coût</th>
              <th scope="col">Délai de livraison</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Livraison express</td>
              <td>Des frais additionnels s'appliquent (entre 500 et 1 500 DZD)</td>
              <td>1 à 3 jours ouvrables</td>
            </tr>
            <tr>
              <td>Retrait en magasin</td>
              <td>Gratuit</td>
              <td>Prêt sous 24 heures</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  `;

  page.appendChild(createCtaDock({ sectionId: "shippingCtaDock", slotId: "shippingCtaDockSlot" }));
  return page;
}
