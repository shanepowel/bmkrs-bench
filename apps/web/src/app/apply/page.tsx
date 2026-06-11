import Link from "next/link";
import { Body, H1, Kicker, PageBridge, Rule, Section } from "@/components/surfaces";
import { routes } from "@/lib/routes";

export default function ApplyPage() {
  return (
    <>
      <Section theme="ink">
        <PageBridge className="py-section">
          <div className="col-span-12 sm:col-span-9">
            <Kicker>join the bench</Kicker>
            <Rule className="mb-tight mt-4" />
            <H1 className="text-h2">good at what you do and tired of platforms that treat you like inventory?</H1>
            <Body large className="mt-tight">
              apply. a human reads every application, usually the same week. we do not run unpaid spec
              work; if we need to see you in action, we pay for a trial brief.
            </Body>
          </div>
        </PageBridge>
      </Section>
      <Section theme="paper">
        <PageBridge className="py-section">
          <div className="col-span-12 max-w-xl sm:col-span-8">
            <Body className="mb-6">
              create an account to submit your profile, portfolio links, disciplines, rate band, and two
              references. until you are trusted, you will only see your application status.
            </Body>
            <Link
              href={routes.signUp("applicant")}
              className="inline-flex bg-[#FF4D00] px-6 py-3.5 text-body font-medium text-[#181613] transition hover:opacity-90"
            >
              start application
            </Link>
            <Body className="mt-6 text-[var(--surface-meta)]">
              already applied?{" "}
              <Link href={routes.signIn} className="text-[var(--surface-accent)] hover:underline">
                sign in
              </Link>
            </Body>
          </div>
        </PageBridge>
      </Section>
    </>
  );
}
