import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Gutters (20 / 40 / 72) and the 1296px content width. */
export const containerClass = "mx-auto w-full max-w-[calc(var(--spacing-content)+2*var(--spacing-gutter))] px-gutter-sm md:px-gutter-md xl:px-gutter";

export function Container({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn(containerClass, className)} {...rest} />;
}
