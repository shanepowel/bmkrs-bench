"use server";

import { prisma, UserRole } from "@bench/database";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email(),
  role: z.enum(["client", "talent"]).optional(),
  postcode: z.string().optional(),
  categoryId: z.string().optional(),
});

export async function joinWaitlist(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const parsed = waitlistSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role") || undefined,
    postcode: formData.get("postcode") || undefined,
    categoryId: formData.get("categoryId") || undefined,
  });

  if (!parsed.success) return { ok: false, error: "Please enter a valid email address." };

  const role =
    parsed.data.role === "client"
      ? UserRole.CLIENT
      : parsed.data.role === "talent"
        ? UserRole.TALENT
        : undefined;

  await prisma.waitlistEntry.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    create: {
      email: parsed.data.email.toLowerCase(),
      role,
      postcode: parsed.data.postcode,
      categoryId: parsed.data.categoryId || null,
    },
    update: {
      role: role ?? undefined,
      postcode: parsed.data.postcode,
      categoryId: parsed.data.categoryId || null,
    },
  });

  return { ok: true };
}
