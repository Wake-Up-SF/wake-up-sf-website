// src/lib/data/covers.ts — where a book cover comes from.
// Open Library serves a cover for most ISBNs, free and without a key, so a facilitator only has to
// type the ISBN. An uploaded file in the Supabase `media` bucket always wins over it.
// The host is allowed in next.config.ts; a missing cover renders as a blank spine, never a broken image.
import type { Img } from "@/lib/types";

export function openLibraryCover(isbn: string, title: string): Img | undefined {
  const clean = isbn.replace(/[^0-9Xx]/g, "");
  return clean ? { src: `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`, alt: `Cover of ${title}` } : undefined;
}

export function coverFrom(coverPath: string | null, isbn: string | null, title: string): Img | undefined {
  if (coverPath) return { src: coverPath, alt: `Cover of ${title}` };
  return isbn ? openLibraryCover(isbn, title) : undefined;
}
