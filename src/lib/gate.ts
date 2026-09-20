/**
 * Shared-password gates (plans/SETUP-supabase-vercel.md §6b–6c).
 * Two independent gates, one mechanism: a password env var, a cookie secret env var, and a cookie.
 * Facilitators and members have separate passwords — a member password never opens the facilitator hub.
 * This is a courtesy wall, not a security boundary; member data that must stay private is read
 * server-side with the service-role key and never shipped to a public route.
 */
export type GateKey = "facilitators" | "sangha";

export type Gate = {
  base: string; // path prefix the gate protects
  enter: string; // the password page, always reachable
  cookie: string;
  passwordEnv: string;
  secretEnv: string;
};

export const gates: Record<GateKey, Gate> = {
  facilitators: {
    base: "/facilitators",
    enter: "/facilitators/enter",
    cookie: "wusf_fac",
    passwordEnv: "FACILITATOR_PASSWORD",
    secretEnv: "FACILITATOR_COOKIE_SECRET",
  },
  sangha: {
    base: "/sangha",
    enter: "/sangha/enter",
    cookie: "wusf_member",
    passwordEnv: "MEMBER_PASSWORD",
    secretEnv: "MEMBER_COOKIE_SECRET",
  },
};

export const gateList = Object.values(gates);

export const GATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** The gate protecting a path, if any. */
export function gateFor(pathname: string): Gate | undefined {
  return gateList.find((g) => pathname === g.base || pathname.startsWith(`${g.base}/`));
}

/** Keep a `next` redirect inside the area the visitor just unlocked. */
export function safeNext(next: unknown, gate: Gate): string {
  return typeof next === "string" && (next === gate.base || next.startsWith(`${gate.base}/`)) && !next.startsWith(gate.enter)
    ? next
    : gate.base;
}
