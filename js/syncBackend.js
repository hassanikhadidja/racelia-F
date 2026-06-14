import { api, getAuthToken, setAuthToken, setStoredUser, uploadImageField } from "./api.js";
import {
  applyStoredUser,
  saveClientOrders,
  saveClientProfileLocal,
  userToProfile,
} from "./clientProfileData.js";
import { cacheProfileAvatar } from "./profileAvatar.js";
import { dataUrlToBlob } from "./api.js";
import {
  saveCatalogProducts,
  normalizeCatalogProduct,
  loadCatalogProducts,
} from "./productCatalog.js";
import { saveBlogs, normalizeBlog } from "./dashboardBlogsData.js";
import { saveWebPics } from "./dashboardWebPicsData.js";
import { saveStyleLooks } from "./dashboardRaceliaStyleData.js";
import { savePublishedReviews, savePendingReviews } from "./dashboardReviewsData.js";
import { saveDashboardUsers } from "./dashboardUsersData.js";
import { saveDashboardOrders } from "./dashboardOrdersData.js";

const ORDER_CONFIG_KEY = "raceliaOrderConfig";

let orderConfig = { deliveryFee: 20, onlineDiscountRate: 0.05, currency: "EUR" };

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function mapStorefrontStyleLooks(rawLooks) {
  return (rawLooks || []).map((look, i) => ({
    id: look.id || look._id || `style-${i}`,
    title: look.title || `Creator look ${i + 1}`,
    tag: look.tag || "Live",
    image: look.image || look.img || "",
    products: (look.products || []).map((p, j) => ({
      id: p.id || p.entryKey || `style-p-${i}-${j}`,
      productId: p.productId || p.id,
      image: p.image || "",
    })),
    createdAt: look.createdAt || i + 1,
  }));
}

function mapStyleLooksFromStorefront(storefrontLooks) {
  return (storefrontLooks || []).map((look, i) => ({
    id: `style-seed-${i}`,
    title: i === 0 ? "Featured creator look" : `Creator look ${i + 1}`,
    tag: i === 0 ? "Featured" : "Live",
    image: look.img || look.image || "",
    products: (look.products || []).map((p, j) => ({
      id: `style-seed-${i}-p-${j}`,
      productId: p.id || p.productId,
      image: p.image || "",
    })),
    createdAt: i + 1,
  }));
}

export function getOrderConfig() {
  try {
    const saved = localStorage.getItem(ORDER_CONFIG_KEY);
    if (saved) return { ...orderConfig, ...JSON.parse(saved) };
  } catch {
    /* ignore */
  }
  return orderConfig;
}

function mergeCatalogProductFromApi(incoming, local) {
  if (!incoming) return null;
  if (!local) return incoming;

  const localTime = local.updatedAt || 0;
  const incomingTime = incoming.updatedAt || 0;
  const localNewer = localTime > incomingTime;

  const merged = {
    ...incoming,
    isNewArrival: incoming.isNewArrival || local.isNewArrival,
    hasColorImages: incoming.hasColorImages || local.hasColorImages,
  };

  if (localNewer) {
    merged.priceAmountDzd = local.priceAmountDzd || incoming.priceAmountDzd;
    merged.cardCover = local.cardCover || incoming.cardCover;
    merged.cardScroll = local.cardScroll?.length ? local.cardScroll : incoming.cardScroll;
    merged.pdpCover = local.pdpCover || incoming.pdpCover;
    merged.pdpScroll = local.pdpScroll?.length ? local.pdpScroll : incoming.pdpScroll;
    merged.closerLookExtra = local.closerLookExtra?.length
      ? local.closerLookExtra
      : incoming.closerLookExtra;
    merged.closerLookMain = local.closerLookMain?.image ? local.closerLookMain : incoming.closerLookMain;
    merged.colorVariants = local.colorVariants?.length ? local.colorVariants : incoming.colorVariants;
    merged.sections = local.sections?.length ? local.sections : incoming.sections;
    merged.stockNote = local.stockNote || incoming.stockNote;
    merged.tag = local.tag || incoming.tag;
    merged.name = local.name || incoming.name;
    merged.description = local.description || incoming.description;
    merged.updatedAt = localTime;
  }

  return normalizeCatalogProduct(merged);
}

function mergeCatalogFromApi(incomingList) {
  const existing = loadCatalogProducts();
  const existingById = new Map(existing.map((p) => [p.id, p]));
  const mergedIds = new Set();

  const merged = incomingList
    .map((raw) => {
      const incoming = normalizeCatalogProduct(raw);
      if (!incoming?.id) return null;
      mergedIds.add(incoming.id);
      return mergeCatalogProductFromApi(incoming, existingById.get(incoming.id));
    })
    .filter(Boolean);

  for (const local of existing) {
    if (!mergedIds.has(local.id)) {
      merged.push(normalizeCatalogProduct(local));
    }
  }

  return merged;
}

