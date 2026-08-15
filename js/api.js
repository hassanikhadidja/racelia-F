function normalizeApiBase(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeApiBase(
  process.env.NEXT_PUBLIC_API_URL || "https://rac-lia-backend-gebj.vercel.app"
);

const TOKEN_KEY = "raceliaAuthToken";
const USER_KEY = "raceliaCurrentUser";

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAuthToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function clearAuthSession() {
  setAuthToken("");
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("racelia:auth-cleared"));
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAdminUser(user = getStoredUser()) {
  if (!getAuthToken()) return false;
  const role = String(user?.role || "").toLowerCase();
  return role === "admin";
}

export function setStoredUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getAuthToken();

  if (token) headers.Authorization = `Bearer ${token}`;

  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message =
      (payload && (payload.msg || payload.message)) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

export async function apiJson(path, options = {}) {
  const body = options.body;
  return apiFetch(path, {
    ...options,
    body: body instanceof FormData || typeof body === "string" ? body : JSON.stringify(body),
  });
}

export function dataUrlToBlob(dataUrl) {
  const [header, base64] = String(dataUrl).split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function uploadImageField(dataUrlOrUrl, fieldName = "file") {
  if (!dataUrlOrUrl) return null;
  if (!String(dataUrlOrUrl).startsWith("data:")) return String(dataUrlOrUrl);

  const form = new FormData();
  form.append(fieldName, dataUrlToBlob(dataUrlOrUrl), "upload.jpg");
  return form;
}

export const api = {
  health: () => apiJson("/health"),
  getProducts: () => apiJson("/product"),
  getProduct: (slug) => apiJson(`/product/${encodeURIComponent(slug)}`),
  createProduct: (body, filesForm) =>
    apiFetch("/product", { method: "POST", body: filesForm || JSON.stringify(body) }),
  uploadProductImage: (form) => apiFetch("/product/upload-image", { method: "POST", body: form }),
  updateProduct: (idOrSlug, body, filesForm) =>
    apiFetch(`/product/${encodeURIComponent(idOrSlug)}`, {
      method: "PATCH",
      body: filesForm || JSON.stringify(body),
    }),
  deleteProduct: (idOrSlug) =>
    apiJson(`/product/${encodeURIComponent(idOrSlug)}`, { method: "DELETE" }),

  getPublishedBlogs: () => apiJson("/blog/public"),
  getPublishedBlog: (slug) => apiJson(`/blog/public/${encodeURIComponent(slug)}`),
  getAdminBlogs: () => apiJson("/blog/admin"),
  createBlog: (form) => apiFetch("/blog/admin", { method: "POST", body: form }),
  updateBlog: (id, form) =>
    apiFetch(`/blog/admin/${encodeURIComponent(id)}`, { method: "PATCH", body: form }),
  deleteBlog: (id) => apiJson(`/blog/admin/${encodeURIComponent(id)}`, { method: "DELETE" }),

  getStorefrontStyleLooks: () => apiJson("/style/storefront"),
  getAdminStyleLooks: () => apiJson("/style"),
  createStyleLook: (form) => apiFetch("/style", { method: "POST", body: form }),
  updateStyleLook: (id, form) =>
    apiFetch(`/style/${encodeURIComponent(id)}`, { method: "PATCH", body: form }),
  deleteStyleLook: (id) => apiJson(`/style/${encodeURIComponent(id)}`, { method: "DELETE" }),

  getPublishedReviews: () => apiJson("/review/published"),
  getPendingReviews: () => apiJson("/review/pending"),
  createReview: (form) => apiFetch("/review", { method: "POST", body: form }),
  publishReview: (id) =>
    apiJson(`/review/${encodeURIComponent(id)}/publish`, { method: "PATCH" }),
  updateReview: (id, body, form) =>
    apiFetch(`/review/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: form || JSON.stringify(body),
    }),
  deleteReview: (id) => apiJson(`/review/${encodeURIComponent(id)}`, { method: "DELETE" }),

  getOrderConfig: () => apiJson("/order/config"),
  createOrder: (body) => apiJson("/order", { method: "POST", body }),
  getMyOrders: () => apiJson("/order/mine"),
  getOrders: () => apiJson("/order"),
  updateOrderStatus: (id, status, issueComment) =>
    apiJson(`/order/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: { status, ...(issueComment ? { issueComment } : {}) },
    }),

  register: (body) => apiJson("/user/register", { method: "POST", body }),
  login: (body) => apiJson("/user/login", { method: "POST", body }),
  getCurrentUser: () => apiJson("/user/getcurrentuser"),
  updateMyProfile: (body) => apiJson("/user/me", { method: "PATCH", body }),
  updateMyProfileForm: (form) => apiFetch("/user/me", { method: "PATCH", body: form }),
  getUsers: () => apiJson("/user"),
  updateUser: (id, body) => apiJson(`/user/${encodeURIComponent(id)}`, { method: "PATCH", body }),

  getEmails: () => apiJson("/email"),
  upsertEmail: (body) => apiJson("/email", { method: "POST", body }),
  updateEmail: (id, body) =>
    apiJson(`/email/${encodeURIComponent(id)}`, { method: "PATCH", body }),
  deleteEmail: (id) => apiJson(`/email/${encodeURIComponent(id)}`, { method: "DELETE" }),

  getReturns: () => apiJson("/return"),
  createReturn: (form) => apiFetch("/return", { method: "POST", body: form }),
  updateReturn: (id, body) =>
    apiJson(`/return/${encodeURIComponent(id)}`, { method: "PATCH", body }),
  deleteReturn: (id) => apiJson(`/return/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
