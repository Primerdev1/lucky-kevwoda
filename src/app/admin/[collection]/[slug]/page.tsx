import { notFound } from "next/navigation";
import { AdminBar } from "@/components/admin/AdminBar";
import { PostForm } from "@/components/admin/PostForm";
import { getAdminPost, isCollection } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const { collection, slug } = await params;
  if (!isCollection(collection)) notFound();
  const post = getAdminPost(collection, slug);
  if (!post) notFound();

  return (
    <>
      <AdminBar />
      <div className="mx-auto max-w-3xl px-5 py-10">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#e06a36]">
          Edit
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-[-0.04em]">{post.title}</h1>
        <PostForm
          mode="edit"
          initial={{
            collection: post.collection,
            slug: post.slug,
            title: post.title,
            date: post.date,
            excerpt: post.excerpt,
            tags: post.tags.join(", "),
            cover: post.cover ?? "",
            featured: post.featured,
            draft: post.draft,
            markdown: post.markdown,
          }}
        />
      </div>
    </>
  );
}
