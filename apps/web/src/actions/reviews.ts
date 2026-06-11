"use server";

import { ContractStatus, NotificationType, prisma } from "@bench/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { pushNotification } from "@/lib/in-app-notify";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export async function getReviewsForTalent(talentId: string) {
  return prisma.review.findMany({
    where: { revieweeId: talentId },
    include: {
      reviewer: { select: { firstName: true, lastName: true, username: true } },
      contract: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getTalentRatingStats(talentId: string) {
  const agg = await prisma.review.aggregate({
    where: { revieweeId: talentId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    average: agg._avg.rating ?? 0,
    count: agg._count.rating,
  };
}

export async function getReviewForContract(contractId: string) {
  return prisma.review.findUnique({
    where: { contractId },
    include: {
      reviewer: { select: { firstName: true, lastName: true, username: true } },
    },
  });
}

export async function submitReview(contractId: string, formData: FormData) {
  const user = await requireUser();
  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });
  if (!parsed.success) throw new Error("Invalid review");

  const contract = await prisma.contract.findUnique({ where: { id: contractId } });
  if (!contract) throw new Error("Contract not found");
  if (contract.clientId !== user.id) throw new Error("Only the client can leave a review");
  if (contract.status !== ContractStatus.COMPLETED) {
    throw new Error("Reviews are available after the contract is marked complete");
  }

  const existing = await prisma.review.findUnique({ where: { contractId } });
  if (existing) throw new Error("You already reviewed this contract");

  await prisma.review.create({
    data: {
      contractId,
      reviewerId: user.id,
      revieweeId: contract.talentId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  const talent = await prisma.user.findUnique({
    where: { id: contract.talentId },
    select: { username: true },
  });

  await pushNotification({
    userId: contract.talentId,
    type: NotificationType.REVIEW,
    title: "New review",
    body: `${user.firstName} left a ${parsed.data.rating}-star review`,
    href: talent ? `/freelancers/${talent.username}` : "/dashboard",
  });

  revalidatePath(`/contracts/${contractId}`);
  if (talent) revalidatePath(`/freelancers/${talent.username}`);
  revalidatePath("/talents");
}