async function syncPublicData() {
  const [products, blogs, webPicsPayload, styleLooks, reviews, config] = await Promise.all([
    api.getProducts().catch(() => null),
    api.getPublishedBlogs().catch(() => null),
    api.getWebPics().catch(() => null),
    api.getStorefrontStyleLooks().catch(() => null),
    api.getPublishedReviews().catch(() => null),
    api.getOrderConfig().catch(() => null),
  ]);

  if (Array.isArray(products)) {
    saveCatalogProducts(mergeCatalogFromApi(products));
  }

  if (Array.isArray(blogs)) {
    saveBlogs(blogs.map(normalizeBlog).filter(Boolean));
  }

  if (webPicsPayload?.all) {
    saveWebPics(webPicsPayload.all);
  } else if (Array.isArray(webPicsPayload)) {
    saveWebPics(webPicsPayload);
  }

  if (Array.isArray(styleLooks)) {
    saveStyleLooks(mapStyleLooksFromStorefront(styleLooks));
  }

  if (Array.isArray(reviews)) {
    savePublishedReviews(reviews);
  }

  if (config) {
    orderConfig = { ...orderConfig, ...config };
    writeStorage(ORDER_CONFIG_KEY, orderConfig);
  }
}

export async function syncAdminData() {
  if (!getAuthToken()) return;

  const [blogs, orders, users, pendingReviews, styleLooks] = await Promise.all([
    api.getAdminBlogs().catch(() => null),
    api.getOrders().catch(() => null),
    api.getUsers().catch(() => null),
    api.getPendingReviews().catch(() => null),
    api.getAdminStyleLooks().catch(() => null),
  ]);

  if (Array.isArray(blogs)) {
    saveBlogs(blogs.map(normalizeBlog).filter(Boolean));
  }
  if (Array.isArray(orders)) {
    saveDashboardOrders(orders);
  }
  if (Array.isArray(users)) {
    const userOrders = Array.isArray(orders) ? orders : [];
    const enriched = users.map((user) => ({
      ...user,
      orders: userOrders.filter(
        (order) =>
          String(order.customerEmail || "").toLowerCase() ===
          String(user.email || "").toLowerCase()
      ),
    }));
    saveDashboardUsers(enriched);
  }
  if (Array.isArray(pendingReviews)) {
    savePendingReviews(pendingReviews);
  }
  if (Array.isArray(styleLooks)) {
    saveStyleLooks(mapStorefrontStyleLooks(styleLooks));
  }
}

export async function syncClientData(root) {
  if (!getAuthToken()) return;

  try {
    const [user, orders] = await Promise.all([
      api.getCurrentUser().catch(() => null),
      api.getMyOrders().catch(() => null),
    ]);

    if (user?.email) {
      applyStoredUser(user);
    }
    if (Array.isArray(orders)) {
      saveClientOrders(orders);
    }

    root?.dispatchEvent(new CustomEvent("racelia:client-synced", { bubbles: true }));
  } catch (error) {
    console.warn("RACÈLIA client sync failed:", error.message);
  }
}

export async function updateClientProfile(body, root) {
  const result = await api.updateMyProfile(body);
  if (result?.user) {
    applyStoredUser(result.user);
  } else if (body) {
    const profile = userToProfile({ ...loadClientProfileFallback(), ...body });
    saveClientProfileLocal(profile);
  }
  root?.dispatchEvent(new CustomEvent("racelia:client-synced", { bubbles: true }));
  return result;
}

export async function uploadProfileAvatar(dataUrl, root) {
  const form = new FormData();
  form.append("avatar", dataUrlToBlob(dataUrl), "avatar.jpg");
  const result = await api.updateMyProfileForm(form);
  if (result?.user) {
    applyStoredUser(result.user);
    if (result.user.avatar) cacheProfileAvatar(result.user.avatar);
  }
  root?.dispatchEvent(new CustomEvent("racelia:client-synced", { bubbles: true }));
  return result;
}

