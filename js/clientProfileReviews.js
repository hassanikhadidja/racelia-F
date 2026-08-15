import { addGiftPointsEntry, getDeliveredProductsForReview } from "./clientProfileGiftPoints.js";
import { queueClientReviewForModeration } from "./dashboardReviewsData.js";
import { loadCatalogProducts } from "./productCatalog.js";

const REVIEWS_STORAGE_KEY = "raceliaProfileReviews";
const REVIEW_POINTS = 150;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function loadProfileReviews() {
  try {
    const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return [];
}

export function saveProfileReviews(reviews) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    /* ignore */
  }
}

export function getReviewsSummaryText() {
  const reviews = loadProfileReviews();
  if (!reviews.length) return "Ajouter votre premier avis";
  const avg =
    reviews.reduce((s, r) => s + (r.stars || 0), 0) / reviews.length;
  return `${avg.toFixed(1)} · ${reviews.length} avis`;
}

function productOptionsMarkup() {
  const products = getDeliveredProductsForReview();
  const opts = products.length
    ? products.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("")
    : `<option value="" disabled>Aucune commande livrée pour le moment</option>`;
  return `<option value="" disabled selected>Choisir un produit</option>${opts}<option value="_other">Autre produit</option>`;
}

export function getProfileReviewOverlayMarkup() {
  return `<div class="profile-review-overlay" id="profile-review-overlay" aria-hidden="true">
  <div class="profile-review-sheet profile-sheet" role="dialog" aria-labelledby="profile-review-title">
    <div class="profile-sheet-header">
      <h3 id="profile-review-title">Ajouter un avis</h3>
      <button type="button" class="profile-sheet-close" data-close="profile-review-overlay">Fermer</button>
    </div>
    <form class="profile-review-form" id="profile-review-form">
      <div class="profile-review-field">
        <label for="review-name">Votre nom</label>
        <input type="text" id="review-name" name="name" autocomplete="name" required placeholder=" " />
      </div>
      <div class="profile-review-field">
        <label for="review-product">Produit</label>
        <select id="review-product" name="product" required>
          ${productOptionsMarkup()}
        </select>
      </div>
      <div class="profile-review-field profile-review-field--other" id="review-product-other-wrap" hidden>
        <label for="review-product-other">Nom du produit</label>
        <input type="text" id="review-product-other" name="productOther" placeholder=" " />
      </div>
      <div class="profile-review-field">
        <label>Note</label>
        <div class="profile-review-stars" id="review-stars" role="radiogroup" aria-label="Note en étoiles">
          ${[1, 2, 3, 4, 5]
            .map(
              (n) =>
                `<button type="button" class="profile-review-star" data-star="${n}" aria-label="${n} étoile${n > 1 ? "s" : ""}">★</button>`
            )
            .join("")}
        </div>
        <input type="hidden" id="review-stars-value" name="stars" value="5" required />
      </div>
      <div class="profile-review-field">
        <label for="review-comment">Commentaire</label>
        <textarea id="review-comment" name="comment" rows="4" required placeholder="Partagez votre expérience…"></textarea>
      </div>
      <div class="profile-review-field">
        <span class="profile-review-photo-label" id="review-photo-label">Photo (facultatif)</span>
        <label class="profile-review-photo-btn" for="review-photo">
          <input type="file" id="review-photo" name="photo" accept="image/*" hidden aria-labelledby="review-photo-label" />
          <span class="profile-review-photo-btn__text">Choisir un fichier</span>
        </label>
        <p class="profile-review-photo-name" id="review-photo-name">Aucun fichier choisi</p>
        <div class="profile-review-photo-preview" id="review-photo-preview" hidden>
          <img id="review-photo-img" alt="Aperçu de la photo de l'avis" />
          <button type="button" class="profile-review-photo-remove" id="review-photo-remove">Retirer la photo</button>
        </div>
      </div>
      <button type="submit" class="profile-review-submit">Envoyer l'avis</button>
    </form>
  </div>
</div>`;
}

