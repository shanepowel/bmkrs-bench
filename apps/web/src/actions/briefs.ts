"use server";

import {
  BriefVisibility,
  JobStatus,
  prisma,
  ProposalStatus,
  UserRole,
} from "@bench/database";
import { revalidatePath } from "next/cache";
import { requireRole, requireStudio } from "@/lib/auth";
import { routes } from "@/lib/routes";

export type PartnerBriefRow = {
  id: string;
  slug: string;
  codename: string;
  role: string;
  dates: string;
  respondBy: string;
  proposalId: string;
  proposalStatus: ProposalStatus;
  responded: boolean;
};

export async function listPartnerBriefs(): Promise<PartnerBriefRow[]> {
  const user = await requireRole(UserRole.TALENT);

  const jobs = await prisma.job.findMany({
    where: {
      visibility: BriefVisibility.INVITED,
      status: JobStatus.OPEN,
      proposals: { some: { talentId: user.id } },
    },
    include: {
      proposals: { where: { talentId: user.id } },
      skills: { include: { skill: true } },
    },
    orderBy: { publishedAt: "desc" },
  });

  return jobs.map((job) => {
    const proposal = job.proposals[0];
    const role = job.skills.map((s) => s.skill.name.toLowerCase()).join(" · ") || "brief";
    const delivery = proposal?.deliveryDays ?? 14;
    const published = job.publishedAt ?? job.createdAt;
    const respondBy = new Date(published.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      id: job.id,
      slug: job.slug,
      codename: job.title.toLowerCase(),
      role,
      dates: `${delivery} day window`,
      respondBy: respondBy.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
      proposalId: proposal!.id,
      proposalStatus: proposal!.status,
      responded:
        proposal!.status === ProposalStatus.DECLINED ||
        (proposal!.status === ProposalStatus.SUBMITTED &&
          !proposal!.coverLetter.toLowerCase().includes("awaiting your response")),
    };
  });
}

export async function listStudioBriefs() {
  await requireStudio();

  return prisma.job.findMany({
    where: { visibility: BriefVisibility.INVITED },
    include: {
      proposals: {
        include: {
          talent: { select: { firstName: true, lastName: true, username: true } },
        },
      },
      _count: { select: { proposals: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });
}

export async function respondToBrief(formData: FormData) {
  const user = await requireRole(UserRole.TALENT);
  const jobId = String(formData.get("jobId") ?? "");
  const response = String(formData.get("response") ?? "");
  const whenNote = String(formData.get("whenNote") ?? "").trim();

  if (!jobId || !["in", "no", "when"].includes(response)) {
    return { error: "invalid response" };
  }

  const proposal = await prisma.proposal.findUnique({
    where: { jobId_talentId: { jobId, talentId: user.id } },
    include: { job: true },
  });

  if (!proposal || proposal.job.visibility !== BriefVisibility.INVITED) {
    return { error: "brief not found" };
  }

  let coverLetter: string;
  let status: ProposalStatus;

  if (response === "in") {
    coverLetter = "i'm in";
    status = ProposalStatus.SUBMITTED;
  } else if (response === "no") {
    coverLetter = "not this time";
    status = ProposalStatus.DECLINED;
  } else {
    if (!whenNote) return { error: "say when you are free" };
    coverLetter = `when: ${whenNote}`;
    status = ProposalStatus.SUBMITTED;
  }

  await prisma.proposal.update({
    where: { id: proposal.id },
    data: { coverLetter, status },
  });

  revalidatePath(routes.partner);
  revalidatePath(routes.dashboardHome);
  revalidatePath(routes.studioBriefs);
  return { success: true };
}
