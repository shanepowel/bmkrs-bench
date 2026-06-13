import {
  ContractStatus,
  JobStatus,
  PartnerStatus,
  prisma,
  BriefVisibility,
} from "@bench/database";

export type BenchPublicRow = {
  discipline: string;
  specialism: string;
  status: "trusted" | "core";
  availability: "available" | "booked" | "away";
  note: string;
  projects: number;
  group: "brand" | "motion" | "build" | "voice" | "growth";
};

export type BenchPublicPulse = {
  updated: string;
  line: string;
};

export type BenchPublicTeamMember = {
  name: string;
  discipline: string;
};

export type BenchPublicSlice = {
  rows: BenchPublicRow[];
  totals: { partners: number; disciplines: number };
  pulse: BenchPublicPulse | null;
  coreTeam: BenchPublicTeamMember[];
};

const SEED_SLICE: BenchPublicSlice = {
  rows: [
    {
      discipline: "motion + 3d",
      specialism: "brand films, launch",
      status: "core",
      availability: "available",
      note: "available",
      projects: 9,
      group: "motion",
    },
    {
      discipline: "voice + copy",
      specialism: "naming, messaging",
      status: "trusted",
      availability: "booked",
      note: "booked until jul",
      projects: 11,
      group: "voice",
    },
    {
      discipline: "brand + identity",
      specialism: "identity systems",
      status: "trusted",
      availability: "available",
      note: "available",
      projects: 6,
      group: "brand",
    },
    {
      discipline: "engineering",
      specialism: "next, supabase",
      status: "trusted",
      availability: "available",
      note: "available",
      projects: 2,
      group: "build",
    },
    {
      discipline: "product design",
      specialism: "web, app, growth",
      status: "core",
      availability: "available",
      note: "available",
      projects: 8,
      group: "build",
    },
    {
      discipline: "pr + comms",
      specialism: "launches, profile",
      status: "trusted",
      availability: "available",
      note: "available",
      projects: 4,
      group: "growth",
    },
    {
      discipline: "growth",
      specialism: "paid, lifecycle",
      status: "trusted",
      availability: "booked",
      note: "booked until aug",
      projects: 3,
      group: "growth",
    },
  ],
  totals: { partners: 7, disciplines: 8 },
  pulse: {
    updated: "this week",
    line: "2 briefs out, 1 trial running",
  },
  coreTeam: [],
};

function formatDiscipline(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ");
}

function formatSpecialism(skills: { skill: { name: string } }[]): string {
  const names = skills.slice(0, 2).map((entry) => formatDiscipline(entry.skill.name));
  return names.join(", ") || "generalist";
}

function mapGroup(categorySlug?: string | null): BenchPublicRow["group"] {
  const slug = (categorySlug ?? "").toLowerCase();
  if (slug.includes("brand") || slug.includes("identity")) return "brand";
  if (slug.includes("motion") || slug.includes("3d")) return "motion";
  if (slug.includes("voice") || slug.includes("copy")) return "voice";
  if (slug.includes("growth") || slug.includes("pr") || slug.includes("comms")) return "growth";
  return "build";
}

function mapAvailability(raw: string | null | undefined): {
  availability: BenchPublicRow["availability"];
  note: string;
} {
  switch (raw) {
    case "limited":
      return { availability: "booked", note: "booked" };
    case "unavailable":
      return { availability: "away", note: "away" };
    default:
      return { availability: "available", note: "available" };
  }
}

function mergeStatus(current: "trusted" | "core", next: PartnerStatus): "trusted" | "core" {
  if (next === PartnerStatus.CORE || current === "core") return "core";
  return "trusted";
}

function mergeAvailability(
  current: BenchPublicRow["availability"],
  next: BenchPublicRow["availability"],
): BenchPublicRow["availability"] {
  const rank: Record<BenchPublicRow["availability"], number> = {
    available: 0,
    booked: 1,
    away: 2,
  };
  return rank[next] < rank[current] ? next : current;
}

function buildPulse(parts: string[]): BenchPublicPulse | null {
  if (parts.length === 0) return null;
  return { updated: "this week", line: parts.join(" · ") };
}

