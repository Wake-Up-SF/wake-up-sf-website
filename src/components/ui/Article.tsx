import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Sub Nav + 760px article column.
 * Mobile: sub-nav chip row above a full-width column. Tablet: 180 + fill, gap 64. Desktop: 220 + 760, gap 96.
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
      <div className="md:w-subnav-md md:shrink-0 xl:w-subnav">{subnav}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-28 xl:max-w-article">{children}</div>
    </div>
  );
}
