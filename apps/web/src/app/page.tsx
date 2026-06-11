import Link from "next/link";
import { redirect } from "next/navigation";
import { Body, H1, PageBridge, Section } from "@/components/surfaces";
import { Logo } from "@/components/logo";
import { getCurrentUser } from "@/lib/auth";
import { homeForRole } from "@/lib/bench";
import { routes } from "@/lib/routes";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect(homeForRole(user.role));

  return (
    <Section theme="ink" className="min-h-[calc(100vh-4rem)]">
      <PageBridge className="flex min-h-[calc(100vh-4rem)] flex-col justify-between">
        <header className="col-span-12 pt-4">
          <Logo variant="wordmark-dark" href={undefined} priority className="!w-[min(180px,40vw)]" />
        </header>

        <main className="col-span-12 sm:col-span-9">
          <H1 className="mb-tight">the bmkrs bench.</H1>
          <Body large className="mb-block">
            trusted partners, real projects, no theatre.
          </Body>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={routes.signIn}
              className="inline-flex w-full items-center justify-center bg-[#FF4D00] px-6 py-3.5 text-body font-medium text-[#181613] transition hover:opacity-90 sm:w-auto"
            >
              sign in
            </Link>
            <Link
              href={routes.apply}
              className="inline-flex w-full items-center justify-center border border-[color:var(--surface-rule)] px-6 py-3.5 text-body text-[var(--surface-heading)] transition hover:border-[var(--surface-accent)] sm:w-auto"
            >
              apply to the network
            </Link>
          </div>
          <Body className="mt-6 text-[var(--surface-meta)]">
            clients and partners join by invite. applicants need an account to track their application.
          </Body>
        </main>

        <footer className="col-span-12 pb-4">
          <p className="font-mono text-meta text-[var(--surface-meta)]">
            a brand company run by builders · network@bmkrs.com
          </p>
        </footer>
      </PageBridge>
    </Section>
  );
}
