import type { TalentProfile, User } from "@bench/database";

export type BenchProfileCompleteness = {
  percent: number;
  missing: string[];
};

export function getBenchPartnerCompleteness(
  user: User,
  profile: TalentProfile & { skills?: { skillId: string }[] }
): BenchProfileCompleteness {
  const checks = [
    { label: "headline", done: Boolean(profile.headline?.trim()) },
    { label: "bio", done: Boolean(profile.bio?.trim()) },
    { label: "day rate band", done: Boolean(profile.dayRateBand?.trim()) },
    { label: "location", done: Boolean(user.city || user.postcode) },
    { label: "disciplines", done: Boolean(profile.skills && profile.skills.length > 0) },
  ];
  const done = checks.filter((c) => c.done).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    missing: checks.filter((c) => !c.done).map((c) => c.label),
  };
}
