export const collections = [
  "gtm-strategy",
  "fun",
  "stablecoins",
  "thoughts",
] as const;

export type Collection = (typeof collections)[number];

export const collectionCopy: Record<
  Collection,
  { kicker: string; title: string; deck: string }
> = {
  "gtm-strategy": {
    kicker: "Go to market",
    title: "GTM Strategy",
    deck: "Sequencing, trust, and the work of taking an idea to market without lying about the numbers.",
  },
  fun: {
    kicker: "Lighter notes",
    title: "Fun",
    deck: "Asides and play. Pieces that do not need a thesis to earn the page.",
  },
  stablecoins: {
    kicker: "Digital dollars",
    title: "Stablecoins",
    deck: "USDT, USDC, and the gap between holding a token and using it as money.",
  },
  thoughts: {
    kicker: "Shorter essays",
    title: "Thoughts",
    deck: "Notes and things I am still turning over. Published when they have a spine.",
  },
};

const labels: Record<Collection, string> = {
  "gtm-strategy": "GTM Strategy",
  fun: "Fun",
  stablecoins: "Stablecoins",
  thoughts: "Thought",
};

export function isCollection(value: string): value is Collection {
  return (collections as readonly string[]).includes(value);
}

export function collectionLabel(collection: Collection) {
  return labels[collection];
}

export function collectionPath(collection: Collection, slug?: string) {
  return slug ? `/${collection}/${slug}` : `/${collection}`;
}
