import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

/** Vertical rhythm between page sections (56 / 72 / 96) with an optional 1px rule on top. */
export const section = cva("w-full", {
  variants: {
    rule: { true: "border-t border-rule", false: "" },
    pad: {
      both: "py-section-sm md:py-section-md xl:py-section",
      bottom: "pb-section-sm md:pb-section-md xl:pb-section",
      top: "pt-section-sm md:pt-section-md xl:pt-section",
      none: "",
    },
  },
  defaultVariants: { rule: false, pad: "both" },
});

export type SectionProps = ComponentPropsWithoutRef<"section"> & VariantProps<typeof section>;

export function Section({ rule, pad, className, children, ...rest }: SectionProps) {
  return (
    <section className={cn(section({ rule, pad }), className)} {...rest}>
      <Container>{children}</Container>
    </section>
  );
}
