import { Article } from "@/components/ui/Article";
import { Section } from "@/components/ui/Section";
import { BrandBlock } from "@/components/editorial/BrandBlock";
import { FooterB } from "@/components/editorial/FooterB";
import { List, ListRow } from "@/components/editorial/ListRow";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import { SubNav } from "@/components/editorial/SubNav";
import { TopNav } from "@/components/editorial/TopNav";
import { site } from "@/config/site";

export const metadata = { title: "Resources" };
export const dynamic = "force-dynamic"; // gated by cookie

export default function ResourcesPage() {
  const s = site.sangha;
  const copy = s.resources;

  return (
    <main className="flex flex-col">
      <TopNav active="/sangha" />
      <BrandBlock />
      <PageHeader title={copy.title} lede={copy.lede} links={copy.links} />

      <Section pad="bottom">
        <Article subnav={<SubNav group={s.subnav.group} items={s.subnav.items} active="/sangha/resources" />}>
          {copy.groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-12">
              <SectionLabel label={group.label} />
              <List>
                {group.items.map((item) => (
                  <ListRow
                    key={item.title}
                    type="document"
                    kind={item.kind}
                    title={item.title}
                    description={item.description}
                    action={`${copy.openLabel} →`}
                    href={item.href}
                    external
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
