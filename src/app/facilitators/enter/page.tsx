import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FooterB } from "@/components/editorial/FooterB";
import { PageHeader } from "@/components/editorial/PageHeader";
import { PasswordGate } from "@/components/editorial/PasswordGate";
import { SplitHero } from "@/components/editorial/SplitHero";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Facilitators · password", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EnterPage({ searchParams }: PageProps<"/facilitators/enter">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  const error = sp.error !== undefined;
  const gate = site.facilitators.gate;

  return (
    <main className="flex flex-col">
      <SplitHero active="/facilitators" />
      <Container className="flex flex-col gap-32 pb-section-sm md:flex-row md:items-start md:gap-48 md:pb-section-md xl:pb-section">
        <PageHeader title={gate.title} lede={gate.lede} className="flex-1 px-0 md:px-0 xl:px-0" />
        <PasswordGate next={next} error={error} />
      </Container>
      <FooterB />
    </main>
  );
}
