import Link from "next/link";
import { PartnerStatus } from "@bench/database";
import { prisma } from "@bench/database";
import { BenchShell } from "@/components/bench-shell";
import { Body } from "@/components/surfaces";
import { requireStudio } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";
import { routes } from "@/lib/routes";

export default async function StudioBenchPage() {
  await requireStudio();

  const bench = await prisma.talentProfile.findMany({
    where: { partnerStatus: { in: [PartnerStatus.TRUSTED, PartnerStatus.CORE] } },
    include: {
      user: true,
      skills: { include: { skill: true } },
    },
    orderBy: { user: { firstName: "asc" } },
  });

  return (
    <BenchShell
      kicker="bench search"
      title="who is on the bench"
      lead="find a motion designer free in july. studio-only; clients never see this list."
    >
      <div className="col-span-12 sm:col-span-9">
        <p className="mb-6 font-mono text-meta text-[var(--surface-meta)]">
          {bench.length} trusted · full search uses existing talents actions in phase 3
        </p>
        <ul className="divide-y divide-[color:var(--surface-rule)]">
          {bench.map((p) => (
            <li key={p.id} className="py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-body-lg text-[var(--surface-heading)]">
                  {p.user.firstName} {p.user.lastName}
                </p>
                <span className="font-mono text-meta text-[var(--surface-meta)]">
                  · {partnerStatusLabel[p.partnerStatus]}
                  {p.dayRateBand ? ` · ${p.dayRateBand}` : ""}
                  {p.availability ? ` · ${p.availability}` : ""}
                </span>
              </div>
              {p.headline && <Body className="mt-2">{p.headline}</Body>}
              {p.skills.length > 0 && (
                <p className="mt-2 font-mono text-meta text-[var(--surface-meta)]">
                  {p.skills.map((s) => s.skill.name).join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
        {bench.length === 0 && (
          <Body className="text-[var(--surface-meta)]">no trusted partners yet. promote from the pipeline.</Body>
        )}
        <Link href={routes.talents} className="mt-8 inline-block text-[var(--surface-accent)] hover:underline">
          open legacy talents search
        </Link>
      </div>
    </BenchShell>
  );
}
