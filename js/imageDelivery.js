/** Resize and re-encode remote photos at the URL, so the browser downloads the size it paints. */

const CLOUDINARY_UPLOAD = "/image/upload/";

export const CARD_WIDTHS = [192, 320, 480, 720];
export const CARD_SIZES = "(max-width: 1023px) 46vw, 353px";
export const PDP_WIDTHS = [480, 720, 1080];
export const PDP_SIZES = "(max-width: 480px) 100vw, 480px";
export const HERO_WIDTHS = [640, 960, 1280];
export const HERO_SIZES = "(max-width: 1023px) 100vw, 620px";
export const EDITORIAL_WIDTHS = [480, 800, 1100];
export const EDITORIAL_SIZES = "(max-width: 1023px) 100vw, 712px";

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isTransformSegment(segment) {
  if (!segment) return false;
  return segment.split(",").every((part) => /^[a-z]{1,3}_[^/]+$/.test(part));
}

export function canResize(url) {
  const raw = String(url || "");
  return (
    (raw.includes("res.cloudinary.com") && raw.includes(CLOUDINARY_UPLOAD)) ||
    raw.includes("images.unsplash.com")
  );
}

export function deliverySrc(url, width) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  const size = Math.max(16, Math.round(Number(width) || 480));

  const marker = raw.indexOf(CLOUDINARY_UPLOAD);
  if (raw.includes("res.cloudinary.com") && marker !== -1) {
    const prefix = raw.slice(0, marker + CLOUDINARY_UPLOAD.length);
    let rest = raw.slice(marker + CLOUDINARY_UPLOAD.length);
    while (rest.includes("/")) {
      const segment = rest.slice(0, rest.indexOf("/"));
      if (/^v\d+$/.test(segment) || !isTransformSegment(segment)) break;
      rest = rest.slice(segment.length + 1);
    }
    return `${prefix}f_auto,q_auto,c_limit,w_${size}/${rest}`;
  }

  if (raw.includes("images.unsplash.com")) {
    try {
      const parsed = new URL(raw);
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", parsed.searchParams.get("fit") || "crop");
      parsed.searchParams.set("w", String(size));
      parsed.searchParams.set("q", "75");
      return parsed.toString();
    } catch {
      return raw;
    }
  }

  return raw;
}

export function buildSrcSet(url, widths) {
  if (!canResize(url)) return "";
  return widths.map((width) => `${deliverySrc(url, width)} ${width}w`).join(", ");
}

function fallbackWidth(widths) {
  if (widths.length >= 3) return widths[1];
  return widths[widths.length - 1] || 480;
}

export function responsiveImgTag(
  url,
  {
    alt = "",
    eager = false,
    priority = false,
    sizes = CARD_SIZES,
    widths = CARD_WIDTHS,
    className = "",
    keepOrigin = false,
    extra = "",
  } = {}
) {
  const src = canResize(url) ? deliverySrc(url, fallbackWidth(widths)) : url;
  const srcset = buildSrcSet(url, widths);
  const setAttr = srcset ? ` srcset="${escapeAttr(srcset)}" sizes="${escapeAttr(sizes)}"` : "";
  const loading = eager
    ? `loading="eager" decoding="async"${priority ? ` fetchpriority="high"` : ""}`
    : `loading="lazy" decoding="async"`;
  const classAttr = className ? ` class="${escapeAttr(className)}"` : "";
  const origin = keepOrigin ? ` data-origin="${escapeAttr(url)}"` : "";
  const extraAttr = extra ? ` ${extra}` : "";
  return `<img${classAttr} src="${escapeAttr(src)}"${setAttr}${origin} alt="${escapeAttr(alt)}" ${loading}${extraAttr}>`;
}

export function heroDelivery(url) {
  return {
    src: canResize(url) ? deliverySrc(url, fallbackWidth(HERO_WIDTHS)) : url,
    srcSet: buildSrcSet(url, HERO_WIDTHS),
    sizes: HERO_SIZES,
  };
}

export function deferredImgTag(url, { extra = "" } = {}) {
  const extraAttr = extra ? ` ${extra}` : "";
  return `<img alt="" data-defer-src="${escapeAttr(url)}" decoding="async"${extraAttr}>`;
}

export function releaseDeferredImages(scope) {
  if (!scope) return;
  scope.querySelectorAll("source[data-defer-srcset]").forEach((source) => {
    source.srcset = source.dataset.deferSrcset;
    delete source.dataset.deferSrcset;
  });
  scope.querySelectorAll("img[data-defer-src]").forEach((img) => {
    const url = img.dataset.deferSrc;
    if (!url || img.getAttribute("src")) return;
    if (img.closest("[hidden]")) return;
    if (img.dataset.deferPlain === "1") {
      const heldSet = img.dataset.deferSrcset;
      if (heldSet) {
        img.srcset = heldSet;
        delete img.dataset.deferSrcset;
      }
      img.decoding = "async";
      img.loading = "lazy";
      img.src = url;
      delete img.dataset.deferSrc;
      delete img.dataset.deferPlain;
      return;
    }
    const widths = img.dataset.deferWidths
      ? img.dataset.deferWidths.split(",").map((value) => Number(value)).filter(Boolean)
      : undefined;
    applyResponsiveImage(img, url, {
      eager: img.dataset.deferEager === "1",
      priority: img.dataset.deferPriority === "1",
      sizes: img.dataset.deferSizes || undefined,
      widths,
      width: img.dataset.deferWidth ? Number(img.dataset.deferWidth) : undefined,
    });
    delete img.dataset.deferSrc;
  });
}

export function applyResponsiveImage(img, url, options = {}) {
  if (!img || !url) return;
  const widths = options.widths || CARD_WIDTHS;
  const sizes = options.sizes || CARD_SIZES;
  const srcset = buildSrcSet(url, widths);
  const src = canResize(url) ? deliverySrc(url, options.width || fallbackWidth(widths)) : url;
  img.decoding = "async";
  if (options.eager) {
    img.loading = "eager";
    if (options.priority) img.fetchPriority = "high";
    else img.removeAttribute("fetchpriority");
  } else {
    img.loading = "lazy";
    img.removeAttribute("fetchpriority");
  }
  if (srcset) {
    img.sizes = sizes;
    img.srcset = srcset;
  } else {
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
  }
  img.src = src;
  if (options.keepOrigin) img.dataset.origin = url;
}

export function watchHiddenImages(root) {
  if (!root || root.dataset.hiddenImagesWatch === "1") return;
  root.dataset.hiddenImagesWatch = "1";
  root.querySelectorAll("[hidden] img[src]").forEach((img) => {
    if (img.dataset.deferSrc) return;
    img.dataset.deferSrc = img.getAttribute("src");
    img.dataset.deferPlain = "1";
    const srcset = img.getAttribute("srcset");
    if (srcset) {
      img.dataset.deferSrcset = srcset;
      img.removeAttribute("srcset");
    }
    img.removeAttribute("src");
  });
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      const el = record.target;
      if (el instanceof Element && !el.hasAttribute("hidden")) releaseDeferredImages(el);
    });
  });
  root.querySelectorAll("[hidden]").forEach((el) => {
    observer.observe(el, { attributes: true, attributeFilter: ["hidden"] });
  });
}
