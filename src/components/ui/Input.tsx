import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Text } from "./Text";

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
};

/** Legacy Input Field (password gate): Body 3 label, 1px rule border, pill radius. */
export function Input({ label, error, id, className, ...rest }: InputProps) {
  const inputId = id ?? rest.name ?? "input";
  const errorId = `${inputId}-error`;
  return (
    <div className="flex flex-col gap-8">
      <Text as="span" size={3} tone="default">
        <label htmlFor={inputId}>{label}</label>
      </Text>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full rounded-pill border border-rule bg-surface px-18 py-13 text-body-2 text-text placeholder:text-text-faint",
          className,
        )}
        {...rest}
      />
      {error ? (
        <Text id={errorId} size={3} tone="accent" role="alert">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
