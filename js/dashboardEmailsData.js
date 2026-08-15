export const EMAILS_STORAGE_KEY = "raceliaCollectedEmails";
export const RETURNS_STORAGE_KEY = "raceliaReturnRequests";

export const EMAIL_SOURCES = [
  { id: "account", label: "Account" },
  { id: "newsletter", label: "Newsletter" },
  { id: "contact", label: "Contact" },
  { id: "returns", label: "Returns" },
  { id: "admin", label: "Admin" },
];

export const RETURN_STATUSES = [
  { id: "pending", label: "Pending" },
  { id: "in_progress", label: "In progress" },
  { id: "solved", label: "Solved" },
  { id: "closed", label: "Closed" },
];

export const RETURN_TYPES = [
  { id: "retour", label: "Retour" },
  { id: "echange", label: "Échange" },
  { id: "reclamation", label: "Réclamation" },
];

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

export function notifyEmailsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("racelia:emails-updated"));
}

export function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function isValidCollectedEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

export function emailSourceLabel(id) {
  return EMAIL_SOURCES.find((item) => item.id === id)?.label || id || "—";
}

export function returnStatusLabel(id) {
  return RETURN_STATUSES.find((item) => item.id === id)?.label || id || "Pending";
}

export function returnTypeLabel(id) {
  return RETURN_TYPES.find((item) => item.id === id)?.label || id || "—";
}

function emailIdFor(email) {
  return `em-${normalizeEmail(email)}`;
}

export function loadCollectedEmails() {
  const stored = readJson(EMAILS_STORAGE_KEY, null);
  return Array.isArray(stored) ? stored : [];
}

export function saveCollectedEmails(emails, { silent = false } = {}) {
  writeJson(EMAILS_STORAGE_KEY, emails);
  if (!silent) notifyEmailsUpdated();
}

export function loadReturnRequests() {
  const stored = readJson(RETURNS_STORAGE_KEY, null);
  return Array.isArray(stored) ? stored : [];
}

export function saveReturnRequests(items, { silent = false } = {}) {
  writeJson(RETURNS_STORAGE_KEY, items);
  if (!silent) notifyEmailsUpdated();
}

export function upsertCollectedEmail({
  email,
  name = "",
  newsletter,
  source,
  sources,
  forceNewsletter = false,
  silent = false,
} = {}) {
  const normalized = normalizeEmail(email);
  if (!isValidCollectedEmail(normalized)) return null;

  const list = loadCollectedEmails();
  const extraSources = [...new Set([...(sources || []), source].filter(Boolean))];
  const existing = list.find((item) => normalizeEmail(item.email) === normalized);
  const now = Date.now();
  const optedIn =
    newsletter === true || extraSources.includes("account") || extraSources.includes("newsletter");

  if (existing) {
    const next = {
      ...existing,
      email: normalized,
      name: String(name || existing.name || "").trim(),
      sources: [...new Set([...(existing.sources || []), ...extraSources])],
      updatedAt: now,
    };
    if (forceNewsletter && (newsletter === true || newsletter === false)) {
      next.newsletter = newsletter;
    } else if (newsletter === true) {
      next.newsletter = true;
    } else if (existing.newsletter == null) {
      next.newsletter = Boolean(optedIn);
    }
    saveCollectedEmails(
      list.map((item) => (item.id === existing.id ? next : item)),
      { silent }
    );
    return next;
  }

  const created = {
    id: emailIdFor(normalized),
    email: normalized,
    name: String(name || "").trim(),
    newsletter: newsletter == null ? Boolean(optedIn) : Boolean(newsletter),
    sources: extraSources.length ? extraSources : ["admin"],
    createdAt: now,
    updatedAt: now,
  };
  saveCollectedEmails([created, ...list], { silent });
  return created;
}

export function updateCollectedEmail(id, patch) {
  const list = loadCollectedEmails();
  let updated = null;
  const next = list.map((item) => {
    if (item.id !== id) return item;
    updated = {
      ...item,
      ...patch,
      id: item.id,
      email: patch.email ? normalizeEmail(patch.email) : item.email,
      updatedAt: Date.now(),
    };
    return updated;
  });
  if (updated) saveCollectedEmails(next);
  return updated;
}

export function deleteCollectedEmail(id) {
  saveCollectedEmails(loadCollectedEmails().filter((item) => item.id !== id));
}

export function addReturnRequest(payload) {
  const now = Date.now();
  const item = {
    id: `ret-${now}`,
    requestType: payload.requestType || "reclamation",
    name: String(payload.name || "").trim(),
    phone: String(payload.phone || "").trim(),
    email: normalizeEmail(payload.email),
    wilaya: String(payload.wilaya || "").trim(),
    wilayaName: String(payload.wilayaName || "").trim(),
    comment: String(payload.comment || "").trim(),
    picture: payload.picture || "",
    status: payload.status || "pending",
    createdAt: now,
    updatedAt: now,
  };
  saveReturnRequests([item, ...loadReturnRequests()], { silent: true });

  if (item.email) {
    upsertCollectedEmail({
      email: item.email,
      name: item.name,
      newsletter: false,
      source: "returns",
      silent: true,
    });
  }

  notifyEmailsUpdated();
  return item;
}

export function updateReturnRequest(id, patch) {
  const list = loadReturnRequests();
  let updated = null;
  const next = list.map((item) => {
    if (item.id !== id) return item;
    updated = { ...item, ...patch, id: item.id, updatedAt: Date.now() };
    return updated;
  });
  if (updated) saveReturnRequests(next);
  return updated;
}

export function deleteReturnRequest(id) {
  saveReturnRequests(loadReturnRequests().filter((item) => item.id !== id));
}

export function syncEmailsFromUsers(users = []) {
  if (!Array.isArray(users) || !users.length) return;
  users.forEach((user) => {
    if (!user?.email) return;
    upsertCollectedEmail({
      email: user.email,
      name: user.name || "",
      newsletter: user.newsletter !== false,
      source: "account",
      silent: true,
      forceNewsletter: true,
    });
  });
  notifyEmailsUpdated();
}

export function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}
