import Link from "next/link";
import { PartnerStatus, UserRole } from "@bench/database";
import { prisma } from "@bench/database";
import { BenchShell } from "@/components/bench-shell";
import { Body, PartnerStatusLine } from "@/components/surfaces";
import { requireRole } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";
import { routes } from "@/lib/routes";

export default async function ApplicationPage() {
  const user = await requireRole(UserRole.APPLICANT);
  const profile = await prisma.talentProfile.findUnique({
    where: { userId: user.id },
    include: {
      statusEvents: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  const status = profile?.partnerStatus ?? PartnerStatus.APPLIED;

  return (
    <BenchShell
      kicker="your application"
      title="we are reviewing your bench application"
      lead="you will see briefs and project threads here once you are trusted. for now, this page is your status."
    >
      <div className="col-span-12 sm:col-span-8">
        <PartnerStatusLine status={partnerStatusLabel[status]} />
        <Body className="mt-6">
          complete your profile so the studio can review portfolio, disciplines, rate band, and references.
        </Body>
        <Link
          href={routes.profile}
          className="mt-8 inline-flex border border-[color:var(--surface-rule)] px-5 py-3 text-body text-[var(--surface-heading)] hover:border-[var(--surface-accent)]"
        >
          edit profile
        </Link>
        {profile?.statusEvents.length ? (
          <div className="mt-10">
            <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
              status history
            </p>
            <ul className="mt-4 space-y-2">
              {profile.statusEvents.map((event) => (
                <li key={event.id} className="font-mono text-meta text-[var(--surface-body)]">
                  {event.fromStatus ? `${partnerStatusLabel[event.fromStatus]} → ` : ""}
                  {partnerStatusLabel[event.toStatus]}
                  {event.reason ? ` · ${event.reason}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </BenchShell>
  );
}
