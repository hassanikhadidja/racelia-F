import { WILAYAS, COMMUNES_BY_WILAYA } from "./checkoutWilayas.js";

export function closeCheckoutGeoPanels(page) {
  closeAllPanels(page);
}

function resetPanelPosition(panel) {
  if (!panel) return;
  panel.style.position = "";
  panel.style.left = "";
  panel.style.width = "";
  panel.style.maxHeight = "";
  panel.style.top = "";
  panel.style.bottom = "";
  panel.style.zIndex = "";
}

function closeAllPanels(page) {
  page.querySelectorAll(".checkout-geo-select").forEach((wrap) => {
    wrap.classList.remove("is-open");
    const panel = wrap.querySelector(".checkout-geo-select__panel");
    const trigger = wrap.querySelector(".checkout-geo-select__trigger");
    if (panel) {
      panel.hidden = true;
      resetPanelPosition(panel);
    }
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  });
}

function positionPanel(trigger, panel) {
  const rect = trigger.getBoundingClientRect();
  const gap = 6;
  const spaceBelow = window.innerHeight - rect.bottom - gap - 16;
  const spaceAbove = rect.top - gap - 16;
  const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
  const maxHeight = Math.max(160, openUp ? spaceAbove : spaceBelow);

  panel.style.position = "fixed";
  panel.style.left = `${rect.left}px`;
  panel.style.width = `${rect.width}px`;
  panel.style.maxHeight = `${maxHeight}px`;
  panel.style.zIndex = "1300";

  if (openUp) {
    panel.style.top = "auto";
    panel.style.bottom = `${window.innerHeight - rect.top + gap}px`;
  } else {
    panel.style.bottom = "auto";
    panel.style.top = `${rect.bottom + gap}px`;
  }
}

function createGeoSelect(page, config) {
  const {
    key,
    nativeSelect,
    trigger,
    valueEl,
    panel,
    searchInput,
    listEl,
    getOptions,
    placeholder,
    disabled = false,
    searchable = true,
    onSelect,
  } = config;

  const wrap = trigger.closest(".checkout-geo-select");

  const renderList = (filter = "") => {
    const query = filter.trim().toLowerCase();
    const options = getOptions();
    listEl.replaceChildren();

    const filtered = query
      ? options.filter((opt) => opt.label.toLowerCase().includes(query))
      : options;

    if (!filtered.length) {
      const empty = document.createElement("li");
      empty.className = "checkout-geo-select__empty";
      empty.textContent = "No results";
      listEl.appendChild(empty);
      return;
    }

    filtered.forEach((opt) => {
      const li = document.createElement("li");
      li.className = "checkout-geo-select__option";
      li.setAttribute("role", "option");
      li.dataset.value = opt.value;
      li.textContent = opt.label;
      if (nativeSelect.value === opt.value) li.setAttribute("aria-selected", "true");
      li.addEventListener("click", () => selectValue(opt));
      listEl.appendChild(li);
    });
  };

  const setTriggerLabel = (text) => {
    valueEl.textContent = text || placeholder;
    trigger.classList.toggle("is-placeholder", !nativeSelect.value);
  };

  const selectValue = (opt) => {
    nativeSelect.value = opt?.value ?? "";
    setTriggerLabel(opt?.label ?? placeholder);
    nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    onSelect?.(opt?.value ?? "");
    closeAllPanels(page);
    searchInput.value = "";
    renderList();
  };

  const open = () => {
    if (disabled || trigger.disabled) return;
    closeAllPanels(page);
    wrap.classList.add("is-open");
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    positionPanel(trigger, panel);
    renderList(searchInput.value);
    if (searchable) searchInput.focus();
  };

  trigger.addEventListener("click", () => {
    if (wrap.classList.contains("is-open")) {
      closeAllPanels(page);
    } else {
      open();
    }
  });

  searchInput?.addEventListener("input", () => renderList(searchInput.value));

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAllPanels(page);
    }
  });

  return {
    key,
    renderList,
    setTriggerLabel,
    selectValue,
    reset: () => {
      nativeSelect.value = "";
      setTriggerLabel(placeholder);
      renderList();
    },
    setDisabled: (isDisabled) => {
      trigger.disabled = isDisabled;
      wrap.classList.toggle("is-disabled", isDisabled);
      if (isDisabled) closeAllPanels(page);
    },
  };
}

