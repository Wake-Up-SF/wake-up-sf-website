// src/lib/data/posts.ts — the only place that knows the `member_posts` table.
// A facilitator adds each row by hand (title, author, link, blurb); nothing is imported from Substack.
// Members-only, like the library: read server-side with the service-role client, only from /sangha pages.
// Row shape per plans/SETUP-supabase-vercel.md §3a.
import type { MemberPost } from "@/lib/types";
import { privateDb, rows } from "@/lib/supabase/server";
import { fixtureMemberPosts } from "./fixtures";

export type MemberPostRow = {
  id: string;
  created_at: string;
  title: string;
  author: string;
  publication: string;
  published_at: string | null;
  excerpt: string;
  url: string;
  is_published: boolean;
};

export function mapMemberPost(row: MemberPostRow): MemberPost {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    publication: row.publication,
    publishedAt: row.published_at,
    excerpt: row.excerpt,
    url: row.url,
  };
}

export async function getMemberPosts(opts: { limit?: number } = {}): Promise<MemberPost[]> {
  const db = privateDb();
  if (db) {
    let q = db
      .from("member_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false });
    if (opts.limit) q = q.limit(opts.limit);
    return rows(await q, "member_posts").map((r) => mapMemberPost(r as MemberPostRow));
  }
  const list = [...fixtureMemberPosts].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  return opts.limit ? list.slice(0, opts.limit) : list;
}

const postDateFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "America/Los_Angeles",
});

export function formatPostDate(iso: string | null) {
  return iso ? postDateFmt.format(new Date(iso)) : "";
}

/** The one-line description under a post title: author, date, and the opening line. */
export function describeMemberPost(post: MemberPost): string {
  return [post.author, formatPostDate(post.publishedAt), post.excerpt].filter(Boolean).join(" · ");
}
