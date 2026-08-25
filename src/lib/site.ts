export const site = {
  name: "lucky kevwoda",
  legalName: "Lucky Ajekevwoda",
  title: "lucky kevwoda — research & thoughts",
  description:
    "Research and thoughts by Lucky Ajekevwoda — growth strategy, blockchain, stablecoins, and notes from the work.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  twitter: "https://x.com/0xluckywiz",
  twitterHandle: "@0xluckywiz",
  moyoPay: "https://moyopay.io",
  language: "en",
} as const;

export const nav = [
  { href: "/growth-strategy", label: "Growth Strategy" },
  { href: "/fun", label: "Fun" },
  { href: "/blockchain", label: "Blockchain" },
  { href: "/stablecoins", label: "Stablecoins" },
  { href: "/research", label: "Research" },
  { href: "/thoughts", label: "Thoughts" },
  { href: "/about", label: "About" },
] as const;
