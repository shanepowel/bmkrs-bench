"use server";

import { put } from "@vercel/blob";
import { prisma, MilestoneStatus, ActivityType, NotificationType } from "@bench/database";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import {
  isAllowedMimeType,
  isBlobConfigured,
  MAX_UPLOAD_BYTES,
} from "@/lib/blob";
import { logContractActivity } from "@/lib/contract-activity";
import { pushNotification } from "@/lib/in-app-notify";

export async function listDeliverablesForContract(contractId: string) {
  const user = await requireUser();
  const contract = await prisma.contract.findUnique({ where: { id: contractId } });
  if (!contract) return [];
  if (contract.clientId !== user.id && contract.talentId !== user.id) return [];

  return prisma.deliverable.findMany({
    where: { contractId },
    include: {
      uploader: { select: { firstName: true, lastName: true, username: true } },
      milestone: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function uploadDeliverable(formData: FormData): Promise<void> {
  if (!isBlobConfigured()) {
    throw new Error("File storage is not configured (BLOB_READ_WRITE_TOKEN)");
  }

  const user = await requireUser();
  const milestoneId = String(formData.get("milestoneId") ?? "");
  const contractId = String(formData.get("contractId") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || undefined;
  const file = formData.get("file");

  if (!milestoneId || !contractId || !(file instanceof File)) {
    throw new Error("Invalid upload");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File must be 25 MB or smaller");
  }
  if (!isAllowedMimeType(file.type || "application/octet-stream")) {
    throw new Error("File type not allowed");
  }

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { contract: true },
  });

  if (!milestone || milestone.contractId !== contractId) {
    throw new Error("Milestone not found");
  }
  if (milestone.contract.talentId !== user.id) {
    throw new Error("Only the talent on this contract can upload deliverables");
  }
  if (
    milestone.status !== MilestoneStatus.FUNDED &&
    milestone.status !== MilestoneStatus.SUBMITTED
  ) {
    throw new Error("Upload deliverables after the milestone is funded");
  }

  const pathname = `contracts/${contractId}/milestones/${milestoneId}/${Date.now()}-${file.name}`;
  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: true,
  });

  await prisma.deliverable.create({
    data: {
      milestoneId,
      contractId,
      uploadedBy: user.id,
      fileName: file.name,
      fileUrl: blob.url,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
      notes,
    },
  });

  await logContractActivity({
    contractId,
    actorId: user.id,
    type: ActivityType.DELIVERABLE_UPLOADED,
    title: `Uploaded ${file.name}`,
    body: `Deliverable for milestone "${milestone.title}"`,
  });

  await pushNotification({
    userId: milestone.contract.clientId,
    type: NotificationType.DELIVERABLE,
    title: "New deliverable uploaded",
    body: `${user.firstName} uploaded ${file.name} for ${milestone.title}`,
    href: `/contracts/${contractId}`,
  });

  revalidatePath(`/contracts/${contractId}`);
}
