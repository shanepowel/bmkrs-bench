import { PartnerStatus } from "@bench/database";
import { prisma } from "@bench/database";
import { StudioBenchTable, type BenchRow } from "@/components/studio-bench-table";
import { requireStudio } from "@/lib/auth";
import { navRailFooter } from "@/lib/nav-rail";

function mapAvailability(value: string | null | undefined): BenchRow["availability"] {
  if (value === "unavailable") return "away";
  if (value === "limited") return "booked";
  return "available";
}

export default async function StudioBenchPage() {
  const studio = await requireStudio();

  const bench = await prisma.talentProfile.findMany({
    where: { partnerStatus: { in: [PartnerStatus.TRUSTED, PartnerStatus.CORE] } },
    include: {
      user: true,
      skills: { include: { skill: true } },
      engagements: true,
    },
    orderBy: { user: { firstName: "asc" } },
  });

  const rows: BenchRow[] = bench.map((p) => {
    const availability = mapAvailability(p.availability);
    return {
      id: p.id,
      name: `${p.user.firstName} ${p.user.lastName}`.toLowerCase(),
      status: p.partnerStatus === PartnerStatus.CORE ? "core" : "trusted",
      disciplines: p.skills.map((s) => s.skill.name.toLowerCase()),
      availability,
      availNote: p.availability ?? availability,
      band: p.dayRateBand ?? "—",
      projects: p.engagements.length,
    };
  });

  return (
    <StudioBenchTable
      rows={rows}
      footer={navRailFooter(studio.firstName, "studio")}
    />
  );
}
