const COOKIE = "lk_admin";
const MAX_AGE = 60 * 60 * 24 * 7;
const encoder = new TextEncoder();

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "dev-change-me";
}

function normalizeSecret(value: string) {
  return value.replace(/^\uFEFF/, "").replace(/\r/g, "").trim();
}

export function adminPassword() {
  const fromEnv = normalizeSecret(process.env.ADMIN_PASSWORD ?? "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV !== "production") return "kevwoda-publish";
  return "";
}

async function hmacHex(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(buf), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function signSession() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  const sig = await hmacHex(exp);
  return `${exp}.${sig}`;
}

export async function verifySession(token: string | undefined) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = await hmacHex(exp);
  if (!timingSafeEqual(expected, sig)) return false;
  return Number(exp) > Date.now();
}

export function passwordsMatch(input: string) {
  const expected = adminPassword();
  const got = normalizeSecret(input);
  if (!expected) return false;
  return timingSafeEqual(got, expected);
}

export const adminCookie = {
  name: COOKIE,
  maxAge: MAX_AGE,
} as const;
