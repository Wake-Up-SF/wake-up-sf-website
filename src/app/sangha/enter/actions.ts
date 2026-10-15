"use server";

import { enterGate, type EnterState } from "@/lib/gate-server";

/** Shared-password gate for the Sangha Hub — the member password, not the facilitator one (§6c). */
export async function enterSangha(_prev: EnterState, formData: FormData): Promise<EnterState> {
  return enterGate("sangha", formData);
}
