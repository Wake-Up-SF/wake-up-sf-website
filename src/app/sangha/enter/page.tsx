import { Container } from "@/components/ui/Container";
import { FooterB } from "@/components/editorial/FooterB";
import { PageHeader } from "@/components/editorial/PageHeader";
import { PasswordGate } from "@/components/editorial/PasswordGate";
import { SplitHero } from "@/components/editorial/SplitHero";
import { site } from "@/config/site";
import { enterSangha } from "./actions";

export const metadata = { title: "Password" };
export const dynamic = "force-dynamic";

export default async function EnterPage({ searchParams }: PageProps<"/sangha/enter">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  const error = sp.error !== undefined;
  const gate = site.sangha.gate;

  return (
    <main className="flex flex-col">
      <SplitHero active="/sangha" />
      <Container className="flex flex-col gap-32 pb-section-sm md:flex-row md:items-start md:gap-48 md:pb-section-md xl:pb-section">
        <PageHeader title={gate.title} lede={gate.lede} className="flex-1 px-0 md:px-0 xl:px-0" />
        <PasswordGate action={enterSangha} copy={gate} fallback="/sangha" next={next} error={error} />
      </Container>
      <FooterB />
    </main>
  );
}
