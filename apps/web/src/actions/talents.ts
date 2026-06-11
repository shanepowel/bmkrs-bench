"use server";

import { prisma, UserRole } from "@bench/database";
import { safeDbQuery } from "@/lib/db-safe";
import { geocodeLocation, distanceMiles } from "@/lib/geocode";

export type TalentFilters = {
  q?: string;
  skill?: string;
  availability?: string;
  minRate?: number;
  maxRate?: number;
  nearPostcode?: string;
  radiusMiles?: number;
};

export async function listTalents(filters: TalentFilters = {}) {
  const { q, skill, availability, minRate, maxRate } = filters;

  const talents = await safeDbQuery(
    () =>
      prisma.user.findMany({
        where: {
          role: UserRole.TALENT,
          talentProfile: {
            is: {
              verified: true,
              ...(availability ? { availability } : {}),
              ...(minRate != null || maxRate != null
                ? {
                    hourlyRate: {
                      ...(minRate != null ? { gte: minRate } : {}),
                      ...(maxRate != null ? { lte: maxRate } : {}),
                    },
                  }
                : {}),
              ...(skill
                ? {
                    skills: {
                      some: { skill: { slug: skill } },
                    },
                  }
                : {}),
            },
          },
          ...(q
            ? {
                OR: [
                  { firstName: { contains: q, mode: "insensitive" } },
                  { lastName: { contains: q, mode: "insensitive" } },
                  { username: { contains: q, mode: "insensitive" } },
                  { talentProfile: { headline: { contains: q, mode: "insensitive" } } },
                ],
              }
            : {}),
        },
        include: {
          talentProfile: {
            include: {
              skills: { include: { skill: true } },
              portfolioItems: { take: 1, orderBy: { sortOrder: "asc" } },
            },
          },
          reviewsReceived: { select: { rating: true } },
        },
        take: 100,
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  if (!filters.nearPostcode || !filters.radiusMiles) {
    return talents.map((t) => ({ ...t, distanceMiles: undefined as number | undefined }));
  }

  const origin = await geocodeLocation({ postcode: filters.nearPostcode, country: "United Kingdom" });
  if (!origin) {
    return talents.map((t) => ({ ...t, distanceMiles: undefined as number | undefined }));
  }

  return talents
    .filter((t) => t.latitude != null && t.longitude != null)
    .map((t) => ({
      ...t,
      distanceMiles: distanceMiles(
        { latitude: origin.latitude, longitude: origin.longitude },
        { latitude: t.latitude!, longitude: t.longitude! }
      ),
    }))
    .filter((t) => t.distanceMiles <= filters.radiusMiles!)
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

export async function getTalentsBySkillSlug(skillSlug: string) {
  return listTalents({ skill: skillSlug });
}
