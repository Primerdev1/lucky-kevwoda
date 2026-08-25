import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  deletePost,
  isCollection,
  savePost,
  type Collection,
  type PostInput,
} from "@/lib/posts";

export const runtime = "nodejs";

function revalidate(collection: Collection, slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath(`/${collection}`);
  if (slug) revalidatePath(`/${collection}/${slug}`);
  revalidatePath("/rss.xml");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
}

function readInput(body: Record<string, unknown>): PostInput {
  if (!isCollection(String(body.collection ?? ""))) {
    throw new Error("Choose a valid section.");
  }
  return {
    collection: body.collection as Collection,
    slug: typeof body.slug === "string" ? body.slug : "",
    title: String(body.title ?? ""),
    date: String(body.date ?? ""),
    excerpt: String(body.excerpt ?? ""),
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    featured: Boolean(body.featured),
    draft: Boolean(body.draft),
    cover: typeof body.cover === "string" ? body.cover : "",
    markdown: String(body.markdown ?? ""),
  };
}

function previousFrom(body: Record<string, unknown>) {
  const previous = body.previous as { collection?: string; slug?: string } | undefined;
  if (!previous?.collection || !previous.slug || !isCollection(previous.collection)) {
    return undefined;
  }
  return { collection: previous.collection, slug: previous.slug };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const saved = savePost(readInput(body));
    revalidate(saved.collection, saved.slug);
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save." },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const previous = previousFrom(body);
    const saved = savePost(readInput(body), previous);
    if (previous) revalidate(previous.collection, previous.slug);
    revalidate(saved.collection, saved.slug);
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { collection?: string; slug?: string };
    if (!body.collection || !body.slug || !isCollection(body.collection)) {
      throw new Error("Post not found.");
    }
    deletePost(body.collection, body.slug);
    revalidate(body.collection, body.slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete." },
      { status: 400 },
    );
  }
}
