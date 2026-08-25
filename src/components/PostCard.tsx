import Link from "next/link";
import {
  collectionLabel,
  collectionPath,
  formatDate,
  type PostMeta,
} from "@/lib/posts";

export function PostCard({
  post,
  emphasize = false,
}: {
  post: PostMeta;
  emphasize?: boolean;
}) {
  return (
    <article className="group border-t border-rule py-7 first:border-t-0 first:pt-0">
      <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-laterite">
        {collectionLabel(post.collection)}
      </p>
      <h3
        className={`mt-2 font-display tracking-[-0.035em] text-ink ${
          emphasize ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[1.7rem]"
        }`}
      >
        <Link
          href={collectionPath(post.collection, post.slug)}
          className="transition-colors group-hover:text-laterite-deep"
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-2xl font-serif text-[1.05rem] leading-relaxed text-ink-muted">
        {post.excerpt}
      </p>
      <p className="mt-4 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint">
        {formatDate(post.date)}
        <span className="mx-2 text-rule">/</span>
        {post.readingMinutes} min
      </p>
    </article>
  );
}
