"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collectionCopy, collections, type Collection } from "@/lib/collections";

export type PostFormValues = {
  collection: Collection;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string;
  cover: string;
  featured: boolean;
  draft: boolean;
  markdown: string;
};

const emptyValues: PostFormValues = {
  collection: "thoughts",
  slug: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  tags: "",
  cover: "",
  featured: false,
  draft: false,
  markdown: "",
};

export function PostForm({
  initial,
  mode,
}: {
  initial?: Partial<PostFormValues>;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [values, setValues] = useState<PostFormValues>({ ...emptyValues, ...initial });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function update<K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent, asDraft: boolean) {
    event.preventDefault();
    setPending(true);
    setError("");
    const payload = {
      collection: values.collection,
      slug: values.slug,
      title: values.title,
      date: values.date,
      excerpt: values.excerpt,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      cover: values.cover,
      featured: values.featured,
      draft: asDraft,
      markdown: values.markdown,
      previous:
        mode === "edit" && initial?.collection && initial.slug
          ? { collection: initial.collection, slug: initial.slug }
          : undefined,
    };

    const response = await fetch("/api/admin/posts", {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      collection?: Collection;
      slug?: string;
    };
    setPending(false);
    if (!response.ok) {
      setError(data.error || "Could not save.");
      return;
    }
    router.push(`/admin/${data.collection}/${data.slug}`);
    router.refresh();
  }

  async function onDelete() {
    if (!initial?.collection || !initial.slug) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setPending(true);
    const response = await fetch("/api/admin/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: initial.collection, slug: initial.slug }),
    });
    setPending(false);
    if (!response.ok) {
      setError("Could not delete.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const field =
    "mt-2 w-full border border-[#3a3228] bg-[#1d1814] px-3 py-2 font-sans text-base text-[#f0e6d6] outline-none focus:border-[#e06a36]";
  const label = "font-sans text-[0.68rem] uppercase tracking-[0.16em] text-[#8a7e6e]";

  return (
    <form className="mt-8 grid gap-6" onSubmit={(event) => onSubmit(event, values.draft)}>
      <label className={label}>
        Section
        <select
          className={field}
          value={values.collection}
          onChange={(event) => update("collection", event.target.value as Collection)}
        >
          {collections.map((collection) => (
            <option key={collection} value={collection}>
              {collectionCopy[collection].title}
            </option>
          ))}
        </select>
      </label>

      <label className={label}>
        Title
        <input
          className={`${field} font-display text-xl tracking-[-0.03em]`}
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          required
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          Date
          <input
            type="date"
            className={field}
            value={values.date}
            onChange={(event) => update("date", event.target.value)}
            required
          />
        </label>
        <label className={label}>
          Slug {mode === "create" ? "(optional)" : ""}
          <input
            className={field}
            value={values.slug}
            onChange={(event) => update("slug", event.target.value)}
            placeholder="generated-from-title"
          />
        </label>
      </div>

      <label className={label}>
        Excerpt
        <textarea
          className={`${field} min-h-24`}
          value={values.excerpt}
          onChange={(event) => update("excerpt", event.target.value)}
        />
      </label>

      <label className={label}>
        Body
        <textarea
          className={`${field} min-h-[22rem] font-serif text-lg leading-relaxed`}
          value={values.markdown}
          onChange={(event) => update("markdown", event.target.value)}
          required
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          Tags (comma separated)
          <input
            className={field}
            value={values.tags}
            onChange={(event) => update("tags", event.target.value)}
          />
        </label>
        <label className={label}>
          Cover image path
          <input
            className={field}
            value={values.cover}
            onChange={(event) => update("cover", event.target.value)}
            placeholder="/images/dusk.jpg"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6 font-sans text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(event) => update("featured", event.target.checked)}
          />
          Featured on home
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.draft}
            onChange={(event) => update("draft", event.target.checked)}
          />
          Keep as draft
        </label>
      </div>

      {error ? <p className="font-serif text-[#e06a36]">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={(event) => onSubmit(event, false)}
          className="bg-[#c2471a] px-5 py-3 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-[#f3ece0] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Publish"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={(event) => onSubmit(event, true)}
          className="border border-[#3a3228] px-5 py-3 font-sans text-[0.72rem] uppercase tracking-[0.16em] disabled:opacity-60"
        >
          Save draft
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            disabled={pending}
            onClick={onDelete}
            className="ml-auto font-sans text-[0.72rem] uppercase tracking-[0.16em] text-[#e06a36]"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
