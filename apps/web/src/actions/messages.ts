"use server";

import { prisma, ContractStatus, ActivityType, NotificationType } from "@bench/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { logContractActivity } from "@/lib/contract-activity";
import { pushNotification } from "@/lib/in-app-notify";
import { notifyNewMessage } from "@/lib/notifications";

export async function getOrCreateThread(jobId: string, talentId: string) {
  const user = await requireUser();
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job not found");

  const isClient = user.id === job.posterId;
  const isTalent = user.id === talentId;
  if (!isClient && !isTalent) throw new Error("Not authorized");

  return prisma.messageThread.upsert({
    where: { jobId_talentId: { jobId, talentId } },
    create: { jobId, clientId: job.posterId, talentId },
    update: {},
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true, username: true },
          },
        },
      },
      job: { select: { slug: true, title: true } },
    },
  });
}

const messageSchema = z.object({
  threadId: z.string(),
  body: z.string().min(1).max(5000),
});

export async function sendMessage(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = messageSchema.safeParse({
    threadId: formData.get("threadId"),
    body: formData.get("body"),
  });
  if (!parsed.success) throw new Error("Invalid message");

  const thread = await prisma.messageThread.findUnique({
    where: { id: parsed.data.threadId },
  });
  if (!thread) throw new Error("Thread not found");
  if (user.id !== thread.clientId && user.id !== thread.talentId) {
    throw new Error("Not authorized");
  }

  await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: user.id,
      body: parsed.data.body.trim(),
    },
  });

  const recipientId =
    user.id === thread.clientId ? thread.talentId : thread.clientId;

  const contract = await prisma.contract.findFirst({
    where: {
      jobId: thread.jobId,
      talentId: thread.talentId,
      status: ContractStatus.ACTIVE,
    },
  });

  const job = await prisma.job.findUnique({
    where: { id: thread.jobId },
    select: { slug: true, title: true },
  });

  if (contract) {
    await logContractActivity({
      contractId: contract.id,
      actorId: user.id,
      type: ActivityType.MESSAGE_SENT,
      title: "New message",
      body: parsed.data.body.trim().slice(0, 200),
    });
    await pushNotification({
      userId: recipientId,
      type: NotificationType.MESSAGE,
      title: "New message on contract",
      body: parsed.data.body.trim().slice(0, 120),
      href: `/inbox/${thread.id}`,
    });
  } else {
    await pushNotification({
      userId: recipientId,
      type: NotificationType.MESSAGE,
      title: "New message",
      body: parsed.data.body.trim().slice(0, 120),
      href: `/inbox/${thread.id}`,
    });
    if (job) {
      const recipient = await prisma.user.findUnique({
        where: { id: recipientId },
        select: { email: true },
      });
      if (recipient?.email) {
        await notifyNewMessage({
          recipientEmail: recipient.email,
          jobTitle: job.title,
          preview: parsed.data.body.trim().slice(0, 120),
          threadId: thread.id,
        });
      }
    }
  }

  await prisma.messageThread.update({
    where: { id: thread.id },
    data: { updatedAt: new Date() },
  });

  const jobForRevalidate = await prisma.job.findUnique({
    where: { id: thread.jobId },
    select: { slug: true },
  });
  if (jobForRevalidate) {
    revalidatePath(`/jobs/${jobForRevalidate.slug}/messages/${thread.talentId}`);
  }
  revalidatePath("/inbox");
  revalidatePath(`/inbox/${thread.id}`);
}
