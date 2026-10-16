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
  const aboutPage = root.querySelector("#aboutPage");
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

  if (aboutPage && !aboutPage.hidden) {
    return root.querySelector("#aboutCtaDock");
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
  const aboutPage = root.querySelector("#aboutPage");
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

  if (aboutPage && !aboutPage.hidden) {
    return root.querySelector("#aboutCtaDockSlot");
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

function hasPassedHomeMetiersSection(root) {
  const pageMain = root.querySelector("#pageMain");
  if (!pageMain || pageMain.hidden) return true;

  const section = root.querySelector("#metiersArtSection");
  if (!section) return true;

  return section.getBoundingClientRect().bottom <= 0;
}

export function updateCtaDock(root) {
  const widget = root.querySelector("#selectionWidget");
  const dock = getActiveDock(root);

  if (!dock || !widget) return;
  if (widget.classList.contains("modal-animated-container--open")) {
    widget.classList.remove("is-hidden-until-scroll");
    return;
  }

  const passed = hasPassedHomeMetiersSection(root);
  const onPdp = isOnProductDetailPage(root);
  const docked = isCtaDockReached(root);

  widget.classList.remove("modal-animated-container--pdp");
  widget.classList.toggle("is-hidden-until-scroll", !passed);
  widget.classList.toggle("modal-animated-container--instant-dock", onPdp);
  widget.classList.toggle("modal-animated-container--docked", docked);

  updatePdpActionBar(root);
}
