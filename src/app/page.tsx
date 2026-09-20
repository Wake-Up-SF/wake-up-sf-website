import { Article } from "@/components/ui/Article";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { ArrowLink } from "@/components/editorial/ArrowLink";
import { Figure } from "@/components/editorial/Figure";
import { FooterB } from "@/components/editorial/FooterB";
import { InfoColumns } from "@/components/editorial/InfoColumn";
import { List, ListRow } from "@/components/editorial/ListRow";
import { PullQuote } from "@/components/editorial/PullQuote";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { SplitHero } from "@/components/editorial/SplitHero";
import { SubNav } from "@/components/editorial/SubNav";
import { site } from "@/config/site";
import { formatEventDate, formatEventTime, getUpcomingEvents } from "@/lib/data/events";
import { getLeaders } from "@/lib/data/leaders";
import { EVENT_TYPE_LABEL } from "@/lib/types";

export const revalidate = 300;

export default async function HomePage() {
  const [events, leaders] = await Promise.all([getUpcomingEvents({ limit: 3 }), getLeaders(3)]);
  const { home } = site;

  return (
    <main className="flex flex-col">
      <SplitHero active="/" title={home.title} lede={home.lede} image={home.hero} />

      <Section pad="both">
        <InfoColumns items={home.infoColumns} />
      </Section>

      <Section pad="bottom">
        <Article subnav={<SubNav group={home.about.subnav.group} items={home.about.subnav.items} />}>
          <Heading level="display" id="about">
            {home.about.title}
          </Heading>
          <Text size="lede">{home.about.lede}</Text>
          {home.about.paragraphs.map((p) => (
            <Text key={p.slice(0, 24)} size={2} tone="muted">
              {p}
            </Text>
          ))}
          <Figure {...home.about.figure} />
          <PullQuote quote={home.about.quote.text} attribution={home.about.quote.attribution} />
          <div className="flex flex-wrap gap-x-24 gap-y-8">
            {home.about.links.map((l) => (
              <ArrowLink key={l.label} {...l} />
            ))}
          </div>

          <Heading level="display" id="community" className="pt-32">
            {home.community.title}
          </Heading>
          <Text size="lede">{home.community.lede}</Text>
          <Text size={2} tone="muted">
            {home.community.paragraph}
          </Text>
          <div className="flex flex-col gap-12">
            <SectionLabel label={home.community.councilLabel} />
            <List>
              {leaders.map((l) => (
                <ListRow key={l.id} type="person" name={l.name} role={l.role} contact={l.contact} avatar={l.avatar} href={l.contactHref} />
              ))}
            </List>
          </div>
          <div className="flex flex-col gap-10">
            <Heading level={3}>{home.community.getInvolvedTitle}</Heading>
            <Text size={2} tone="muted">
              {home.community.getInvolved}
            </Text>
          </div>
          <div className="flex flex-wrap gap-x-24 gap-y-8">
            {home.community.links.map((l) => (
              <ArrowLink key={l.label} {...l} />
            ))}
          </div>
        </Article>
      </Section>

      <Section pad="bottom">
        <div className="flex flex-col gap-24">
          <div className="flex flex-wrap items-baseline justify-between gap-8">
            <Heading level={2}>{home.eventsTitle}</Heading>
            <ArrowLink {...home.eventsLink} />
          </div>
          <List>
            {events.map((e) => (
              <ListRow
                key={e.id}
                type="event"
                lead={formatEventDate(e.startsAt)}
                title={e.title}
                meta={[EVENT_TYPE_LABEL[e.type], e.location, formatEventTime(e.startsAt)].filter(Boolean).join(" · ")}
                action={site.events.rsvpLabel}
                href={e.linkUrl}
                external
              />
            ))}
          </List>
        </div>
      </Section>

      <FooterB />
    </main>
  );
}
