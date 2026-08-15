import { scrollToHeading } from "./scrollToHeading.js";

export function initTermsPage(root) {
  const page = root.querySelector("#termsPage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  page.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#terms-"]');
    if (!link || !page.contains(link)) return;

    event.preventDefault();
    const id = link.getAttribute("href")?.slice(1);
    const target = id ? page.querySelector(`#${CSS.escape(id)}`) : null;
    scrollToHeading(target);
  });
}
