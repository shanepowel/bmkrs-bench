"use server";

import { ContractStatus, PartnerStatus, prisma } from "@bench/database";

export type TrackRecordEntry = {
  id: string;
  title: string;
  role: string;
  completedAt: Date | null;
  kind: "engagement" | "contract";
};

export async function getPartnerTrackRecord(userId: string) {
  const profile = await prisma.talentProfile.findUnique({
    where: { userId },
    include: {
      engagements: {
        include: { project: true },
        orderBy: { completedAt: "desc" },
      },
    },
  });
  if (!profile) return { trustedSince: null as string | null, entries: [] as TrackRecordEntry[] };

  const trustedEvent = await prisma.partnerStatusEvent.findFirst({
    where: { talentProfileId: profile.id, toStatus: PartnerStatus.TRUSTED },
    orderBy: { createdAt: "asc" },
  });

  const contracts = await prisma.contract.findMany({
    where: { talentId: userId, status: ContractStatus.COMPLETED },
    include: { job: { select: { title: true } } },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  const engagementEntries: TrackRecordEntry[] = profile.engagements.map((e) => ({
    id: `eng-${e.projectId}`,
    title: e.project.name.toLowerCase(),
    role: e.role.toLowerCase(),
    completedAt: e.completedAt,
    kind: "engagement",
  }));

  const contractEntries: TrackRecordEntry[] = contracts.map((c) => ({
    id: `con-${c.id}`,
    title: c.title.toLowerCase(),
    role: "delivered",
    completedAt: c.updatedAt,
    kind: "contract",
  }));

  const entries = [...engagementEntries, ...contractEntries].sort((a, b) => {
    const at = a.completedAt?.getTime() ?? 0;
    const bt = b.completedAt?.getTime() ?? 0;
    return bt - at;
  });

  return {
    trustedSince: trustedEvent
      ? trustedEvent.createdAt.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
      : null,
    entries,
  };
}
