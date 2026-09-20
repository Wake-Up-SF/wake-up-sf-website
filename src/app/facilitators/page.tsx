import type { Metadata } from "next";
import { Article } from "@/components/ui/Article";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { ArrowLink } from "@/components/editorial/ArrowLink";
import { FooterB } from "@/components/editorial/FooterB";
import { InfoColumns } from "@/components/editorial/InfoColumn";
import { List, ListRow } from "@/components/editorial/ListRow";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { SplitHero } from "@/components/editorial/SplitHero";
import { SubNav } from "@/components/editorial/SubNav";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Facilitator hub", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic"; // gated by cookie

export default function FacilitatorsPage() {
  const f = site.facilitators;
  return (
    <main className="flex flex-col">
      <SplitHero active="/facilitators" title={f.title} lede={f.lede} links={f.links} image={f.hero} />

      <Section pad="both">
        <InfoColumns items={f.infoColumns} />
      </Section>

      <Section pad="bottom">
        <Article subnav={<SubNav group={f.subnav.group} items={f.subnav.items} />}>
          <Heading level="display" id="schedule">
            {f.glanceTitle}
          </Heading>
          <Text size="lede">{f.glanceLede}</Text>
          <List>
            {f.schedule.map((s) => (
              <ListRow key={s.title} type="step" duration={s.duration} title={s.title} description={s.description} />
            ))}
          </List>

          <div className="flex flex-col gap-10" id="leading">
            <Heading level={3}>{f.containerTitle}</Heading>
            <Text size={2} tone="muted">
              {f.container}
            </Text>
          </div>

          <div className="flex flex-col gap-12">
            <SectionLabel label={f.documentsLabel} />
            <List>
              {f.documents.map((d) => (
                <ListRow key={d.title} type="document" kind={d.kind} title={d.title} description={d.description} action="Open →" href={d.href} external />
              ))}
            </List>
          </div>

          <div className="flex flex-col gap-10 border-l-[3px] border-accent py-8 pl-28">
            <Heading level={3}>{f.support.title}</Heading>
            <Text size={2} tone="muted">
              {f.support.text}
            </Text>
            <ArrowLink {...f.support.link} />
          </div>
        </Article>
      </Section>

      <FooterB />
    </main>
  );
}
