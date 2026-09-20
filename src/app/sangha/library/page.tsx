import { Article } from "@/components/ui/Article";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { BrandBlock } from "@/components/editorial/BrandBlock";
import { FooterB } from "@/components/editorial/FooterB";
import { List, ListRow } from "@/components/editorial/ListRow";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { SubNav } from "@/components/editorial/SubNav";
import { TopNav } from "@/components/editorial/TopNav";
import { site } from "@/config/site";
import { describeLibraryItem, getLibraryByStatus } from "@/lib/data/library";
import { LIBRARY_STATUS_LABEL, type LibraryItem } from "@/lib/types";

export const metadata = { title: "Library" };
export const dynamic = "force-dynamic"; // gated by cookie

const copy = site.sangha.library;

/** "Ask Charisse →" on the shelf, "Ask to be next →" when it's out, "Offer yours →" when it's wanted. */
function actionFor(item: LibraryItem) {
  if (!item.contactHref) return undefined;
  if (item.status === "wanted") return `${copy.offerLabel} →`;
  if (item.status === "lent") return `${copy.waitlistLabel} →`;
  return `${copy.askLabel} ${item.owner} →`;
}

export default async function LibraryPage() {
  const s = site.sangha;
  const groups = await getLibraryByStatus();

  return (
    <main className="flex flex-col">
      <TopNav active="/sangha" />
      <BrandBlock />
      <PageHeader title={copy.title} lede={copy.lede} links={copy.links} />

      <Section pad="bottom">
        <Article subnav={<SubNav group={s.subnav.group} items={s.subnav.items} active="/sangha/library" />}>
          {groups.length === 0 ? (
            <Text size={2} tone="muted">
              {copy.empty}
            </Text>
          ) : null}

          {groups.map(({ status, items }) => (
            <div key={status} className="flex flex-col gap-12">
              <SectionLabel label={LIBRARY_STATUS_LABEL[status]} />
              <List>
                {items.map((item) => (
                  <ListRow
                    key={item.id}
                    type="document"
                    kind={item.kind}
                    title={item.title}
                    description={describeLibraryItem(item)}
                    action={actionFor(item)}
                    href={item.contactHref}
                  />
                ))}
              </List>
            </div>
          ))}
        </Article>
      </Section>

      <FooterB />
    </main>
  );
}
