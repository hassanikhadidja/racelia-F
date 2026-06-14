import { openProfileSheet, closeProfileSheet } from "./clientProfileSheets.js";
import {
  loadBlogs,
  saveBlogs,
  createBlogFromTemplate,
  formatBlogDate,
  estimateReadMinutes,
  validateBlogForPublish,
  getBlogById,
  normalizeBlog,
  normalizeSections,
} from "./dashboardBlogsData.js";
import {
  getDashboardBlogsSectionMarkup,
  getDashboardBlogsOverlaysMarkup,
} from "./dashboardBlogsMarkup.js";
import { renderBlogPreviewHtml } from "./dashboardBlogsPreview.js";
import { getCategoryProductById } from "./categoryData.js";
import { syncBlogUpsert, syncBlogDelete } from "./syncBackend.js";

let editingBlog = null;
let previewDevice = "desktop";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readFileAsDataUrl(file, callback) {
  if (!file?.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") callback(reader.result);
  };
  reader.readAsDataURL(file);
}

function bindDropzone(zone, onDataUrl) {
  if (!zone || zone.dataset.dropBound === "true") return;
  zone.dataset.dropBound = "true";

  const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  zone.addEventListener("dragenter", prevent);
  zone.addEventListener("dragover", (e) => {
    prevent(e);
    zone.classList.add("is-dragover");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("is-dragover"));
  zone.addEventListener("drop", (e) => {
    prevent(e);
    zone.classList.remove("is-dragover");
    const file = e.dataTransfer?.files?.[0];
    if (file) readFileAsDataUrl(file, onDataUrl);
  });
}

function renderListCard(blog) {
  const productCount = new Set([
    ...(blog.linkedProductIds || []),
    ...(blog.cta?.productIds || []),
  ]).size;
  const statusClass = blog.status === "published" ? "published" : "draft";
  const thumb = blog.coverImage
    ? `<img src="${escapeHtml(blog.coverImage)}" alt="" loading="lazy" />`
    : `<div class="dashboard-blog-card__placeholder"></div>`;

  return `<article class="dashboard-blog-card" data-blog-id="${escapeHtml(blog.id)}">
    <div class="dashboard-blog-card__thumb">${thumb}</div>
    <div class="dashboard-blog-card__body">
      <div class="dashboard-blog-card__top">
        <h4 class="dashboard-blog-card__title">${escapeHtml(blog.title || "Untitled")}</h4>
        <span class="dashboard-blog-card__status dashboard-blog-card__status--${statusClass}">${blog.status === "published" ? "Published" : "Draft"}</span>
      </div>
      <p class="dashboard-blog-card__meta">
        Created ${escapeHtml(formatBlogDate(blog.createdAt))} · Updated ${escapeHtml(formatBlogDate(blog.updatedAt))}
      </p>
      <p class="dashboard-blog-card__meta">${productCount} linked product${productCount === 1 ? "" : "s"} · ${estimateReadMinutes(blog)} min read</p>
      <div class="dashboard-blog-card__actions">
        <button type="button" class="dashboard-blog-card__btn js-dashboard-blog-edit" data-blog-id="${escapeHtml(blog.id)}">Edit</button>
        <button type="button" class="dashboard-blog-card__btn js-dashboard-blog-preview-list" data-blog-id="${escapeHtml(blog.id)}">Preview</button>
        ${blog.status === "published"
          ? `<button type="button" class="dashboard-blog-card__btn js-dashboard-blog-unpublish-list" data-blog-id="${escapeHtml(blog.id)}">Unpublish</button>`
          : `<button type="button" class="dashboard-blog-card__btn js-dashboard-blog-publish-list" data-blog-id="${escapeHtml(blog.id)}">Publish</button>`}
        <button type="button" class="dashboard-blog-card__btn dashboard-blog-card__btn--danger js-dashboard-blog-delete" data-blog-id="${escapeHtml(blog.id)}">Delete</button>
      </div>
    </div>
  </article>`;
}

export function renderDashboardBlogList(page) {
  const blogs = loadBlogs().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const list = page.querySelector("#dashboard-blog-list");
  const empty = page.querySelector("#dashboard-blog-empty");
  if (!list) return;

  list.innerHTML = blogs.map(renderListCard).join("");
  if (empty) empty.hidden = blogs.length > 0;

  list.querySelectorAll(".js-dashboard-blog-edit").forEach((btn) => {
    btn.addEventListener("click", () => openEditor(page, getBlogById(btn.dataset.blogId)));
  });
  list.querySelectorAll(".js-dashboard-blog-preview-list").forEach((btn) => {
    btn.addEventListener("click", () => {
      const blog = getBlogById(btn.dataset.blogId);
      if (blog) openPreview(page, blog);
    });
  });
  list.querySelectorAll(".js-dashboard-blog-delete").forEach((btn) => {
    btn.addEventListener("click", () => deleteBlog(page, btn.dataset.blogId));
  });
  list.querySelectorAll(".js-dashboard-blog-publish-list").forEach((btn) => {
    btn.addEventListener("click", () => publishBlogById(page, btn.dataset.blogId));
  });
  list.querySelectorAll(".js-dashboard-blog-unpublish-list").forEach((btn) => {
    btn.addEventListener("click", () => unpublishBlogById(page, btn.dataset.blogId));
  });
}

function sectionEditorHtml(section, index) {
  const removeBtn = `<button type="button" class="dashboard-blog-section-remove js-dashboard-blog-section-remove" data-section-id="${escapeHtml(section.id)}">Remove</button>`;

  if (section.type === "heading") {
    return `<div class="dashboard-blog-section" data-section-id="${escapeHtml(section.id)}" data-section-type="heading">
      <div class="dashboard-blog-section__label">Heading ${index + 1} ${removeBtn}</div>
      <input type="text" class="dashboard-blog-section-input" data-field="content" value="${escapeHtml(section.content || "")}" placeholder="Section heading" />
    </div>`;
  }

  if (section.type === "image") {
    const imgHtml = section.image
      ? `<img class="dashboard-blog-section-img-preview" src="${escapeHtml(section.image)}" alt="" />`
      : "";
    return `<div class="dashboard-blog-section" data-section-id="${escapeHtml(section.id)}" data-section-type="image">
      <div class="dashboard-blog-section__label">Image ${index + 1} ${removeBtn}</div>
      <div class="dashboard-blog-dropzone dashboard-blog-dropzone--compact js-dashboard-blog-section-drop" data-section-id="${escapeHtml(section.id)}">
        ${imgHtml}
        <p class="dashboard-blog-dropzone__hint">Drag &amp; drop or <label class="dashboard-blog-dropzone__link">browse<input type="file" class="dashboard-blog-section-file" accept="image/*" hidden /></label></p>
      </div>
      <input type="text" class="dashboard-blog-section-input" data-field="caption" value="${escapeHtml(section.caption || "")}" placeholder="Caption (optional)" />
    </div>`;
  }

  return `<div class="dashboard-blog-section" data-section-id="${escapeHtml(section.id)}" data-section-type="text">
    <div class="dashboard-blog-section__label">Text ${index + 1} ${removeBtn}</div>
    <textarea class="dashboard-blog-section-textarea" data-field="content" rows="4" placeholder="Write your content…">${escapeHtml(section.content || "")}</textarea>
  </div>`;
}

function renderEditorSections(page, sections) {
  const wrap = page.querySelector("#dashboard-blog-sections");
  if (!wrap) return;
  wrap.innerHTML = (sections || []).map((s, i) => sectionEditorHtml(s, i)).join("");

  wrap.querySelectorAll(".js-dashboard-blog-section-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!editingBlog) return;
      editingBlog.sections = editingBlog.sections.filter((s) => s.id !== btn.dataset.sectionId);
      renderEditorSections(page, editingBlog.sections);
    });
  });

  wrap.querySelectorAll(".js-dashboard-blog-section-drop").forEach((zone) => {
    const sectionId = zone.dataset.sectionId;
    const fileInput = zone.querySelector(".dashboard-blog-section-file");
    const apply = (dataUrl) => {
      const section = editingBlog?.sections?.find((s) => s.id === sectionId);
      if (!section) return;
      section.image = dataUrl;
      renderEditorSections(page, editingBlog.sections);
    };
    bindDropzone(zone, apply);
    fileInput?.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (file) readFileAsDataUrl(file, apply);
    });
  });
}