export async function getBenchPublicSlice(): Promise<BenchPublicSlice> {
  try {
    const partners = await prisma.talentProfile.findMany({
      where: { partnerStatus: { in: [PartnerStatus.TRUSTED, PartnerStatus.CORE] } },
      include: {
        skills: {
          include: { skill: { include: { category: true } } },
          orderBy: { skill: { sortOrder: "asc" } },
        },
        engagements: true,
      },
    });

    if (partners.length === 0) return SEED_SLICE;

    const byDiscipline = new Map<string, BenchPublicRow>();

    for (const partner of partners) {
      const primary = partner.skills[0]?.skill;
      const discipline = primary
        ? formatDiscipline(primary.category?.name ?? primary.name)
        : "general";
      const specialism = formatSpecialism(partner.skills);
      const group = mapGroup(primary?.category?.slug);
      const status =
        partner.partnerStatus === PartnerStatus.CORE ? "core" : ("trusted" as const);
      const { availability, note } = mapAvailability(partner.availability);
      const projects = partner.engagements.length;

      const existing = byDiscipline.get(discipline);
      if (!existing) {
        byDiscipline.set(discipline, {
          discipline,
          specialism,
          status,
          availability,
          note,
          projects,
          group,
        });
        continue;
      }

      byDiscipline.set(discipline, {
        discipline,
        specialism: existing.specialism,
        status: mergeStatus(existing.status, partner.partnerStatus),
        availability: mergeAvailability(existing.availability, availability),
        note: mergeAvailability(existing.availability, availability) === "available" ? "available" : existing.note,
        projects: existing.projects + projects,
        group: existing.group,
      });
    }

    const rows = [...byDiscipline.values()].sort((a, b) =>
      a.discipline.localeCompare(b.discipline),
    );

    const [openBriefs, activeContracts, applicationsPending] = await Promise.all([
      prisma.job.count({
        where: { status: JobStatus.OPEN, visibility: BriefVisibility.INVITED },
      }),
      prisma.contract.count({ where: { status: ContractStatus.ACTIVE } }),
      prisma.talentProfile.count({
        where: {
          partnerStatus: { in: [PartnerStatus.APPLIED, PartnerStatus.REVIEWED] },
        },
      }),
    ]);

    const pulseParts: string[] = [];
    if (openBriefs > 0) {
      pulseParts.push(`${openBriefs} brief${openBriefs === 1 ? "" : "s"} out`);
    }
    if (activeContracts > 0) {
      pulseParts.push(
        `${activeContracts} project${activeContracts === 1 ? "" : "s"} running`,
      );
    }
    if (applicationsPending > 0) {
      pulseParts.push(
        `${applicationsPending} application${applicationsPending === 1 ? "" : "s"} being read by a human`,
      );
    }

    const disciplineSlugs = new Set(
      partners.flatMap((p) => p.skills.map((ts) => ts.skillId)),
    );

    return {
      rows,
      totals: {
        partners: partners.length,
        disciplines: disciplineSlugs.size || rows.length,
      },
      pulse: buildPulse(pulseParts),
      coreTeam: await getCoreTeamMembers(),
    };
  } catch {
    return SEED_SLICE;
  }
}

async function getCoreTeamMembers(): Promise<BenchPublicTeamMember[]> {
  const core = await prisma.talentProfile.findMany({
    where: { partnerStatus: PartnerStatus.CORE },
    include: {
      user: { select: { firstName: true, lastName: true } },
      skills: {
        include: { skill: { include: { category: true } } },
        orderBy: { skill: { sortOrder: "asc" } },
        take: 1,
      },
    },
    orderBy: { user: { firstName: "asc" } },
  });

  return core.map((partner) => {
    const primary = partner.skills[0]?.skill;
    const discipline = primary
      ? formatDiscipline(primary.category?.name ?? primary.name)
      : "general";
    const name = [partner.user.firstName, partner.user.lastName].filter(Boolean).join(" ").trim();
    return { name: name || "partner", discipline };
  });
}
