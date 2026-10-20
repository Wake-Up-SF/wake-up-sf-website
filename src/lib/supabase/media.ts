// src/lib/supabase/media.ts — turns a path in the public `media` bucket into an image URL.
// Facilitators type paths like `leaders/charisse.jpg`; a local `/images/...` path or a full URL passes through.
export function mediaUrl(path: string): string {
  if (path.startsWith("/") || /^https?:\/\//.test(path)) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path.replace(/^media\//, "")}`;
}
