"use server";

import { prisma, UserRole } from "@bench/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { geocodeLocation } from "@/lib/geocode";
import { routes } from "@/lib/routes";

const baseSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  country: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
});

const clientSchema = baseSchema.extend({
  companyName: z.string().optional(),
  companySize: z.string().optional(),
  website: z.union([z.url(), z.literal("")]).optional(),
  bio: z.string().max(2000).optional(),
});

const talentSchema = baseSchema.extend({
  headline: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
  hourlyRate: z.coerce.number().min(0).optional(),
  dayRateBand: z.string().max(50).optional(),
  referenceOne: z.string().max(200).optional(),
  referenceTwo: z.string().max(200).optional(),
  availability: z.enum(["open", "limited", "unavailable"]).optional(),
  skillIds: z.array(z.string()).optional(),
});

export async function getProfileForEdit() {
  const user = await requireUser();
  return prisma.user.findUnique({
    where: { id: user.id },
    include: {
      clientProfile: true,
      talentProfile: { include: { skills: { include: { skill: true } } } },
    },
  });
}

export async function updateProfile(formData: FormData): Promise<void> {
  const user = await requireUser();

  if (user.role === UserRole.CLIENT) {
    const parsed = clientSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      country: formData.get("country") || undefined,
      city: formData.get("city") || undefined,
      postcode: formData.get("postcode") || undefined,
      companyName: formData.get("companyName") || undefined,
      companySize: formData.get("companySize") || undefined,
      website: formData.get("website") || undefined,
      bio: formData.get("bio") || undefined,
    });
    if (!parsed.success) throw new Error("Invalid profile data");

    const d = parsed.data;
    const geo = await geocodeLocation({
      postcode: d.postcode,
      city: d.city,
      country: d.country,
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        country: geo?.country ?? d.country,
        city: geo?.city ?? d.city,
        postcode: d.postcode,
        latitude: geo?.latitude,
        longitude: geo?.longitude,
        clientProfile: {
          upsert: {
            create: {
              companyName: d.companyName,
              companySize: d.companySize,
              website: d.website || undefined,
              bio: d.bio,
            },
            update: {
              companyName: d.companyName,
              companySize: d.companySize,
              website: d.website || undefined,
              bio: d.bio,
            },
          },
        },
      },
    });
  } else if (user.role === UserRole.TALENT || user.role === UserRole.APPLICANT) {
    const skillIds = formData.getAll("skillIds").map(String);
    const parsed = talentSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      country: formData.get("country") || undefined,
      city: formData.get("city") || undefined,
      postcode: formData.get("postcode") || undefined,
      headline: formData.get("headline") || undefined,
      bio: formData.get("bio") || undefined,
      hourlyRate: formData.get("hourlyRate") || undefined,
      dayRateBand: formData.get("dayRateBand") || undefined,
      referenceOne: formData.get("referenceOne") || undefined,
      referenceTwo: formData.get("referenceTwo") || undefined,
      availability: formData.get("availability") || "open",
      skillIds,
    });
    if (!parsed.success) throw new Error("Invalid profile data");

    const d = parsed.data;
    const geo = await geocodeLocation({
      postcode: d.postcode,
      city: d.city,
      country: d.country,
    });
    const profile = await prisma.talentProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        headline: d.headline,
        bio: d.bio,
        hourlyRate: d.hourlyRate,
        dayRateBand: d.dayRateBand,
        referenceOne: d.referenceOne,
        referenceTwo: d.referenceTwo,
        availability: d.availability,
      },
      update: {
        headline: d.headline,
        bio: d.bio,
        hourlyRate: d.hourlyRate,
        dayRateBand: d.dayRateBand,
        referenceOne: d.referenceOne,
        referenceTwo: d.referenceTwo,
        availability: d.availability,
      },
    });

    if (d.skillIds) {
      await prisma.talentSkill.deleteMany({ where: { talentProfileId: profile.id } });
      if (d.skillIds.length > 0) {
        await prisma.talentSkill.createMany({
          data: d.skillIds.map((skillId) => ({
            talentProfileId: profile.id,
            skillId,
          })),
          skipDuplicates: true,
        });
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        country: geo?.country ?? d.country,
        city: geo?.city ?? d.city,
        postcode: d.postcode,
        latitude: geo?.latitude,
        longitude: geo?.longitude,
      },
    });
  }

  revalidatePath(routes.profile);
  revalidatePath(routes.application);
  revalidatePath(routes.partnerProfile(user.username));
  revalidatePath(routes.partner);
  revalidatePath(routes.dashboardHome);
  revalidatePath("/talents");
  redirect(routes.profile);
}

export async function updateAvailability(formData: FormData) {
  const user = await requireUser();
  if (user.role !== UserRole.TALENT) throw new Error("partners only");

  const availability = String(formData.get("availability") ?? "");
  if (!["open", "limited", "unavailable"].includes(availability)) {
    throw new Error("invalid availability");
  }

  await prisma.talentProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, availability },
    update: { availability },
  });

  revalidatePath(routes.partner);
  revalidatePath(routes.dashboardHome);
  revalidatePath(routes.profile);
  revalidatePath(routes.studioBench);
}

export async function getTalentByUsername(username: string) {
  return prisma.user.findFirst({
    where: {
      username: { equals: username, mode: "insensitive" },
      role: UserRole.TALENT,
    },
    include: {
      talentProfile: {
        include: {
          skills: { include: { skill: true } },
          portfolioItems: { orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] },
          engagements: { include: { project: true }, orderBy: { completedAt: "desc" } },
        },
      },
    },
  });
}
