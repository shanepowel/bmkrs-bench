"use server";

import { prisma } from "@bench/database";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function getUnreadNotificationCount() {
  const user = await requireUser();
  return prisma.notification.count({
    where: { userId: user.id, read: false },
  });
}

export async function listNotifications(limit = 30) {
  const user = await requireUser();
  return prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { read: true },
  });
  revalidatePath("/notifications");
}

export async function markAllNotificationsRead(): Promise<void> {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/notifications");
}
