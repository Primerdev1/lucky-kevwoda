import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.legalName}, writing as ${site.name}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-laterite">
        About
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl tracking-[-0.045em] text-ink sm:text-7xl">
        Lucky Ajekevwoda,
        <br />
        <span className="wordmark-lucky text-ink-muted">writing as</span> lucky kevwoda.
      </h1>
    </div>
  );
}
