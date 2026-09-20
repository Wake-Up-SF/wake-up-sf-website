import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Sub Nav + 760px article column.
 * Mobile: sub-nav chip row above a full-width column. Tablet: 180 + fill, gap 64. Desktop: 220 + 760, gap 96.
 * The sub-nav wrapper is the sticky element (top = nav height on mobile, 96px on md+). On md+ it must be `self-start`
 * so it can travel the full row height; on mobile it must stay full width (`self-start` there shrank the white
 * band to the width of its own text, so the article scrolled through the gap beside it).
 */
export function Article({
  subnav,
  className,
  children,
}: {
  subnav: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-32 md:flex-row md:items-start md:gap-64 xl:gap-96", className)}>
      <div className="sticky top-nav z-40 w-full self-stretch border-b border-rule bg-surface md:top-subnav-top md:w-subnav-md md:shrink-0 md:self-start md:border-b-0 xl:w-subnav">{subnav}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-28 xl:max-w-article">{children}</div>
    </div>
  );
}
