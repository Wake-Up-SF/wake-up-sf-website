import type { ElementType, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The body half of the type scale. Lede is the responsive serif paragraph. No weight prop, by design. */
export const text = cva("", {
  variants: {
    size: {
      lede: "font-serif text-lede-sm md:text-lede-md xl:text-lede",
      1: "text-body-1",
      2: "text-body-2",
      3: "text-body-3",
    },
    tone: {
      default: "text-text",
      muted: "text-text-muted",
      faint: "text-text-faint",
      accent: "text-accent",
    },
  },
  defaultVariants: { size: 2, tone: "default" },
});

export type TextProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof text> & { as?: "p" | "span" | "div" | "li" | "figcaption" | "dt" | "dd" };

export function Text({ size, tone, as = "p", className, ...rest }: TextProps) {
  const Tag: ElementType = as;
  return <Tag className={cn(text({ size, tone }), className)} {...rest} />;
}
