import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Img, LinkItem } from "@/lib/types";
import { BrandBlock } from "./BrandBlock";
import { PageHeader } from "./PageHeader";
import { TopNav } from "./TopNav";

export type SplitHeroProps = {
  active?: string;
  wordmark?: string;
  title?: string;
  lede?: string;
  links?: LinkItem[];
  image?: Img;
  titleId?: string;
};

/**
 * Figma "Split Hero": Top Nav + Brand Block + Page Header on the left, photo on the right.
 * Desktop 720/720 and the full viewport height; tablet text fill + 340 photo; mobile stacked with a 390×300 photo.
 * Without `image` the left column runs full width (Events). Without `title` it is nav + brand only (password gate).
 */
export function SplitHero({ active, wordmark, title, lede, links, image, titleId }: SplitHeroProps) {
  return (
    <div className={cn("flex w-full flex-col md:flex-row", image && "md:min-h-svh")}>
      <div className="flex min-w-0 flex-1 flex-col md:justify-between">
        <TopNav active={active} />
        <BrandBlock wordmark={wordmark} />
        {title && lede ? <PageHeader title={title} lede={lede} links={links} id={titleId} /> : null}
      </div>
      {image ? (
        <div className="relative h-[300px] w-full shrink-0 bg-surface-muted md:h-auto md:min-h-svh md:w-[340px] xl:w-1/2">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 1440px) 50vw, (min-width: 834px) 340px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
