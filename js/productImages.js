/** Image slot helpers and per-color overrides. */

export function emptyColorVariant(hex = "#111111", label = "") {
  return {
    hex,
    label,
    cardCover: "",
    cardScroll: [],
    pdpCover: "",
    pdpScroll: [],
    closerLookMain: "",
    closerLookExtra: [],
  };
}

export function migrateLegacyImages(product = {}) {
  const legacyCard = Array.isArray(product.cardImages) ? product.cardImages.filter(Boolean) : [];
  const legacyCover = product.coverImage || product.cardCover || legacyCard[0] || "";
  const legacyScroll = legacyCard.filter((url) => url !== legacyCover);

  const cardCover = product.cardCover || legacyCover;
  const cardScroll =
    Array.isArray(product.cardScroll) && product.cardScroll.length
      ? product.cardScroll.filter(Boolean)
      : legacyScroll;

  const pdpCover = product.pdpCover || cardCover;
  const pdpScroll =
    Array.isArray(product.pdpScroll) && product.pdpScroll.length
      ? product.pdpScroll.filter(Boolean)
      : cardScroll;

  const closerLookExtra =
    Array.isArray(product.closerLookExtra) && product.closerLookExtra.length
      ? product.closerLookExtra.filter(Boolean)
      : Array.isArray(product.closerLookImages)
        ? product.closerLookImages.filter(Boolean)
        : [];

  const closerMainImage =
    product.closerLookMain?.image ||
    (typeof product.closerLookMain === "string" ? product.closerLookMain : "") ||
    closerLookExtra[0] ||
    pdpScroll[0] ||
    pdpCover;

  return { cardCover, cardScroll, pdpCover, pdpScroll, closerLookExtra, closerMainImage };
}

export function normalizeColorVariants(product, slots) {
  const raw = Array.isArray(product.colorVariants) ? product.colorVariants : [];
  if (raw.length) {
    return raw.map((v, index) => ({
      hex: String(v.hex || product.colors?.[index] || "#111111").trim(),
      label: String(v.label || "").trim(),
      cardCover: v.cardCover || "",
      cardScroll: Array.isArray(v.cardScroll) ? v.cardScroll.filter(Boolean) : [],
      pdpCover: v.pdpCover || "",
      pdpScroll: Array.isArray(v.pdpScroll) ? v.pdpScroll.filter(Boolean) : [],
      closerLookMain: v.closerLookMain || "",
      closerLookExtra: Array.isArray(v.closerLookExtra) ? v.closerLookExtra.filter(Boolean) : [],
    }));
  }

  const colors = Array.isArray(product.colors) ? product.colors.filter(Boolean) : [];
  if (!colors.length) return [];
  return colors.map((hex) => emptyColorVariant(hex));
}

export function getDefaultSlots(product) {
  const migrated = migrateLegacyImages(product);
  return {
    cardCover: migrated.cardCover,
    cardScroll: migrated.cardScroll,
    pdpCover: migrated.pdpCover,
    pdpScroll: migrated.pdpScroll,
    closerLookMain: migrated.closerMainImage,
    closerLookExtra: migrated.closerLookExtra,
  };
}

export function getSlotsForColor(product, colorIndex = 0) {
  const defaults = getDefaultSlots(product);
  const variant = product.colorVariants?.[colorIndex];
  if (!variant) return defaults;

  return {
    cardCover: variant.cardCover || defaults.cardCover,
    cardScroll: variant.cardScroll?.length ? variant.cardScroll : defaults.cardScroll,
    pdpCover: variant.pdpCover || defaults.pdpCover,
    pdpScroll: variant.pdpScroll?.length ? variant.pdpScroll : defaults.pdpScroll,
    closerLookMain: variant.closerLookMain || defaults.closerLookMain,
    closerLookExtra: variant.closerLookExtra?.length
      ? variant.closerLookExtra
      : defaults.closerLookExtra,
  };
}

export function buildImageList(cover, scroll = []) {
  const extras = (scroll || []).filter(Boolean).filter((url) => url !== cover);
  return cover ? [cover, ...extras] : extras;
}

export function getCardImages(product, colorIndex = 0) {
  const slots = getSlotsForColor(product, colorIndex);
  return buildImageList(slots.cardCover, slots.cardScroll);
}

export function getPdpImages(product, colorIndex = 0) {
  const slots = getSlotsForColor(product, colorIndex);
  return buildImageList(slots.pdpCover, slots.pdpScroll);
}

export function getCloserLookForColor(product, colorIndex = 0) {
  const slots = getSlotsForColor(product, colorIndex);
  const extra =
    slots.closerLookExtra?.length >= 2
      ? slots.closerLookExtra
      : slots.closerLookExtra?.length === 1
        ? [slots.closerLookExtra[0], slots.pdpScroll[0] || slots.pdpCover]
        : slots.pdpScroll.length >= 2
          ? [slots.pdpScroll[0], slots.pdpScroll[1]]
          : [slots.pdpCover, slots.pdpCover];

  return {
    image: slots.closerLookMain || extra[0] || slots.pdpCover,
    title: product.closerLookMain?.title || "A Closer Look",
    text: product.closerLookMain?.text || "",
    extra,
  };
}
