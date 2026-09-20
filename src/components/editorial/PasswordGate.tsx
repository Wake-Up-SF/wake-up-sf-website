"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import type { LinkItem } from "@/lib/types";
import { ArrowLink } from "./ArrowLink";
import { Button } from "./Button";

export type GateCopy = {
  passwordLabel: string;
  submit: string;
  help: LinkItem;
  error: string;
  hint: string; // for screen readers before an error exists
};

export type GateState = { error: boolean };

export type PasswordGateProps = {
  /** The area's `enter` server action (facilitators or sangha). */
  action: (prev: GateState, formData: FormData) => Promise<GateState>;
  copy: GateCopy;
  /** Where to land after unlocking; the action clamps it to the gated area. */
  fallback: string;
  next?: string;
  error?: boolean;
};

/** Figma "Password Gate" card: Input, filled Button, Arrow Link, error line hidden by default. */
export function PasswordGate({ action, copy, fallback, next, error }: PasswordGateProps) {
  const [state, formAction, pending] = useActionState(action, { error: !!error });
  const showError = state.error;

  return (
    <form action={formAction} className="flex w-full flex-col gap-20 bg-surface-footer p-24 md:w-[520px] md:p-48">
      <input type="hidden" name="next" value={next ?? fallback} />
      <Input
        name="password"
        type="password"
        label={copy.passwordLabel}
        placeholder="••••••••••"
        autoComplete="current-password"
        required
        error={showError ? copy.error : undefined}
      />
      <Button type="submit" block disabled={pending}>
        {copy.submit}
      </Button>
      <div className="flex justify-center">
        <ArrowLink {...copy.help} />
      </div>
      {!showError ? (
        <Text size={3} tone="faint" className="sr-only">
          {copy.hint}
        </Text>
      ) : null}
    </form>
  );
}
