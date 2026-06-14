export const PUBLISHED_STORAGE_KEY = "raceliaDashboardPublishedReviews";
export const PENDING_STORAGE_KEY = "raceliaDashboardPendingReviews";

export const REVIEW_PRODUCTS = [];

export function getReviewProductOptions() {
  try {
    return import("./productCatalog.js")
      .then(({ loadCatalogProducts }) =>
        loadCatalogProducts().map((p) => ({ id: p.id, name: p.name }))
      )
      .catch(() => []);
  } catch {
    return Promise.resolve([]);
  }
}

function readJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return fallback;
}

function writeJson(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function loadPublishedReviews() {
  const stored = readJson(PUBLISHED_STORAGE_KEY, null);
  if (Array.isArray(stored)) return stored;
  return [];
}

export function savePublishedReviews(reviews) {
  writeJson(PUBLISHED_STORAGE_KEY, reviews);
}

export function loadPendingReviews() {
  const stored = readJson(PENDING_STORAGE_KEY, null);
  if (Array.isArray(stored)) return stored;
  return [];
}

export function savePendingReviews(reviews) {
  writeJson(PENDING_STORAGE_KEY, reviews);
}

export function getPublishedReviewsForProduct(productId, productName = "") {
  const id = String(productId || "").trim();
  const name = String(productName || "").trim().toLowerCase();
  return loadPublishedReviews().filter((review) => {
    if (review.productSlug && id) return review.productSlug === id;
    const productLabel = String(review.product || "").trim().toLowerCase();
    return name && productLabel === name;
  });
}

export function getProductReviewsForDisplay(productId, productName = "") {
  const published = getPublishedReviewsForProduct(productId, productName);
  const count = published.length;

  if (!count) {
    return {
      score: "0",
      count: "0 Reviews",
      chips: [],
      bars: [
        { stars: 5, pct: 0 },
        { stars: 4, pct: 0 },
        { stars: 3, pct: 0 },
        { stars: 2, pct: 0 },
        { stars: 1, pct: 0 },
      ],
      items: [],
      isEmpty: true,
    };
  }

  const avg = published.reduce((sum, r) => sum + (Number(r.stars) || 0), 0) / count;
  const bars = [5, 4, 3, 2, 1].map((stars) => {
    const starCount = published.filter((r) => Math.round(Number(r.stars) || 0) === stars).length;
    return { stars, pct: Math.round((starCount / count) * 100) };
  });

  const items = published.slice(0, 6).map((review) => ({
    meta: `${String(review.author || "Guest").toUpperCase()}, ${String(review.date || "").toUpperCase()}`,
    title: review.comment?.split(/[.!?]/)[0]?.trim() || "Customer review",
    text: review.comment || "",
    stars: Number(review.stars) || 5,
  }));

  return {
    score: avg.toFixed(1),
    count: `${count} Review${count === 1 ? "" : "s"}`,
    chips: [],
    bars,
    items,
    isEmpty: false,
  };
}

export function queueClientReviewForModeration(review) {
  const pending = loadPendingReviews();
  if (pending.some((r) => r.id === review.id)) return;
  pending.unshift({
    id: review.id,
    author: review.name || review.author || "Guest",
    product: review.product,
    productSlug: review.productSlug || "",
    stars: review.stars || 5,
    comment: review.comment || "",
    date: review.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    photo: review.photo || null,
    source: "client",
  });
  savePendingReviews(pending);
  import("./syncBackend.js")
    .then(({ submitClientReview }) => submitClientReview(review).catch(() => {}))
    .catch(() => {});
}

export function starsToLabel(stars) {
  const n = Math.max(0, Math.min(5, Math.round(Number(stars) || 0)));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export function getReviewStats(published) {
  const count = published.length;
  if (!count) {
    return { average: "—", total: 0, recommend: "—" };
  }
  const avg = published.reduce((s, r) => s + (r.stars || 0), 0) / count;
  const recommend = Math.round(
    (published.filter((r) => (r.stars || 0) >= 4).length / count) * 100
  );
  return {
    average: avg.toFixed(1),
    total: count,
    recommend: `${recommend}%`,
  };
}
