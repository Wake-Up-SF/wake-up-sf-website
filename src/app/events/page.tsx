import type { Metadata } from "next";
import { Article } from "@/components/ui/Article";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { ArrowLink } from "@/components/editorial/ArrowLink";
import { BrandBlock } from "@/components/editorial/BrandBlock";
import { Figure } from "@/components/editorial/Figure";
import { FooterB } from "@/components/editorial/FooterB";
import { List, ListRow } from "@/components/editorial/ListRow";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { SubNav } from "@/components/editorial/SubNav";
import { TopNav } from "@/components/editorial/TopNav";
import { site } from "@/config/site";
import { formatEventDate, formatEventTime, getEventsByMonth } from "@/lib/data/events";
import { EVENT_TYPE_LABEL, type EventType } from "@/lib/types";

export const metadata: Metadata = { title: "Events" };
export const revalidate = 300;

const TYPES = new Set<string>(Object.keys(EVENT_TYPE_LABEL));

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const sp = await searchParams;
  const rawType = typeof sp.type === "string" ? sp.type : undefined;
  const type = rawType && TYPES.has(rawType) ? (rawType as EventType) : undefined;
  const months = await getEventsByMonth(type);
  const { events } = site;
  const active = type ? `/events?type=${type}` : "/events";

  return (
    <main className="flex flex-col">
      <TopNav active="/events" />
      <BrandBlock />
      <PageHeader title={events.title} lede={events.lede} links={events.links} />

      <Section pad="bottom">
        <Article subnav={<SubNav group={events.subnav.group} items={events.subnav.items} active={active} />}>
          <Heading level="display">{events.comingUpTitle}</Heading>
          <Text size="lede">{events.comingUpLede}</Text>
          <Figure {...events.figure} priority />
          {months.length === 0 ? (
            <Text size={2} tone="muted">
              Nothing scheduled yet — check back soon, or come to the Sunday sit.
            </Text>
          ) : null}
          {months.map(({ month, events: list }) => (
            <div key={month} className="flex flex-col gap-12">
              <SectionLabel label={month} />
              <List>
                {list.map((e) => (
                  <ListRow
                    key={e.id}
                    type="event"
                    lead={formatEventDate(e.startsAt)}
                    title={e.title}
                    meta={[EVENT_TYPE_LABEL[e.type], e.location, formatEventTime(e.startsAt)].filter(Boolean).join(" · ")}
                    action={events.rsvpLabel}
                    href={e.linkUrl}
                    external
                  />
                ))}
              </List>
            </div>
          ))}
          <ArrowLink {...events.pastLink} />
        </Article>
      </Section>

      <FooterB />
    </main>
  );
}
