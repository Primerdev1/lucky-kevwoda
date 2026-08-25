import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm font-serif text-[1.05rem] leading-relaxed text-ink-muted">
            Research and thoughts by {site.legalName}.
          </p>
        </div>
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint">
            In this journal
          </p>
          <ul className="mt-4 space-y-2 font-serif text-lg">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-quiet">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/rss.xml" className="link-quiet">
                RSS
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint">
            Elsewhere
          </p>
          <ul className="mt-4 space-y-2 font-serif text-lg">
            <li>
              <a href={site.twitter} className="link-quiet" rel="me">
                {site.twitterHandle}
              </a>
            </li>
            <li>
              <a href={site.moyoPay} className="link-quiet">
                MoyoPay
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="normal-case tracking-[0.04em]">
            {"\u00A9"} {new Date().getFullYear()} {site.legalName}
          </span>
          <span>A journal, not a newsletter</span>
        </div>
      </div>
    </footer>
  );
}
