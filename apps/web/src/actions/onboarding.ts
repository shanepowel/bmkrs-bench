"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { PartnerStatus, prisma, UserRole } from "@bench/database";
import { redirect } from "next/navigation";
import { z } from "zod";
import { syncUserFromClerk } from "@/lib/auth";
import { homeForRole } from "@/lib/bench";
import { isDevAuthBypass } from "@/lib/env";
import { geocodeLocation } from "@/lib/geocode";
import { routes } from "@/lib/routes";

const schema = z.object({
  role: z.enum(["client", "talent", "applicant"]),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  username: z.string().min(4).max(30).regex(/^[a-z0-9._-]+$/i),
  country: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  headline: z.string().optional(),
  hourlyRate: z.coerce.number().optional(),
  companyName: z.string().optional(),
});

export async function completeOnboarding(formData: FormData): Promise<void> {
  const parsed = schema.safeParse({
    role: formData.get("role"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    username: formData.get("username"),
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    postcode: formData.get("postcode") || undefined,
    headline: formData.get("headline") || undefined,
    hourlyRate: formData.get("hourlyRate") || undefined,
    companyName: formData.get("companyName") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  const data = parsed.data;
  const dbRole =
    data.role === "client"
      ? UserRole.CLIENT
      : data.role === "applicant"
        ? UserRole.APPLICANT
        : UserRole.TALENT;
  const geo = await geocodeLocation({
    postcode: data.postcode,
    city: data.city,
    country: data.country,
  });

  if (isDevAuthBypass()) {
    redirect(homeForRole(dbRole));
  }

  const { userId } = await auth();
  if (!userId) redirect(routes.login);

  const taken = await prisma.user.findFirst({
    where: { username: data.username.toLowerCase(), NOT: { clerkId: userId } },
  });
  if (taken) throw new Error("Username already taken");

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      email: `pending-${userId}@local.dev`,
      username: data.username.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      role: dbRole,
      country: geo?.country ?? data.country,
      city: geo?.city ?? data.city,
      postcode: data.postcode,
      latitude: geo?.latitude,
      longitude: geo?.longitude,
      ...(dbRole === UserRole.CLIENT
        ? { clientProfile: { create: { companyName: data.companyName } } }
        : {
            talentProfile: {
              create: {
                headline: data.headline,
                hourlyRate: data.hourlyRate,
                partnerStatus:
                  dbRole === UserRole.APPLICANT ? PartnerStatus.APPLIED : PartnerStatus.REVIEWED,
              },
            },
          }),
    },
    update: {
      username: data.username.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      role: dbRole,
      country: geo?.country ?? data.country,
      city: geo?.city ?? data.city,
      postcode: data.postcode,
      latitude: geo?.latitude,
      longitude: geo?.longitude,
    },
  });

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role: dbRole },
  });

  if ((dbRole === UserRole.TALENT || dbRole === UserRole.APPLICANT) && data.headline) {
    await prisma.talentProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        headline: data.headline,
        hourlyRate: data.hourlyRate,
        partnerStatus:
          dbRole === UserRole.APPLICANT ? PartnerStatus.APPLIED : PartnerStatus.REVIEWED,
      },
      update: { headline: data.headline, hourlyRate: data.hourlyRate },
    });
  }

  if (dbRole === UserRole.CLIENT && data.companyName) {
    await prisma.clientProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, companyName: data.companyName },
      update: { companyName: data.companyName },
    });
  }

  redirect(homeForRole(dbRole));
}

export async function ensureUser() {
  if (isDevAuthBypass()) {
    return prisma.user.findFirst({ where: { clerkId: "seed_client_1" } });
  }
  let user = await syncUserFromClerk();
  if (!user) return null;
  const needsOnboarding = !user.username || user.firstName === "User";
  return { user, needsOnboarding };
}
