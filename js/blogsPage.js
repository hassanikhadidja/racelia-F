import {
  loadBlogs,
  formatBlogDate,
  estimateReadMinutes,
  getBlogById,
  normalizeBlog,
  BLOGS_STORAGE_KEY,
} from "./dashboardBlogsData.js";
import { renderBlogPreviewHtml } from "./dashboardBlogsPreview.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getPublishedBlogs() {
  return loadBlogs()
    .filter((blog) => blog.status === "published")
    .sort(
      (a, b) =>
        (b.publishedAt || b.updatedAt || 0) - (a.publishedAt || a.updatedAt || 0)
    );
}

function renderBlogCard(blog) {
  const readMin = estimateReadMinutes(blog);
  const dateLabel = formatBlogDate(blog.publishedAt || blog.updatedAt);

  return `<article class="blogs-page__card" data-blog-id="${escapeHtml(blog.id)}">
    <div class="blogs-page__card-cover">
      <img src="${escapeHtml(blog.coverImage || "")}" alt="" loading="lazy" />
    </div>
    <div class="blogs-page__card-body">
      <p class="blogs-page__card-meta">${escapeHtml(dateLabel)} · ${readMin} min read</p>
      <h2 class="blogs-page__card-title">${escapeHtml(blog.title || "Untitled")}</h2>
      ${blog.subtitle ? `<p class="blogs-page__card-sub">${escapeHtml(blog.subtitle)}</p>` : ""}
    </div>
  </article>`;
}

export function showBlogsListView(root) {
  const listView = root.querySelector("#blogsListView");
  const articleView = root.querySelector("#blogsArticleView");
  if (listView) listView.hidden = false;
  if (articleView) articleView.hidden = true;
}

export function renderBlogsList(root) {
  const grid = root.querySelector("#blogsGrid");
  const empty = root.querySelector("#blogsEmpty");
  if (!grid) return;

  const blogs = getPublishedBlogs();
  if (!blogs.length) {
    grid.replaceChildren();
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;
  grid.innerHTML = blogs.map(renderBlogCard).join("");
}

export function renderBlogArticle(root, blogId) {
  const articleEl = root.querySelector("#blogsArticle");
  const blog = normalizeBlog(getBlogById(blogId));

  if (!blog || blog.status !== "published" || !articleEl) {
    return false;
  }

  const listView = root.querySelector("#blogsListView");
  const articleView = root.querySelector("#blogsArticleView");
  if (listView) listView.hidden = true;
  if (articleView) articleView.hidden = false;

  articleEl.innerHTML = renderBlogPreviewHtml(blog, { device: "desktop" });

  const productIds = [
    ...new Set([...(blog.linkedProductIds || []), ...(blog.cta?.productIds || [])]),
  ];

  articleEl
    .querySelectorAll(".blog-preview__product, .blog-preview__cta[data-cta]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const productId = btn.dataset.productId || productIds[0];
        if (productId) {
          root.dispatchEvent(
            new CustomEvent("racelia:open-product", { detail: { productId } })
          );
        }
      });
    });

  return true;
}

export function initBlogsPage(root) {
  const page = root.querySelector("#blogsPage");
  if (!page || page.dataset.bound === "true") return;
  page.dataset.bound = "true";

  page.addEventListener("click", (event) => {
    const card = event.target.closest(".blogs-page__card");
    if (!card?.dataset.blogId) return;
    root.dispatchEvent(
      new CustomEvent("racelia:open-blog", { detail: { blogId: card.dataset.blogId } })
    );
  });

  root.querySelector("#blogsBackBtn")?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("racelia:open-blogs"));
  });

  window.addEventListener("storage", (event) => {
    if (event.key === BLOGS_STORAGE_KEY) {
      renderBlogsList(root);
    }
  });
}
