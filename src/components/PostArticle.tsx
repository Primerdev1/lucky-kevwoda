import Link from "next/link";
import {
  collectionLabel,
  collectionPath,
  formatDate,
  type Post,
} from "@/lib/posts";
import { PostCard } from "./PostCard";
import { ReadingProgress } from "./ReadingProgress";

export function PostArticle({
  post,
  related,
}: {
  post: Post;
  related: Post[];
}) {
  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-2xl px-5 py-16 sm:px-0 sm:py-24">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-laterite">
          <Link href={collectionPath(post.collection)} className="hover:text-laterite-deep">
            {collectionLabel(post.collection)}
          </Link>
        </p>
        <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] tracking-[-0.045em] text-ink sm:text-6xl">
          {post.title}
        </h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-ink-muted">{post.excerpt}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-rule py-4 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-rule">/</span>
          <span>{post.readingMinutes} min</span>
          {post.tags.length > 0 ? (
            <>
              <span className="text-rule">/</span>
              <span>{post.tags.join(" · ")}</span>
            </>
          ) : null}
        </div>
        <div
          className={`prose-journal mt-12 ${post.collection === "research" ? "drop-cap" : ""}`}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <p className="mt-16 font-display text-3xl text-laterite" aria-hidden>
          ※
        </p>
        <p className="mt-3 font-serif italic text-ink-muted">lucky kevwoda</p>
      </article>
      {related.length > 0 ? (
        <section className="mx-auto max-w-2xl border-t border-rule px-5 py-16 sm:px-0">
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint">
            More {post.collection}
          </p>
          <div className="mt-6">
            {related.map((item) => (
              <PostCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
