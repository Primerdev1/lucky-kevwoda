import Link from "next/link";
import { AdminBar } from "@/components/admin/AdminBar";
import { collectionLabel, collectionPath, formatDate, getAdminPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  const posts = getAdminPosts();

  return (
    <>
      <AdminBar />
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#e06a36]">
              Desk
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-[-0.04em]">Posts</h1>
          </div>
          <Link
            href="/admin/new"
            className="bg-[#c2471a] px-4 py-2 font-sans text-[0.68rem] uppercase tracking-[0.16em] text-[#f3ece0]"
          >
            New post
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 font-serif text-lg text-[#b7ab99]">
            Nothing filed yet. Write the first piece.
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-[#3a3228] border-y border-[#3a3228]">
            {posts.map((post) => (
              <li key={`${post.collection}-${post.slug}`} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-[#e06a36]">
                      {collectionLabel(post.collection)}
                      <span className="mx-2 text-[#3a3228]">/</span>
                      {post.draft ? "Draft" : "Live"}
                    </p>
                    <Link
                      href={`/admin/${post.collection}/${post.slug}`}
                      className="mt-1 block font-display text-2xl tracking-[-0.03em] hover:text-[#e06a36]"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-1 font-sans text-[0.72rem] uppercase tracking-[0.14em] text-[#8a7e6e]">
                      {formatDate(post.date)}
                    </p>
                  </div>
                  <div className="flex gap-4 font-sans text-[0.68rem] uppercase tracking-[0.16em]">
                    <Link
                      href={`/admin/${post.collection}/${post.slug}`}
                      className="text-[#f0e6d6]"
                    >
                      Edit
                    </Link>
                    {!post.draft ? (
                      <Link
                        href={collectionPath(post.collection, post.slug)}
                        className="text-[#8a7e6e]"
                      >
                        View
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
