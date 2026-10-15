import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Every hub page is members-only: gated by the proxy (§6c) and kept out of search results. */
export const metadata: Metadata = {
  title: { default: "Sangha Hub", template: "%s · Sangha Hub" },
  robots: { index: false, follow: false },
};

export default function SanghaLayout({ children }: { children: ReactNode }) {
  return children;
}
