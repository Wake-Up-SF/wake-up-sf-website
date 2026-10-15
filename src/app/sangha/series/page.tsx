import { Article } from "@/components/ui/Article";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { ArrowLink } from "@/components/editorial/ArrowLink";
import { BrandBlock } from "@/components/editorial/BrandBlock";
import { FooterB } from "@/components/editorial/FooterB";
import { List, ListRow } from "@/components/editorial/ListRow";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { SubNav } from "@/components/editorial/SubNav";
import { TopNav } from "@/components/editorial/TopNav";
import { site } from "@/config/site";
import { formatEventDate, formatEventTime } from "@/lib/data/events";
import { formatSeriesRange, getSeries } from "@/lib/data/series";
import { EVENT_TYPE_LABEL, SERIES_STATUS_LABEL } from "@/lib/types";

export const metadata = { title: "Series" };
export const dynamic = "force-dynamic"; // gated by cookie

export default async function SeriesPage() {
  const s = site.sangha;
  const copy = s.series;
  const series = await getSeries();

  return (
    <main className="flex flex-col">
      <TopNav active="/sangha" />
      <BrandBlock />
      <PageHeader title={copy.title} lede={copy.lede} links={copy.links} />

      <Section pad="bottom">
        <Article subnav={<SubNav group={s.subnav.group} items={s.subnav.items} active="/sangha/series" />}>
          {series.length === 0 ? (
            <Text size={2} tone="muted">
              {copy.empty}
            </Text>
          ) : null}

          {series.map((item) => (
            <div key={item.id} className="flex flex-col gap-12">
              <SectionLabel
                label={[
                  SERIES_STATUS_LABEL[item.status],
                  formatSeriesRange(item.startsAt, item.endsAt),
                  item.cadence,
                ].join(" · ")}
              />
              <Heading level={3} id={item.slug}>
                {item.title}
              </Heading>
              <Text size={2} tone="muted">
                {item.description}
              </Text>
              <Text size={3} tone="faint">
                {item.place}
              </Text>
              {item.events.length ? (
                <List>
                  {item.events.map((e) => (
                    <ListRow
                      key={e.id}
                      type="event"
                      lead={formatEventDate(e.startsAt)}
                      title={e.title}
                      meta={[
                        e.type === "other" ? undefined : EVENT_TYPE_LABEL[e.type],
                        e.location,
                        formatEventTime(e.startsAt),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                      action={copy.rsvpLabel}
                      href={e.linkUrl}
                      external
                    />
                  ))}
                </List>
              ) : null}
              {item.linkUrl ? <ArrowLink label={copy.seriesLinkLabel} href={item.linkUrl} external /> : null}
            </div>
          ))}
        </Article>
      </Section>

      <FooterB />
    </main>
  );
}
