// Next.js 16 proxy (formerly middleware): gate /facilitators behind the shared-password cookie.
// See plans/SETUP-supabase-vercel.md §6b. Env: FACILITATOR_PASSWORD, FACILITATOR_COOKIE_SECRET.
import { NextResponse, type NextRequest } from "next/server";

export const config = { matcher: ["/facilitators/:path*"] };

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/facilitators/enter")) return NextResponse.next();
  const secret = process.env.FACILITATOR_COOKIE_SECRET;
  if (secret && req.cookies.get("wusf_fac")?.value === secret) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/facilitators/enter";
  url.search = "";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}
