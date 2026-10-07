import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      { source: "/growth-strategy", destination: "/gtm-strategy", permanent: true },
      {
        source: "/growth-strategy/:slug",
        destination: "/gtm-strategy/:slug",
        permanent: true,
      },
      { source: "/research", destination: "/thoughts", permanent: true },
      { source: "/research/:slug", destination: "/thoughts/:slug", permanent: true },
      { source: "/blockchain", destination: "/", permanent: true },
      { source: "/blockchain/:slug", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
