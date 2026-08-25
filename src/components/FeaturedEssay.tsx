import Image from "next/image";
import Link from "next/link";
import {
  collectionLabel,
  collectionPath,
  formatDate,
  type PostMeta,
} from "@/lib/posts";

export function FeaturedEssay({ post }: { post: PostMeta }) {
  const href = collectionPath(post.collection, post.slug);

  return (
    <article className="grid overflow-hidden border border-rule bg-paper-raised md:grid-cols-12">
      <Link href={href} className="relative block aspect-[16/10] md:col-span-7 md:aspect-auto md:min-h-[22rem]">
        <Image
          src={post.cover ?? "/images/night-desk.jpg"}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="(min-width: 768px) 58vw, 100vw"
        />
      </Link>
      <div className="flex flex-col justify-between px-6 py-8 sm:px-9 sm:py-10 md:col-span-5">
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-laterite">
            Featured {collectionLabel(post.collection).toLowerCase()}
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink sm:text-5xl">
            <Link href={href} className="hover:text-laterite-deep">
              {post.title}
            </Link>
          </h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-ink-muted">
            {post.excerpt}
          </p>
        </div>
        <p className="mt-8 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint">
          {formatDate(post.date)}
          <span className="mx-2 text-rule">/</span>
          {post.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}