function updateCoverPreview(page, url) {
  const img = page.querySelector("#dashboard-blog-cover-preview");
  const zone = page.querySelector("#dashboard-blog-cover-drop");
  if (img && url) {
    img.src = url;
    img.hidden = false;
    zone?.classList.add("has-image");
  } else if (img) {
    img.hidden = true;
    img.removeAttribute("src");
    zone?.classList.remove("has-image");
  }
}

function syncProductCheckboxes(page, blog) {
  const ids = new Set([...(blog.linkedProductIds || []), ...(blog.cta?.productIds || [])]);
  page.querySelectorAll(".dashboard-blog-product-check").forEach((cb) => {
    cb.checked = ids.has(cb.value);
  });
  updateLinkedPreview(page);
}

function updateLinkedPreview(page) {
  const preview = page.querySelector("#dashboard-blog-linked-preview");
  if (!preview) return;
  const checked = [...page.querySelectorAll(".dashboard-blog-product-check:checked")];
  if (!checked.length) {
    preview.innerHTML = "";
    return;
  }
  preview.innerHTML = checked
    .map((cb) => {
      const name = cb.dataset.name || cb.value;
      const img = cb.dataset.image || "";
      return `<div class="dashboard-blog-linked-chip">
        <img src="${escapeHtml(img)}" alt="" />
        <span>${escapeHtml(name)}</span>
      </div>`;
    })
    .join("");
}

