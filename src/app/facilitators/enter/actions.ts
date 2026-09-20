"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type EnterState = { error: boolean };

const COOKIE = "wusf_fac";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

/** Shared-password gate (plans/SETUP-supabase-vercel.md §6b). */
export async function enterFacilitators(_prev: EnterState, formData: FormData): Promise<EnterState> {
  const password = process.env.FACILITATOR_PASSWORD;
  const secret = process.env.FACILITATOR_COOKIE_SECRET;
  if (!password || !secret) return { error: true };
  if (formData.get("password") !== password) return { error: true };

  const jar = await cookies();
  jar.set(COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: THIRTY_DAYS,
    path: "/",
  });
  const next = String(formData.get("next") ?? "/facilitators");
  redirect(next.startsWith("/facilitators") ? next : "/facilitators");
}
