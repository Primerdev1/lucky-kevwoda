"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminBar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[#3a3228]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-xl tracking-[-0.03em]">
            Admin
          </Link>
          <Link
            href="/admin/new"
            className="font-sans text-[0.68rem] uppercase tracking-[0.16em] text-[#e06a36]"
          >
            New post
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="font-sans text-[0.68rem] uppercase tracking-[0.16em] text-[#8a7e6e] hover:text-[#f0e6d6]"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="font-sans text-[0.68rem] uppercase tracking-[0.16em] text-[#8a7e6e] hover:text-[#f0e6d6]"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
