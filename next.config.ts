import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Book covers for the Sangha library (src/lib/data/covers.ts). Uploaded covers are served
    // from the Supabase `media` bucket instead — add that host here when the bucket goes live.
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org", pathname: "/b/isbn/**" },
    ],
  },
};

export default nextConfig;
