import Link from "next/link";
import { UserRole } from "@bench/database";
import { BenchShell } from "@/components/bench-shell";
import { Body, PartnerStatusLine } from "@/components/surfaces";
import { getProfileForEdit } from "@/actions/profile";
import { requireRole } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";
import { routes } from "@/lib/routes";

export default async function PartnerPage() {
  await requireRole(UserRole.TALENT);
  const profile = await getProfileForEdit();
  const status = profile?.talentProfile?.partnerStatus;

  return (
    <BenchShell
      kicker="partner"
      title="your bench profile and invited briefs"
      lead="update availability, respond to briefs, and keep project threads current."
    >
      <div className="col-span-12 grid gap-8 sm:col-span-9 md:grid-cols-2">
        <div>
          {status && (
            <PartnerStatusLine status={partnerStatusLabel[status]} className="text-[var(--surface-meta)]" />
          )}
          <Body className="mt-4">
            availability:{" "}
            <span className="font-mono text-meta">{profile?.talentProfile?.availability ?? "open"}</span>
          </Body>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={routes.profile}
              className="inline-flex bg-[#FF4D00] px-5 py-3 text-body font-medium text-[#181613]"
            >
              edit profile
            </Link>
            <Link
              href={routes.inbox}
              className="inline-flex border border-[color:var(--surface-rule)] px-5 py-3 text-body text-[var(--surface-heading)]"
            >
              project threads
            </Link>
          </div>
        </div>
        <div className="border-t border-[color:var(--surface-rule)] pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0">
          <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
            invited briefs
          </p>
          <Body className="mt-4 text-[var(--surface-meta)]">
            phase 3: yes/no/when responses for studio briefs you are invited to. marketplace job routes remain
            wired underneath.
          </Body>
          <Link href={routes.jobs} className="mt-4 inline-block text-[var(--surface-accent)] hover:underline">
            view briefs (legacy jobs route)
          </Link>
        </div>
      </div>
    </BenchShell>
  );
}
