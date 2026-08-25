import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
      <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-laterite">
        404
      </p>
      <h1 className="mt-4 font-display text-5xl tracking-[-0.045em] sm:text-6xl">
        This page is not in the journal.
      </h1>
      <p className="mt-5 font-serif text-lg text-ink-muted">
        It may have been renamed, or it was never filed.
      </p>
      <Link
        href="/"
        className="mt-10 inline-block font-sans text-[0.72rem] uppercase tracking-[0.18em] text-laterite hover:text-laterite-deep"
      >
        Back to the desk
      </Link>
    </div>
  );
}
