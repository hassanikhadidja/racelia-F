export function closeProfileSheet(page, overlayId, toggleSelector) {
  const overlay = page.querySelector(`#${overlayId}`);
  if (!overlay) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  if (toggleSelector) {
    page.querySelector(toggleSelector)?.setAttribute("aria-expanded", "false");
  }
}

export function openProfileSheet(page, overlayId, toggleSelector) {
  const overlay = page.querySelector(`#${overlayId}`);
  if (!overlay) return;
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  if (toggleSelector) {
    page.querySelector(toggleSelector)?.setAttribute("aria-expanded", "true");
  }
}

export function bindProfileSheet(page, { overlayId, toggleSelector, focusSelector, onOpen }) {
  const overlay = page.querySelector(`#${overlayId}`);
  const toggle = toggleSelector ? page.querySelector(toggleSelector) : null;
  if (!overlay) return;

  const open = () => {
    onOpen?.();
    openProfileSheet(page, overlayId, toggleSelector);
    if (focusSelector) {
      requestAnimationFrame(() => page.querySelector(focusSelector)?.focus());
    }
  };

  const close = () => closeProfileSheet(page, overlayId, toggleSelector);

  if (toggle) {
    toggle.addEventListener("click", open);
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  }

  overlay.querySelectorAll(`[data-close="${overlayId}"]`).forEach((btn) => {
    btn.addEventListener("click", close);
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  overlay.querySelector(".profile-sheet")?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  return { open, close, overlay };
}

export function getOpenProfileOverlay(page) {
  return page.querySelector(
    ".profile-orders-overlay.open, .profile-review-overlay.open, .profile-points-overlay.open, .profile-edit-overlay.open, #profile-egifts-overlay.open"
  );
}

export function closeTopProfileOverlay(page) {
  const orders = page.querySelector("#profile-orders-overlay");
  if (orders?.classList.contains("open")) {
    closeProfileSheet(page, "profile-orders-overlay", ".js-loyalty-orders-toggle");
    return true;
  }
  const egifts = page.querySelector("#profile-egifts-overlay");
  if (egifts?.classList.contains("open")) {
    closeProfileSheet(page, "profile-egifts-overlay", ".js-egifts-toggle");
    return true;
  }
  const review = page.querySelector("#profile-review-overlay");
  if (review?.classList.contains("open")) {
    closeProfileSheet(page, "profile-review-overlay", ".js-profile-reviews-open");
    return true;
  }
  const points = page.querySelector("#profile-points-overlay");
  if (points?.classList.contains("open")) {
    closeProfileSheet(page, "profile-points-overlay", ".js-profile-points-open");
    return true;
  }
  const edit = page.querySelector("#profile-edit-overlay");
  if (edit?.classList.contains("open")) {
    edit.classList.remove("open");
    edit.setAttribute("aria-hidden", "true");
    return true;
  }
  return false;
}
