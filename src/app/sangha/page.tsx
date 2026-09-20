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
import { describeLibraryItem, getLibrary } from "@/lib/data/library";
import { describeMemberPost, getMemberPosts } from "@/lib/data/posts";
import { formatSeriesRange, getSeries } from "@/lib/data/series";
import { LIBRARY_STATUS_LABEL } from "@/lib/types";

export const metadata = { title: "Sangha Hub" }; // a layout template never applies to its own segment
export const dynamic = "force-dynamic"; // gated by cookie

export default async function SanghaPage() {
  const s = site.sangha;
  const o = s.overview;
  const [series, library, posts] = await Promise.all([
    getSeries({ limit: 3 }),
    getLibrary({ limit: 4 }),
    getMemberPosts({ limit: 3 }),
  ]);

  return (
    <main className="flex flex-col">
      <SplitHero active="/sangha" title={s.title} lede={s.lede} links={s.links} image={s.hero} />

      <Section pad="both">
        <InfoColumns items={s.infoColumns} />
      </Section>

      <Section pad="bottom">
        <Article subnav={<SubNav group={s.subnav.group} items={s.subnav.items} active="/sangha" />}>
          <Heading level="display">{o.title}</Heading>
          <Text size="lede">{o.lede}</Text>

          <div className="flex flex-col gap-12">
            <SectionLabel label={o.seriesLabel} />
            {series.length ? (
              <List>
                {series.map((item) => (
                  <ListRow
                    key={item.id}
                    type="event"
                    lead={formatSeriesRange(item.startsAt, item.endsAt)}
                    title={item.title}
                    meta={[item.cadence, item.place].filter(Boolean).join(" · ")}
                    action={o.seriesRowAction}
                    href="/sangha/series"
                  />
                ))}
              </List>
            ) : (
              <Text size={2} tone="muted">
                {s.series.empty}
              </Text>
            )}
            <ArrowLink {...o.seriesLink} />
          </div>

          <div className="flex flex-col gap-12">
            <SectionLabel label={o.libraryLabel} />
            {library.length ? (
              <List>
                {library.map((item) => (
                  <ListRow
                    key={item.id}
                    type="document"
                    kind={LIBRARY_STATUS_LABEL[item.status]}
                    title={item.title}
                    description={describeLibraryItem(item)}
                    action={item.contactHref ? `${s.library.askLabel} ${item.owner} →` : undefined}
                    href={item.contactHref}
                  />
                ))}
              </List>
            ) : (
              <Text size={2} tone="muted">
                {s.library.empty}
              </Text>
            )}
            <ArrowLink {...o.libraryLink} />
          </div>

          <div className="flex flex-col gap-12">
            <SectionLabel label={o.writingLabel} />
            {posts.length ? (
              <List>
                {posts.map((post) => (
                  <ListRow
                    key={post.id}
                    type="document"
                    kind={post.publication}
                    title={post.title}
                    description={describeMemberPost(post)}
                    action={`${s.writing.readLabel} →`}
                    href={post.url}
                    external
                  />
                ))}
              </List>
            ) : (
              <Text size={2} tone="muted">
                {s.writing.empty}
              </Text>
            )}
            <ArrowLink {...o.writingLink} />
          </div>

          <div className="flex flex-col gap-10 border-l-[3px] border-accent py-8 pl-28">
            <Heading level={3}>{o.resources.title}</Heading>
            <Text size={2} tone="muted">
              {o.resources.text}
            </Text>
            <ArrowLink {...o.resources.link} />
          </div>
        </Article>
      </Section>

      <FooterB />
    </main>
  );
}
