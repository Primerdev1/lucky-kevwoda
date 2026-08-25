export const collections = [
  "growth-strategy",
  "fun",
  "blockchain",
  "stablecoins",
  "research",
  "thoughts",
] as const;

export type Collection = (typeof collections)[number];

export const collectionCopy: Record<
  Collection,
  { kicker: string; title: string; deck: string }
> = {
  "growth-strategy": {
    kicker: "The engine",
    title: "Growth Strategy",
    deck: "Sequencing, trust, and the work of taking an idea to traction without lying about the numbers.",
  },
  fun: {
    kicker: "Lighter notes",
    title: "Fun",
    deck: "Asides and play. Pieces that do not need a thesis to earn the page.",
  },
  blockchain: {
    kicker: "The rails",
    title: "Blockchain",
    deck: "Protocols, infrastructure, and what still does not work for people who just need to move value.",
  },
  stablecoins: {
    kicker: "Digital dollars",
    title: "Stablecoins",
    deck: "USDT, USDC, and the gap between holding a token and using it as money.",
  },
  research: {
    kicker: "Longer notes",
    title: "Research",
    deck: "Arguments, field studies, and working papers. The pieces I am willing to stand behind.",
  },
  thoughts: {
    kicker: "Shorter essays",
    title: "Thoughts",
    deck: "Notes and things I am still turning over. Published when they have a spine.",
  },
};

const labels: Record<Collection, string> = {
  "growth-strategy": "Growth Strategy",
  fun: "Fun",
  blockchain: "Blockchain",
  stablecoins: "Stablecoins",
  research: "Research",
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
