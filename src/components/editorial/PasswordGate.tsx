"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { site } from "@/config/site";
import { enterFacilitators, type EnterState } from "@/app/facilitators/enter/actions";
import { ArrowLink } from "./ArrowLink";
import { Button } from "./Button";

const initial: EnterState = { error: false };

/** Figma "Password Gate" card: Input, filled Button, Arrow Link, error line hidden by default. */
export function PasswordGate({ next, error }: { next?: string; error?: boolean }) {
  const [state, action, pending] = useActionState(enterFacilitators, { error: !!error });
  const gate = site.facilitators.gate;
  const showError = state.error || initial.error;

  return (
    <form action={action} className="flex w-full flex-col gap-20 bg-surface-footer p-24 md:w-[520px] md:p-48">
      <input type="hidden" name="next" value={next ?? "/facilitators"} />
      <Input
        name="password"
        type="password"
        label={gate.passwordLabel}
        placeholder="••••••••••"
        autoComplete="current-password"
        required
        error={showError ? gate.error : undefined}
      />
      <Button type="submit" block disabled={pending}>
        {gate.submit}
      </Button>
      <div className="flex justify-center">
        <ArrowLink {...gate.help} />
      </div>
      {!showError ? (
        <Text size={3} tone="faint" className="sr-only">
          Enter the shared facilitator password.
        </Text>
      ) : null}
    </form>
  );
}
