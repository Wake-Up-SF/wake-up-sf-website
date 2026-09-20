import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** The ten text-size tokens from src/styles/tokens.css, so tailwind-merge doesn't mistake them for colors. */
const TEXT_SIZES = [
  "h1", "h2", "h3", "h4", "h5",
  "body-1", "body-2", "body-3",
  "display", "display-md", "display-sm",
  "lede", "lede-md", "lede-sm",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TEXT_SIZES }],
      rounded: [{ rounded: ["sm", "pill"] }],
    },
  },
});

/** Merge Tailwind class lists; later classes win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
