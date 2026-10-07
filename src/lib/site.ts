export const site = {
  name: "lucky kevwoda",
  legalName: "Lucky Ajekevwoda",
  title: "lucky kevwoda — notes & thoughts",
  description:
    "Notes and thoughts by Lucky Ajekevwoda — GTM strategy, stablecoins, and notes from the work.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  twitter: "https://x.com/0xluckywiz",
  twitterHandle: "@0xluckywiz",
  linkedin: "https://www.linkedin.com/in/lucky-kevwoda",
  language: "en",
} as const;

export const nav = [
  { href: "/gtm-strategy", label: "GTM Strategy" },
  { href: "/fun", label: "Fun" },
  { href: "/stablecoins", label: "Stablecoins" },
  { href: "/thoughts", label: "Thoughts" },
  { href: "/about", label: "About" },
] as const;
