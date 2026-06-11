"use server";

import {
  prisma,
  JobStatus,
  UserRole,
  type BillingMode,
  type WorkEnvironment,
  type ExperienceLevel,
  type Prisma,
} from "@bench/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole, requireUser } from "@/lib/auth";
import { safeDbQuery } from "@/lib/db-safe";
import { geocodeLocation, distanceMiles } from "@/lib/geocode";
import { uniqueSlug } from "@/lib/slug";

const jobSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  budgetMin: z.coerce.number().min(0),
  budgetMax: z.coerce.number().min(0),
  billingMode: z.enum(["FIXED", "HOURLY"]),
  environment: z.enum(["REMOTE", "ONSITE", "HYBRID"]),
  experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "EXPERT"]),
  country: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  skillIds: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  urgent: z.coerce.boolean().optional(),
});

export type JobFilters = {
  q?: string;
  category?: string;
  environment?: WorkEnvironment;
  billingMode?: BillingMode;
  experienceLevel?: ExperienceLevel;
  skill?: string;
  minBudget?: number;
  maxBudget?: number;
  featured?: boolean;
  urgent?: boolean;
  nearPostcode?: string;
  radiusMiles?: number;
};

function parseJobForm(formData: FormData) {
  const skillIds = formData.getAll("skillIds").map(String).filter(Boolean);
  return jobSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    budgetMin: formData.get("budgetMin"),
    budgetMax: formData.get("budgetMax"),
    billingMode: formData.get("billingMode"),
    environment: formData.get("environment"),
    experienceLevel: formData.get("experienceLevel"),
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    postcode: formData.get("postcode") || undefined,
    skillIds,
    categoryId: formData.get("categoryId") || undefined,
    featured: formData.get("featured") === "on",
    urgent: formData.get("urgent") === "on",
  });
}

async function syncJobSkills(jobId: string, skillIds?: string[]) {
  await prisma.jobSkill.deleteMany({ where: { jobId } });
  if (skillIds?.length) {
    await prisma.jobSkill.createMany({
      data: skillIds.map((skillId) => ({ jobId, skillId })),
      skipDuplicates: true,
    });
  }
}

export async function createJob(formData: FormData) {
  const user = await requireRole(UserRole.CLIENT);
  const parsed = parseJobForm(formData);
  if (!parsed.success) throw new Error("Invalid job data");
  const d = parsed.data;
  if (d.budgetMax < d.budgetMin) throw new Error("Max budget must be ≥ min budget");

  const publish = formData.get("publish") === "true";
  const slug = uniqueSlug(d.title, user.id);
  const geo = await geocodeLocation({
    postcode: d.postcode,
    city: d.city ?? user.city,
    country: d.country ?? user.country,
  });

  const job = await prisma.job.create({
    data: {
      slug,
      posterId: user.id,
      title: d.title,
      description: d.description,
      status: publish ? JobStatus.OPEN : JobStatus.DRAFT,
      billingMode: d.billingMode as BillingMode,
      environment: d.environment as WorkEnvironment,
      experienceLevel: d.experienceLevel as ExperienceLevel,
      budgetMin: d.budgetMin,
      budgetMax: d.budgetMax,
      country: geo?.country ?? d.country ?? user.country,
      city: geo?.city ?? d.city ?? user.city,
      postcode: d.postcode,
      latitude: geo?.latitude,
      longitude: geo?.longitude,
      categoryId: d.categoryId || null,
      featured: d.featured ?? false,
      urgent: d.urgent ?? false,
      publishedAt: publish ? new Date() : null,
    },
  });

  await syncJobSkills(job.id, d.skillIds);
  revalidatePath("/jobs");
  redirect(`/jobs/${job.slug}`);
}

