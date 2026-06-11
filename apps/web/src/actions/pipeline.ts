"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { PartnerStatus, UserRole, prisma } from "@bench/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStudio } from "@/lib/auth";
import { isClerkConfigured } from "@/lib/env-clerk";
import { canTransition } from "@/lib/pipeline";
import { pushNotification } from "@/lib/in-app-notify";
import { routes } from "@/lib/routes";
import { partnerStatusLabel } from "@/lib/bench";

const promoteSchema = z.object({
  talentProfileId: z.string().min(1),
  toStatus: z.nativeEnum(PartnerStatus),
  reason: z.string().min(3).max(500),
});

const notesSchema = z.object({
  talentProfileId: z.string().min(1),
  studioNotes: z.string().max(5000),
});

export async function listPipelineApplicants(status?: PartnerStatus) {
  await requireStudio();

  return prisma.talentProfile.findMany({
    where: status
      ? { partnerStatus: status }
      : { partnerStatus: { in: [PartnerStatus.APPLIED, PartnerStatus.REVIEWED] } },
    include: {
      user: true,
      skills: { include: { skill: true } },
      portfolioItems: { take: 3, orderBy: { sortOrder: "asc" } },
      statusEvents: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: [{ applicationReadyAt: "desc" }, { user: { createdAt: "desc" } }],
    take: 50,
  });
}

export async function getPipelineApplicant(talentProfileId: string) {
  await requireStudio();

  return prisma.talentProfile.findUnique({
    where: { id: talentProfileId },
    include: {
      user: true,
      skills: { include: { skill: true } },
      portfolioItems: { orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] },
      statusEvents: {
        orderBy: { createdAt: "desc" },
        include: { byUser: { select: { firstName: true, lastName: true } } },
      },
      engagements: { include: { project: true } },
    },
  });
}

export async function promotePartnerStatus(formData: FormData): Promise<void> {
  const studio = await requireStudio();
  const parsed = promoteSchema.safeParse({
    talentProfileId: formData.get("talentProfileId"),
    toStatus: formData.get("toStatus"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) throw new Error("Invalid promotion data");

  const { talentProfileId, toStatus, reason } = parsed.data;

  const profile = await prisma.talentProfile.findUnique({
    where: { id: talentProfileId },
    include: { user: true },
  });
  if (!profile) throw new Error("Applicant not found");

  const fromStatus = profile.partnerStatus;
  if (!canTransition(fromStatus, toStatus)) {
    throw new Error(`Cannot move from ${fromStatus} to ${toStatus}`);
  }

  const promoteToPartner =
    toStatus === PartnerStatus.TRUSTED || toStatus === PartnerStatus.CORE;

  await prisma.$transaction(async (tx) => {
    await tx.partnerStatusEvent.create({
      data: {
        talentProfileId,
        fromStatus,
        toStatus,
        byUserId: studio.id,
        reason: reason.trim(),
      },
    });

    await tx.talentProfile.update({
      where: { id: talentProfileId },
      data: { partnerStatus: toStatus },
    });

    if (promoteToPartner && profile.user.role === UserRole.APPLICANT) {
      await tx.user.update({
        where: { id: profile.userId },
        data: { role: UserRole.TALENT },
      });
    }
  });

  if (promoteToPartner && profile.user.role === UserRole.APPLICANT && isClerkConfigured()) {
    const client = await clerkClient();
    await client.users.updateUserMetadata(profile.user.clerkId, {
      publicMetadata: { role: UserRole.TALENT },
    });
  }

  const notifyHref =
    promoteToPartner && profile.user.role === UserRole.APPLICANT
      ? routes.partner
      : profile.user.role === UserRole.APPLICANT
        ? routes.application
        : routes.partner;

  await pushNotification({
    userId: profile.userId,
    type: "SYSTEM",
    title: `bench status: ${partnerStatusLabel[toStatus]}`,
    body: reason.trim(),
    href: notifyHref,
  });

  revalidatePath(routes.studioPipeline);
  revalidatePath(routes.studioPipelineApplicant(talentProfileId));
  revalidatePath(routes.studioBench);
  revalidatePath(routes.application);
  revalidatePath(routes.partner);
}

export async function updateStudioNotes(formData: FormData): Promise<void> {
  await requireStudio();
  const parsed = notesSchema.safeParse({
    talentProfileId: formData.get("talentProfileId"),
    studioNotes: formData.get("studioNotes") ?? "",
  });
  if (!parsed.success) throw new Error("Invalid notes");

  await prisma.talentProfile.update({
    where: { id: parsed.data.talentProfileId },
    data: { studioNotes: parsed.data.studioNotes.trim() || null },
  });

  revalidatePath(routes.studioPipelineApplicant(parsed.data.talentProfileId));
}
