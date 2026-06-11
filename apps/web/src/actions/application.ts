"use server";

import { PartnerStatus, UserRole, prisma } from "@bench/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { DAY_RATE_BANDS } from "@/lib/pipeline";
import { getApplicationChecks, isApplicationComplete } from "@/lib/application-completeness";
import { routes } from "@/lib/routes";

const applicationSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  headline: z.string().min(4).max(120),
  bio: z.string().min(40).max(2000),
  dayRateBand: z.enum(DAY_RATE_BANDS),
  referenceOne: z.string().min(3).max(200),
  referenceTwo: z.string().min(3).max(200),
  skillIds: z.array(z.string()).min(1),
});

export async function getApplicationForEdit() {
  const user = await requireRole(UserRole.APPLICANT);
  return prisma.user.findUnique({
    where: { id: user.id },
    include: {
      talentProfile: {
        include: {
          skills: { include: { skill: true } },
          portfolioItems: { orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] },
          statusEvents: { orderBy: { createdAt: "desc" }, take: 10 },
        },
      },
    },
  });
}

export async function submitApplication(formData: FormData): Promise<void> {
  const user = await requireRole(UserRole.APPLICANT);
  const skillIds = formData.getAll("skillIds").map(String);

  const parsed = applicationSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    dayRateBand: formData.get("dayRateBand"),
    referenceOne: formData.get("referenceOne"),
    referenceTwo: formData.get("referenceTwo"),
    skillIds,
  });

  if (!parsed.success) throw new Error("Complete all application fields before submitting");

  const d = parsed.data;

  const profile = await prisma.talentProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      partnerStatus: PartnerStatus.APPLIED,
      headline: d.headline,
      bio: d.bio,
      dayRateBand: d.dayRateBand,
      referenceOne: d.referenceOne,
      referenceTwo: d.referenceTwo,
    },
    update: {
      headline: d.headline,
      bio: d.bio,
      dayRateBand: d.dayRateBand,
      referenceOne: d.referenceOne,
      referenceTwo: d.referenceTwo,
    },
    include: {
      skills: { include: { skill: true } },
      portfolioItems: true,
    },
  });

  await prisma.talentSkill.deleteMany({ where: { talentProfileId: profile.id } });
  await prisma.talentSkill.createMany({
    data: d.skillIds.map((skillId) => ({ talentProfileId: profile.id, skillId })),
    skipDuplicates: true,
  });

  const refreshed = await prisma.talentProfile.findUnique({
    where: { id: profile.id },
    include: {
      skills: { include: { skill: true } },
      portfolioItems: true,
    },
  });

  const checks = getApplicationChecks(
    { ...user, firstName: d.firstName, lastName: d.lastName },
    refreshed
  );
  if (!isApplicationComplete(checks)) {
    throw new Error("Add at least one portfolio link with a URL before submitting");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { firstName: d.firstName, lastName: d.lastName },
  });

  await prisma.talentProfile.update({
    where: { id: profile.id },
    data: { applicationReadyAt: new Date() },
  });

  revalidatePath(routes.application);
  revalidatePath(routes.studioPipeline);
  redirect(routes.application);
}