function collectBlogFromEditor(page) {
  if (!editingBlog) return null;

  const blog = {
    ...editingBlog,
    title: page.querySelector("#dashboard-blog-title")?.value.trim() || "",
    subtitle: page.querySelector("#dashboard-blog-subtitle")?.value.trim() || "",
    cta: {
      text: page.querySelector("#dashboard-blog-cta-text")?.value.trim() || "",
      productIds: [],
    },
    linkedProductIds: [],
    updatedAt: Date.now(),
  };

  blog.sections = normalizeSections(editingBlog.sections).map((section) => {
    const el = page.querySelector(`[data-section-id="${section.id}"]`);
    if (!el) return section;
    if (section.type === "text" || section.type === "heading") {
      const input = el.querySelector("[data-field='content']");
      return { ...section, content: input?.value.trim() || "" };
    }
    if (section.type === "image") {
      const caption = el.querySelector("[data-field='caption']");
      return { ...section, caption: caption?.value.trim() || "", image: section.image || "" };
    }
    return section;
  });

  const productIds = [...page.querySelectorAll(".dashboard-blog-product-check:checked")].map((cb) => cb.value);
  blog.linkedProductIds = productIds;
  blog.cta.productIds = productIds.length ? [productIds[0]] : [];

  return blog;
}

function persistBlog(blog) {
  const normalized = normalizeBlog(blog);
  if (!normalized) return;
  const blogs = loadBlogs();
  const idx = blogs.findIndex((b) => b.id === normalized.id);
  if (idx >= 0) blogs[idx] = normalized;
  else blogs.unshift(normalized);
  saveBlogs(blogs);
  syncBlogUpsert(normalized).catch(() => {});
}

function openEditor(page, blog) {
  editingBlog = JSON.parse(JSON.stringify(normalizeBlog(blog)));
  const overlay = page.querySelector("#dashboard-blog-editor-overlay");
  if (!overlay) return;

  page.querySelector("#dashboard-blog-edit-id").value = blog.id;
  page.querySelector("#dashboard-blog-title").value = blog.title || "";
  page.querySelector("#dashboard-blog-subtitle").value = blog.subtitle || "";
  page.querySelector("#dashboard-blog-cta-text").value = blog.cta?.text || "";
  page.querySelector("#dashboard-blog-editor-status").textContent =
    blog.status === "published" ? "Published" : "Draft";

  const unpublishBtn = page.querySelector(".js-dashboard-blog-unpublish");
  const publishBtn = page.querySelector(".js-dashboard-blog-publish");
  if (unpublishBtn) unpublishBtn.hidden = blog.status !== "published";
  if (publishBtn) publishBtn.textContent = blog.status === "published" ? "Update published" : "Publish";

  updateCoverPreview(page, blog.coverImage);
  renderEditorSections(page, editingBlog.sections);
  syncProductCheckboxes(page, blog);

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
}

function closeEditor(page) {
  const overlay = page.querySelector("#dashboard-blog-editor-overlay");
  overlay?.classList.remove("open");
  overlay?.setAttribute("aria-hidden", "true");
  editingBlog = null;
}

