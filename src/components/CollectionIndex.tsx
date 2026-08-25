import { collectionCopy, type Collection } from "@/lib/collections";
import type { PostMeta } from "@/lib/posts";
import { PostCard } from "./PostCard";

export function CollectionIndex({
  collection,
  posts,
}: {
  collection: Collection;
  posts: PostMeta[];
}) {
  const meta = collectionCopy[collection];

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-laterite">
        {meta.kicker}
      </p>
      <h1 className="mt-3 font-display text-6xl tracking-[-0.05em] text-ink sm:text-7xl">
        {meta.title}
      </h1>
      <p className="mt-5 max-w-xl font-serif text-xl leading-relaxed text-ink-muted">
        {meta.deck}
      </p>
      <div className="mt-14 border-t border-rule">
        {posts.length === 0 ? (
          <p className="py-12 font-serif text-lg text-ink-muted">Nothing filed here yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} emphasize />)
        )}
      </div>
    </div>
  );
}
