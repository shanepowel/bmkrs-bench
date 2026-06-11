import Link from "next/link";
import { PartnerStatus } from "@bench/database";
import { listPipelineApplicants } from "@/actions/pipeline";
import { BenchShell } from "@/components/bench-shell";
import { Body, PartnerStatusLine } from "@/components/surfaces";
import { requireStudio } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";
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
  await requireStudio();
  const { status: statusParam } = await searchParams;
  const status =
    statusParam === PartnerStatus.APPLIED || statusParam === PartnerStatus.REVIEWED
      ? statusParam
      : undefined;

  const applicants = await listPipelineApplicants(status);

  return (
    <BenchShell
      kicker="pipeline"
      title="vetting queue"
      lead="portfolio check, reference check, optional paid trial brief. every status change is logged."
    >
      <div className="col-span-12 sm:col-span-9">
        <nav className="mb-8 flex flex-wrap gap-4 border-b border-[color:var(--surface-rule)] pb-4">
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
                className={
                  active
                    ? "font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-heading)]"
                    : "font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)] hover:text-[var(--surface-heading)]"
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {applicants.length === 0 ? (
          <Body className="text-[var(--surface-meta)]">no applications in this queue.</Body>
        ) : (
          <ul className="divide-y divide-[color:var(--surface-rule)]">
            {applicants.map((p) => (
              <li key={p.id}>
                <Link
                  href={routes.studioPipelineApplicant(p.id)}
                  className="flex flex-col gap-3 py-5 transition hover:opacity-80 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-body-lg text-[var(--surface-heading)]">
                      {p.user.firstName} {p.user.lastName}
                    </p>
                    <p className="font-mono text-meta text-[var(--surface-meta)]">
                      @{p.user.username}
                      {p.applicationReadyAt ? " · submitted" : " · draft"}
                      {p.dayRateBand ? ` · ${p.dayRateBand}` : ""}
                    </p>
                    {p.headline && (
                      <p className="mt-1 text-body text-[var(--surface-body)]">{p.headline}</p>
                    )}
                  </div>
                  <PartnerStatusLine status={partnerStatusLabel[p.partnerStatus]} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BenchShell>
  );
}
