// Next.js 16 proxy (formerly middleware): gate /facilitators and /sangha behind their shared-password cookies.
// See plans/SETUP-supabase-vercel.md §6b–6c. Env: FACILITATOR_PASSWORD, FACILITATOR_COOKIE_SECRET,
// MEMBER_PASSWORD, MEMBER_COOKIE_SECRET.
import { NextResponse, type NextRequest } from "next/server";
import { gateFor } from "@/lib/gate";

export const config = { matcher: ["/facilitators/:path*", "/sangha/:path*"] };

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const gate = gateFor(pathname);
  if (!gate) return NextResponse.next();
  if (pathname.startsWith(gate.enter)) return NextResponse.next();

  const secret = process.env[gate.secretEnv];
  if (secret && req.cookies.get(gate.cookie)?.value === secret) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = gate.enter;
  url.search = "";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}
