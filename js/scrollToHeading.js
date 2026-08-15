export function scrollToHeading(target) {
  if (!target) return;
  const topbar = document.querySelector(".topbar");
  const offset = Math.round((topbar?.getBoundingClientRect().height || 64) + 16);
  const top = window.scrollY + target.getBoundingClientRect().top - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
