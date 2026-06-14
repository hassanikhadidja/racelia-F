export const USERS_STORAGE_KEY = "raceliaDashboardUsers";

function readStorage() {
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return null;
}

export function loadDashboardUsers() {
  const stored = readStorage();
  if (Array.isArray(stored)) return stored;
  return [];
}

export function saveDashboardUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}

export function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return "??";
}
