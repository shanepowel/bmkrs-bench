"use server";

import { prisma, ProposalStatus, UserRole, JobStatus, NotificationType } from "@bench/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole, requireUser } from "@/lib/auth";
import { pushNotification } from "@/lib/in-app-notify";
import { notifyProposalReceived } from "@/lib/notifications";

const proposalSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().min(20).max(5000),
  bidAmount: z.coerce.number().min(1),
  deliveryDays: z.coerce.number().min(1).max(365),
});

export async function submitProposal(formData: FormData) {
  const user = await requireRole(UserRole.TALENT);
  const parsed = proposalSchema.safeParse({
    jobId: formData.get("jobId"),
    coverLetter: formData.get("coverLetter"),
    bidAmount: formData.get("bidAmount"),
    deliveryDays: formData.get("deliveryDays"),
  });

  if (!parsed.success) return { error: "Invalid proposal" };
  const { jobId, coverLetter, bidAmount, deliveryDays } = parsed.data;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { poster: { select: { id: true, email: true } } },
  });
  if (!job || job.status !== JobStatus.OPEN) return { error: "Job is not open" };
  if (job.posterId === user.id) return { error: "Cannot propose on your own job" };

  const existing = await prisma.proposal.findUnique({
    where: { jobId_talentId: { jobId, talentId: user.id } },
  });
  if (existing) return { error: "You already submitted a proposal" };

  await prisma.proposal.create({
    data: { jobId, talentId: user.id, coverLetter, bidAmount, deliveryDays },
  });

  await notifyProposalReceived({
    clientEmail: job.poster.email,
    jobTitle: job.title,
    talentName: `${user.firstName} ${user.lastName}`,
    jobSlug: job.slug,
  });

  await pushNotification({
    userId: job.poster.id,
    type: NotificationType.PROPOSAL,
    title: "New proposal",
    body: `${user.firstName} ${user.lastName} applied to "${job.title}"`,
    href: `/jobs/${job.slug}`,
  });

  revalidatePath(`/jobs/${job.slug}`);
  return { success: true };
}

export async function updateProposalStatus(
  proposalId: string,
  status: ProposalStatus
): Promise<void> {
  const user = await requireRole(UserRole.CLIENT);
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { job: true },
  });

  if (!proposal || proposal.job.posterId !== user.id) {
    throw new Error("Not authorized");
  }

  await prisma.proposal.update({
    where: { id: proposalId },
    data: { status },
  });

  revalidatePath(`/jobs/${proposal.job.slug}`);
}

export async function shortlistProposal(proposalId: string): Promise<void> {
  return updateProposalStatus(proposalId, ProposalStatus.SHORTLISTED);
}

export async function declineProposal(proposalId: string): Promise<void> {
  return updateProposalStatus(proposalId, ProposalStatus.DECLINED);
}

export async function getMyProposals() {
  const user = await requireRole(UserRole.TALENT);
  return prisma.proposal.findMany({
    where: { talentId: user.id },
    include: { job: { select: { id: true, title: true, slug: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReceivedProposals() {
  const user = await requireRole(UserRole.CLIENT);
  return prisma.proposal.findMany({
    where: {
      job: { posterId: user.id },
      status: { in: [ProposalStatus.SUBMITTED, ProposalStatus.SHORTLISTED] },
    },
    include: {
      job: { select: { slug: true, title: true } },
      talent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          talentProfile: { select: { headline: true, hourlyRate: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
