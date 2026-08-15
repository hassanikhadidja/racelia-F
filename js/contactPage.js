import { upsertCollectedEmail } from "./dashboardEmailsData.js";
import { syncCollectedEmail } from "./syncBackend.js";

const MESSAGE_MAX = 200;
const MESSAGE_LINES = 5;

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function messageStats(text) {
  const value = String(text || "");
  const lines = value.split(/\n/).length;
  return {
    charsLeft: Math.max(0, MESSAGE_MAX - value.length),
    linesLeft: Math.max(0, MESSAGE_LINES - lines),
  };
}

export function initContactPage(root) {
  const page = root.querySelector("#contactPage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  const form = page.querySelector("#contactForm");
  const submitBtn = page.querySelector("#contactSubmitBtn");
  const statusEl = page.querySelector("#contactFormStatus");
  const nameInput = page.querySelector("#contact-name");
  const emailInput = page.querySelector("#contact-email");
  const subjectInput = page.querySelector("#contact-subject");
  const messageInput = page.querySelector("#contact-message");
  const charCounter = page.querySelector("#contactCharCounter");
  const lineCounter = page.querySelector("#contactLineCounter");

  const setStatus = (message, type = "") => {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.classList.toggle("is-error", type === "error");
    statusEl.classList.toggle("is-ok", type === "ok");
  };

  const updateCounter = () => {
    const stats = messageStats(messageInput?.value);
    if (charCounter) {
      charCounter.textContent = `${stats.charsLeft}/${MESSAGE_MAX} caractères restants`;
    }
    if (lineCounter) {
      lineCounter.textContent = `${stats.linesLeft}/${MESSAGE_LINES} lignes restantes`;
    }
  };

  const validate = () => {
    const nameOk = Boolean(nameInput?.value.trim());
    const emailOk = isValidEmail(emailInput?.value);
    const subjectOk = Boolean(subjectInput?.value.trim());
    const messageOk = Boolean(messageInput?.value.trim());
    const ok = nameOk && emailOk && subjectOk && messageOk;
    if (submitBtn) submitBtn.disabled = !ok;
    return ok;
  };

  form?.addEventListener("input", () => {
    setStatus("");
    validate();
  });

  messageInput?.addEventListener("input", () => {
    const lines = String(messageInput.value || "").split(/\n/);
    if (lines.length > MESSAGE_LINES) {
      messageInput.value = lines.slice(0, MESSAGE_LINES).join("\n");
    }
    if (messageInput.value.length > MESSAGE_MAX) {
      messageInput.value = messageInput.value.slice(0, MESSAGE_MAX);
    }
    updateCounter();
    validate();
  });

  page.querySelector(".js-contact-privacy")?.addEventListener("click", (event) => {
    event.preventDefault();
    root.dispatchEvent(new CustomEvent("racelia:open-privacy"));
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validate()) {
      setStatus("Veuillez renseigner les champs obligatoires.", "error");
      return;
    }
    const payload = {
      email: emailInput.value,
      name: nameInput.value.trim(),
      newsletter: false,
      source: "contact",
    };
    upsertCollectedEmail(payload);
    await syncCollectedEmail(payload);
    setStatus("Votre message a bien été envoyé. Notre service client vous répondra rapidement.", "ok");
    form.reset();
    updateCounter();
    validate();
  });

  updateCounter();
  validate();
}
