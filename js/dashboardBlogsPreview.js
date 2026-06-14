import { formatBlogDate, estimateReadMinutes, normalizeSections } from "./dashboardBlogsData.js";
import { getCategoryProductById } from "./categoryData.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSection(section) {
  if (section.type === "heading") {
    return `<h3 class="blog-preview__heading">${escapeHtml(section.content || "")}</h3>`;
  }
  if (section.type === "image" && section.image) {
    const cap = section.caption
      ? `<figcaption class="blog-preview__caption">${escapeHtml(section.caption)}</figcaption>`
      : "";
    return `<figure class="blog-preview__figure"><img src="${escapeHtml(section.image)}" alt="" loading="lazy" />${cap}</figure>`;
  }
  if (section.type === "text") {
    const paras = (section.content || "")
      .split(/\n\n+/)
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
    return `<div class="blog-preview__text">${paras}</div>`;
  }
  return "";
}

function renderProducts(blog) {
  const ids = [...new Set([...(blog.linkedProductIds || []), ...(blog.cta?.productIds || [])])];
  if (!ids.length) return "";

  const items = ids
    .map((id) => {
      const p = getCategoryProductById(id);
      if (!p) return "";
      const img = p.images?.[0] || "";
      return `<button type="button" class="blog-preview__product" data-product-id="${escapeHtml(id)}">
        <img src="${escapeHtml(img)}" alt="" loading="lazy" />
        <span>${escapeHtml(p.name)}</span>
      </button>`;
    })
    .filter(Boolean)
    .join("");

  if (!items) return "";
  return `<div class="blog-preview__products"><h4>Featured products</h4><div class="blog-preview__product-grid">${items}</div></div>`;
}

export function renderBlogPreviewHtml(blog, { device = "desktop" } = {}) {
  const readMin = estimateReadMinutes(blog);
  const dateLabel = formatBlogDate(blog.publishedAt || blog.updatedAt);
  const sectionsHtml = normalizeSections(blog.sections).map(renderSection).join("");
  const ctaHtml =
    blog.cta?.text?.trim() && blog.cta.productIds?.length
      ? `<div class="blog-preview__cta-wrap">
          <button type="button" class="blog-preview__cta" data-cta="true">${escapeHtml(blog.cta.text)}</button>
        </div>`
      : blog.cta?.text?.trim()
        ? `<div class="blog-preview__cta-wrap">
            <button type="button" class="blog-preview__cta blog-preview__cta--static">${escapeHtml(blog.cta.text)}</button>
          </div>`
        : "";

  return `<article class="blog-preview blog-preview--${escapeHtml(device)}" data-device="${escapeHtml(device)}">
    <div class="blog-preview__cover">
      <img src="${escapeHtml(blog.coverImage || "")}" alt="" />
    </div>
    <div class="blog-preview__body">
      <p class="blog-preview__meta">${escapeHtml(dateLabel)} · ${readMin} min read</p>
      <h1 class="blog-preview__title">${escapeHtml(blog.title || "Untitled")}</h1>
      ${blog.subtitle ? `<p class="blog-preview__subtitle">${escapeHtml(blog.subtitle)}</p>` : ""}
      <div class="blog-preview__sections">${sectionsHtml}</div>
      ${renderProducts(blog)}
      ${ctaHtml}
    </div>
  </article>`;
}
