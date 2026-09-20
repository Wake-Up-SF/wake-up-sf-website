import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";
import { site } from "@/config/site";
import type { LinkItem } from "@/lib/types";
import { SectionLabel } from "./SectionLabel";

type Column = { label: string; links: LinkItem[] };

function FooterLink({ label, href, external }: LinkItem) {
  const cls = "text-body-3 text-text hover:text-accent";
  if (external || /^(https?:|mailto:|sms:)/.test(href)) {
    return (
      <a href={href} className={cls} rel="noopener">
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

/** Figma "Footer B": cream surface, logo + description, three "— Label" columns, bottom row with a rule above. */
export function FooterB({
  description = site.footer.description,
  columns = site.footer.columns,
  bottomLinks = site.footer.bottomLinks,
}: {
  description?: string;
  columns?: Column[];
  bottomLinks?: LinkItem[];
}) {
  return (
    <footer className="w-full bg-surface-footer pt-48 pb-28 md:pt-56 xl:pt-64 xl:pb-40">
      <Container className="flex flex-col gap-48">
        <div className="flex flex-col gap-28 md:flex-row md:gap-32 xl:gap-48">
          <div className="flex flex-col gap-14 md:w-[220px] md:shrink-0 xl:w-[300px]">
            <Image src="/images/logo.png" alt="Wake Up" width={1753} height={923} className="h-[63px] w-auto" />
            <Text size={3} tone="muted">
              {description}
            </Text>
          </div>
          {columns.map((col) => (
            <div key={col.label} className="flex flex-1 flex-col gap-10">
              <SectionLabel label={col.label} />
              {col.links.map((l) => (
                <FooterLink key={l.label} {...l} />
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8 border-t border-rule pt-24 md:flex-row md:flex-wrap md:gap-24">
          <Text as="span" size={3} tone="faint">
            {site.footer.copyright}
          </Text>
          {bottomLinks.map((l) => (
            <Text key={l.label} as="span" size={3} tone="faint">
              <FooterLink {...l} />
            </Text>
          ))}
        </div>
      </Container>
    </footer>
  );
}
