"use server";

import {
  prisma,
  ContractStatus,
  ProposalStatus,
  UserRole,
  JobStatus,
  ActivityType,
  NotificationType,
} from "@bench/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole, requireUser } from "@/lib/auth";
import { logContractActivity } from "@/lib/contract-activity";
import { pushNotification } from "@/lib/in-app-notify";
import { notifyContractAccepted, notifyOfferSent } from "@/lib/notifications";

export async function sendOfferFromProposal(proposalId: string): Promise<void> {
  const user = await requireRole(UserRole.CLIENT);
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: {
      job: true,
      contract: true,
      talent: { select: { email: true, firstName: true, lastName: true } },
    },
  });

  if (!proposal || proposal.job.posterId !== user.id) {
    throw new Error("Not authorized");
  }
  if (proposal.status !== ProposalStatus.SHORTLISTED) {
    throw new Error("Shortlist the proposal before sending an offer");
  }
  if (proposal.contract) {
    redirect(`/contracts/${proposal.contract.id}`);
  }

  const contract = await prisma.$transaction(async (tx) => {
    await tx.proposal.update({
      where: { id: proposalId },
      data: { status: ProposalStatus.ACCEPTED },
    });

    return tx.contract.create({
      data: {
        jobId: proposal.jobId,
        proposalId: proposal.id,
        clientId: user.id,
        talentId: proposal.talentId,
        title: proposal.job.title,
        amount: proposal.bidAmount,
        status: ContractStatus.PENDING_ACCEPTANCE,
      },
    });
  });

  await prisma.job.update({
    where: { id: proposal.jobId },
    data: { status: JobStatus.FILLED },
  });

  await notifyOfferSent({
    talentEmail: proposal.talent.email,
    contractTitle: contract.title,
    contractId: contract.id,
  });

  await logContractActivity({
    contractId: contract.id,
    actorId: user.id,
    type: ActivityType.CONTRACT_OFFERED,
    title: "Contract offer sent",
    body: proposal.job.title,
  });

  await pushNotification({
    userId: proposal.talentId,
    type: NotificationType.OFFER,
    title: "New contract offer",
    body: `You received an offer for "${contract.title}"`,
    href: `/contracts/${contract.id}`,
  });

  revalidatePath(`/jobs/${proposal.job.slug}`);
  redirect(`/contracts/${contract.id}`);
}

export async function acceptContract(contractId: string): Promise<void> {
  const user = await requireRole(UserRole.TALENT);
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      client: { select: { email: true } },
      talent: { select: { firstName: true, lastName: true } },
    },
  });
  if (!contract || contract.talentId !== user.id) {
    throw new Error("Not authorized");
  }
  if (contract.status !== ContractStatus.PENDING_ACCEPTANCE) {
    throw new Error("Contract is not pending acceptance");
  }

  await prisma.contract.update({
    where: { id: contractId },
    data: { status: ContractStatus.ACTIVE, startsAt: new Date() },
  });

  await notifyContractAccepted({
    clientEmail: contract.client.email,
    contractTitle: contract.title,
    talentName: `${contract.talent.firstName} ${contract.talent.lastName}`,
    contractId,
  });

  await logContractActivity({
    contractId,
    actorId: user.id,
    type: ActivityType.CONTRACT_ACCEPTED,
    title: "Contract accepted",
    body: contract.title,
  });

  await pushNotification({
    userId: contract.clientId,
    type: NotificationType.CONTRACT,
    title: "Contract accepted",
    body: `${contract.talent.firstName} accepted "${contract.title}"`,
    href: `/contracts/${contractId}`,
  });

  revalidatePath(`/contracts/${contractId}`);
  redirect(`/contracts/${contractId}`);
}

export async function getContract(contractId: string) {
  const user = await requireUser();
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      job: true,
      proposal: true,
      client: { select: { firstName: true, lastName: true, username: true } },
      talent: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          talentProfile: true,
        },
      },
    },
  });

  if (!contract) return null;
  if (contract.clientId !== user.id && contract.talentId !== user.id) return null;
  return contract;
}

export async function completeContract(contractId: string): Promise<void> {
  const user = await requireUser();
  const contract = await prisma.contract.findUnique({ where: { id: contractId } });
  if (!contract) throw new Error("Contract not found");
  if (contract.clientId !== user.id) throw new Error("Only the client can complete a contract");
  if (contract.status !== ContractStatus.ACTIVE) {
    throw new Error("Only active contracts can be marked complete");
  }

  await prisma.contract.update({
    where: { id: contractId },
    data: { status: ContractStatus.COMPLETED },
  });

  revalidatePath(`/contracts/${contractId}`);
  revalidatePath("/dashboard");
}

export async function getMyContracts(activeOnly = false) {
  const user = await requireUser();
  return prisma.contract.findMany({
    where: {
      OR: [{ clientId: user.id }, { talentId: user.id }],
      ...(activeOnly
        ? { status: { in: [ContractStatus.ACTIVE, ContractStatus.PENDING_ACCEPTANCE] } }
        : {}),
    },
    include: { job: { select: { slug: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
}