function openPreview(page, blog, device = previewDevice) {
  const overlay = page.querySelector("#dashboard-blog-preview-overlay");
  const frame = page.querySelector("#dashboard-blog-preview-frame");
  if (!overlay || !frame) return;

  const safeBlog = normalizeBlog(blog) || blog;
  frame.innerHTML = renderBlogPreviewHtml(safeBlog, { device });
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");

  frame.querySelectorAll(".blog-preview__product, .blog-preview__cta[data-cta]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ids = [...new Set([...(safeBlog.linkedProductIds || []), ...(safeBlog.cta?.productIds || [])])];
      const productId = btn.dataset.productId || ids[0];
      if (productId) {
        const name = getCategoryProductById(productId)?.name || productId;
        window.alert(`Preview: would open product page for ${name}`);
      }
    });
  });
}

function closePreview(page) {
  const overlay = page.querySelector("#dashboard-blog-preview-overlay");
  overlay?.classList.remove("open");
  overlay?.setAttribute("aria-hidden", "true");
}

function saveDraft(page) {
  const blog = collectBlogFromEditor(page);
  if (!blog) return;
  blog.status = blog.status === "published" ? "published" : "draft";
  persistBlog(blog);
  editingBlog = blog;
  renderDashboardBlogList(page);
  page.querySelector("#dashboard-blog-editor-status").textContent =
    blog.status === "published" ? "Published (saved)" : "Draft saved";
}

function publishFromEditor(page) {
  const blog = collectBlogFromEditor(page);
  if (!blog) return;
  const errors = validateBlogForPublish(blog);
  if (errors.length) {
    window.alert(errors.join("\n"));
    return;
  }
  blog.status = "published";
  if (!blog.publishedAt) blog.publishedAt = Date.now();
  blog.updatedAt = Date.now();
  persistBlog(blog);
  editingBlog = blog;
  page.querySelector("#dashboard-blog-editor-status").textContent = "Published";
  page.querySelector(".js-dashboard-blog-unpublish").hidden = false;
  page.querySelector(".js-dashboard-blog-publish").textContent = "Update published";
  renderDashboardBlogList(page);
}

function publishBlogById(page, id) {
  const blog = getBlogById(id);
  if (!blog) return;
  const errors = validateBlogForPublish(blog);
  if (errors.length) {
    window.alert(`Cannot publish:\n${errors.join("\n")}\n\nOpen Edit to fix.`);
    return;
  }
  blog.status = "published";
  if (!blog.publishedAt) blog.publishedAt = Date.now();
  blog.updatedAt = Date.now();
  persistBlog(blog);
  renderDashboardBlogList(page);
}

function unpublishBlogById(page, id) {
  const blog = getBlogById(id);
  if (!blog) return;
  blog.status = "draft";
  blog.updatedAt = Date.now();
  persistBlog(blog);
  renderDashboardBlogList(page);
}

function deleteBlog(page, id) {
  if (!id || !window.confirm("Delete this blog post? This cannot be undone.")) return;
  saveBlogs(loadBlogs().filter((b) => b.id !== id));
  syncBlogDelete(id).catch(() => {});
  if (editingBlog?.id === id) closeEditor(page);
  renderDashboardBlogList(page);
}

