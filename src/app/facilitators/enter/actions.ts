"use server";

import { enterGate, type EnterState } from "@/lib/gate-server";

export type { EnterState };

/** Shared-password gate for the facilitator hub (plans/SETUP-supabase-vercel.md §6b). */
export async function enterFacilitators(_prev: EnterState, formData: FormData): Promise<EnterState> {
  return enterGate("facilitators", formData);
}
