"use server";

import { prisma } from "@bench/database";
import { requireUser } from "@/lib/auth";

export async function listInboxThreads() {
  const user = await requireUser();

  const threads = await prisma.messageThread.findMany({
    where: {
      OR: [{ clientId: user.id }, { talentId: user.id }],
    },
    include: {
      job: { select: { slug: true, title: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          sender: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      threadReads: {
        where: { userId: user.id },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return threads.map((thread) => {
    const lastMessage = thread.messages[0];
    const lastReadAt = thread.threadReads[0]?.lastReadAt;
    const unread =
      lastMessage &&
      lastMessage.senderId !== user.id &&
      (!lastReadAt || lastMessage.createdAt > lastReadAt);

    const otherPartyId = user.id === thread.clientId ? thread.talentId : thread.clientId;

    return {
      id: thread.id,
      jobSlug: thread.job.slug,
      jobTitle: thread.job.title,
      otherPartyId,
      lastMessage: lastMessage
        ? {
            body: lastMessage.body,
            createdAt: lastMessage.createdAt,
            senderName: `${lastMessage.sender.firstName} ${lastMessage.sender.lastName}`,
            isOwn: lastMessage.senderId === user.id,
          }
        : null,
      unread: Boolean(unread),
      updatedAt: thread.updatedAt,
    };
  });
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  try {
    const threads = await listInboxThreadsForUser(userId);
    return threads.filter((t) => t.unread).length;
  } catch {
    return 0;
  }
}

async function listInboxThreadsForUser(userId: string) {
  const threads = await prisma.messageThread.findMany({
    where: { OR: [{ clientId: userId }, { talentId: userId }] },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      threadReads: { where: { userId }, take: 1 },
    },
  });

  return threads.map((thread) => {
    const lastMessage = thread.messages[0];
    const lastReadAt = thread.threadReads[0]?.lastReadAt;
    const unread =
      lastMessage &&
      lastMessage.senderId !== userId &&
      (!lastReadAt || lastMessage.createdAt > lastReadAt);
    return { unread: Boolean(unread) };
  });
}

export async function markThreadRead(threadId: string): Promise<void> {
  const user = await requireUser();
  const thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
  if (!thread) throw new Error("Thread not found");
  if (user.id !== thread.clientId && user.id !== thread.talentId) {
    throw new Error("Not authorized");
  }

  await prisma.threadRead.upsert({
    where: { threadId_userId: { threadId, userId: user.id } },
    create: { threadId, userId: user.id, lastReadAt: new Date() },
    update: { lastReadAt: new Date() },
  });
}

export async function getInboxThread(threadId: string) {
  const user = await requireUser();
  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    include: {
      job: { select: { slug: true, title: true, id: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true, username: true },
          },
        },
      },
    },
  });

  if (!thread) return null;
  if (user.id !== thread.clientId && user.id !== thread.talentId) return null;

  await markThreadRead(threadId);
  return { thread, currentUserId: user.id };
}
