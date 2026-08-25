import Image from "next/image";
import Link from "next/link";
import { FeaturedEssay } from "@/components/FeaturedEssay";
import { PostCard } from "@/components/PostCard";
import { collectionCopy, collections, getFeaturedPost, getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

const topics = collections.filter(
  (collection) => collection !== "research" && collection !== "thoughts",
);

export const dynamic = "force-dynamic";

export default async function Home() {
  const [all, featured] = await Promise.all([getPosts(), getFeaturedPost()]);
  const rest = all.filter((post) => post.slug !== featured?.slug);
  const research = rest.filter((post) => post.collection === "research").slice(0, 3);
  const thoughts = rest.filter((post) => post.collection === "thoughts").slice(0, 4);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
        <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-ink-faint">
          Field journal · 2026
        </p>
        <h1 className="mt-6 font-display text-[4.4rem] leading-[0.86] tracking-[-0.06em] text-ink sm:text-[7.5rem]">
          <span className="wordmark-lucky">lucky</span>
          <br />
          <span className="wordmark-kevwoda">kevwoda</span>
        </h1>
        <p className="mt-8 max-w-2xl font-serif text-xl leading-relaxed text-ink-muted sm:text-2xl">
          Research and thoughts on growth, money, and the institutions still being built.
        </p>
        <p className="mt-5 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint">
          {site.legalName}
          <span className="mx-2 text-rule">/</span>
          writes as {site.name}
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {topics.map((collection) => (
          <Link
            key={collection}
            href={`/${collection}`}
            className="bg-paper px-6 py-7 transition-colors hover:bg-paper-raised"
          >
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-laterite">
              {collectionCopy[collection].kicker}
            </p>
            <h2 className="mt-2 font-display text-2xl tracking-[-0.03em]">
              {collectionCopy[collection].title}
            </h2>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {featured ? <FeaturedEssay post={featured} /> : null}
      </section>

      <section className="mx-auto grid max-w-6xl gap-16 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-3xl tracking-[-0.03em]">Research</h2>
            <Link
              href="/research"
              className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-laterite hover:text-laterite-deep"
            >
              All research
            </Link>
          </div>
          <div className="border-t border-rule">
            {research.length === 0 ? (
              <p className="py-8 font-serif text-ink-muted">Nothing filed yet.</p>
            ) : (
              research.map((post) => <PostCard key={post.slug} post={post} emphasize />)
            )}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-3xl tracking-[-0.03em]">Thoughts</h2>
            <Link
              href="/thoughts"
              className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-laterite hover:text-laterite-deep"
            >
              All thoughts
            </Link>
          </div>
          <div className="border-t border-rule">
            {thoughts.length === 0 ? (
              <p className="py-8 font-serif text-ink-muted">Nothing filed yet.</p>
            ) : (
              thoughts.map((post) => <PostCard key={post.slug} post={post} />)
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2">
          <div>
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-laterite">
              About the writer
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">
              Lucky Ajekevwoda,
              <span className="block font-display italic text-ink-muted">writing as</span>
              lucky kevwoda.
            </h2>
            <Link
              href="/about"
              className="mt-6 inline-block font-sans text-[0.72rem] uppercase tracking-[0.16em] text-laterite hover:text-laterite-deep"
            >
              About →
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden border border-rule">
            <Image
              src="/images/night-desk.jpg"
              alt="A field notebook on a desk at night"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </div>
        </div>
      </section>
    </>
  );
}
