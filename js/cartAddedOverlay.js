export function openPdpAddedOverlay(root, quantity = 1) {
  const backdrop = root.querySelector("#pdpAddedBackdrop");
  const overlay = root.querySelector("#pdpAddedOverlay");
  const count = root.querySelector("#pdpAddedCount");
  if (!backdrop || !overlay) return;

  if (count) count.textContent = String(Math.max(1, Number(quantity) || 1));
  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("pdp-added-open");
}

export function closePdpAddedOverlay(root) {
  const backdrop = root.querySelector("#pdpAddedBackdrop");
  const overlay = root.querySelector("#pdpAddedOverlay");
  if (!backdrop || !overlay) return;

  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("pdp-added-open");
}

export function initCartAddedOverlay(root) {
  if (!root || root.dataset.cartAddedBound === "true") return;
  root.dataset.cartAddedBound = "true";

  root.addEventListener("click", (event) => {
    if (event.target.closest("#pdpAddedClose") || event.target.closest("#pdpAddedBackdrop")) {
      closePdpAddedOverlay(root);
      return;
    }

    if (event.target.closest(".pdp-added-checkout")) {
      event.preventDefault();
      closePdpAddedOverlay(root);
      root.dispatchEvent(new CustomEvent("racelia:open-checkout"));
      return;
    }

    if (event.target.closest(".pdp-added-view")) {
      event.preventDefault();
      closePdpAddedOverlay(root);
      root.dispatchEvent(new CustomEvent("racelia:open-shopping-bag"));
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("pdp-added-open")) {
      closePdpAddedOverlay(root);
    }
  });
}
