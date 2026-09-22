import fs from "node:fs";
import path from "node:path";
import type { Collection } from "@/lib/collections";

export type OverlayPost = {
  collection: Collection;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  cover?: string;
  markdown: string;
  deleted?: boolean;
};

export type Overlay = {
  posts: Record<string, OverlayPost>;
};

const overlayRel = "data/cms.json";
const overlayPath = path.join(process.cwd(), overlayRel);

export function postKey(collection: Collection, slug: string) {
  return `${collection}/${slug}`;
}

function emptyOverlay(): Overlay {
  return { posts: {} };
}

function parseOverlay(raw: string): Overlay {
  try {
    const parsed = JSON.parse(raw) as Overlay;
    if (!parsed || typeof parsed !== "object" || !parsed.posts) return emptyOverlay();
    return parsed;
  } catch {
    return emptyOverlay();
  }
}

function githubConfig() {
  const token = process.env.GITHUB_TOKEN || process.env.CMS_GITHUB_TOKEN || "";
  const repo = process.env.CMS_GITHUB_REPO || "Primerdev1/lucky-kevwoda";
  return { token, repo };
}

function useGithub() {
  return Boolean(process.env.VERCEL) || process.env.CMS_USE_GITHUB === "1";
}

async function githubGet(): Promise<{ overlay: Overlay; sha?: string }> {
  const { token, repo } = githubConfig();
  if (!token) return { overlay: emptyOverlay() };

  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${overlayRel}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );

  if (response.status === 404) return { overlay: emptyOverlay() };
  if (!response.ok) {
    throw new Error(`Could not read posts (${response.status}).`);
  }

  const body = (await response.json()) as { content?: string; encoding?: string; sha?: string };
  const decoded = Buffer.from(body.content ?? "", "base64").toString("utf8");
  return { overlay: parseOverlay(decoded), sha: body.sha };
}

async function githubPut(overlay: Overlay, sha?: string) {
  const { token, repo } = githubConfig();
  if (!token) {
    throw new Error("Live publishing is not configured (missing GITHUB_TOKEN).");
  }

  const content = Buffer.from(`${JSON.stringify(overlay, null, 2)}\n`, "utf8").toString("base64");
  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${overlayRel}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        message: "Update journal posts from admin",
        content,
        sha,
        branch: "main",
      }),
    },
  );

  if (response.status === 409) {
    const latest = await githubGet();
    return githubPut(overlay, latest.sha);
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Could not save posts to GitHub (${response.status}). ${detail.slice(0, 180)}`);
  }
}

function readOverlayFile() {
  if (!fs.existsSync(overlayPath)) return emptyOverlay();
  return parseOverlay(fs.readFileSync(overlayPath, "utf8"));
}

function writeOverlayFile(overlay: Overlay) {
  fs.mkdirSync(path.dirname(overlayPath), { recursive: true });
  fs.writeFileSync(overlayPath, `${JSON.stringify(overlay, null, 2)}\n`, "utf8");
}

export async function loadOverlay(): Promise<Overlay> {
  if (useGithub() && (process.env.VERCEL || process.env.CMS_USE_GITHUB === "1")) {
    const { overlay } = await githubGet();
    return overlay;
  }
  return readOverlayFile();
}

export async function saveOverlay(mutator: (current: Overlay) => Overlay) {
  if (useGithub() && (process.env.VERCEL || process.env.CMS_USE_GITHUB === "1")) {
    const { overlay, sha } = await githubGet();
    const next = mutator(overlay);
    await githubPut(next, sha);
    return next;
  }

  try {
    const next = mutator(readOverlayFile());
    writeOverlayFile(next);
    return next;
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "EACCES" || code === "EPERM" || code === "EROFS") {
      const { overlay, sha } = await githubGet();
      const next = mutator(overlay);
      await githubPut(next, sha);
      return next;
    }
    throw error;
  }
}
