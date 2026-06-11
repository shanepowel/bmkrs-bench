"use server";

import { ContractStatus, prisma, UserRole } from "@bench/database";
import { requireRole } from "@/lib/auth";

export type ClientTeamMember = {
  id: string;
  name: string;
  discipline: string;
  note: string;
  avatarUrl: string | null;
  project: string;
};

export async function getClientTeam(): Promise<ClientTeamMember[]> {
  const user = await requireRole(UserRole.CLIENT);

  const contracts = await prisma.contract.findMany({
    where: {
      clientId: user.id,
      status: { in: [ContractStatus.ACTIVE, ContractStatus.PENDING_ACCEPTANCE] },
    },
    include: {
      job: { select: { title: true } },
      talent: {
        include: {
          talentProfile: {
            include: { skills: { include: { skill: true } } },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return contracts.map((contract) => {
    const profile = contract.talent.talentProfile;
    const disciplines =
      profile?.skills.map((s) => s.skill.name.toLowerCase()).join(" · ") ?? "partner";
    return {
      id: contract.talent.id,
      name: `${contract.talent.firstName} ${contract.talent.lastName}`.toLowerCase(),
      discipline: disciplines,
      note: profile?.headline ?? `on ${contract.job.title.toLowerCase()}`,
      avatarUrl: contract.talent.avatarUrl,
      project: contract.job.title.toLowerCase(),
    };
  });
}
