import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    // Book covers for the Sangha library (src/lib/data/covers.ts), and uploads to the Supabase
    // `media` bucket: leader photos, event and book covers (src/lib/supabase/media.ts).
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org", pathname: "/b/isbn/**" },
      ...(supabaseHost ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/media/**" }] : []),
    ],
  },
};

export default nextConfig;
