import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.legalName}, writing as ${site.name}. A journal of growth, ideas, and the work of making life easier.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-laterite">
        About Lucky
      </p>
      <h1 className="mt-3 font-display text-5xl tracking-[-0.045em] text-ink sm:text-6xl">
        Lucky Ajekevwoda,
        <br />
        <span className="wordmark-lucky text-ink-muted">writing as</span> lucky kevwoda.
      </h1>

      <div className="prose-journal mt-12">
        <p>I&apos;m Lucky Ajekevwoda.</p>
        <p>
          I&apos;m curious about how people, businesses, technology, and ideas come together to
          create meaningful change.
        </p>
        <p>
          I spend much of my time thinking about growth, how products find the right people, how
          communities become movements, how businesses create value, and how technology can make
          everyday life easier.
        </p>
        <p>But I&apos;m more than what I do for work.</p>
        <p>
          I enjoy chess and basketball, and I play the piano. I love comedy movies and science
          fiction — especially stories that challenge how I think and make me imagine what the
          future could look like.
        </p>
        <p>
          I also enjoy being alone. Solitude gives me space to think, read, create, reflect, and
          sometimes question what I thought I already knew.
        </p>
        <p>
          I love reading, particularly books about business, psychology, strategy, human
          behaviour, and personal development. I&apos;m fascinated by why people behave the way
          they do, how decisions are made, and what makes certain ideas spread while others
          disappear.
        </p>
        <p>
          At heart, I&apos;m curious. I like learning across disciplines — from technology,
          business, and psychology to science, philosophy, and anything else that captures my
          attention.
        </p>
        <p>This website is where I document that journey.</p>
        <p>
          Here, I share my research, experiments, observations, ideas, and lessons from building
          things. Some will be about growth and technology. Others will explore business, money,
          emerging systems, or simply an idea I find interesting enough to write about.
        </p>
        <p>I don&apos;t have everything figured out.</p>
        <p>I&apos;m still building, learning, reading, thinking, and becoming.</p>
        <p>And perhaps the simplest way to describe what I&apos;m trying to do is:</p>
        <blockquote>
          Make life easier through the things I build, study, and share.
        </blockquote>
      </div>
    </div>
  );
}