export function initCheckoutGeoSelects(page, { onWilayaChange } = {}) {
  const wilayaNative = page.querySelector("#checkout-wilaya");
  const communeNative = page.querySelector("#checkout-commune");
  if (!wilayaNative || !communeNative) return null;

  const wilayaSelect = createGeoSelect(page, {
    key: "wilaya",
    nativeSelect: wilayaNative,
    trigger: page.querySelector("#checkout-wilaya-trigger"),
    valueEl: page.querySelector("#checkout-wilaya-value"),
    panel: page.querySelector("#checkout-wilaya-panel"),
    searchInput: page.querySelector("#checkout-wilaya-search"),
    listEl: page.querySelector("#checkout-wilaya-list"),
    placeholder: "Select wilaya",
    searchable: true,
    getOptions: () =>
      WILAYAS.map((w) => ({
        value: w.code,
        label: `${w.code} — ${w.name}`,
      })),
    onSelect: (code) => onWilayaChange?.(code),
  });

  const communeSelect = createGeoSelect(page, {
    key: "commune",
    nativeSelect: communeNative,
    trigger: page.querySelector("#checkout-commune-trigger"),
    valueEl: page.querySelector("#checkout-commune-value"),
    panel: page.querySelector("#checkout-commune-panel"),
    searchInput: page.querySelector("#checkout-commune-search"),
    listEl: page.querySelector("#checkout-commune-list"),
    placeholder: "Select wilaya first",
    searchable: true,
    getOptions: () => {
      const code = wilayaNative.value;
      const communes = COMMUNES_BY_WILAYA[code] ?? [];
      return communes.map((name) => ({ value: name, label: name }));
    },
    onSelect: () => {},
  });

  const refreshCommune = (wilayaCode) => {
    communeNative.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = wilayaCode
      ? (COMMUNES_BY_WILAYA[wilayaCode]?.length ? "Select commune (optional)" : "No communes listed")
      : "Select wilaya first";
    placeholder.selected = true;
    communeNative.appendChild(placeholder);

    (COMMUNES_BY_WILAYA[wilayaCode] ?? []).forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      communeNative.appendChild(option);
    });

    const hasWilaya = Boolean(wilayaCode);
    communeSelect.setDisabled(!hasWilaya);
    communeSelect.reset();
    communeSelect.setTriggerLabel(
      hasWilaya
        ? COMMUNES_BY_WILAYA[wilayaCode]?.length
          ? "Select commune (optional)"
          : "No communes listed"
        : "Select wilaya first"
    );
  };

  if (!page.dataset.geoSelectBound) {
    page.dataset.geoSelectBound = "true";

    document.addEventListener("click", (event) => {
      if (!page.hidden && !event.target.closest(".checkout-geo-select")) {
        closeAllPanels(page);
      }
    });

    window.addEventListener(
      "resize",
      () => {
        const openWrap = page.querySelector(".checkout-geo-select.is-open");
        if (!openWrap) return;
        const trigger = openWrap.querySelector(".checkout-geo-select__trigger");
        const panel = openWrap.querySelector(".checkout-geo-select__panel");
        if (trigger && panel) positionPanel(trigger, panel);
      },
      { passive: true }
    );

    page.querySelector(".checkout-inner")?.addEventListener(
      "scroll",
      () => closeAllPanels(page),
      { passive: true }
    );
  }

  wilayaSelect.renderList();
  refreshCommune("");
  closeAllPanels(page);

  return { refreshCommune };
}