function loadClientProfileFallback() {
  try {
    const raw = localStorage.getItem("raceliaProfileDetails");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function initBackendSync(root) {
  try {
    await syncPublicData();
    if (getAuthToken()) {
      await Promise.all([syncAdminData(), syncClientData(root)]);
    }
    root?.dispatchEvent(new CustomEvent("racelia:backend-synced", { bubbles: true }));
  } catch (error) {
    console.warn("RACÈLIA backend sync failed:", error.message);
  }
}

export async function loginUser(email, password, root) {
  const result = await api.login({ email, password });
  if (!result?.token) throw new Error("Login failed");
  setAuthToken(result.token);
  if (result.user) setStoredUser(result.user);
  await Promise.all([syncAdminData(), syncClientData(root)]);
  root?.dispatchEvent(new CustomEvent("racelia:backend-synced", { bubbles: true }));
  return result;
}

export async function registerUser({ name, email, phone, password, birthday }) {
  return api.register({ name, email, phone, password, birthday });
}

export async function submitOrder(payload) {
  return api.createOrder(payload);
}

export async function submitClientReview(review) {
  const form = new FormData();
  form.append("author", review.name || review.author || "Guest");
  form.append("product", review.product || "Product");
  if (review.productSlug) form.append("productSlug", review.productSlug);
  form.append("stars", String(review.stars || 5));
  form.append("comment", review.comment || "");
  form.append("reviewDate", review.date || "");
  form.append("source", "client");
  form.append("status", "pending");

  if (review.photo?.startsWith("data:")) {
    const uploadForm = await uploadImageField(review.photo, "photo");
    uploadForm.forEach((value, key) => form.append(key, value));
  }

  return api.createReview(form);
}

function productHasDataUrls(product) {
  const urls = [
    product.cardCover,
    product.pdpCover,
    product.coverImage,
    product.closerLookMain?.image,
    ...(product.cardScroll || []),
    ...(product.pdpScroll || []),
    ...(product.closerLookExtra || []),
    ...(product.closerLookImages || []),
  ];
  for (const variant of product.colorVariants || []) {
    urls.push(
      variant.cardCover,
      variant.pdpCover,
      variant.closerLookMain,
      ...(variant.cardScroll || []),
      ...(variant.pdpScroll || []),
      ...(variant.closerLookExtra || [])
    );
  }
  return urls.some((url) => typeof url === "string" && url.startsWith("data:"));
}

async function resolveDataUrl(url) {
  if (!url || typeof url !== "string" || !url.startsWith("data:")) return url;
  if (!getAuthToken()) {
    throw new Error("Sign in as admin to save photos from your device.");
  }
  const form = await uploadImageField(url, "file");
  const result = await api.uploadProductImage(form);
  return result?.url || url;
}

async function resolveImageList(urls = []) {
  return Promise.all(urls.map((url) => resolveDataUrl(url)));
}

async function resolveProductImages(product) {
  const resolved = { ...product };
  resolved.cardCover = await resolveDataUrl(resolved.cardCover);
  resolved.coverImage = resolved.cardCover || resolved.coverImage;
  resolved.pdpCover = await resolveDataUrl(resolved.pdpCover || resolved.cardCover);
  resolved.cardScroll = await resolveImageList(resolved.cardScroll);
  resolved.pdpScroll = await resolveImageList(resolved.pdpScroll);
  resolved.closerLookExtra = await resolveImageList(resolved.closerLookExtra || resolved.closerLookImages);

  if (resolved.closerLookMain) {
    resolved.closerLookMain = {
      ...resolved.closerLookMain,
      image: await resolveDataUrl(
        resolved.closerLookMain.image || resolved.cardCover || resolved.cardScroll?.[0]
      ),
    };
  }

  if (Array.isArray(resolved.colorVariants)) {
    resolved.colorVariants = await Promise.all(
      resolved.colorVariants.map(async (variant) => ({
        ...variant,
        cardCover: await resolveDataUrl(variant.cardCover),
        pdpCover: await resolveDataUrl(variant.pdpCover),
        closerLookMain: await resolveDataUrl(variant.closerLookMain),
        cardScroll: await resolveImageList(variant.cardScroll),
        pdpScroll: await resolveImageList(variant.pdpScroll),
        closerLookExtra: await resolveImageList(variant.closerLookExtra),
      }))
    );
  }

  return normalizeCatalogProduct(resolved);
}

export async function resolveProductImagesForSave(product) {
  if (!productHasDataUrls(product)) return product;
  return resolveProductImages(product);
}

function productPayload(product) {
  return {
    slug: product.id,
    id: product.id,
    name: product.name,
    tag: product.tag,
    price: product.price,
    priceAmountDzd: product.priceAmountDzd,
    stockNote: product.stockNote,
    description: product.description,
    isPack: product.isPack,
    isNewArrival: product.isNewArrival,
    hasColorImages: product.hasColorImages,
    packLabel: product.packLabel,
    sections: product.sections,
    coverImage: product.cardCover || product.coverImage,
    cardCover: product.cardCover,
    cardScroll: product.cardScroll,
    pdpCover: product.pdpCover,
    pdpScroll: product.pdpScroll,
    cardImages: product.cardImages,
    closerLookImages: product.closerLookExtra || product.closerLookImages,
    closerLookExtra: product.closerLookExtra,
    closerLookMain: product.closerLookMain,
    colors: product.colors,
    colorVariants: product.colorVariants,
    materials: product.materials,
    size: product.size,
    filters: product.filters,
  };
}

export async function syncProductUpsert(product) {
  if (!getAuthToken()) return null;
  const body = productPayload(product);
  try {
    return await api.updateProduct(product.id, body);
  } catch (error) {
    const message = String(error.message || "");
    if (message.includes("not found") || message.includes("404")) {
      return api.createProduct(body);
    }
    throw error;
  }
}

export async function syncProductDelete(id) {
  if (!getAuthToken() || !id) return null;
  return api.deleteProduct(id);
}

function blogFormData(blog) {
  const form = new FormData();
  form.append("blogKey", blog.id);
  form.append("id", blog.id);
  form.append("title", blog.title || "");
  form.append("subtitle", blog.subtitle || "");
  form.append("templateId", blog.templateId || "editorial-story");
  form.append("status", blog.status || "draft");
  form.append("sections", JSON.stringify(blog.sections || []));
  form.append("linkedProductIds", JSON.stringify(blog.linkedProductIds || []));
  form.append("cta", JSON.stringify(blog.cta || { text: "", productIds: [] }));
  if (blog.publishedAt) form.append("publishedAt", new Date(blog.publishedAt).toISOString());

  if (blog.coverImage?.startsWith("data:")) {
    const upload = uploadImageField(blog.coverImage, "cover");
    return upload.then((uploadForm) => {
      uploadForm?.forEach((value, key) => form.append(key, value));
      return form;
    });
  }

  if (blog.coverImage) form.append("keepCover", blog.coverImage);
  return Promise.resolve(form);
}

export async function syncBlogUpsert(blog) {
  if (!getAuthToken()) return null;
  const form = await blogFormData(blog);
  try {
    return await api.updateBlog(blog.id, form);
  } catch {
    return api.createBlog(form);
  }
}

export async function syncBlogDelete(id) {
  if (!getAuthToken() || !id) return null;
  return api.deleteBlog(id);
}

export async function syncWebPicCreate(pic) {
  if (!getAuthToken()) return null;
  const form = new FormData();
  form.append("webPicKey", pic.id);
  form.append("id", pic.id);
  form.append("title", pic.title || "");
  form.append("device", pic.device);
  form.append("section", pic.section);
  form.append("linksToProduct", String(Boolean(pic.linksToProduct)));
  form.append("productSlug", pic.productId || "");
  if (pic.image?.startsWith("data:")) {
    const upload = await uploadImageField(pic.image, "file");
    upload?.forEach((value, key) => form.append(key, value));
  } else if (pic.image) {
    form.append("imageUrl", pic.image);
  }
  return api.createWebPic(form);
}

export async function syncWebPicDelete(id) {
  if (!getAuthToken() || !id) return null;
  return api.deleteWebPic(id);
}

export async function syncStyleLookUpsert(look) {
  if (!getAuthToken()) return null;
  const form = new FormData();
  form.append("lookKey", look.id);
  form.append("id", look.id);
  form.append("title", look.title || "");
  form.append("tag", look.tag || "");
  form.append("products", JSON.stringify(look.products || []));
  if (look.image?.startsWith("data:")) {
    const upload = await uploadImageField(look.image, "file");
    upload?.forEach((value, key) => form.append(key, value));
  } else if (look.image) {
    form.append("image", look.image);
  }
  try {
    return await api.updateStyleLook(look.id, form);
  } catch {
    return api.createStyleLook(form);
  }
}

export async function syncStyleLookDelete(id) {
  if (!getAuthToken() || !id) return null;
  return api.deleteStyleLook(id);
}

export async function syncReviewPublish(id) {
  if (!getAuthToken() || !id) return null;
  return api.publishReview(id);
}

export async function syncReviewDelete(id) {
  if (!getAuthToken() || !id) return null;
  return api.deleteReview(id);
}

export async function syncPublishedReviewCreate(review) {
  if (!getAuthToken()) return null;
  const form = new FormData();
  form.append("reviewKey", review.id);
  form.append("author", review.author);
  form.append("product", review.product);
  form.append("stars", String(review.stars || 5));
  form.append("comment", review.comment || "");
  form.append("reviewDate", review.date || "");
  form.append("source", review.source || "admin");
  form.append("status", "published");
  if (review.photo?.startsWith("data:")) {
    const upload = await uploadImageField(review.photo, "photo");
    upload?.forEach((value, key) => form.append(key, value));
  }
  return api.createReview(form);
}

export async function syncOrderStatus(orderId, status) {
  if (!getAuthToken() || !orderId || !status) return null;
  return api.updateOrderStatus(orderId, status);
}

export async function refreshCatalogFromBackend() {
  const products = await api.getProducts();
  if (Array.isArray(products)) {
    saveCatalogProducts(mergeCatalogFromApi(products));
  }
  return products;
}
