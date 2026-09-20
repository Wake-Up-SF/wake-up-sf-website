"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Img } from "@/lib/types";

/**
 * A book cover inside a fixed-size parent. Plenty of ISBNs have no cover on Open Library, and an
 * uploaded file can go missing, so a failed load falls back to the parent's blank spine rather than
 * the browser's broken-image icon. The load usually finishes before React hydrates, which means
 * `onError` never fires for it — the mount check for a complete-but-zero-width image is the one
 * that catches it in practice.
 */
export function CoverImage({ cover, sizes }: { cover?: Img; sizes: string }) {
  const wrapper = useRef<HTMLSpanElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const img = wrapper.current?.querySelector("img");
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (!cover || failed) return null;
  return (
    <span ref={wrapper} className="absolute inset-0">
      <Image src={cover.src} alt={cover.alt} fill sizes={sizes} className="object-cover" onError={() => setFailed(true)} />
    </span>
  );
}
