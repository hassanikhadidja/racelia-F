/** Dashboard orders synced from backend (see syncBackend.js). */
export const dashboardStoreOrders = [];
export const DASHBOARD_SITUATION_OPTIONS = [
  { value: "processing", label: "Processing" },
  { value: "on_way", label: "On the way" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export const SITUATIONS_STORAGE_KEY = "raceliaDashboardOrderSituations";
export const ORDERS_STORAGE_KEY = "raceliaDashboardOrders";

export function loadDashboardOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function saveDashboardOrders(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}
