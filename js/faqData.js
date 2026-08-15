/** FAQ RACÈLIA — catégories et articles. */
export const FAQ_CATEGORIES = [
  {
    id: "commandes",
    title: "Commandes",
    description: "Passer, modifier ou suivre une commande en ligne.",
  },
  {
    id: "livraison",
    title: "Livraison",
    description: "Délais, frais et options de livraison en Algérie.",
  },
  {
    id: "retours",
    title: "Retours et échanges",
    description: "Conditions, délais et procédure de retour.",
  },
  {
    id: "paiement",
    title: "Paiement",
    description: "Modes de paiement acceptés et sécurité.",
  },
  {
    id: "compte",
    title: "Compte et liste d'envies",
    description: "Création de compte, favoris et points fidélité.",
  },
  {
    id: "produits",
    title: "Produits et entretien",
    description: "Matières, tailles, couleurs et entretien des sacs.",
  },
  {
    id: "boutiques",
    title: "Boutiques",
    description: "Points de vente, horaires et services en magasin.",
  },
];

export const FAQ_ARTICLES = [
  {
    id: "comment-commander",
    categoryId: "commandes",
    title: "Comment passer une commande ?",
    excerpt: "Ajoutez vos sacs au panier, choisissez la livraison et validez.",
    body: `<p>Parcourez la sélection RACÈLIA, choisissez la couleur souhaitée, puis ajoutez l'article à votre panier.</p><p>Dans le panier, vérifiez les quantités, puis passez au paiement. Indiquez vos coordonnées de livraison (wilaya et commune) et choisissez votre mode de paiement.</p><p>Vous recevrez une confirmation une fois la commande enregistrée.</p>`,
  },
  {
    id: "modifier-commande",
    categoryId: "commandes",
    title: "Puis-je modifier ou annuler ma commande ?",
    excerpt: "Contactez-nous rapidement après la confirmation.",
    body: `<p>Tant que votre commande n'est pas expédiée, vous pouvez demander une modification ou une annulation via le service client.</p><p>Depuis votre compte, consultez l'état de la commande. Si elle est encore « en traitement », écrivez-nous en indiquant votre numéro de commande.</p>`,
  },
  {
    id: "suivre-commande",
    categoryId: "commandes",
    title: "Comment suivre ma commande ?",
    excerpt: "Suivez l'état depuis votre compte client.",
    body: `<p>Connectez-vous à votre compte RACÈLIA, puis ouvrez la section commandes pour voir le statut (traitement, en cours de livraison, livrée).</p><p>Vous pouvez aussi nous contacter avec votre numéro de commande et l'e-mail utilisé lors de l'achat.</p>`,
  },
  {
    id: "delais-livraison",
    categoryId: "livraison",
    title: "Quels sont les délais de livraison ?",
    excerpt: "En général 2 à 5 jours ouvrables selon la wilaya.",
    body: `<p>Les commandes sont préparées sous 1 à 2 jours ouvrables après confirmation.</p><p>La livraison standard prend généralement 2 à 5 jours ouvrables selon votre wilaya. Pour certaines communes d'Alger, le délai peut être de 1 à 3 jours ouvrables.</p><p>Consultez la page <strong>Options de livraison</strong> pour le détail des tarifs et délais.</p>`,
  },
  {
    id: "frais-livraison",
    categoryId: "livraison",
    title: "Combien coûte la livraison ?",
    excerpt: "Gratuite au-delà de 6 500 DZD ; sinon selon la wilaya.",
    body: `<p>La livraison est offerte pour les commandes supérieures à 6 500 DZD.</p><p>En dessous de ce montant, les frais varient selon le transporteur et la wilaya (généralement entre 350 et 1 200 DZD). Des options express et un retrait en magasin peuvent aussi être proposés.</p>`,
  },
  {
    id: "livraison-wilaya",
    categoryId: "livraison",
    title: "Livrez-vous dans toute l'Algérie ?",
    excerpt: "Oui, dans l'ensemble des wilayas.",
    body: `<p>RACÈLIA livre dans toutes les wilayas d'Algérie via ses partenaires de livraison.</p><p>Les délais et tarifs peuvent varier selon la destination. Indiquez votre wilaya au moment du paiement pour voir les options disponibles.</p>`,
  },
  {
    id: "politique-retour",
    categoryId: "retours",
    title: "Quelle est la politique de retour ?",
    excerpt: "7 jours après réception, produit non utilisé.",
    body: `<p>Vous disposez de 7 jours après réception pour demander un retour ou un échange.</p><p>Le produit doit être retourné dans son état d'origine, non utilisé, avec son emballage. Contactez le service client pour obtenir les instructions de retour.</p>`,
  },
  {
    id: "echanger-produit",
    categoryId: "retours",
    title: "Comment échanger un article ?",
    excerpt: "Signalez votre demande au service client.",
    body: `<p>Pour un échange (taille, couleur ou modèle), contactez-nous dans les 7 jours suivant la réception en précisant le numéro de commande et l'article souhaité.</p><p>Selon les stocks, nous organisons l'échange ou proposons une solution alternative.</p>`,
  },
  {
    id: "modes-paiement",
    categoryId: "paiement",
    title: "Quels modes de paiement acceptez-vous ?",
    excerpt: "Paiement à la livraison et paiement en ligne.",
    body: `<p>Vous pouvez régler à la livraison (cash on delivery) ou en ligne selon les options affichées au paiement.</p><p>Les montants sont indiqués en dinars algériens (DZD). Une conversion indicative peut être proposée dans d'autres devises.</p>`,
  },
  {
    id: "paiement-securise",
    categoryId: "paiement",
    title: "Le paiement en ligne est-il sécurisé ?",
    excerpt: "Oui, via nos prestataires de paiement.",
    body: `<p>Les paiements en ligne transitent par des prestataires sécurisés. RACÈLIA ne stocke pas vos données de carte bancaire sur ses serveurs.</p>`,
  },
  {
    id: "creer-compte",
    categoryId: "compte",
    title: "Dois-je créer un compte pour commander ?",
    excerpt: "Recommandé pour suivre vos commandes et favoris.",
    body: `<p>Un compte vous permet de suivre vos commandes, enregistrer votre liste d'envies et cumuler des points fidélité.</p><p>Vous pouvez créer un compte avant ou après votre première commande depuis Mon compte.</p>`,
  },
  {
    id: "liste-envies",
    categoryId: "compte",
    title: "Comment utiliser la liste d'envies ?",
    excerpt: "Enregistrez vos sacs favoris pour plus tard.",
    body: `<p>Cliquez sur le cœur sur une fiche produit ou une carte pour l'ajouter à votre liste d'envies.</p><p>Retrouvez vos favoris depuis l'icône liste d'envies dans la barre supérieure.</p>`,
  },
  {
    id: "matieres-entretien",
    categoryId: "produits",
    title: "Comment entretenir mon sac RACÈLIA ?",
    excerpt: "Conseils d'entretien selon la matière.",
    body: `<p>Évitez l'humidité excessive et les produits chimiques agressifs. Essuyez délicatement avec un chiffon doux et sec.</p><p>Consultez les détails produit sur chaque fiche pour les matières spécifiques. En cas de doute, contactez le service client.</p>`,
  },
  {
    id: "couleurs-reelles",
    categoryId: "produits",
    title: "Les couleurs correspondent-elles aux photos ?",
    excerpt: "Légères variations possibles selon l'écran.",
    body: `<p>Nous soignons nos photos, mais les couleurs peuvent légèrement varier selon votre écran et l'éclairage.</p><p>En boutique, vous pouvez voir et toucher les modèles avant d'acheter.</p>`,
  },
  {
    id: "trouver-boutique",
    categoryId: "boutiques",
    title: "Où trouver une boutique RACÈLIA ?",
    excerpt: "Utilisez la page Boutiques pour localiser un point de vente.",
    body: `<p>Ouvrez la page <strong>Boutiques</strong> depuis le pied de page pour voir la carte et la liste des points de vente.</p><p>Vous pouvez filtrer par ville, code postal ou type de magasin.</p>`,
  },
  {
    id: "retrait-magasin",
    categoryId: "boutiques",
    title: "Puis-je retirer ma commande en magasin ?",
    excerpt: "Oui, le retrait en magasin est gratuit.",
    body: `<p>Le retrait en magasin est proposé gratuitement. La commande est généralement prête sous 24 heures après confirmation.</p><p>Choisissez cette option au moment du paiement lorsque disponible.</p>`,
  },
];

export function getCategoryById(id) {
  return FAQ_CATEGORIES.find((c) => c.id === id) || null;
}

export function getArticleById(id) {
  return FAQ_ARTICLES.find((a) => a.id === id) || null;
}

export function getArticlesByCategory(categoryId) {
  return FAQ_ARTICLES.filter((a) => a.categoryId === categoryId);
}

export function searchFaqArticles(query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return [];
  return FAQ_ARTICLES.filter((a) => {
    const cat = getCategoryById(a.categoryId);
    const hay = `${a.title} ${a.excerpt} ${a.body} ${cat?.title || ""}`.toLowerCase();
    return hay.includes(q);
  });
}
