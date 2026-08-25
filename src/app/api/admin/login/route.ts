import { NextResponse } from "next/server";
import { adminCookie, passwordsMatch, signSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!passwordsMatch(String(body?.password ?? ""))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await signSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: adminCookie.name,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminCookie.maxAge,
  });
  return response;
}
