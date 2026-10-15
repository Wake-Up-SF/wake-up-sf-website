// src/lib/data/library.ts — the only place that knows the `library_items` table.
// Member contact details live in these rows, so unlike events this table has no public read policy:
// TODO(supabase): read it server-side with the service-role client, never the anon key
//   .from('library_items').select(...).eq('is_active', true).order('created_at', { ascending: false })
// Row shape per plans/SETUP-supabase-vercel.md §3a.
import type { LibraryItem, LibraryStatus } from "@/lib/types";
import { coverFrom } from "./covers";
import { fixtureLibrary } from "./fixtures";

export type LibraryRow = {
  id: string;
  created_at: string;
  title: string;
  author: string;
  kind: string;
  status: LibraryStatus;
  note: string | null;
  owner: string;
  contact_href: string | null;
  cover_path: string | null; // path in the Supabase `media` bucket, or a local /images path
  isbn: string | null; // 10 or 13 digits; used only to find a cover
  is_active: boolean;
};

export function mapLibraryItem(row: LibraryRow): LibraryItem {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    kind: row.kind,
    status: row.status,
    note: row.note ?? undefined,
    owner: row.owner,
    contactHref: row.contact_href ?? undefined,
    cover: coverFrom(row.cover_path, row.isbn, row.title),
  };
}

const STATUS_ORDER: LibraryStatus[] = ["available", "lent", "wanted"];

export async function getLibrary(opts: { limit?: number } = {}): Promise<LibraryItem[]> {
  const list = [...fixtureLibrary].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || a.title.localeCompare(b.title),
  );
  return opts.limit ? list.slice(0, opts.limit) : list;
}

/** The shelf grouped for display: On the shelf, then Lent out, then Wanted. Empty groups are dropped. */
export async function getLibraryByStatus(): Promise<Array<{ status: LibraryStatus; items: LibraryItem[] }>> {
  const items = await getLibrary();
  return STATUS_ORDER.map((status) => ({ status, items: items.filter((i) => i.status === status) })).filter(
    (g) => g.items.length > 0,
  );
}

/** The one-line description under a book title: format, author, note, and who has it. */
export function describeLibraryItem(item: LibraryItem): string {
  const who = item.status === "wanted" ? `wanted by ${item.owner}` : `offered by ${item.owner}`;
  const note = item.note?.replace(/\.$/, ""); // the separator is the dot in this line
  const kind = item.kind === "Book" ? undefined : item.kind; // "Book" says nothing next to a cover
  return [kind, `by ${item.author}`, note, who].filter(Boolean).join(" · ");
}
