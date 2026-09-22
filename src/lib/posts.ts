import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";
import { collections, type Collection } from "@/lib/collections";
import {
  loadOverlay,
  postKey,
  saveOverlay,
  type OverlayPost,
} from "@/lib/cms-overlay";

export {
  collectionCopy,
  collectionLabel,
  collectionPath,
  collections,
  isCollection,
} from "@/lib/collections";
export type { Collection } from "@/lib/collections";

export type PostMeta = {
  slug: string;
  collection: Collection;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  cover?: string;
  draft: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & {
  html: string;
};

export type AdminPost = PostMeta & {
  markdown: string;
};

type ParsedFile = {
  meta: PostMeta;
  content: string;
};

const contentDir = path.join(process.cwd(), "content");

function readingMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function toIsoDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const raw = String(value ?? "").trim();
  const iso = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  return "1970-01-01";
}

function parseFile(
  collection: Collection,
  filename: string,
  includeDrafts: boolean,
): ParsedFile | null {
  if (!filename.endsWith(".md")) return null;

  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(contentDir, collection, filename), "utf8");
  const { data, content } = matter(raw);
  const draft = Boolean(data.draft);
  if (draft && !includeDrafts) return null;

  return {
    meta: {
      slug,
      collection,
      title: String(data.title ?? slug),
      date: toIsoDate(data.date),
      excerpt: String(data.excerpt ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      featured: Boolean(data.featured),
      cover: data.cover ? String(data.cover) : undefined,
      draft,
      readingMinutes: readingMinutes(content),
    },
    content,
  };
}

function overlayToParsed(item: OverlayPost): ParsedFile {
  return {
    meta: {
      slug: item.slug,
      collection: item.collection,
      title: item.title,
      date: toIsoDate(item.date),
      excerpt: item.excerpt,
      tags: item.tags,
      featured: item.featured,
      cover: item.cover,
      draft: item.draft,
      readingMinutes: readingMinutes(item.markdown),
    },
    content: item.markdown,
  };
}

async function listParsed(includeDrafts: boolean, collection?: Collection) {
  const buckets = collection ? [collection] : [...collections];
  const byKey = new Map<string, ParsedFile>();

  for (const bucket of buckets) {
    const dir = path.join(contentDir, bucket);
    if (!fs.existsSync(dir)) continue;
    for (const filename of fs.readdirSync(dir)) {
      const post = parseFile(bucket, filename, true);
      if (post) byKey.set(postKey(post.meta.collection, post.meta.slug), post);
    }
  }

  const overlay = await loadOverlay();
  for (const [key, item] of Object.entries(overlay.posts)) {
    if (collection && item.collection !== collection) continue;
    if (item.deleted) {
      byKey.delete(key);
      continue;
    }
    byKey.set(key, overlayToParsed(item));
  }

  const parsed = [...byKey.values()].filter((item) => includeDrafts || !item.meta.draft);
  parsed.sort((a, b) => (a.meta.date < b.meta.date ? 1 : a.meta.date > b.meta.date ? -1 : 0));
  return parsed;
}

async function renderMarkdown(source: string) {
  const file = await remark().use(gfm).use(html, { sanitize: false }).process(source);
  return String(file);
}

export const getPosts = cache(async (collection?: Collection): Promise<Post[]> => {
  const parsed = await listParsed(false, collection);
  return Promise.all(
    parsed.map(async (item) => ({
      ...item.meta,
      html: await renderMarkdown(item.content),
    })),
  );
});

export const getPost = cache(async (collection: Collection, slug: string) => {
  const posts = await getPosts(collection);
  return posts.find((post) => post.slug === slug) ?? null;
});

export async function getAdminPosts(collection?: Collection): Promise<AdminPost[]> {
  const parsed = await listParsed(true, collection);
  return parsed.map((item) => ({
    ...item.meta,
    markdown: item.content,
  }));
}

export async function getAdminPost(collection: Collection, slug: string) {
  const posts = await getAdminPosts(collection);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getFeaturedPost() {
  const posts = await getPosts();
  return posts.find((post) => post.featured) ?? posts[0] ?? null;
}

export function formatDate(iso: string) {
  const date = new Date(`${toIsoDate(iso)}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function slugify(input: string) {
  const slug = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return slug || `note-${Date.now()}`;
}

export type PostInput = {
  collection: Collection;
  slug?: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  cover?: string;
  markdown: string;
};

async function uniqueSlug(collection: Collection, desired: string, current?: string) {
  let slug = slugify(desired);
  if (slug === current) return slug;
  const existing = new Set(
    (await getAdminPosts(collection)).map((post) => post.slug),
  );
  if (current) existing.delete(current);
  let n = 2;
  let candidate = slug;
  while (existing.has(candidate)) {
    candidate = `${slug}-${n}`;
    n += 1;
  }
  return candidate;
}

function serializePost(input: PostInput) {
  const data: Record<string, unknown> = {
    title: input.title.trim(),
    date: toIsoDate(input.date),
    excerpt: input.excerpt.trim(),
    tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
    featured: input.featured,
    draft: input.draft,
  };
  if (input.cover?.trim()) data.cover = input.cover.trim();
  return matter.stringify(input.markdown.replace(/^\uFEFF/, "").trimStart(), data);
}

export async function savePost(
  input: PostInput,
  previous?: { collection: Collection; slug: string },
) {
  if (!input.title.trim()) throw new Error("Title is required.");
  const slug = await uniqueSlug(
    input.collection,
    input.slug?.trim() || input.title,
    previous && previous.collection === input.collection ? previous.slug : undefined,
  );

  const record: OverlayPost = {
    collection: input.collection,
    slug,
    title: input.title.trim(),
    date: toIsoDate(input.date),
    excerpt: input.excerpt.trim(),
    tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
    featured: input.featured,
    draft: input.draft,
    cover: input.cover?.trim() || undefined,
    markdown: input.markdown.replace(/^\uFEFF/, "").trimStart(),
  };

  await saveOverlay((current) => {
    const posts = { ...current.posts };
    if (previous) delete posts[postKey(previous.collection, previous.slug)];
    posts[postKey(input.collection, slug)] = record;
    return { posts };
  });

  if (!process.env.VERCEL) {
    try {
      const dir = path.join(contentDir, input.collection);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${slug}.md`), serializePost(input), "utf8");
      if (previous && (previous.collection !== input.collection || previous.slug !== slug)) {
        const oldPath = path.join(contentDir, previous.collection, `${previous.slug}.md`);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    } catch {
      // Overlay is the source of truth on hosts that cannot write markdown files.
    }
  }

  return { collection: input.collection, slug };
}

export async function deletePost(collection: Collection, slug: string) {
  const existing = await getAdminPost(collection, slug);
  if (!existing) throw new Error("Post not found.");

  await saveOverlay((current) => {
    const posts = { ...current.posts };
    posts[postKey(collection, slug)] = {
      collection,
      slug,
      title: existing.title,
      date: existing.date,
      excerpt: existing.excerpt,
      tags: existing.tags,
      featured: existing.featured,
      draft: true,
      cover: existing.cover,
      markdown: existing.markdown,
      deleted: true,
    };
    return { posts };
  });

  if (!process.env.VERCEL) {
    try {
      const filePath = path.join(contentDir, collection, `${slug}.md`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {
      // Overlay hides the post even if the seed file cannot be removed.
    }
  }
}
