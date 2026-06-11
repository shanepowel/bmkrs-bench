import Link from "next/link";
import { notFound } from "next/navigation";
import { getPipelineApplicant, updateStudioNotes } from "@/actions/pipeline";
import { BenchShell } from "@/components/bench-shell";
import { PipelinePromotePanel } from "@/components/pipeline-promote-panel";
import { ApplicationChecklist } from "@/components/application-checklist";
import { BenchField } from "@/components/bench-field";
import { Body, PartnerStatusLine } from "@/components/surfaces";
import { requireStudio } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";
import { getApplicationChecks } from "@/lib/application-completeness";
import { PARTNER_STATUS_TRANSITIONS, promoteLabel } from "@/lib/pipeline";
import { routes } from "@/lib/routes";
import { PartnerStatus } from "@bench/database";

export default async function StudioPipelineApplicantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStudio();
  const { id } = await params;
  const applicant = await getPipelineApplicant(id);
  if (!applicant) notFound();

  const checks = getApplicationChecks(applicant.user, applicant);
  const transitions = PARTNER_STATUS_TRANSITIONS[applicant.partnerStatus].map((toStatus) => ({
    toStatus,
    label: promoteLabel(toStatus),
    primary: toStatus === PartnerStatus.TRUSTED || toStatus === PartnerStatus.CORE,
  }));

  return (
    <BenchShell
      kicker="pipeline"
      title={`${applicant.user.firstName} ${applicant.user.lastName}`}
      lead={applicant.headline ?? applicant.user.email}
    >
      <div className="col-span-12 space-y-8 lg:col-span-8">
        <div className="flex flex-wrap items-center gap-4">
          <PartnerStatusLine status={partnerStatusLabel[applicant.partnerStatus]} />
          <span className="font-mono text-meta text-[var(--surface-meta)]">
            @{applicant.user.username}
          </span>
          {applicant.applicationReadyAt && (
            <span className="font-mono text-meta text-[var(--surface-meta)]">
              submitted{" "}
              {applicant.applicationReadyAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        <ApplicationChecklist checks={checks} />

        {applicant.bio && (
          <div>
            <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
              bio
            </p>
            <Body className="mt-3">{applicant.bio}</Body>
          </div>
        )}

        {applicant.skills.length > 0 && (
          <div>
            <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
              disciplines
            </p>
            <p className="mt-3 font-mono text-meta text-[var(--surface-body)]">
              {applicant.skills.map((s) => s.skill.name).join(" · ")}
            </p>
          </div>
        )}

        {applicant.dayRateBand && (
          <div>
            <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
              day rate band
            </p>
            <p className="mt-3 font-mono text-meta text-[var(--surface-body)]">
              {applicant.dayRateBand}
            </p>
          </div>
        )}

        {(applicant.referenceOne || applicant.referenceTwo) && (
          <div>
            <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
              references
            </p>
            <ul className="mt-3 space-y-2 font-mono text-meta text-[var(--surface-body)]">
              {applicant.referenceOne && <li>{applicant.referenceOne}</li>}
              {applicant.referenceTwo && <li>{applicant.referenceTwo}</li>}
            </ul>
          </div>
        )}

        {applicant.portfolioItems.length > 0 && (
          <div>
            <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
              portfolio
            </p>
            <ul className="mt-3 divide-y divide-[color:var(--surface-rule)]">
              {applicant.portfolioItems.map((item) => (
                <li key={item.id} className="py-3">
                  <p className="text-body text-[var(--surface-heading)]">{item.title}</p>
                  {item.projectUrl && (
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block font-mono text-meta text-[var(--surface-accent)] hover:underline"
                    >
                      {item.projectUrl}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {applicant.statusEvents.length > 0 && (
          <div>
            <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
              audit trail
            </p>
            <ul className="mt-3 space-y-3">
              {applicant.statusEvents.map((event) => (
                <li key={event.id} className="border-l-2 border-[color:var(--surface-rule)] pl-4">
                  <p className="font-mono text-meta text-[var(--surface-body)]">
                    {event.fromStatus ? `${partnerStatusLabel[event.fromStatus]} → ` : ""}
                    {partnerStatusLabel[event.toStatus]}
                    {event.byUser
                      ? ` · ${event.byUser.firstName} ${event.byUser.lastName}`
                      : ""}
                  </p>
                  {event.reason && (
                    <p className="mt-1 text-body text-[var(--surface-meta)]">{event.reason}</p>
                  )}
                  <p className="mt-1 font-mono text-meta text-[var(--surface-meta)]">
                    {event.createdAt.toLocaleDateString("en-GB")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href={routes.studioPipeline}
          className="inline-block font-mono text-meta text-[var(--surface-accent)] hover:underline"
        >
          ← back to queue
        </Link>
      </div>

      <div className="col-span-12 space-y-6 lg:col-span-4">
        <PipelinePromotePanel talentProfileId={applicant.id} transitions={transitions} />

        <form action={updateStudioNotes} className="space-y-3 border border-[color:var(--surface-rule)] p-5">
          <input type="hidden" name="talentProfileId" value={applicant.id} />
          <BenchField
            label="studio notes (private)"
            name="studioNotes"
            as="textarea"
            defaultValue={applicant.studioNotes ?? ""}
            rows={6}
            hint="never visible to the partner or client"
          />
          <button
            type="submit"
            className="border border-[color:var(--surface-rule)] px-5 py-2.5 text-body text-[var(--surface-heading)] hover:border-[var(--surface-accent)]"
          >
            save notes
          </button>
        </form>
      </div>
    </BenchShell>
  );
}
