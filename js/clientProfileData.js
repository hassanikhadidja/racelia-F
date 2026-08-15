import { getStoredUser, setStoredUser } from "./api.js";

const AVATAR_CACHE_KEY = "raceliaProfileAvatarImage";

export const PROFILE_STORAGE_KEY = "raceliaProfileDetails";
export const PROFILE_ORDERS_KEY = "raceliaProfileOrders";

const emptyProfile = {
  name: "",
  phone: "",
  email: "",
  address: "",
  wilaya: "",
  commune: "",
  birthday: "",
  points: 0,
  newsletter: true,
};

function readLocalNewsletter() {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!saved) return true;
    const parsed = JSON.parse(saved);
    return parsed?.newsletter !== false;
  } catch {
    return true;
  }
}

export function userToProfile(user) {
  if (!user) return { ...emptyProfile };
  const address =
    user.address ||
    [user.commune, user.wilaya].filter(Boolean).join(", ") ||
    "";
  return {
    name: user.name || "",
    phone: user.phone || "",
    email: user.email || "",
    address,
    wilaya: user.wilaya || "",
    commune: user.commune || "",
    birthday: user.birthday || "",
    points: user.points ?? 0,
    newsletter: user.newsletter == null ? readLocalNewsletter() : Boolean(user.newsletter),
    id: user.id,
    _id: user._id,
    role: user.role,
  };
}

export function loadClientProfile() {
  const user = getStoredUser();
  if (user) return userToProfile(user);

  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) return { ...emptyProfile, ...JSON.parse(saved) };
  } catch {
    /* ignore */
  }
  return { ...emptyProfile };
}

export function saveClientProfileLocal(profile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

export function applyStoredUser(user) {
  if (!user) return null;
  const profile = userToProfile(user);
  setStoredUser(user);
  saveClientProfileLocal(profile);
  if (user.avatar) {
    try {
      localStorage.setItem(AVATAR_CACHE_KEY, user.avatar);
    } catch {
      /* ignore */
    }
  }
  return profile;
}

export function mapOrderForProfile(order) {
  if (!order) return null;
  return {
    id: order.id || order.orderNumber,
    date: order.date || "",
    product: order.product || order.items?.[0]?.name || "Order",
    total: order.total || "",
    status: order.status || "processing",
    statusLabel: order.statusLabel || order.status || "",
    items: Array.isArray(order.items) ? order.items : [],
    paymentMode: order.paymentMode || "",
    promoUsed:
      Number(order.discount) > 0
        ? { code: "ONLINE5", label: "5% online discount applied" }
        : null,
  };
}

export function loadClientOrders() {
  try {
    const saved = localStorage.getItem(PROFILE_ORDERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.map(mapOrderForProfile).filter(Boolean);
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function saveClientOrders(orders) {
  try {
    localStorage.setItem(
      PROFILE_ORDERS_KEY,
      JSON.stringify((orders || []).map(mapOrderForProfile).filter(Boolean))
    );
  } catch {
    /* ignore */
  }
}

export function buildGiftPointsLedger(orders = loadClientOrders(), extra = []) {
  const orderRows = orders
    .filter((o) => o.status !== "cancelled")
    .map((o) => {
      const amount = parseFloat(String(o.total).replace(/[^\d.]/g, "")) || 0;
      const points = o.status === "delivered" ? Math.round(amount * 0.1) : Math.round(amount * 0.05);
      return {
        source: "order",
        label: `Order ${o.id}${o.status === "delivered" ? " — delivered" : ""}`,
        points: o.status === "cancelled" ? 0 : points,
        date: o.date,
      };
    });

  return [...orderRows, ...extra].filter((row) => row.points > 0);
}

export function getClientGiftPointsTotal(profile = loadClientProfile()) {
  if (profile?.points != null && profile.points > 0) return profile.points;
  return buildGiftPointsLedger().reduce((sum, row) => sum + (row.points || 0), 0);
}

export function isLoggedIn() {
  try {
    return Boolean(localStorage.getItem("raceliaAuthToken"));
  } catch {
    return false;
  }
}
