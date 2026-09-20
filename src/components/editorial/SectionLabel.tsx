import { Text } from "@/components/ui/Text";

/** Figma "Section Label": "— September" style, Body 3 faint, above a list or footer column. */
export function SectionLabel({ label, id }: { label: string; id?: string }) {
  return (
    <Text as="p" size={3} tone="faint" id={id}>
      {label.startsWith("—") ? label : `— ${label}`}
    </Text>
  );
}
