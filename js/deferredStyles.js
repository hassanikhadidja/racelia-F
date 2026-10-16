/** Styles for screens that are not the first homepage paint. Loaded after render. */

const sheets = [
  () => import("../styles/raceliaStyle.css"),
  () => import("../styles/account.css"),
  () => import("../styles/categoryPage.css"),
  () => import("../styles/blogsPage.css"),
  () => import("../styles/privacyPage.css"),
  () => import("../styles/termsPage.css"),
  () => import("../styles/shippingPage.css"),
  () => import("../styles/boutiquesPage.css"),
  () => import("../styles/faqPage.css"),
  () => import("../styles/returnsPage.css"),
  () => import("../styles/giftCardPage.css"),
  () => import("../styles/contactPage.css"),
  () => import("../styles/aboutPage.css"),
  () => import("../styles/productDetail.css"),
  () => import("../styles/dashboard.css"),
  () => import("../styles/dashboard-theme.css"),
  () => import("../styles/clientProfile.css"),
  () => import("../styles/clientProfile-theme.css"),
  () => import("../styles/shoppingBag.css"),
  () => import("../styles/shoppingBag-theme.css"),
  () => import("../styles/wishlist.css"),
  () => import("../styles/checkout.css"),
];

export function loadDeferredStyles() {
  return Promise.all(sheets.map((load) => load()));
}
