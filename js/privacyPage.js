import { scrollToHeading } from "./scrollToHeading.js";

export function initPrivacyPage(root) {
  const page = root.querySelector("#privacyPage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  // Keep SPA hash as #confidentialite — don't navigate away on TOC anchors.
  page.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#privacy-"]');
    if (!link || !page.contains(link)) return;

    event.preventDefault();
    const id = link.getAttribute("href")?.slice(1);
    const target = id ? page.querySelector(`#${CSS.escape(id)}`) : null;
    scrollToHeading(target);
  });
}
