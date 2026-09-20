import { Text } from "@/components/ui/Text";

/** Figma "Pull Quote": 3px accent left rule, 28px left padding, Body 1 quote, Body 3 attribution. */
export function PullQuote({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <figure className="flex flex-col gap-10 border-l-[3px] border-accent py-8 pl-28">
      <blockquote>
        <Text size={1}>“{quote}”</Text>
      </blockquote>
      <Text as="figcaption" size={3} tone="faint">
        — {attribution}
      </Text>
    </figure>
  );
}
