"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!response.ok) {
      setError("That password did not match.");
      return;
    }
    router.push(nextPath.startsWith("/admin") ? nextPath : "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-4">
      <label className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#8a7e6e]">
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 block w-full border border-[#3a3228] bg-[#1d1814] px-4 py-3 font-sans text-base tracking-normal text-[#f0e6d6] outline-none focus:border-[#e06a36]"
          required
        />
      </label>
      {error ? <p className="font-serif text-[#e06a36]">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 bg-[#c2471a] px-5 py-3 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[#f3ece0] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Enter"}
      </button>
    </form>
  );
}
