import { updatePdpActionBar } from "./pdpActionBar.js";

const CTA_BOTTOM = 16;
const CTA_HEIGHT = 55;

function getActiveDock(root) {
  const productDetailPage = root.querySelector("#productDetailPage");
  const categoryPage = root.querySelector("#categoryPage");
  const blogsPage = root.querySelector("#blogsPage");
  const privacyPage = root.querySelector("#privacyPage");
  const termsPage = root.querySelector("#termsPage");
  const shippingPage = root.querySelector("#shippingPage");
  const boutiquesPage = root.querySelector("#boutiquesPage");
  const faqPage = root.querySelector("#faqPage");
  const returnsPage = root.querySelector("#returnsPage");
  const giftCardPage = root.querySelector("#giftCardPage");
  const contactPage = root.querySelector("#contactPage");
  const pageMain = root.querySelector("#pageMain");

  if (productDetailPage && !productDetailPage.hidden) {
    return root.querySelector("#pdpCtaDock");
  }

  if (categoryPage && !categoryPage.hidden) {
    return root.querySelector("#categoryCtaDock");
  }

  if (blogsPage && !blogsPage.hidden) {
    return root.querySelector("#blogsCtaDock");
  }

  if (privacyPage && !privacyPage.hidden) {
    return root.querySelector("#privacyCtaDock");
  }

  if (termsPage && !termsPage.hidden) {
    return root.querySelector("#termsCtaDock");
  }

  if (shippingPage && !shippingPage.hidden) {
    return root.querySelector("#shippingCtaDock");
  }

  if (boutiquesPage && !boutiquesPage.hidden) {
    return root.querySelector("#boutiquesCtaDock");
  }

  if (faqPage && !faqPage.hidden) {
    return root.querySelector("#faqCtaDock");
  }

  if (returnsPage && !returnsPage.hidden) {
    return root.querySelector("#returnsCtaDock");
  }

  if (giftCardPage && !giftCardPage.hidden) {
    return root.querySelector("#giftCardCtaDock");
  }

  if (contactPage && !contactPage.hidden) {
    return root.querySelector("#contactCtaDock");
  }

  if (pageMain && !pageMain.hidden) {
    return root.querySelector("#ctaDock");
  }

  return null;
}

function isOnProductDetailPage(root) {
  const page = root.querySelector("#productDetailPage");
  return page && !page.hidden;
}

export { isOnProductDetailPage };

export function getActiveDockSlot(root) {
  const productDetailPage = root.querySelector("#productDetailPage");
  const categoryPage = root.querySelector("#categoryPage");
  const blogsPage = root.querySelector("#blogsPage");
  const privacyPage = root.querySelector("#privacyPage");
  const termsPage = root.querySelector("#termsPage");
  const shippingPage = root.querySelector("#shippingPage");
  const boutiquesPage = root.querySelector("#boutiquesPage");
  const faqPage = root.querySelector("#faqPage");
  const returnsPage = root.querySelector("#returnsPage");
  const giftCardPage = root.querySelector("#giftCardPage");
  const contactPage = root.querySelector("#contactPage");
  const pageMain = root.querySelector("#pageMain");

  if (productDetailPage && !productDetailPage.hidden) {
    return root.querySelector("#pdpCtaDockSlot");
  }

  if (categoryPage && !categoryPage.hidden) {
    return root.querySelector("#categoryCtaDockSlot");
  }

  if (blogsPage && !blogsPage.hidden) {
    return root.querySelector("#blogsCtaDockSlot");
  }

  if (privacyPage && !privacyPage.hidden) {
    return root.querySelector("#privacyCtaDockSlot");
  }

  if (termsPage && !termsPage.hidden) {
    return root.querySelector("#termsCtaDockSlot");
  }

  if (shippingPage && !shippingPage.hidden) {
    return root.querySelector("#shippingCtaDockSlot");
  }

  if (boutiquesPage && !boutiquesPage.hidden) {
    return root.querySelector("#boutiquesCtaDockSlot");
  }

  if (faqPage && !faqPage.hidden) {
    return root.querySelector("#faqCtaDockSlot");
  }

  if (returnsPage && !returnsPage.hidden) {
    return root.querySelector("#returnsCtaDockSlot");
  }

  if (giftCardPage && !giftCardPage.hidden) {
    return root.querySelector("#giftCardCtaDockSlot");
  }

  if (contactPage && !contactPage.hidden) {
    return root.querySelector("#contactCtaDockSlot");
  }

  if (pageMain && !pageMain.hidden) {
    return root.querySelector("#ctaDockSlot");
  }

  return null;
}

export function isCtaDockReached(root) {
  const dock = getActiveDock(root);
  if (!dock) return false;

  const dockTop = dock.getBoundingClientRect().top;
  const limit = window.innerHeight - CTA_BOTTOM - CTA_HEIGHT;
  return dockTop <= limit;
}

export function updateCtaDock(root) {
  const widget = root.querySelector("#selectionWidget");
  const dock = getActiveDock(root);

  if (!dock || !widget) return;
  if (widget.classList.contains("modal-animated-container--open")) return;

  widget.classList.remove("modal-animated-container--pdp");
  widget.classList.toggle("modal-animated-container--instant-dock", isOnProductDetailPage(root));
  widget.classList.toggle("modal-animated-container--docked", isCtaDockReached(root));

  updatePdpActionBar(root);
}

export function initCtaDock(root) {
  updateCtaDock(root);
  window.addEventListener("scroll", () => updateCtaDock(root), { passive: true });
  window.addEventListener("resize", () => updateCtaDock(root));
}