function bindBlogOverlays(page, root) {
  if (!page.querySelector("#dashboard-blog-template-overlay")) {
    page.insertAdjacentHTML("beforeend", getDashboardBlogsOverlaysMarkup());
  }

  page.querySelectorAll(".js-dashboard-blog-create-open").forEach((btn) => {
    btn.addEventListener("click", () => openProfileSheet(page, "dashboard-blog-template-overlay"));
  });

  page.querySelectorAll('[data-close="dashboard-blog-template-overlay"]').forEach((btn) => {
    btn.addEventListener("click", () => closeProfileSheet(page, "dashboard-blog-template-overlay"));
  });
  page.querySelector("#dashboard-blog-template-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "dashboard-blog-template-overlay") {
      closeProfileSheet(page, "dashboard-blog-template-overlay");
    }
  });

  page.querySelectorAll(".js-dashboard-blog-template-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      const blog = normalizeBlog(createBlogFromTemplate(btn.dataset.templateId));
      if (!blog) return;
      closeProfileSheet(page, "dashboard-blog-template-overlay");
      openEditor(page, blog);
    });
  });

  const coverInput = page.querySelector("#dashboard-blog-cover-input");
  const coverDrop = page.querySelector("#dashboard-blog-cover-drop");
  bindDropzone(coverDrop, (dataUrl) => {
    if (editingBlog) editingBlog.coverImage = dataUrl;
    updateCoverPreview(page, dataUrl);
  });
  coverInput?.addEventListener("change", () => {
    const file = coverInput.files?.[0];
    if (file) {
      readFileAsDataUrl(file, (dataUrl) => {
        if (editingBlog) editingBlog.coverImage = dataUrl;
        updateCoverPreview(page, dataUrl);
      });
    }
  });

  page.querySelectorAll(".js-dashboard-blog-add-section").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!editingBlog) return;
      const type = btn.dataset.sectionType;
      const section = {
        id: `sec-${Date.now()}`,
        type,
        content: type === "heading" ? "New heading" : type === "text" ? "" : undefined,
        image: type === "image" ? "" : undefined,
        caption: type === "image" ? "" : undefined,
      };
      editingBlog.sections = [...(editingBlog.sections || []), section];
      renderEditorSections(page, editingBlog.sections);
    });
  });

  page.querySelectorAll(".dashboard-blog-product-check").forEach((cb) => {
    cb.addEventListener("change", () => updateLinkedPreview(page));
  });

  page.querySelector(".js-dashboard-blog-save-draft")?.addEventListener("click", () => saveDraft(page));
  page.querySelector(".js-dashboard-blog-publish")?.addEventListener("click", () => publishFromEditor(page));
  page.querySelector(".js-dashboard-blog-unpublish")?.addEventListener("click", () => {
    if (!editingBlog) return;
    editingBlog.status = "draft";
    editingBlog.updatedAt = Date.now();
    persistBlog(collectBlogFromEditor(page));
    editingBlog = getBlogById(editingBlog.id);
    page.querySelector("#dashboard-blog-editor-status").textContent = "Draft";
    page.querySelector(".js-dashboard-blog-unpublish").hidden = true;
    page.querySelector(".js-dashboard-blog-publish").textContent = "Publish";
    renderDashboardBlogList(page);
  });
  page.querySelector(".js-dashboard-blog-preview")?.addEventListener("click", () => {
    const blog = collectBlogFromEditor(page);
    if (blog) openPreview(page, blog);
  });
  page.querySelector(".js-dashboard-blog-editor-close")?.addEventListener("click", () => closeEditor(page));

  page.querySelectorAll('[data-close="dashboard-blog-preview-overlay"]').forEach((btn) => {
    btn.addEventListener("click", () => closePreview(page));
  });
  page.querySelector("#dashboard-blog-preview-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "dashboard-blog-preview-overlay") closePreview(page);
  });

  page.querySelectorAll(".dashboard-blog-preview__device").forEach((btn) => {
    btn.addEventListener("click", () => {
      previewDevice = btn.dataset.previewDevice || "desktop";
      page.querySelectorAll(".dashboard-blog-preview__device").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", String(on));
      });
      const blog = editingBlog ? collectBlogFromEditor(page) : null;
      if (blog) openPreview(page, blog, previewDevice);
    });
  });
}

export function closeDashboardBlogsOverlay(page) {
  if (page.querySelector("#dashboard-blog-preview-overlay")?.classList.contains("open")) {
    closePreview(page);
    return true;
  }
  if (page.querySelector("#dashboard-blog-editor-overlay")?.classList.contains("open")) {
    closeEditor(page);
    return true;
  }
  if (page.querySelector("#dashboard-blog-template-overlay")?.classList.contains("open")) {
    closeProfileSheet(page, "dashboard-blog-template-overlay");
    return true;
  }
  return false;
}

export function initDashboardBlogs(page) {
  const section = page.querySelector("#blogs");
  if (!section || section.dataset.blogsBound === "true") return;
  section.dataset.blogsBound = "true";

  const root = page.closest("#racelia-app") || document.querySelector("#racelia-app");
  bindBlogOverlays(page, root);
  renderDashboardBlogList(page);

  page.querySelector('[data-screen="blogs"]')?.addEventListener("click", () => {
    requestAnimationFrame(() => renderDashboardBlogList(page));
  });
}