export async function updateJob(slug: string, formData: FormData): Promise<void> {
  const user = await requireRole(UserRole.CLIENT);
  const job = await prisma.job.findUnique({ where: { slug } });
  if (!job || job.posterId !== user.id) throw new Error("Not authorized");

  const parsed = parseJobForm(formData);
  if (!parsed.success) throw new Error("Invalid job data");
  const d = parsed.data;
  if (d.budgetMax < d.budgetMin) throw new Error("Max budget must be ≥ min budget");

  const publish = formData.get("publish") === "true";
  const geo = await geocodeLocation({
    postcode: d.postcode,
    city: d.city,
    country: d.country,
  });

  await prisma.job.update({
    where: { id: job.id },
    data: {
      title: d.title,
      description: d.description,
      billingMode: d.billingMode as BillingMode,
      environment: d.environment as WorkEnvironment,
      experienceLevel: d.experienceLevel as ExperienceLevel,
      budgetMin: d.budgetMin,
      budgetMax: d.budgetMax,
      country: geo?.country ?? d.country,
      city: geo?.city ?? d.city,
      postcode: d.postcode,
      latitude: geo?.latitude,
      longitude: geo?.longitude,
      categoryId: d.categoryId || null,
      featured: d.featured ?? job.featured,
      urgent: d.urgent ?? job.urgent,
      ...(publish
        ? { status: JobStatus.OPEN, publishedAt: job.publishedAt ?? new Date() }
        : {}),
    },
  });

  await syncJobSkills(job.id, d.skillIds);
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${slug}`);
  redirect(`/jobs/${slug}`);
}

export async function publishJob(slug: string): Promise<void> {
  const user = await requireRole(UserRole.CLIENT);
  const job = await prisma.job.findUnique({ where: { slug } });
  if (!job || job.posterId !== user.id) throw new Error("Not authorized");

  await prisma.job.update({
    where: { id: job.id },
    data: { status: JobStatus.OPEN, publishedAt: new Date() },
  });

  revalidatePath("/jobs");
  redirect(`/jobs/${slug}`);
}

function buildJobWhere(filters: JobFilters = {}): Prisma.JobWhereInput {
  const { q, category, environment, billingMode, experienceLevel, skill, minBudget, maxBudget, featured, urgent } =
    filters;

  return {
    status: JobStatus.OPEN,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(environment ? { environment } : {}),
    ...(billingMode ? { billingMode } : {}),
    ...(experienceLevel ? { experienceLevel } : {}),
    ...(featured ? { featured: true } : {}),
    ...(urgent ? { urgent: true } : {}),
    ...(skill ? { skills: { some: { skill: { slug: skill } } } } : {}),
    ...(minBudget != null ? { budgetMax: { gte: minBudget } } : {}),
    ...(maxBudget != null ? { budgetMin: { lte: maxBudget } } : {}),
  };
}

export type JobListItem = Awaited<ReturnType<typeof listOpenJobs>>[number];

export async function listOpenJobs(filters: JobFilters | string = {}) {
  const resolved: JobFilters = typeof filters === "string" ? { q: filters } : filters;

  const jobs = await safeDbQuery(
    () =>
      prisma.job.findMany({
        where: buildJobWhere(resolved),
        include: {
          poster: {
            select: { firstName: true, lastName: true, username: true, country: true, city: true },
          },
          category: { select: { name: true, slug: true } },
          skills: { include: { skill: true } },
          _count: { select: { proposals: true } },
        },
        orderBy: [{ featured: "desc" }, { urgent: "desc" }, { publishedAt: "desc" }],
        take: 100,
      }),
    []
  );

  if (!resolved.nearPostcode || !resolved.radiusMiles) {
    return jobs.map((job) => ({ ...job, distanceMiles: undefined as number | undefined }));
  }

  const origin = await geocodeLocation({ postcode: resolved.nearPostcode, country: "United Kingdom" });
  if (!origin) {
    return jobs.map((job) => ({ ...job, distanceMiles: undefined as number | undefined }));
  }

  const withDistance = jobs
    .filter((job) => job.latitude != null && job.longitude != null)
    .map((job) => ({
      ...job,
      distanceMiles: distanceMiles(
        { latitude: origin.latitude, longitude: origin.longitude },
        { latitude: job.latitude!, longitude: job.longitude! }
      ),
    }))
    .filter((job) => job.distanceMiles <= resolved.radiusMiles!)
    .sort((a, b) => a.distanceMiles - b.distanceMiles);

  return withDistance;
}

export async function getJobBySlug(slug: string) {
  return prisma.job.findUnique({
    where: { slug },
    include: {
      poster: { select: { id: true, firstName: true, lastName: true, username: true, country: true, city: true } },
      category: { select: { name: true, slug: true } },
      skills: { include: { skill: true } },
      proposals: {
        include: {
          talent: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              talentProfile: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getMyJobs() {
  const user = await requireUser();
  return prisma.job.findMany({
    where: { posterId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      skills: { include: { skill: true } },
      _count: { select: { proposals: true } },
    },
  });
}