export function initProfileReviewForm(page, { onSubmitted } = {}) {
  const overlay = page.querySelector("#profile-review-overlay");
  const form = page.querySelector("#profile-review-form");
  const starsWrap = page.querySelector("#review-stars");
  const starsInput = page.querySelector("#review-stars-value");
  const productSelect = page.querySelector("#review-product");
  const otherWrap = page.querySelector("#review-product-other-wrap");
  const photoInput = page.querySelector("#review-photo");
  const photoName = page.querySelector("#review-photo-name");
  const photoPreview = page.querySelector("#review-photo-preview");
  const photoImg = page.querySelector("#review-photo-img");
  const photoRemove = page.querySelector("#review-photo-remove");
  const nameInput = page.querySelector("#review-name");

  if (!overlay || !form) return;

  const profileName = page.querySelector("#profile-name")?.textContent?.trim();
  if (nameInput && profileName) nameInput.value = profileName;

  let selectedStars = 5;
  let photoDataUrl = "";

  const setStars = (value) => {
    selectedStars = value;
    if (starsInput) starsInput.value = String(value);
    starsWrap?.querySelectorAll(".profile-review-star").forEach((btn) => {
      const star = Number(btn.dataset.star);
      btn.classList.toggle("is-active", star <= value);
      btn.classList.toggle("is-selected", star === value);
    });
  };

  setStars(5);

  starsWrap?.querySelectorAll(".profile-review-star").forEach((btn) => {
    btn.addEventListener("click", () => setStars(Number(btn.dataset.star)));
  });

  productSelect?.addEventListener("change", () => {
    const isOther = productSelect.value === "_other";
    if (otherWrap) otherWrap.hidden = !isOther;
  });

  const clearPhoto = () => {
    photoDataUrl = "";
    if (photoInput) photoInput.value = "";
    if (photoPreview) photoPreview.hidden = true;
    if (photoImg) photoImg.removeAttribute("src");
    if (photoName) {
      photoName.textContent = "Aucun fichier choisi";
      photoName.classList.remove("has-file");
    }
  };

  photoInput?.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (!file?.type.startsWith("image/")) {
      clearPhoto();
      return;
    }
    if (photoName) {
      photoName.textContent = file.name;
      photoName.classList.add("has-file");
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        photoDataUrl = reader.result;
        if (photoImg) photoImg.src = photoDataUrl;
        if (photoPreview) photoPreview.hidden = false;
      }
    };
    reader.readAsDataURL(file);
  });

  photoRemove?.addEventListener("click", clearPhoto);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let product =
      productSelect?.value === "_other"
        ? page.querySelector("#review-product-other")?.value.trim()
        : productSelect?.value;
    if (!product) product = page.querySelector("#review-product-other")?.value.trim() || "Produit";

    const catalogMatch = loadCatalogProducts().find(
      (p) => String(p.name).toLowerCase() === String(product).toLowerCase()
    );

    const review = {
      id: `rev-${Date.now()}`,
      name: page.querySelector("#review-name")?.value.trim() || "Invité",
      product,
      productSlug: catalogMatch?.id || "",
      comment: page.querySelector("#review-comment")?.value.trim() || "",
      stars: selectedStars,
      photo: photoDataUrl || null,
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    const reviews = loadProfileReviews();
    reviews.unshift(review);
    saveProfileReviews(reviews);
    queueClientReviewForModeration(review);

    addGiftPointsEntry({
      source: "review",
      label: `Avis après livraison — ${product}`,
      points: REVIEW_POINTS,
      date: review.date,
    });

    form.reset();
    setStars(5);
    clearPhoto();
    if (nameInput && profileName) nameInput.value = profileName;
    if (otherWrap) otherWrap.hidden = true;

    onSubmitted?.(review);
    window.alert(`Merci ! Vous avez gagné ${REVIEW_POINTS} points cadeau pour votre avis.`);
  });
}
