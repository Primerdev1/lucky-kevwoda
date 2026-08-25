"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div>
      <button
        type="button"
        className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink"
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        Menu
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-paper px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink-faint">
              Index
            </span>
            <button
              type="button"
              className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <nav className="mt-10 flex flex-1 flex-col gap-4 overflow-y-auto pb-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl tracking-[-0.04em] text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex items-center justify-between border-t border-rule pt-6 text-ink-muted">
            <a href={site.twitter} className="text-[0.72rem] uppercase tracking-[0.18em]">
              {site.twitterHandle}
            </a>
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </div>
  );
}
