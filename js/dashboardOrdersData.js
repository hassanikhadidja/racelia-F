/** Dashboard orders synced from backend (see syncBackend.js). */
export const dashboardStoreOrders = [];
export const DASHBOARD_SITUATION_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "on_way", label: "In way" },
  { value: "received", label: "Received" },
  { value: "not_received", label: "Not Received" },
  { value: "order_issue", label: "Order Issue" },
  { value: "cancelled", label: "Canceled" },
];

export const DASHBOARD_ORDER_FILTERS = [
  { value: "all", label: "All", statuses: null },
  { value: "pending", label: "Pending", statuses: ["pending", "processing"] },
  { value: "confirmed", label: "Confirmed", statuses: ["confirmed"] },
  { value: "on_way", label: "In way", statuses: ["on_way"] },
  { value: "received", label: "Received", statuses: ["received"] },
  { value: "not_received", label: "Not Received", statuses: ["not_received"] },
  { value: "order_issue", label: "Order Issue", statuses: ["order_issue"] },
  { value: "cancelled", label: "Canceled", statuses: ["cancelled"] },
];

export const SITUATIONS_STORAGE_KEY = "raceliaDashboardOrderSituations";
export const ORDERS_STORAGE_KEY = "raceliaDashboardOrders";

const STATUS_LABELS = {
  pending: "Pending",
  processing: "Pending",
  confirmed: "Confirmed",
  on_way: "In way",
  delivered: "Received",
  received: "Received",
  not_received: "Not Received",
  order_issue: "Order Issue",
  cancelled: "Canceled",
};

function demoOrder({
  id,
  date,
  customer,
  phone,
  wilaya,
  commune = "",
  email = "",
  promoCode = "",
  hasAccount = false,
  items,
  deliveryFee = 20,
  status = "pending",
  issueComment = "",
}) {
  const quantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * (Number(item.quantity) || 1), 0);
  const total = subtotal + deliveryFee;
  return {
    id,
    date,
    customer,
    customerEmail: email,
    phone,
    wilaya,
    commune,
    product: items[0]?.name || "",
    productSlug: items[0]?.productSlug || "",
    quantity,
    items,
    subtotal,
    deliveryFee,
    total,
    promoCode,
    hasAccount,
    status,
    statusLabel: STATUS_LABELS[status] || status,
    issueComment,
  };
}

export const DEMO_DASHBOARD_ORDERS = [
  demoOrder({
    id: "RA-24001",
    date: "12 Aug 2026",
    customer: "Amira Benali",
    phone: "0551 23 45 67",
    wilaya: "Alger",
    commune: "Hydra",
    email: "amira.benali@email.com",
    promoCode: "RC10-A4K2M9",
    hasAccount: true,
    items: [{ productSlug: "mini-flap-bag", name: "MINI FLAP BAG", price: 3950, quantity: 1 }],
    status: "pending",
  }),
  demoOrder({
    id: "RA-24002",
    date: "11 Aug 2026",
    customer: "Yacine Mebarki",
    phone: "0770 88 12 40",
    wilaya: "Oran",
    items: [{ productSlug: "mini-hobo-bag", name: "MINI HOBO BAG", price: 4200, quantity: 1 }],
    status: "pending",
  }),
  demoOrder({
    id: "RA-24003",
    date: "9 Aug 2026",
    customer: "Sara Khelifi",
    phone: "0661 44 90 18",
    wilaya: "Constantine",
    commune: "El Khroub",
    email: "sara.khelifi@email.com",
    hasAccount: true,
    items: [
      { productSlug: "mini-flap-bag", name: "MINI FLAP BAG", price: 3950, quantity: 1 },
      { productSlug: "mini-evening-clutch", name: "MINI EVENING CLUTCH", price: 2800, quantity: 2 },
    ],
    status: "confirmed",
  }),
  demoOrder({
    id: "RA-24004",
    date: "7 Aug 2026",
    customer: "Nabil Touati",
    phone: "0540 19 33 21",
    wilaya: "Blida",
    commune: "Boufarik",
    promoCode: "RC50-P8Q1LZ",
    items: [{ productSlug: "mini-hobo-bag", name: "MINI HOBO BAG", price: 4200, quantity: 1 }],
    status: "on_way",
  }),
  demoOrder({
    id: "RA-24005",
    date: "3 Aug 2026",
    customer: "Lina Haddad",
    phone: "0792 55 04 88",
    wilaya: "Tizi Ouzou",
    commune: "Azazga",
    email: "lina.haddad@email.com",
    hasAccount: true,
    items: [{ productSlug: "mini-evening-clutch", name: "MINI EVENING CLUTCH", price: 2800, quantity: 1 }],
    status: "received",
  }),
  demoOrder({
    id: "RA-24006",
    date: "1 Aug 2026",
    customer: "Karim Boudiaf",
    phone: "0560 71 28 93",
    wilaya: "Sétif",
    items: [{ productSlug: "mini-flap-bag", name: "MINI FLAP BAG", price: 3950, quantity: 1 }],
    status: "cancelled",
  }),
  demoOrder({
    id: "RA-24007",
    date: "14 Aug 2026",
    customer: "Meriem Cherif",
    phone: "0555 62 17 09",
    wilaya: "Alger",
    commune: "Bab Ezzouar",
    email: "meriem.cherif@email.com",
    hasAccount: true,
    items: [{ productSlug: "mini-hobo-bag", name: "MINI HOBO BAG", price: 4200, quantity: 1 }],
    status: "order_issue",
    issueComment: "Package arrived damaged. Client reported a torn strap and asked for a replacement or refund.",
  }),
];

export function orderMatchesFilter(order, filterValue = "all") {
  const filter = DASHBOARD_ORDER_FILTERS.find((item) => item.value === filterValue);
  if (!filter || !filter.statuses) return true;
  const status = String(order?.status || "").toLowerCase();
  return filter.statuses.includes(status);
}

export function loadDashboardOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) {
        const savedIds = new Set(parsed.map((order) => String(order.id)));
        const extraDemos = DEMO_DASHBOARD_ORDERS.filter((demo) => !savedIds.has(demo.id));
        const hasDemoIds = parsed.some((order) => String(order.id).startsWith("RA-24"));
        if (extraDemos.length && hasDemoIds) {
          const next = [...parsed, ...extraDemos];
          saveDashboardOrders(next);
          return next;
        }
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }
  return DEMO_DASHBOARD_ORDERS;
}

export function saveDashboardOrders(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}

export function getOrderStatusLabel(status) {
  const value = String(status || "pending").toLowerCase();
  return STATUS_LABELS[value] || status || "Pending";
}

export function updateDashboardOrderStatus(orderId, status, issueComment) {
  const nextStatus = String(status || "pending").toLowerCase();
  const label = getOrderStatusLabel(nextStatus);
  const comment = typeof issueComment === "string" ? issueComment.trim() : "";
  const orders = loadDashboardOrders().map((order) => {
    if (String(order.id) !== String(orderId)) return order;
    return {
      ...order,
      status: nextStatus,
      statusLabel: label,
      issueComment: nextStatus === "order_issue" ? comment : order.issueComment || "",
    };
  });
  saveDashboardOrders(orders);

  try {
    const situationsRaw = localStorage.getItem(SITUATIONS_STORAGE_KEY);
    const situations = situationsRaw ? JSON.parse(situationsRaw) : {};
    situations[orderId] = nextStatus;
    localStorage.setItem(SITUATIONS_STORAGE_KEY, JSON.stringify(situations));
  } catch {
    /* ignore */
  }

  return orders;
}
