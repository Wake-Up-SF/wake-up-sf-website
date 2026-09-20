import type { ReactNode } from "react";
import Image from "next/image";
import { cva } from "class-variance-authority";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import type { Img } from "@/lib/types";

/** Figma "List Row" — the single list primitive. Types mirror `Type=Event|Person|Document|Step`. */
export const listRow = cva(
  "group flex flex-col gap-6 border-b border-rule py-14 md:flex-row md:items-start md:gap-32 md:py-20",
  {
    variants: {
      type: { event: "", person: "md:items-center", document: "", step: "" },
    },
    defaultVariants: { type: "event" },
  },
);

type Common = { href?: string; external?: boolean; className?: string };
export type ListRowProps = Common &
  (
    | { type: "event"; lead: string; title: string; meta?: string; action?: string }
    | { type: "person"; name: string; role: string; contact?: string; avatar?: Img }
    | { type: "document"; kind: string; title: string; description?: string; action?: string }
    | { type: "step"; duration: string; title: string; description?: string }
  );

const leadClass = "shrink-0 md:w-[130px] xl:w-[180px]";
const actionClass = "text-h4 text-accent md:shrink-0";

export function ListRow(props: ListRowProps) {
  const { href, external, className } = props;
  let lead: ReactNode = null;
  let body: ReactNode = null;
  let action: ReactNode = null;

  switch (props.type) {
    case "event":
      lead = (
        <Text as="span" size={2} tone="faint" className={leadClass}>
          {props.lead}
        </Text>
      );
      body = (
        <>
          <Heading level={3} as="span" className="group-hover:text-accent">
            {props.title}
          </Heading>
          {props.meta ? (
            <Text as="span" size={3} tone="faint">
              {props.meta}
            </Text>
          ) : null}
        </>
      );
      action = props.action ? <span className={actionClass}>{props.action}</span> : null;
      break;
    case "person":
      lead = (
        <span className="relative size-44 shrink-0 overflow-hidden rounded-pill bg-surface-muted">
          {props.avatar ? <Image src={props.avatar.src} alt={props.avatar.alt} fill className="object-cover" /> : null}
        </span>
      );
      body = (
        <>
          <Text as="span" size={1} className="group-hover:text-accent">
            {props.name}
          </Text>
          <Text as="span" size={3} tone="faint">
            {props.role}
          </Text>
        </>
      );
      action = props.contact ? <span className={actionClass}>{props.contact}</span> : null;
      break;
    case "document":
      lead = (
        <Text as="span" size={3} tone="faint" className={leadClass}>
          {props.kind}
        </Text>
      );
      body = (
        <>
          <Text as="span" size={1} className="group-hover:text-accent">
            {props.title}
          </Text>
          {props.description ? (
            <Text as="span" size={3} tone="faint">
              {props.description}
            </Text>
          ) : null}
        </>
      );
      action = props.action ? <span className={actionClass}>{props.action}</span> : null;
      break;
    case "step":
      lead = (
        <Text as="span" size={2} tone="faint" className={leadClass}>
          {props.duration}
        </Text>
      );
      body = (
        <>
          <Text as="span" size={1}>
            {props.title}
          </Text>
          {props.description ? (
            <Text as="span" size={3} tone="faint">
              {props.description}
            </Text>
          ) : null}
        </>
      );
      break;
  }

  const inner = (
    <>
      {lead}
      <span className="flex min-w-0 flex-1 flex-col gap-2">{body}</span>
      {action}
    </>
  );
  const cls = cn(listRow({ type: props.type }), className);

  if (href) {
    const isExt = external || /^(https?:|mailto:|sms:|tel:)/.test(href);
    return (
      <a href={href} className={cls} target={isExt && /^https?:/.test(href) ? "_blank" : undefined} rel={isExt ? "noopener" : undefined}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}

/** A list of rows with the opening 1px rule. */
export function List({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col border-t border-rule", className)}>{children}</div>;
}
