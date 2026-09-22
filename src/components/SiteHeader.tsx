import Link from "next/link";
import { nav } from "@/lib/site";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="h-[3px] bg-laterite" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4">
        <div className="min-w-0 shrink">
          <Wordmark />
        </div>
        <nav className="hidden flex-wrap items-center justify-end gap-x-5 gap-y-2 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-quiet font-sans text-[0.68rem] uppercase tracking-[0.16em] text-ink-muted hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
