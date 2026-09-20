import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { LinkItem } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ArrowLink } from "./ArrowLink";

export type PageHeaderProps = {
  title: string;
  lede: string;
  links?: LinkItem[]; // 0–2
  id?: string;
  className?: string;
};

/** Figma "Page Header": Display · Serif title + Lede · Serif + up to two Arrow Links. Sizes 48/24 → 44/22 → 36/20. */
export function PageHeader({ title, lede, links = [], id, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-16 px-gutter-sm pt-24 pb-32 md:px-gutter-md xl:px-gutter xl:pt-40 xl:pb-40",
        className,
      )}
    >
      <Heading level="display" id={id}>
        {title}
      </Heading>
      <Text size="lede">{lede}</Text>
      {links.length ? (
        <div className="flex flex-wrap gap-x-24 gap-y-8 pt-8">
          {links.slice(0, 2).map((l) => (
            <ArrowLink key={l.label} {...l} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
