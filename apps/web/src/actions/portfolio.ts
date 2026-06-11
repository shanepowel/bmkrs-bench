"use server";

import { prisma, UserRole } from "@bench/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth";

const itemSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  projectUrl: z.union([z.url(), z.literal("")]).optional(),
  imageUrl: z.union([z.url(), z.literal("")]).optional(),
});

export async function listMyPortfolio() {
  const user = await requireRole(UserRole.TALENT);
  const profile = await prisma.talentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return [];

  return prisma.portfolioItem.findMany({
    where: { talentProfileId: profile.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function addPortfolioItem(formData: FormData) {
  const user = await requireRole(UserRole.TALENT);
  const parsed = itemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    projectUrl: formData.get("projectUrl") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
  });
  if (!parsed.success) throw new Error("Invalid portfolio item");

  const profile = await prisma.talentProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  });

  const count = await prisma.portfolioItem.count({ where: { talentProfileId: profile.id } });

  await prisma.portfolioItem.create({
    data: {
      talentProfileId: profile.id,
      title: parsed.data.title,
      description: parsed.data.description,
      projectUrl: parsed.data.projectUrl || undefined,
      imageUrl: parsed.data.imageUrl || undefined,
      sortOrder: count,
    },
  });

  revalidatePath("/profile");
  revalidatePath(`/freelancers/${user.username}`);
}

export async function deletePortfolioItem(itemId: string) {
  const user = await requireRole(UserRole.TALENT);
  const profile = await prisma.talentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) throw new Error("Profile not found");

  const item = await prisma.portfolioItem.findFirst({
    where: { id: itemId, talentProfileId: profile.id },
  });
  if (!item) throw new Error("Not found");

  await prisma.portfolioItem.delete({ where: { id: itemId } });
  revalidatePath("/profile");
  revalidatePath(`/freelancers/${user.username}`);
}
