import { selectionItems } from "../js/data.js";

function normalizeSelectionItem(item) {
  if (typeof item === "string") {
    return { label: item, page: null };
  }
  return item;
}

export function createSelectionWidget() {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.id = "backdrop";

  const container = document.createElement("div");
  container.className = "modal-animated-container";
  container.id = "selectionWidget";

  const panel = document.createElement("div");
  panel.className = "modal-animated-container__panel";
  panel.id = "animatedPanel";

  const ctaView = document.createElement("button");
  ctaView.className = "bottom-cta__view";
  ctaView.id = "ctaBtn";
  ctaView.type = "button";
  ctaView.innerHTML = `
    <span class="bottom-cta__content">
      <span class="bottom-cta__eyebrow">SACS</span>
      <span class="bottom-cta__label" id="ctaLabel">TOUTE LA SÉLECTION</span>
    </span>
    <span class="chev"></span>
  `;

  const modalView = document.createElement("div");
  modalView.className = "modal";
  modalView.id = "modalView";
  modalView.setAttribute("role", "dialog");
  modalView.setAttribute("aria-modal", "true");

  const tabs = document.createElement("div");
  tabs.className = "tabs";

  const tabBtn = document.createElement("button");
  tabBtn.className = "active";
  tabBtn.type = "button";
  tabBtn.textContent = "SACS";
  tabs.appendChild(tabBtn);

  const heading = document.createElement("button");
  heading.type = "button";
  heading.className = "modal__primary";
  heading.id = "modalHeading";
  heading.dataset.page = "home";
  heading.textContent = "TOUTE LA SÉLECTION";

  const listWrap = document.createElement("div");
  listWrap.className = "modal__list-wrap";
  listWrap.id = "modalListWrap";

  const list = document.createElement("ul");
  selectionItems.forEach((item) => {
    const { label, page } = normalizeSelectionItem(item);
    const li = document.createElement("li");
    li.textContent = label;
    if (page) li.dataset.page = page;
    list.appendChild(li);
  });
  listWrap.appendChild(list);

  const footer = document.createElement("div");
  footer.className = "modal__footer";

  const scrollLine = document.createElement("div");
  scrollLine.className = "modal__scroll-line";
  scrollLine.id = "modalScrollLine";

  const closeBtn = document.createElement("button");
  closeBtn.className = "close";
  closeBtn.id = "closeModal";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Fermer");

  footer.append(scrollLine, closeBtn);
  modalView.append(tabs, heading, listWrap, footer);
  panel.append(ctaView, modalView);
  container.appendChild(panel);

  const fragment = document.createDocumentFragment();
  fragment.append(backdrop, container);
  return fragment;
}
