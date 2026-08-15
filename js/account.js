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
import { upsertCollectedEmail } from "./dashboardEmailsData.js";

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
    if (isLoggedIn()) showClientProfile(root);
    else showAccount(root);
  };

  root.addEventListener("racelia:open-account", () => openAccount());

  const closeAccountOrProfile = () => {
    if (isLoggedIn()) leaveClientProfile(root);
    else closeAccount(root);
  };

  const toggleAccount = () => {
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

  accountPage.querySelectorAll(".account-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      accountPage.querySelectorAll(".account-tab").forEach((item) => {
        item.classList.remove("active");
      });
      accountPage.querySelectorAll(".account-panel-section").forEach((panel) => {
        panel.classList.remove("active");
      });
      tab.classList.add("active");
      const panel = accountPage.querySelector(
        `#account${tab.dataset.tab === "signin" ? "Signin" : "Register"}`
      );
      panel?.classList.add("active");
      accountMain?.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  accountPage.querySelectorAll(".account-field--select select").forEach((select) => {
    const sync = () => {
      select.closest(".account-field")?.classList.toggle("account-field--has-value", !!select.value);
    };
    select.addEventListener("change", sync);
    sync();
  });

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

  accountPage.querySelector(".js-account-privacy")?.addEventListener("click", (event) => {
    event.preventDefault();
    closeAccount(root);
    root.dispatchEvent(new CustomEvent("racelia:open-privacy"));
  });

  accountPage.querySelector(".js-account-terms")?.addEventListener("click", (event) => {
    event.preventDefault();
    closeAccount(root);
    root.dispatchEvent(new CustomEvent("racelia:open-terms"));
  });

  root.querySelector("#accountSigninForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = root.querySelector("#accountSiEmail")?.value.trim();
    const password = root.querySelector("#accountSiPass")?.value;
    const submitBtn = event.target.querySelector('button[type="submit"]');

    if (!email || !password) return;

    submitBtn.disabled = true;
    try {
      await loginUser(email, password, root);
      updateAccountButtons(root);
      showClientProfile(root);
    } catch (error) {
      window.alert(error.message || "Sign in failed.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  root.querySelector("#accountRegisterForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = root.querySelector("#accountName")?.value.trim();
    const email = root.querySelector("#accountEmail")?.value.trim();
    const phone = root.querySelector("#accountPhone")?.value.trim();
    const password = root.querySelector("#accountPass")?.value;
    const submitBtn = event.target.querySelector('button[type="submit"]');

    if (!name || !email || !password) return;

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
      window.alert("Account created. You can sign in now.");
      closeAccount(root);
    } catch (error) {
      window.alert(error.message || "Registration failed.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  const refreshAccountUi = () => updateAccountButtons(root);
  refreshAccountUi();
  root.addEventListener("racelia:backend-synced", refreshAccountUi);
  root.addEventListener("racelia:client-synced", refreshAccountUi);
}
