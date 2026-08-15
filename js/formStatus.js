export function setFormStatus(host, message = "", type = "error") {
  if (!host) return;

  let el = host.querySelector(":scope > .form-status, .js-form-status");
  if (!el) {
    el = document.createElement("p");
    el.className = "form-status js-form-status";
    el.setAttribute("role", "status");
    const submit = host.querySelector(
      'button[type="submit"], .js-dashboard-product-save, .js-promo-apply, .apply-btn'
    );
    if (submit) submit.insertAdjacentElement("beforebegin", el);
    else host.appendChild(el);
  }

  const text = String(message || "").trim();
  el.textContent = text;
  el.hidden = !text;
  el.classList.toggle("form-status--error", Boolean(text) && type === "error");
  el.classList.toggle("form-status--ok", Boolean(text) && type === "ok");
}
