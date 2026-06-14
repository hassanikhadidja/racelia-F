import { selectionItems } from "../js/data.js";

export function createSelectionModal() {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.id = "backdrop";

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  const tabs = document.createElement("div");
  tabs.className = "tabs";

  const tabBtn = document.createElement("button");
  tabBtn.className = "active";
  tabBtn.textContent = "HANDBAGS";
  tabs.appendChild(tabBtn);

  const heading = document.createElement("h3");
  heading.textContent = "ALL SELECTION";

  const list = document.createElement("ul");
  selectionItems.forEach((label) => {
    const li = document.createElement("li");
    li.textContent = label;
    list.appendChild(li);
  });

  const closeBtn = document.createElement("button");
  closeBtn.className = "close";
  closeBtn.id = "closeModal";
  closeBtn.setAttribute("aria-label", "Close");

  modal.append(tabs, heading, list, closeBtn);

  const fragment = document.createDocumentFragment();
  fragment.append(backdrop, modal);
  return fragment;
}
