"use server";

import {
  BriefVisibility,
  BillingMode,
  JobStatus,
  PartnerStatus,
  prisma,
  ProposalStatus,
  UserRole,
  WorkEnvironment,
} from "@bench/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole, requireStudio } from "@/lib/auth";
import { routes } from "@/lib/routes";
import { uniqueSlug } from "@/lib/slug";

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

const briefSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(20).max(8000),
  budgetMin: z.coerce.number().min(0),
  budgetMax: z.coerce.number().min(0),
  deliveryDays: z.coerce.number().min(1).max(365),
  partnerIds: z.array(z.string()).min(1),
});

export async function listTrustedPartnersForInvite() {
  await requireStudio();
  return prisma.talentProfile.findMany({
    where: { partnerStatus: { in: [PartnerStatus.TRUSTED, PartnerStatus.CORE] } },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, username: true } },
      skills: { include: { skill: true } },
    },
    orderBy: { user: { firstName: "asc" } },
  });
}

export async function createStudioBrief(formData: FormData) {
  const studio = await requireStudio();
  const partnerIds = formData.getAll("partnerIds").map(String).filter(Boolean);
  const parsed = briefSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    budgetMin: formData.get("budgetMin"),
    budgetMax: formData.get("budgetMax"),
    deliveryDays: formData.get("deliveryDays"),
    partnerIds,
  });

  if (!parsed.success) throw new Error("invalid brief");
  const d = parsed.data;
  if (d.budgetMax < d.budgetMin) throw new Error("max budget must be ≥ min");

  const slug = uniqueSlug(d.title, studio.id);
  const job = await prisma.job.create({
    data: {
      slug,
      posterId: studio.id,
      title: d.title,
      description: d.description,
      status: JobStatus.OPEN,
      visibility: BriefVisibility.INVITED,
      billingMode: BillingMode.FIXED,
      environment: WorkEnvironment.REMOTE,
      budgetMin: d.budgetMin,
      budgetMax: d.budgetMax,
      publishedAt: new Date(),
      proposals: {
        create: d.partnerIds.map((talentId) => ({
          talentId,
          coverLetter: "awaiting your response",
          bidAmount: d.budgetMax,
          deliveryDays: d.deliveryDays,
          status: ProposalStatus.SUBMITTED,
        })),
      },
    },
  });

  revalidatePath(routes.studioBriefs);
  revalidatePath(routes.partner);
  redirect(routes.job(job.slug));
}
