"use server";

import { prisma } from "@bench/database";
import { requireUser } from "@/lib/auth";

export async function listContractActivity(contractId: string) {
  const user = await requireUser();
  const contract = await prisma.contract.findUnique({ where: { id: contractId } });
  if (!contract) return [];
  if (contract.clientId !== user.id && contract.talentId !== user.id) return [];

  return prisma.contractActivity.findMany({
    where: { contractId },
    include: {
      actor: { select: { firstName: true, lastName: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
