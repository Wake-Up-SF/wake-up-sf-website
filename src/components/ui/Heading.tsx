import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** The heading half of the type scale. Display is the responsive serif title. */
export const heading = cva("", {
  variants: {
    level: {
      display: "font-serif text-display-sm md:text-display-md xl:text-display",
      1: "text-h1",
      2: "text-h2",
      3: "text-h3",
      4: "text-h4",
      5: "text-h5",
    },
    tone: {
      default: "text-text",
      muted: "text-text-muted",
      faint: "text-text-faint",
      accent: "text-accent",
    },
  },
  defaultVariants: { level: 2, tone: "default" },
});

type Level = NonNullable<VariantProps<typeof heading>["level"]>;
type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span" | "div";

export type HeadingProps = ComponentPropsWithoutRef<"h2"> &
  VariantProps<typeof heading> & { as?: Tag };

const defaultTag: Record<Level, Tag> = { display: "h1", 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5" };

export function Heading({ level = 2, tone, as, className, ...rest }: HeadingProps) {
  const Tag: ElementType = as ?? defaultTag[level ?? 2];
  return <Tag className={cn(heading({ level, tone }), className)} {...rest} />;
}
