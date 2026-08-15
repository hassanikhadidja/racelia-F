import { WILAYAS } from "./checkoutWilayas.js";
import { addReturnRequest, fileToDataUrl } from "./dashboardEmailsData.js";
import { syncReturnCreate } from "./syncBackend.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function initReturnsPage(root) {
  const page = root.querySelector("#returnsPage");
  if (!page) return;

  const form = page.querySelector("#returnsForm");
  const submitBtn = page.querySelector("#returnsSubmitBtn");
  const statusEl = page.querySelector("#returnsFormStatus");
  const nameInput = page.querySelector("#returns-name");
  const phoneInput = page.querySelector("#returns-phone");
  const emailInput = page.querySelector("#returns-email");
  const commentInput = page.querySelector("#returns-comment");
  const fileInput = page.querySelector("#returns-picture");
  const attachBtn = page.querySelector("#returnsAttachBtn");
  const fileNameEl = page.querySelector("#returnsPictureName");
  const wilayaHidden = page.querySelector("#returns-wilaya");
  const wilayaDisplay = page.querySelector("#returnsWilayaDisplay");
  const wilayaTrigger = page.querySelector("#returnsWilayaTrigger");
  const overlay = page.querySelector("#returnsPickerOverlay");
  const pickerList = page.querySelector("#returnsPickerList");
  const pickerSearch = page.querySelector("#returnsPickerSearch");
  const pickerClose = page.querySelector("#returnsPickerClose");

  const validate = () => {
    const ok =
      Boolean(nameInput?.value.trim()) &&
      Boolean(phoneInput?.value.trim()) &&
      Boolean(commentInput?.value.trim()) &&
      Boolean(page.querySelector('input[name="request_type"]:checked'));
    if (submitBtn) submitBtn.disabled = !ok;
    return ok;
  };

  const setStatus = (message, type = "") => {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.classList.toggle("is-error", type === "error");
    statusEl.classList.toggle("is-ok", type === "ok");
  };

  const renderWilayas = (query = "") => {
    if (!pickerList) return;
    const q = String(query).trim().toLowerCase();
    const items = WILAYAS.filter((w) => {
      if (!q) return true;
      return `${w.code} ${w.name}`.toLowerCase().includes(q);
    });
    if (!items.length) {
      pickerList.innerHTML = `<li class="picker-empty">Aucune wilaya trouvée.</li>`;
      return;
    }
    const selected = wilayaHidden?.value || "";
    pickerList.innerHTML = items
      .map(
        (w) => `<li>
          <button type="button" role="option" data-code="${escapeHtml(w.code)}" data-name="${escapeHtml(w.name)}" class="${selected === w.code ? "selected" : ""}">${escapeHtml(w.code)} — ${escapeHtml(w.name)}</button>
        </li>`
      )
      .join("");
  };

  const openPicker = () => {
    overlay?.classList.add("open");
    overlay?.setAttribute("aria-hidden", "false");
    document.body.classList.add("returns-picker-open");
    renderWilayas(pickerSearch?.value || "");
    requestAnimationFrame(() => pickerSearch?.focus());
  };

  const closePicker = () => {
    overlay?.classList.remove("open");
    overlay?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("returns-picker-open");
  };

  if (page.dataset.bound !== "true") {
    page.dataset.bound = "true";

    form?.addEventListener("input", () => {
      setStatus("");
      validate();
    });
    form?.addEventListener("change", validate);

    attachBtn?.addEventListener("click", () => fileInput?.click());
    fileInput?.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (fileNameEl) {
        if (file) {
          fileNameEl.hidden = false;
          fileNameEl.textContent = file.name;
        } else {
          fileNameEl.hidden = true;
          fileNameEl.textContent = "";
        }
      }
    });

    wilayaTrigger?.addEventListener("click", openPicker);
    pickerClose?.addEventListener("click", closePicker);
    overlay?.addEventListener("click", (event) => {
      if (event.target === overlay) closePicker();
    });
    pickerSearch?.addEventListener("input", () => renderWilayas(pickerSearch.value));
    pickerList?.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-code]");
      if (!btn) return;
      if (wilayaHidden) wilayaHidden.value = btn.dataset.code || "";
      if (wilayaDisplay) {
        wilayaDisplay.textContent = `${btn.dataset.code} — ${btn.dataset.name}`;
        wilayaDisplay.classList.remove("placeholder");
      }
      closePicker();
      validate();
    });

    page.querySelector(".js-returns-policy")?.addEventListener("click", (event) => {
      event.preventDefault();
      root.dispatchEvent(
        new CustomEvent("racelia:open-terms", {
          detail: { headingId: "terms-returns" },
        })
      );
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validate()) {
        setStatus("Veuillez remplir les champs obligatoires.", "error");
        return;
      }
      const wilayaCode = wilayaHidden?.value || "";
      const wilayaName = WILAYAS.find((item) => item.code === wilayaCode)?.name || "";
      const payload = {
        requestType: page.querySelector('input[name="request_type"]:checked')?.value || "reclamation",
        name: nameInput?.value.trim() || "",
        phone: phoneInput?.value.trim() || "",
        email: emailInput?.value.trim() || "",
        wilaya: wilayaCode,
        wilayaName,
        comment: commentInput?.value.trim() || "",
      };
      const saved = await syncReturnCreate(payload, fileInput?.files?.[0]);
      if (!saved) {
        const picture = await fileToDataUrl(fileInput?.files?.[0]);
        addReturnRequest({ ...payload, picture });
      }
      setStatus("Votre demande a bien été envoyée. Notre service client vous contactera rapidement.", "ok");
      form.reset();
      if (wilayaHidden) wilayaHidden.value = "";
      if (wilayaDisplay) {
        wilayaDisplay.textContent = "Sélectionner une wilaya";
        wilayaDisplay.classList.add("placeholder");
      }
      if (fileNameEl) {
        fileNameEl.hidden = true;
        fileNameEl.textContent = "";
      }
      const claim = page.querySelector('input[name="request_type"][value="reclamation"]');
      if (claim) claim.checked = true;
      validate();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay?.classList.contains("open")) {
        closePicker();
      }
    });
  }

  validate();
}
