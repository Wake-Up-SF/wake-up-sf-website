import Image from "next/image";
import Link from "next/link";
import { WORDMARK } from "@/config/site";
import { cn } from "@/lib/cn";

export { WORDMARK };

/**
 * Figma "Brand Block": Wake Up logo + "san francisco ♥" wordmark.
 * Heart is U+2665 + U+FE0E (text presentation); `font-variant-emoji: text` stops platforms substituting the emoji.
 * Desktop: logo 238×124, padding 56/72. Tablet: 169×88, 24/40. Mobile: 200×105 stacked, 24/20.
 */
export function BrandBlock({ wordmark = WORDMARK, className }: { wordmark?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-8 px-gutter-sm pt-24 md:flex-row md:items-end md:justify-between md:gap-16 md:px-gutter-md xl:px-gutter xl:pt-56",
        className,
      )}
    >
      <Link href="/" aria-label="Wake Up San Francisco — home" className="block">
        <Image
          src="/images/logo.png"
          alt=""
          width={1753}
          height={923}
          priority
          className="h-[105px] w-auto md:h-[88px] xl:h-[124px]"
        />
      </Link>
      <span className="text-h4 text-accent [font-variant-emoji:text]">{wordmark}</span>
    </div>
  );
}
