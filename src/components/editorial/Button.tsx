import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** Figma "Button": 4px radius, 8×16 padding, Body 3. Filled = accent, Outline = 1px ink 30%. Nav and forms only. */
export const button = cva(
  "inline-flex items-center justify-center rounded-sm px-16 py-8 text-body-3 motion-safe:transition-colors disabled:opacity-60",
  {
    variants: {
      variant: {
        filled: "bg-accent text-on-accent hover:bg-accent-hover",
        outline: "border border-text/30 text-text hover:border-text/60",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "filled", block: false },
  },
);

type Variants = VariantProps<typeof button>;

export type ButtonLinkProps = Variants & { href: string; className?: string; children: ReactNode };
export type ButtonButtonProps = Variants &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & { className?: string; children: ReactNode };

export function Button(props: ButtonLinkProps | ButtonButtonProps) {
  if ("href" in props) {
    const { href, variant, block, className, children } = props;
    return (
      <Link href={href} className={cn(button({ variant, block }), className)}>
        {children}
      </Link>
    );
  }
  const { variant, block, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={cn(button({ variant, block }), className)} {...rest}>
      {children}
    </button>
  );
}
