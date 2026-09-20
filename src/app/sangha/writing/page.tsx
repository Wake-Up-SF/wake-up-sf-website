import { Article } from "@/components/ui/Article";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { BrandBlock } from "@/components/editorial/BrandBlock";
import { FooterB } from "@/components/editorial/FooterB";
import { List, ListRow } from "@/components/editorial/ListRow";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SubNav } from "@/components/editorial/SubNav";
import { TopNav } from "@/components/editorial/TopNav";
import { site } from "@/config/site";
import { describeMemberPost, getMemberPosts } from "@/lib/data/posts";

export const metadata = { title: "Writing" };
export const dynamic = "force-dynamic"; // gated by cookie

export default async function WritingPage() {
  const s = site.sangha;
  const copy = s.writing;
  const posts = await getMemberPosts();

  return (
    <main className="flex flex-col">
      <TopNav active="/sangha" />
      <BrandBlock />
      <PageHeader title={copy.title} lede={copy.lede} links={copy.links} />

      <Section pad="bottom">
        <Article subnav={<SubNav group={s.subnav.group} items={s.subnav.items} active="/sangha/writing" />}>
          {posts.length === 0 ? (
            <Text size={2} tone="muted">
              {copy.empty}
            </Text>
          ) : (
            <List>
              {posts.map((post) => (
                <ListRow
                  key={post.id}
                  type="document"
                  kind={post.publication}
                  title={post.title}
                  description={describeMemberPost(post)}
                  action={`${copy.readLabel} →`}
                  href={post.url}
                  external
                />
              ))}
            </List>
          )}
        </Article>
      </Section>

      <FooterB />
    </main>
  );
}
