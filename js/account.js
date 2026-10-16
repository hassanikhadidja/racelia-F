import {
  closeAccount,
  showAccount,
  showClientProfile,
  leaveClientProfile,
  getCurrentPage,
} from "./pages.js";
import { getAuthToken } from "./api.js";
import { loginUser, registerUser, syncCollectedEmail } from "./syncBackend.js";
import { updateAccountButtons } from "./accountUi.js";
import { isValidCollectedEmail, upsertCollectedEmail } from "./dashboardEmailsData.js";
import { setFormStatus } from "./formStatus.js";

export function initAccount(root) {
  const accountPage = root.querySelector("#accountPage");
  const pageMain = root.querySelector("#pageMain");
  const accountMain = root.querySelector(".account-main");
  const openButtons = root.querySelectorAll(".js-account-open");

  if (!accountPage || !pageMain) return;

  const isLoggedIn = () => Boolean(getAuthToken());

  const isOpen = () => {
    if (isLoggedIn()) return getCurrentPage() === "client-profile";
    return !accountPage.hidden;
  };

  const closeMenu = () => {
    root.querySelector("#menuPanel")?.classList.remove("open");
    root.querySelector("#menuPanel")?.setAttribute("aria-hidden", "true");
    root.querySelector("#menuBackdrop")?.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  const openAccount = () => {
    closeMenu();
    if (isLoggedIn()) {
      showClientProfile(root);
      return;
    }
    showAccountTab("signin");
    showAccount(root);
  };

  root.addEventListener("racelia:open-account", () => openAccount());

  const closeAccountOrProfile = () => {
    if (isLoggedIn()) leaveClientProfile(root);
    else closeAccount(root);
  };

  const toggleAccount = () => {
    const forgotOpen = !accountPage.hidden && accountPage.querySelector("#accountForgot.active");
    if (!isLoggedIn() && forgotOpen) {
      openAccount();
      return;
    }
    if (isOpen()) closeAccountOrProfile();
    else openAccount();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleAccount();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      closeAccountOrProfile();
    }
  });

  const scrollAccountToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    accountMain?.scrollTo({ top: 0 });
  };

  const showAccountPanel = (panelId) => {
    accountPage.querySelectorAll(".account-panel-section").forEach((panel) => {
      panel.classList.toggle("active", panel.id === panelId);
    });
    scrollAccountToTop();
  };

  const showAccountTab = (tabName) => {
    accountPage.querySelector(".account-tabs")?.removeAttribute("hidden");
    accountPage.querySelectorAll(".account-tab").forEach((item) => {
      item.classList.toggle("active", item.dataset.tab === tabName);
    });
    showAccountPanel(tabName === "signin" ? "accountSignin" : "accountRegister");
  };

  const showForgotPassword = () => {
    const form = accountPage.querySelector("#accountForgotForm");
    const done = accountPage.querySelector("#accountForgotDone");
    accountPage.querySelector(".account-tabs")?.setAttribute("hidden", "");
    accountPage.querySelectorAll(".account-tab").forEach((item) => item.classList.remove("active"));
    if (form) {
      form.hidden = false;
      form.reset();
      setFormStatus(form, "");
    }
    if (done) done.hidden = true;
    showAccountPanel("accountForgot");
  };

  accountPage.querySelector("#accountForgotOpen")?.addEventListener("click", () => {
    showForgotPassword();
  });

  accountPage.querySelector("#accountForgotBack")?.addEventListener("click", () => {
    showAccountTab("signin");
  });

  accountPage.querySelectorAll(".account-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      showAccountTab(tab.dataset.tab);
    });
  });

  const syncAccountLabels = () => {
    accountPage.querySelectorAll(".account-field input, .account-field select").forEach((control) => {
      control.closest(".account-field")?.classList.toggle("account-field--has-value", Boolean(control.value));
    });
  };

  accountPage.addEventListener("input", (event) => {
    if (event.target.matches?.(".account-field input, .account-field select")) syncAccountLabels();
  });
  accountPage.addEventListener("change", (event) => {
    if (event.target.matches?.(".account-field input, .account-field select")) syncAccountLabels();
  });
  accountPage.addEventListener("animationstart", (event) => {
    if (event.animationName === "accountFieldAutofill") syncAccountLabels();
  });
  syncAccountLabels();
  [100, 400, 1000].forEach((delay) => window.setTimeout(syncAccountLabels, delay));

  accountPage.querySelectorAll(".account-field--password").forEach((field) => {
    const input = field.querySelector("input");
    const toggle = field.querySelector(".account-password-toggle");
    if (!input || !toggle) return;

    toggle.addEventListener("click", () => {
      const showPassword = input.type === "password";
      input.type = showPassword ? "text" : "password";
      toggle.classList.toggle("is-visible", showPassword);
      toggle.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
      toggle.setAttribute("aria-pressed", String(showPassword));
    });
  });

  accountPage.addEventListener("click", (event) => {
    const privacyLink = event.target.closest(".js-account-privacy");
    if (privacyLink && accountPage.contains(privacyLink)) {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-privacy"));
      return;
    }

    const termsLink = event.target.closest(".js-account-terms");
    if (termsLink && accountPage.contains(termsLink)) {
      event.preventDefault();
      root.dispatchEvent(new CustomEvent("racelia:open-terms"));
    }
  });

  root.querySelector("#accountSigninForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = root.querySelector("#accountSiEmail")?.value.trim();
    const password = root.querySelector("#accountSiPass")?.value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!email || !password) return;

    setFormStatus(form, "");
    submitBtn.disabled = true;
    try {
      await loginUser(email, password, root);
      updateAccountButtons(root);
      showClientProfile(root);
    } catch (error) {
      setFormStatus(form, error.message || "Connexion impossible.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  root.querySelector("#accountForgotForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = root.querySelector("#accountForgotName")?.value.trim();
    const email = root.querySelector("#accountForgotEmail")?.value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');
    const done = root.querySelector("#accountForgotDone");

    if (!name || !isValidCollectedEmail(email)) {
      setFormStatus(form, "Veuillez renseigner votre nom et une adresse e-mail valide.");
      return;
    }

    setFormStatus(form, "");
    submitBtn.disabled = true;
    try {
      const payload = {
        email,
        name,
        newsletter: false,
        source: "contact",
      };
      upsertCollectedEmail(payload);
      await syncCollectedEmail(payload);
      form.hidden = true;
      if (done) done.hidden = false;
    } catch (error) {
      setFormStatus(form, error.message || "Envoi impossible.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  root.querySelector("#accountRegisterForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = root.querySelector("#accountName")?.value.trim();
    const email = root.querySelector("#accountEmail")?.value.trim();
    const phone = root.querySelector("#accountPhone")?.value.trim();
    const password = root.querySelector("#accountPass")?.value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const signinForm = root.querySelector("#accountSigninForm");

    if (!name || !email || !password) return;

    setFormStatus(form, "");
    submitBtn.disabled = true;
    try {
      await registerUser({ name, email, phone, password });
      const payload = {
        email,
        name,
        newsletter: true,
        source: "account",
      };
      upsertCollectedEmail(payload);
      await syncCollectedEmail(payload);
      const emailInput = root.querySelector("#accountSiEmail");
      if (emailInput) emailInput.value = email;
      showAccountTab("signin");
      setFormStatus(signinForm, "Compte créé. Vous pouvez vous connecter.", "ok");
    } catch (error) {
      setFormStatus(form, error.message || "Inscription impossible.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  const refreshAccountUi = () => updateAccountButtons(root);
  refreshAccountUi();
  root.addEventListener("racelia:backend-synced", refreshAccountUi);
  root.addEventListener("racelia:client-synced", refreshAccountUi);
}
