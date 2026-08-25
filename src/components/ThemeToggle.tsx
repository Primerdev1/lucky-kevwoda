"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "lk-theme";
const EVENT = "lk-theme-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("night");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const night = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !document.documentElement.classList.contains("night");
    document.documentElement.classList.toggle("night", next);
    localStorage.setItem(STORAGE_KEY, next ? "night" : "paper");
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ink ${className}`}
      aria-pressed={night}
    >
      {night ? "Paper" : "Night"}
    </button>
  );
}
