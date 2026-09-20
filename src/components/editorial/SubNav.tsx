"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { LinkItem } from "@/lib/types";

export type SubNavProps = {
  group: string;
  items: LinkItem[]; // max 6
  active?: string; // href; if omitted, the first item (or scroll-spy for #hash items)
  className?: string;
};

/**
 * Figma "Sub Nav": group label Heading 4, active item Heading 5 accent, other items Body 3 muted.
 * Desktop 220 / Tablet 180 column, sticky at 96px under the Top Nav. Mobile: wrapping chip row pinned under the nav.
 * Scroll-spy: for in-page "#id" items the active one follows the headings.
 */
export function SubNav({ group, items, active, className }: SubNavProps) {
  const list = items.slice(0, 6);
  const [spy, setSpy] = useState<string | null>(null);

  useEffect(() => {
    const hashes = list.filter((i) => i.href.startsWith("#"));
    if (!hashes.length) return;
    const targets = hashes.map((i) => document.getElementById(i.href.slice(1))).filter(Boolean) as HTMLElement[];
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setSpy(`#${visible[0].target.id}`);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [list]);

  const current = active ?? spy ?? list[0]?.href;

  return (
    <nav
      aria-label={group}
      className={cn(
        "sticky top-nav z-40 flex flex-row flex-wrap items-baseline gap-x-20 gap-y-10 bg-surface py-12",
        "md:top-subnav-top md:flex-col md:items-start md:gap-14 md:py-0",
        className,
      )}
    >
      <span className="text-h4 text-text">{group}</span>
      {list.map((it) => {
        const isActive = it.href === current;
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(isActive ? "text-h5 text-accent" : "text-body-3 text-text-muted hover:text-accent")}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
