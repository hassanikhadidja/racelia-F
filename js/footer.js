import { initCurrencyControls, refreshDisplayedPrices } from "./currency.js";

export function initFooter(root) {
  root.querySelectorAll(".js-footer-blogs").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-blogs"));
    });
  });

  root.querySelectorAll(".site-footer .accordion-header").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.parentElement;
      if (!item) return;
      item.classList.toggle("open");
      button.setAttribute(
        "aria-expanded",
        item.classList.contains("open") ? "true" : "false"
      );
    });
  });

  const contrastToggle = root.querySelector("#contrastToggle");
  contrastToggle?.addEventListener("click", () => {
    contrastToggle.classList.toggle("on");
    document.body.classList.toggle("footer-hc");
  });

  initCurrencyControls(root);
  refreshDisplayedPrices(root);

  const modal = root.querySelector("#subscribeModal");
  const openBtn = root.querySelector("#openSubscribe");
  const closeBtn = root.querySelector("#closeSubscribe");
  const form = root.querySelector("#subscribeForm");

  if (!modal || !openBtn || !closeBtn || !form) return;

  const openModal = () => {
    modal.classList.add("show");
    document.body.classList.add("no-scroll");
  };

  const closeModal = () => {
    modal.classList.remove("show");
    document.body.classList.remove("no-scroll");
  };

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstName = root.querySelector("#firstName")?.value.trim() ?? "";
    const lastName = root.querySelector("#lastName")?.value.trim() ?? "";
    const email = root.querySelector("#email")?.value.trim() ?? "";

    if (!firstName || !lastName || !email) {
      window.alert("All fields are mandatory.");
      return;
    }

    window.alert(`Thank you for subscribing, ${firstName}!`);
    form.reset();
    closeModal();
  });
}
