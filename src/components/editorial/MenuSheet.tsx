"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Text } from "@/components/ui/Text";
import type { LinkItem } from "@/lib/types";
import { SectionLabel } from "./SectionLabel";

type Column = { label: string; links: LinkItem[] };

/** Full-screen sheet opened by the Top Nav menu icon: nav items, then footer columns. */
export function MenuSheet({
  open,
  onClose,
  items,
  footerColumns,
}: {
  open: boolean;
  onClose: () => void;
  items: LinkItem[];
  footerColumns: Column[];
}) {
  const pathname = usePathname();
  const first = useRef<HTMLButtonElement>(null);

  // Close on route change and on Escape; trap initial focus.
  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col bg-surface">
      <div className="flex items-center justify-between px-gutter-sm py-16 md:px-gutter-md">
        <Text as="span" size={3}>
          Menu
        </Text>
        <button ref={first} type="button" onClick={onClose} aria-label="Close menu" className="p-4">
          <X size={20} strokeWidth={1.6} />
        </button>
      </div>
      <nav aria-label="Site" className="flex flex-col overflow-y-auto px-gutter-sm pb-40 md:px-gutter-md">
        <div className="flex flex-col border-t border-rule">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="border-b border-rule py-14 text-h3 text-text hover:text-accent">
              {it.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-28 pt-32">
          {footerColumns.map((col) => (
            <div key={col.label} className="flex flex-col gap-10">
              <SectionLabel label={col.label} />
              {col.links.map((l) => (
                <a key={l.label} href={l.href} className="text-body-3 text-text hover:text-accent">
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
