import { updateCtaDock } from "./ctaDock.js";
import { updateTopbar } from "./topbar.js";

export function initScrollChrome(root) {
  let frame = 0;

  const run = () => {
    frame = 0;
    updateTopbar(root);
    updateCtaDock(root);
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(run);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  run();
}
