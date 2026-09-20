import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type ArrowLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  label: string;
  href: string;
  external?: boolean;
};

/** Figma "Arrow Link": Heading 4 in accent with a trailing →. The only in-copy action. */
export const arrowLinkClass =
  "group inline-flex items-baseline gap-4 text-h4 text-accent hover:text-accent-hover hover:underline underline-offset-4";

export function ArrowLink({ label, href, external, className, ...rest }: ArrowLinkProps) {
  const text = label.replace(/\s*→\s*$/, "");
  const inner = (
    <>
      <span>{text}</span>
      <span aria-hidden className="inline-block motion-safe:transition-transform group-hover:translate-x-2">
        →
      </span>
    </>
  );
  const cls = cn(arrowLinkClass, className);
  if (external || /^(https?:|mailto:|sms:|tel:)/.test(href)) {
    return (
      <a href={href} className={cls} target={/^https?:/.test(href) ? "_blank" : undefined} rel="noopener" {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}
