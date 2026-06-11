import { PartnerStatus } from "@bench/database";
import { prisma } from "@bench/database";
import { BenchShell } from "@/components/bench-shell";
import { Body, PartnerStatusLine } from "@/components/surfaces";
import { requireStudio } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";

export default async function StudioPipelinePage() {
  await requireStudio();

  const applicants = await prisma.talentProfile.findMany({
    where: { partnerStatus: { in: [PartnerStatus.APPLIED, PartnerStatus.REVIEWED] } },
    include: { user: true },
    orderBy: { user: { createdAt: "desc" } },
    take: 20,
  });

  return (
    <BenchShell
      kicker="pipeline"
      title="vetting queue"
      lead="portfolio check, reference check, optional paid trial brief. every status change is logged."
    >
      <div className="col-span-12 sm:col-span-9">
        {applicants.length === 0 ? (
          <Body className="text-[var(--surface-meta)]">no applications in the queue yet.</Body>
        ) : (
          <ul className="divide-y divide-[color:var(--surface-rule)]">
            {applicants.map((p) => (
              <li key={p.id} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-body-lg text-[var(--surface-heading)]">
                    {p.user.firstName} {p.user.lastName}
                  </p>
                  <p className="font-mono text-meta text-[var(--surface-meta)]">@{p.user.username}</p>
                </div>
                <PartnerStatusLine status={partnerStatusLabel[p.partnerStatus]} />
              </li>
            ))}
          </ul>
        )}
        <Body className="mt-8 text-[var(--surface-meta)]">
          phase 2: promote to trusted/core with reason capture writing to status_events.
        </Body>
      </div>
    </BenchShell>
  );
}
