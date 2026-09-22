"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { nav, site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const panel = open ? (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-paper"
      style={{
        paddingTop: "max(1.25rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
        paddingRight: "max(1.25rem, env(safe-area-inset-right))",
      }}
    >
      <div className="flex shrink-0 items-center justify-between gap-4">
        <span className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink-faint">
          Index
        </span>
        <button
          type="button"
          className="min-h-11 px-1 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>
      <nav className="mt-6 grid min-h-0 flex-1 grid-cols-1 content-start gap-x-8 gap-y-1 overflow-y-auto overscroll-contain sm:grid-cols-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="flex min-h-12 items-center font-display text-[clamp(1.35rem,5vw,2rem)] leading-tight tracking-[-0.03em] text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-4 flex shrink-0 items-center justify-between gap-4 border-t border-rule pt-4 text-ink-muted">
        <a href={site.twitter} className="text-[0.72rem] uppercase tracking-[0.18em]">
          {site.twitterHandle}
        </a>
        <ThemeToggle />
      </div>
    </div>
  ) : null;

  return (
    <div>
      <button
        type="button"
        className="min-h-11 min-w-11 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open menu"
      >
        Menu
      </button>
      {mounted ? createPortal(panel, document.body) : null}
    </div>
  );
}
