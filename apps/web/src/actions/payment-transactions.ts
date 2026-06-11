"use server";

import { prisma } from "@bench/database";
import { requireUser } from "@/lib/auth";

export async function getMyPaymentTransactions() {
  const user = await requireUser();

  return prisma.paymentTransaction.findMany({
    where: {
      OR: [{ payerId: user.id }, { payeeId: user.id }],
    },
    include: {
      contract: { select: { id: true, title: true } },
      milestone: { select: { id: true, title: true } },
      payer: { select: { firstName: true, lastName: true } },
      payee: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getContractPaymentTransactions(contractId: string) {
  const user = await requireUser();
  const contract = await prisma.contract.findUnique({ where: { id: contractId } });
  if (!contract) return [];
  if (contract.clientId !== user.id && contract.talentId !== user.id) return [];

  return prisma.paymentTransaction.findMany({
    where: { contractId },
    include: {
      milestone: { select: { title: true } },
      payer: { select: { firstName: true, lastName: true } },
      payee: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
