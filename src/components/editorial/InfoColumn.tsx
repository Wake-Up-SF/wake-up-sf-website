import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { LinkItem } from "@/lib/types";
import { ArrowLink } from "./ArrowLink";

export type InfoColumnProps = { title: string; body: string; link?: LinkItem };

/** Figma "Info Column": 1px ink top rule, 16px top padding, Heading 3 + Body 2 + Arrow Link. */
export function InfoColumn({ title, body, link }: InfoColumnProps) {
  return (
    <div className="flex flex-col gap-12 border-t border-text pt-16">
      <Heading level={3}>{title}</Heading>
      <Text size={2} tone="muted">
        {body}
      </Text>
      {link ? <ArrowLink {...link} /> : null}
    </div>
  );
}

/** 2–3 Info Columns across (48 gap), stacked on mobile (24 gap). */
export function InfoColumns({ items }: { items: InfoColumnProps[] }) {
  return (
    <div className="grid grid-cols-1 gap-24 md:grid-cols-2 md:gap-48">
      {items.map((item) => (
        <InfoColumn key={item.title} {...item} />
      ))}
    </div>
  );
}
