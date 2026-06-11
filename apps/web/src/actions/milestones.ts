"use server";

import {
  prisma,
  ContractStatus,
  MilestoneStatus,
  ActivityType,
  NotificationType,
} from "@bench/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { releaseMilestonePayment } from "@/actions/payments";
import { logContractActivity } from "@/lib/contract-activity";
import { pushNotification } from "@/lib/in-app-notify";
import { formatMoney } from "@/lib/utils";

export async function listMilestones(contractId: string) {
  const user = await requireUser();
  const contract = await prisma.contract.findUnique({ where: { id: contractId } });
  if (!contract) return [];
  if (contract.clientId !== user.id && contract.talentId !== user.id) return [];

  return prisma.milestone.findMany({
    where: { contractId },
    orderBy: { sortOrder: "asc" },
  });
}

const milestoneSchema = z.object({
  contractId: z.string(),
  title: z.string().min(2).max(200),
  description: z.string().optional(),
  amount: z.coerce.number().min(1),
  dueDate: z.string().optional(),
});

export async function createMilestone(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = milestoneSchema.safeParse({
    contractId: formData.get("contractId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate") || undefined,
  });
  if (!parsed.success) throw new Error("Invalid milestone");

  const contract = await prisma.contract.findUnique({
    where: { id: parsed.data.contractId },
  });
  if (!contract || contract.clientId !== user.id) throw new Error("Not authorized");
  if (contract.status !== ContractStatus.ACTIVE) {
    throw new Error("Contract must be active to add milestones");
  }

  const count = await prisma.milestone.count({ where: { contractId: contract.id } });

  const milestone = await prisma.milestone.create({
    data: {
      contractId: contract.id,
      title: parsed.data.title,
      description: parsed.data.description,
      amount: parsed.data.amount,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      sortOrder: count,
    },
  });

  await logContractActivity({
    contractId: contract.id,
    actorId: user.id,
    type: ActivityType.MILESTONE_CREATED,
    title: `Milestone added: ${milestone.title}`,
    body: formatMoney(Number(milestone.amount)),
  });

  await pushNotification({
    userId: contract.talentId,
    type: NotificationType.MILESTONE,
    title: "New milestone",
    body: `${parsed.data.title} — ${formatMoney(parsed.data.amount)}`,
    href: `/contracts/${contract.id}`,
  });

  revalidatePath(`/contracts/${contract.id}`);
}

export async function updateMilestoneStatus(
  milestoneId: string,
  status: MilestoneStatus
): Promise<void> {
  const user = await requireUser();
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { contract: true },
  });
  if (!milestone) throw new Error("Milestone not found");

  const { contract } = milestone;
  const isClient = contract.clientId === user.id;
  const isTalent = contract.talentId === user.id;

  if (status === MilestoneStatus.SUBMITTED && !isTalent) throw new Error("Not authorized");
  if (status === MilestoneStatus.SUBMITTED && milestone.status !== MilestoneStatus.FUNDED) {
    throw new Error("Milestone must be funded before submitting work");
  }
  if (status === MilestoneStatus.APPROVED && !isClient) throw new Error("Not authorized");
  if (status === MilestoneStatus.APPROVED && milestone.status !== MilestoneStatus.SUBMITTED) {
    throw new Error("Milestone must be submitted before approval");
  }

  if (status === MilestoneStatus.APPROVED) {
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: MilestoneStatus.APPROVED },
    });
    await logContractActivity({
      contractId: contract.id,
      actorId: user.id,
      type: ActivityType.MILESTONE_APPROVED,
      title: `Approved: ${milestone.title}`,
    });
    await pushNotification({
      userId: contract.talentId,
      type: NotificationType.MILESTONE,
      title: "Milestone approved",
      body: `"${milestone.title}" was approved — payout processing`,
      href: `/contracts/${contract.id}`,
    });
    await releaseMilestonePayment(milestoneId);
  } else {
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status },
    });
    if (status === MilestoneStatus.SUBMITTED) {
      await logContractActivity({
        contractId: contract.id,
        actorId: user.id,
        type: ActivityType.MILESTONE_SUBMITTED,
        title: `Work submitted: ${milestone.title}`,
      });
      await pushNotification({
        userId: contract.clientId,
        type: NotificationType.MILESTONE,
        title: "Milestone submitted for review",
        body: milestone.title,
        href: `/contracts/${contract.id}`,
      });
    }
  }

  revalidatePath(`/contracts/${contract.id}`);
}
