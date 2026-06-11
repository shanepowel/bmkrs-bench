import { PartnerStatus, UserRole } from "@bench/database";
import { getApplicationForEdit } from "@/actions/application";
import { ApplicationChecklist } from "@/components/application-checklist";
import { ApplicationForm } from "@/components/application-form";
import { BenchShell } from "@/components/bench-shell";
import { Body, PartnerStatusLine } from "@/components/surfaces";
import { requireRole } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";
import { getApplicationChecks } from "@/lib/application-completeness";

export default async function ApplicationPage() {
  await requireRole(UserRole.APPLICANT);
  const profile = await getApplicationForEdit();
  if (!profile) return null;

  const talent = profile.talentProfile;
  const status = talent?.partnerStatus ?? PartnerStatus.APPLIED;
  const checks = getApplicationChecks(profile, talent);

  return (
    <BenchShell
      kicker="your application"
      title={
        status === PartnerStatus.APPLIED
          ? "tell us what you do. a human reads every application."
          : "we are reviewing your bench application"
      }
      lead="portfolio, disciplines, rate band, two references. no unpaid spec work; we pay for trial briefs when we need to see you in action."
    >
      <div className="col-span-12 lg:col-span-4">
        <PartnerStatusLine
          status={partnerStatusLabel[status]}
          since={
            talent?.statusEvents[0]
              ? undefined
              : talent?.applicationReadyAt
                ? talent.applicationReadyAt.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })
                : undefined
          }
        />
        <div className="mt-6">
          <ApplicationChecklist checks={checks} />
        </div>
        {talent?.statusEvents && talent.statusEvents.length > 0 && (
          <div className="mt-8">
            <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
              status history
            </p>
            <ul className="mt-4 space-y-2">
              {talent.statusEvents.map((event) => (
                <li key={event.id} className="font-mono text-meta text-[var(--surface-body)]">
                  {event.fromStatus ? `${partnerStatusLabel[event.fromStatus]} → ` : ""}
                  {partnerStatusLabel[event.toStatus]}
                  {event.reason ? ` · ${event.reason}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
        {status !== PartnerStatus.APPLIED && (
          <Body className="mt-8 text-[var(--surface-meta)]">
            you will see briefs and project threads here once you are on the bench.
          </Body>
        )}
      </div>

      <ApplicationForm
        firstName={profile.firstName}
        lastName={profile.lastName}
        headline={talent?.headline}
        bio={talent?.bio}
        dayRateBand={talent?.dayRateBand}
        referenceOne={talent?.referenceOne}
        referenceTwo={talent?.referenceTwo}
        selectedSkillIds={talent?.skills.map((s) => s.skillId) ?? []}
        submittedAt={talent?.applicationReadyAt}
      />
    </BenchShell>
  );
}
