import { initCurrencyControls, refreshDisplayedPrices } from "./currency.js";
import { upsertCollectedEmail } from "./dashboardEmailsData.js";
import { syncCollectedEmail } from "./syncBackend.js";
import { setFormStatus } from "./formStatus.js";

export function initFooter(root) {
  const subscribeModal = root.querySelector("#subscribeModal");
  const thanksModal = root.querySelector("#subscribeThanks");

  const lockPage = () => {
    document.body.classList.add("no-scroll");
  };

  const unlockPage = () => {
    if (subscribeModal?.classList.contains("show") || thanksModal?.classList.contains("show")) {
      return;
    }
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
  };

  const closeSubscribeModal = () => {
    if (!subscribeModal) return;
    subscribeModal.classList.remove("show");
    unlockPage();
  };

  const closeThanksModal = () => {
    if (!thanksModal) return;
    thanksModal.classList.remove("show");
    unlockPage();
  };

  const closeAllSubscribeDrawers = () => {
    subscribeModal?.classList.remove("show");
    thanksModal?.classList.remove("show");
    document.documentElement.classList.remove("no-scroll");
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
      closeAllSubscribeDrawers();
      root.dispatchEvent(new CustomEvent("racelia:open-privacy"));
    });
  });

  root.querySelectorAll(".js-footer-terms").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeAllSubscribeDrawers();
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
  const closeThanksBtn = root.querySelector("#closeSubscribeThanks");

  if (!modal || !openBtn || !closeBtn || !form) return;

  const openModal = () => {
    thanksModal?.classList.remove("show");
    modal.classList.add("show");
    modal.querySelector(".subscribe-modal-scroll")?.scrollTo(0, 0);
    lockPage();
  };

  const openThanksModal = () => {
    subscribeModal?.classList.remove("show");
    if (!thanksModal) return;
    thanksModal.classList.add("show");
    lockPage();
  };

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeSubscribeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeSubscribeModal();
  });
  closeThanksBtn?.addEventListener("click", closeThanksModal);
  thanksModal?.addEventListener("click", (event) => {
    if (event.target === thanksModal) closeThanksModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (thanksModal?.classList.contains("show")) {
      closeThanksModal();
      return;
    }
    if (modal.classList.contains("show")) closeSubscribeModal();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const lastName = form.querySelector("#lastName")?.value.trim() ?? "";
    const email = form.querySelector("#email")?.value.trim() ?? "";
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!lastName || !email) {
      setFormStatus(form, "Tous les champs sont obligatoires.");
      return;
    }

    const payload = {
      email,
      name: lastName,
      newsletter: true,
      source: "newsletter",
    };
    setFormStatus(form, "");
    if (submitBtn) submitBtn.disabled = true;
    try {
      upsertCollectedEmail(payload);
      await syncCollectedEmail(payload);
      form.reset();
      openThanksModal();
    } catch (error) {
      setFormStatus(form, error.message || "Inscription impossible.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
