// Server-only: `next/headers` makes importing this from a client component a build error.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_COOKIE_MAX_AGE, gates, safeNext, type GateKey } from "./gate";

export type EnterState = { error: boolean };

/**
 * Check a shared password and, on a match, set the area's cookie and redirect into it.
 * Used by the two `enter/actions.ts` server actions (facilitators, sangha).
 */
export async function enterGate(key: GateKey, formData: FormData): Promise<EnterState> {
  const gate = gates[key];
  const password = process.env[gate.passwordEnv];
  const secret = process.env[gate.secretEnv];
  if (!password || !secret) return { error: true };
  if (formData.get("password") !== password) return { error: true };

  const jar = await cookies();
  jar.set(gate.cookie, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: GATE_COOKIE_MAX_AGE,
    path: "/",
  });
  redirect(safeNext(formData.get("next"), gate));
}
