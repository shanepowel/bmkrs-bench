import { prisma, type NotificationType } from "@bench/database";

export async function pushNotification({
  userId,
  type,
  title,
  body,
  href,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
}) {
  await prisma.notification.create({
    data: { userId, type, title, body, href },
  });
}
