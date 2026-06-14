import { createCtaDock } from "./CtaDock.js";

function createPdpAddedOverlay() {
  const backdrop = document.createElement("div");
  backdrop.className = "pdp-added-backdrop";
  backdrop.id = "pdpAddedBackdrop";
  backdrop.setAttribute("aria-hidden", "true");

  const overlay = document.createElement("div");
  overlay.className = "pdp-added-overlay";
  overlay.id = "pdpAddedOverlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "pdpAddedMsg");
  overlay.innerHTML = `
    <div class="pdp-added-top">
      <div class="pdp-added-msg" id="pdpAddedMsg"><span id="pdpAddedCount">1</span> item(s) successfully added to bag.</div>
      <button class="pdp-added-close" id="pdpAddedClose" type="button" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
      </button>
    </div>
    <div class="pdp-added-actions">
      <button class="pdp-added-checkout" type="button">CHECKOUT</button>
      <button class="pdp-added-view" type="button">VIEW SHOPPING BAG</button>
    </div>
  `;

  const fragment = document.createDocumentFragment();
  fragment.append(backdrop, overlay);
  return fragment;
}

function createPdpVirtualTryOn() {
  const backdrop = document.createElement("div");
  backdrop.className = "pdp-vto-backdrop";
  backdrop.id = "pdpVtoBackdrop";
  backdrop.setAttribute("aria-hidden", "true");

  const panel = document.createElement("div");
  panel.className = "pdp-vto-panel";
  panel.id = "pdpVtoPanel";
  panel.setAttribute("aria-hidden", "true");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "pdpVtoTitle");
  panel.innerHTML = `
    <div class="pdp-vto-head">
      <span class="pdp-vto-label">Virtual Try-On</span>
      <button class="pdp-vto-close" id="pdpVtoClose" type="button" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
      </button>
    </div>
    <h3 class="pdp-vto-title" id="pdpVtoTitle"></h3>
    <p class="pdp-vto-color" id="pdpVtoColor"></p>
    <div class="pdp-vto-preview">
      <img id="pdpVtoImg" alt="" />
    </div>
    <p class="pdp-vto-note">Preview how this bag looks before you choose.</p>
  `;

  const fragment = document.createDocumentFragment();
  fragment.append(backdrop, panel);
  return fragment;
}

export function createProductDetailPage() {
  const page = document.createElement("section");
  page.className = "pdp-page";
  page.id = "productDetailPage";
  page.hidden = true;

  const app = document.createElement("div");
  app.className = "pdp-app";
  app.id = "pdpRoot";
  page.appendChild(app);
  page.appendChild(createPdpAddedOverlay());
  page.appendChild(createPdpVirtualTryOn());
  page.appendChild(
    createCtaDock({
      sectionId: "pdpCtaDock",
      slotId: "pdpCtaDockSlot",
      actionSlotId: "pdpActionBarDockSlot",
    })
  );

  return page;
}
