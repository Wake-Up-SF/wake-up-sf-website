import Image from "next/image";
import { Text } from "@/components/ui/Text";

export type FigureProps = { src: string; alt: string; caption?: string; priority?: boolean };

/** Figma "Figure": column-width photo, 10px gap, Body 3 faint caption. */
export function Figure({ src, alt, caption, priority }: FigureProps) {
  return (
    <figure className="flex flex-col gap-10">
      <div className="relative aspect-[760/480] w-full overflow-hidden bg-surface-muted">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1440px) 760px, (min-width: 834px) 60vw, 100vw"
          className="object-cover"
        />
      </div>
      {caption ? (
        <Text as="figcaption" size={3} tone="faint">
          {caption}
        </Text>
      ) : null}
    </figure>
  );
}
