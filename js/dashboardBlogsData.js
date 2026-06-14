export const BLOGS_STORAGE_KEY = "raceliaDashboardBlogs";

export const BLOG_TEMPLATES = [
  {
    id: "product-spotlight",
    name: "Product Spotlight",
    description: "Cover image, intro, feature image, and product CTA.",
  },
  {
    id: "seasonal-campaign",
    name: "Seasonal Campaign",
    description: "Campaign hero, highlights, gallery image, and shop CTA.",
  },
  {
    id: "editorial-story",
    name: "Editorial Story",
    description: "Long-form story with multiple text blocks and soft CTA.",
  },
];

const PLACEHOLDER_COVER = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80";
const PLACEHOLDER_INLINE = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80";

function sectionId() {
  return `sec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatBlogDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Ensures sections is always an array (fixes corrupted localStorage). */
export function normalizeSections(sections) {
  if (Array.isArray(sections)) return sections;
  if (sections && typeof sections === "object") return Object.values(sections);
  return [];
}

export function normalizeBlog(blog) {
  if (!blog || typeof blog !== "object") return null;
  return {
    ...blog,
    sections: normalizeSections(blog.sections),
    linkedProductIds: Array.isArray(blog.linkedProductIds) ? blog.linkedProductIds : [],
    cta: {
      text: typeof blog.cta?.text === "string" ? blog.cta.text : "",
      productIds: Array.isArray(blog.cta?.productIds) ? blog.cta.productIds : [],
    },
  };
}

export function estimateReadMinutes(blog) {
  const sections = normalizeSections(blog?.sections);
  const text = [
    blog.title,
    blog.subtitle,
    ...sections.map((s) => (s.type === "text" || s.type === "heading" ? s.content : "")),
  ].join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export function createBlogFromTemplate(templateId) {
  const now = Date.now();
  const base = {
    id: `blog-${now}`,
    templateId,
    status: "draft",
    coverImage: PLACEHOLDER_COVER,
    linkedProductIds: [],
    cta: { text: "Shop the collection", productIds: [] },
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  };

  if (templateId === "product-spotlight") {
    return {
      ...base,
      title: "The bag shaping this season",
      subtitle: "A closer look at craftsmanship and everyday elegance.",
      sections: [
        { id: sectionId(), type: "heading", content: "Why this piece matters" },
        {
          id: sectionId(),
          type: "text",
          content:
            "From the atelier to your wardrobe, each detail is considered — hardware, lining, and silhouette work together for a piece that feels both timeless and current.",
        },
        { id: sectionId(), type: "image", image: PLACEHOLDER_INLINE, caption: "Featured look" },
        {
          id: sectionId(),
          type: "text",
          content:
            "Pair with neutral tailoring for day, or let it anchor an evening look. The structure holds its shape while the leather softens beautifully over time.",
        },
      ],
      cta: { text: "Discover the bag", productIds: [] },
    };
  }

  if (templateId === "seasonal-campaign") {
    return {
      ...base,
      title: "Summer campaign essentials",
      subtitle: "Light textures, bold lines, and pieces made for warm evenings.",
      coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
      sections: [
        { id: sectionId(), type: "heading", content: "Campaign highlights" },
        {
          id: sectionId(),
          type: "text",
          content:
            "This season celebrates movement — crossbodies for city days, totes for weekends away, and clutches that transition from terrace to table.",
        },
        { id: sectionId(), type: "image", image: PLACEHOLDER_INLINE, caption: "Campaign still" },
        {
          id: sectionId(),
          type: "text",
          content:
            "Shot on location with natural light, the campaign focuses on real wear — how RACÈLIA pieces live in your routine, not just in the studio.",
        },
      ],
      cta: { text: "Shop summer edit", productIds: [] },
    };
  }

  return {
    ...base,
    title: "Inside RACÈLIA: métiers d'art",
    subtitle: "The people and processes behind each creation.",
    coverImage: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1200&q=80",
    sections: [
      { id: sectionId(), type: "heading", content: "A note from the studio" },
      {
        id: sectionId(),
        type: "text",
        content:
          "Every collection begins with material — leather selected for grain and longevity, hardware tested for weight and feel, patterns refined over countless fittings.",
      },
      {
        id: sectionId(),
        type: "text",
        content:
          "We document the journey so you can see what makes a RACÈLIA piece different: patience, precision, and respect for craft traditions reinterpreted for today.",
      },
      { id: sectionId(), type: "image", image: PLACEHOLDER_INLINE, caption: "Atelier detail" },
    ],
    cta: { text: "Explore the collection", productIds: [] },
  };
}

const defaultBlogs = [
  {
    ...createBlogFromTemplate("product-spotlight"),
    id: "blog-seed-1",
    title: "How to boost conversion on high-ticket pieces",
    subtitle: "Practical tips for product pages and launch campaigns.",
    status: "published",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "blog-seed-1-s1",
        type: "text",
        content:
          "Practical tips for product pages, sizing guides, and retargeting campaigns that help customers commit to investment pieces.",
      },
    ],
    linkedProductIds: ["mini-flap-bag"],
    cta: { text: "Shop mini flap bag", productIds: ["mini-flap-bag"] },
    createdAt: Date.parse("2026-05-28"),
    updatedAt: Date.parse("2026-05-28"),
    publishedAt: Date.parse("2026-05-28"),
  },
  {
    ...createBlogFromTemplate("seasonal-campaign"),
    id: "blog-seed-2",
    title: "Weekly sales recap: maxi flap leads",
    status: "published",
    coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "blog-seed-2-s1",
        type: "text",
        content: "A breakdown of top sellers, margins, and inventory alerts from last week.",
      },
    ],
    linkedProductIds: ["racelia-maxi-flap"],
    cta: { text: "View maxi flap", productIds: ["racelia-maxi-flap"] },
    createdAt: Date.parse("2026-05-22"),
    updatedAt: Date.parse("2026-05-22"),
    publishedAt: Date.parse("2026-05-22"),
  },
  {
    ...createBlogFromTemplate("editorial-story"),
    id: "blog-seed-3",
    title: "Preparing your catalog for summer drops",
    status: "draft",
    coverImage: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "blog-seed-3-s1",
        type: "text",
        content: "Checklist for photography, SEO titles, and launch-day stock buffers.",
      },
    ],
    linkedProductIds: [],
    cta: { text: "Browse new arrivals", productIds: [] },
    createdAt: Date.parse("2026-05-15"),
    updatedAt: Date.parse("2026-05-15"),
    publishedAt: null,
  },
];

export function loadBlogs() {
  try {
    const saved = localStorage.getItem(BLOGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const normalized = parsed.map(normalizeBlog).filter(Boolean);
        return normalized;
      }
    }
  } catch {
    /* ignore */
  }
  localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(defaultBlogs));
  return defaultBlogs.map(normalizeBlog);
}

export function saveBlogs(blogs) {
  try {
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs));
  } catch {
    /* ignore */
  }
}

export function getBlogById(id) {
  return loadBlogs().find((b) => b.id === id) || null;
}

export function validateBlogForPublish(blog) {
  const errors = [];
  if (!blog.title?.trim()) errors.push("Title is required.");
  if (!blog.coverImage) errors.push("Cover image is required.");
  const hasContent = normalizeSections(blog.sections).some((s) => {
    if (s.type === "image") return !!s.image;
    return !!s.content?.trim();
  });
  if (!hasContent) errors.push("Add at least one section with content.");
  if (blog.cta?.productIds?.length && !blog.cta?.text?.trim()) {
    errors.push("CTA button text is required when products are linked.");
  }
  return errors;
}
