import { initCurrencyControls, refreshDisplayedPrices } from "./currency.js";
import { upsertCollectedEmail } from "./dashboardEmailsData.js";
import { syncCollectedEmail } from "./syncBackend.js";

export function initFooter(root) {
  const subscribeModal = root.querySelector("#subscribeModal");

  const closeSubscribeModal = () => {
    if (!subscribeModal) return;
    subscribeModal.classList.remove("show");
    document.body.classList.remove("no-scroll");
  };

  root.querySelectorAll(".js-footer-blogs").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-blogs"));
    });
  });

  root.querySelectorAll(".js-footer-privacy").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeSubscribeModal();
      root.dispatchEvent(new CustomEvent("racelia:open-privacy"));
    });
  });

  root.querySelectorAll(".js-footer-terms").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeSubscribeModal();
      root.dispatchEvent(new CustomEvent("racelia:open-terms"));
    });
  });

  root.querySelectorAll(".js-footer-shipping").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-shipping"));
    });
  });

  root.querySelectorAll(".js-footer-boutiques").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-boutiques"));
    });
  });

  root.querySelectorAll(".js-footer-account").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-account"));
    });
  });

  root.querySelectorAll(".js-footer-faq").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-faq"));
    });
  });

  root.querySelectorAll(".js-footer-returns").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-returns"));
    });
  });

  root.querySelectorAll(".js-footer-contact").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-contact"));
    });
  });

  root.querySelectorAll(".js-footer-gift-card").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-gift-card"));
    });
  });

  root.querySelectorAll(".js-footer-style").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-style"));
    });
  });

  const storeSearchInput = root.querySelector(".site-footer .store-search input");
  root.querySelectorAll(".site-footer .store-search .footer-icon-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.dispatchEvent(
        new CustomEvent("racelia:open-boutiques", {
          detail: { query: storeSearchInput?.value?.trim() || "" },
        })
      );
    });
  });
  storeSearchInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    root.dispatchEvent(
      new CustomEvent("racelia:open-boutiques", {
        detail: { query: storeSearchInput.value.trim() },
      })
    );
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

  const modal = subscribeModal;
  const openBtn = root.querySelector("#openSubscribe");
  const closeBtn = root.querySelector("#closeSubscribe");
  const form = root.querySelector("#subscribeForm");

  if (!modal || !openBtn || !closeBtn || !form) return;

  const openModal = () => {
    modal.classList.add("show");
    document.body.classList.add("no-scroll");
  };

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeSubscribeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeSubscribeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      closeSubscribeModal();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const lastName = form.querySelector("#lastName")?.value.trim() ?? "";
    const email = form.querySelector("#email")?.value.trim() ?? "";

    if (!lastName || !email) {
      window.alert("All fields are mandatory.");
      return;
    }

    const payload = {
      email,
      name: lastName,
      newsletter: true,
      source: "newsletter",
    };
    upsertCollectedEmail(payload);
    await syncCollectedEmail(payload);
    window.alert("Thank you for subscribing!");
    form.reset();
    closeSubscribeModal();
  });
}
