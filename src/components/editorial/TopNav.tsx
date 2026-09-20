"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import type { LinkItem } from "@/lib/types";
import { MenuSheet } from "./MenuSheet";

export type TopNavProps = {
  items?: LinkItem[];
  active?: string; // href of the current page
  className?: string;
};

/**
 * Figma "Top Nav": sticky (top 0, z-50, white). A 1px rule fades in once the page has scrolled.
 * Desktop/tablet: menu icon + Body 3 links (active in accent). Mobile: icon + wordmark; links live in the MenuSheet.
 */
export function TopNav({ items = site.nav, active, className }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 flex h-nav items-center bg-surface px-gutter-sm md:px-gutter-md xl:px-gutter",
          "border-b motion-safe:transition-colors",
          scrolled ? "border-rule" : "border-transparent",
          className,
        )}
      >
        <nav aria-label="Primary" className="flex w-full items-center gap-28">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-sheet"
            aria-label="Open menu"
            className="flex items-center"
          >
            <Menu size={18} strokeWidth={1.6} />
          </button>
          <Link href="/" className="text-body-3 text-text md:hidden">
            Wake Up SF
          </Link>
          <ul className="hidden items-center gap-28 md:flex">
            {items.map((it) => {
              const isActive = active === it.href;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn("text-body-3 hover:text-accent", isActive ? "text-accent" : "text-text")}
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <div id="menu-sheet">
        <MenuSheet open={open} onClose={close} items={items} footerColumns={site.footer.columns} />
      </div>
    </>
  );
}
