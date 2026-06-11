import Link from "next/link";
import { PartnerStatus } from "@bench/database";
import { listPipelineApplicants } from "@/actions/pipeline";
import { BenchAppShell } from "@/components/bench-app-shell";
import { C, mono, Status } from "@/lib/bench-ui";
import { requireStudio } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";
import { navRailFooter, studioNavItems } from "@/lib/nav-rail";
import { partnerStatusKind } from "@/lib/partner-status-ui";
import { routes } from "@/lib/routes";

const tabs: { label: string; status?: PartnerStatus }[] = [
  { label: "queue", status: undefined },
  { label: "applied", status: PartnerStatus.APPLIED },
  { label: "reviewed", status: PartnerStatus.REVIEWED },
];

export default async function StudioPipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const studio = await requireStudio();
  const { status: statusParam } = await searchParams;
  const status =
    statusParam === PartnerStatus.APPLIED || statusParam === PartnerStatus.REVIEWED
      ? statusParam
      : undefined;

  const applicants = await listPipelineApplicants(status);

  return (
    <BenchAppShell
      active={routes.studioPipeline}
      footer={navRailFooter(studio.firstName, "studio")}
      items={studioNavItems}
      title="vetting queue."
      lead="portfolio check, reference check, optional paid trial brief. every status change is logged."
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const href =
            tab.status === undefined
              ? routes.studioPipeline
              : `${routes.studioPipeline}?status=${tab.status}`;
          const active = status === tab.status || (tab.status === undefined && !status);
          return (
            <Link
              key={tab.label}
              href={href}
              aria-current={active ? "page" : undefined}
              className="rounded-full border px-3.5 py-1.5 text-[12px] transition-colors"
              style={
                active
                  ? { background: C.ink, color: C.paper, borderColor: C.ink }
                  : { background: "transparent", color: C.paperFaint, borderColor: "rgba(24,22,19,0.25)" }
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div
        className="grid grid-cols-[1.4fr_1fr_0.8fr] py-2 text-[11px]"
        style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
      >
        <span>name</span>
        <span>headline</span>
        <span>status</span>
      </div>

      {applicants.length === 0 ? (
        <p className="py-6 text-[15px]" style={{ color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}>
          no applications in this queue.
        </p>
      ) : (
        applicants.map((p) => (
          <Link
            key={p.id}
            href={routes.studioPipelineApplicant(p.id)}
            className="grid w-full grid-cols-[1.4fr_1fr_0.8fr] items-center py-3 text-left transition-transform hover:translate-x-1 motion-reduce:transform-none"
            style={{ borderTop: `1px solid ${C.paperRule}` }}
          >
            <span className="font-medium">
              {p.user.firstName} {p.user.lastName}{" "}
              <span style={{ ...mono, color: C.paperFaint }} className="text-[12px]">
                @{p.user.username}
              </span>
            </span>
            <span style={{ ...mono, color: C.paperBody }} className="text-[12px]">
              {p.headline ?? (p.applicationReadyAt ? "submitted" : "draft")}
              {p.dayRateBand ? ` · ${p.dayRateBand}` : ""}
            </span>
            <Status kind={partnerStatusKind(p.partnerStatus)}>
              {partnerStatusLabel[p.partnerStatus]}
            </Status>
          </Link>
        ))
      )}
    </BenchAppShell>
  );
}
