const SHEET_SCROLL_SELECTOR =
  ".profile-sheet-scroll, .pdp-review-sheet, .dashboard-review-form, .profile-edit-sheet";

function scrollerFromEvent(overlay, target) {
  const scroller = overlay.querySelector(SHEET_SCROLL_SELECTOR);
  return scroller?.contains(target) ? scroller : null;
}

export function trapOverlayScroll(overlay) {
  if (!overlay || overlay.dataset.scrollTrapped === "true") return;
  overlay.dataset.scrollTrapped = "true";

  overlay.addEventListener(
    "wheel",
    (event) => {
      const scroller = scrollerFromEvent(overlay, event.target);
      if (!scroller) {
        event.preventDefault();
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      const atTop = scrollTop <= 0 && event.deltaY < 0;
      const atBottom =
        scrollTop + clientHeight >= scrollHeight - 1 && event.deltaY > 0;
      if (atTop || atBottom) event.preventDefault();
    },
    { passive: false }
  );

  overlay.addEventListener(
    "touchmove",
    (event) => {
      if (!scrollerFromEvent(overlay, event.target)) event.preventDefault();
    },
    { passive: false }
  );
}

export function setDrawerScrollLock(on, className) {
  document.documentElement.classList.toggle(className, on);
  document.body.classList.toggle(className, on);
}
