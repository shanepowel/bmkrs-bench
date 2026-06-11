import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPipelineApplicant, updateStudioNotes } from "@/actions/pipeline";
import { BenchAppShell } from "@/components/bench-app-shell";
import { PipelinePromotePanel } from "@/components/pipeline-promote-panel";
import { ApplicationChecklist } from "@/components/application-checklist";
import { BenchField } from "@/components/bench-field";
import { C, mono, Status } from "@/lib/bench-ui";
import { requireStudio } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";
import { getApplicationChecks } from "@/lib/application-completeness";
import { navRailFooter, studioNavItems } from "@/lib/nav-rail";
import { PARTNER_STATUS_TRANSITIONS, promoteLabel } from "@/lib/pipeline";
import { partnerStatusKind } from "@/lib/partner-status-ui";
import { routes } from "@/lib/routes";
import { PartnerStatus } from "@bench/database";

function sectionLabel(children: ReactNode) {
  return (
    <p style={{ ...mono, color: C.paperFaint }} className="text-[11px] uppercase tracking-[0.08em]">
      {children}
    </p>
  );
}

export default async function StudioPipelineApplicantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const studio = await requireStudio();
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
    <BenchAppShell
      active={routes.studioPipeline}
      footer={navRailFooter(studio.firstName, "studio")}
      items={studioNavItems}
      title={`${applicant.user.firstName} ${applicant.user.lastName}.`}
      lead={applicant.headline ?? applicant.user.email}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <Status kind={partnerStatusKind(applicant.partnerStatus)}>
              {partnerStatusLabel[applicant.partnerStatus]}
            </Status>
            <span style={{ ...mono, color: C.paperFaint }} className="text-[12px]">
              @{applicant.user.username}
            </span>
            {applicant.applicationReadyAt && (
              <span style={{ ...mono, color: C.paperFaint }} className="text-[12px]">
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
              {sectionLabel("bio")}
              <p className="mt-3 max-w-[65ch] text-[15px]" style={{ color: C.paperBody }}>
                {applicant.bio}
              </p>
            </div>
          )}

          {applicant.skills.length > 0 && (
            <div>
              {sectionLabel("disciplines")}
              <p className="mt-3 text-[12px]" style={{ ...mono, color: C.paperBody }}>
                {applicant.skills.map((s) => s.skill.name).join(" · ")}
              </p>
            </div>
          )}

          {applicant.dayRateBand && (
            <div>
              {sectionLabel("day rate band")}
              <p className="mt-3 text-[12px]" style={{ ...mono, color: C.paperBody }}>
                {applicant.dayRateBand}
              </p>
            </div>
          )}

          {(applicant.referenceOne || applicant.referenceTwo) && (
            <div>
              {sectionLabel("references")}
              <ul className="mt-3 space-y-2 text-[12px]" style={{ ...mono, color: C.paperBody }}>
                {applicant.referenceOne && <li>{applicant.referenceOne}</li>}
                {applicant.referenceTwo && <li>{applicant.referenceTwo}</li>}
              </ul>
            </div>
          )}

          {applicant.portfolioItems.length > 0 && (
            <div>
              {sectionLabel("portfolio")}
              <ul className="mt-3">
                {applicant.portfolioItems.map((item) => (
                  <li key={item.id} className="py-3" style={{ borderTop: `1px solid ${C.paperRule}` }}>
                    <p className="font-medium">{item.title}</p>
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-[12px] hover:underline"
                        style={{ ...mono, color: C.orange }}
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
              {sectionLabel("audit trail")}
              <ul className="mt-3 space-y-3">
                {applicant.statusEvents.map((event) => (
                  <li key={event.id} className="border-l-2 pl-4" style={{ borderColor: C.paperRule }}>
                    <p className="text-[12px]" style={{ ...mono, color: C.paperBody }}>
                      {event.fromStatus ? `${partnerStatusLabel[event.fromStatus]} → ` : ""}
                      {partnerStatusLabel[event.toStatus]}
                      {event.byUser ? ` · ${event.byUser.firstName} ${event.byUser.lastName}` : ""}
                    </p>
                    {event.reason && (
                      <p className="mt-1 text-[14px]" style={{ color: C.paperFaint }}>
                        {event.reason}
                      </p>
                    )}
                    <p className="mt-1 text-[11px]" style={{ ...mono, color: C.paperFaint }}>
                      {event.createdAt.toLocaleDateString("en-GB")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link href={routes.studioPipeline} className="inline-block text-[12px] hover:underline" style={{ ...mono, color: C.orange }}>
            ← back to queue
          </Link>
        </div>

        <div className="space-y-6">
          <PipelinePromotePanel talentProfileId={applicant.id} transitions={transitions} />

          <form action={updateStudioNotes} className="space-y-3 p-5" style={{ border: `1px solid ${C.paperRule}` }}>
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
              className="rounded-full border px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
              style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperText, background: "transparent" }}
            >
              save notes
            </button>
          </form>
        </div>
      </div>
    </BenchAppShell>
  );
}
