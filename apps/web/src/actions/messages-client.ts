"use server";

import { prisma } from "@bench/database";
import { requireUser } from "@/lib/auth";

export async function fetchThreadMessages(threadId: string) {
  const user = await requireUser();
  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    include: {
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
  return thread.messages;
}
