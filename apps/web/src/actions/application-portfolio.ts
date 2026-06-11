"use server";

import { UserRole, prisma } from "@bench/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

const itemSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  projectUrl: z.url(),
});

async function applicantProfile() {
  const user = await requireRole(UserRole.APPLICANT);
  return prisma.talentProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  });
}

export async function listApplicationPortfolio() {
  await requireRole(UserRole.APPLICANT);
  const profile = await applicantProfile();
  return prisma.portfolioItem.findMany({
    where: { talentProfileId: profile.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function addApplicationPortfolioItem(formData: FormData) {
  const profile = await applicantProfile();
  const parsed = itemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    projectUrl: formData.get("projectUrl"),
  });
  if (!parsed.success) throw new Error("Add a title and valid project URL");

  const count = await prisma.portfolioItem.count({ where: { talentProfileId: profile.id } });
  await prisma.portfolioItem.create({
    data: {
      talentProfileId: profile.id,
      title: parsed.data.title,
      description: parsed.data.description,
      projectUrl: parsed.data.projectUrl,
      sortOrder: count,
    },
  });

  revalidatePath(routes.application);
}

export async function deleteApplicationPortfolioItem(itemId: string) {
  const profile = await applicantProfile();
  await prisma.portfolioItem.deleteMany({
    where: { id: itemId, talentProfileId: profile.id },
  });
  revalidatePath(routes.application);
}
