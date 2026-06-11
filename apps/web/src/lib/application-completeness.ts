import type { PortfolioItem, Skill, TalentProfile, User } from "@bench/database";

type ApplicationProfile = TalentProfile & {
  skills: { skill: Skill }[];
  portfolioItems: PortfolioItem[];
};

export type ApplicationCheck = {
  id: string;
  label: string;
  done: boolean;
};

export function getApplicationChecks(
  user: Pick<User, "firstName" | "lastName">,
  profile: ApplicationProfile | null
): ApplicationCheck[] {
  if (!profile) {
    return [
      { id: "profile", label: "basic profile", done: false },
      { id: "bio", label: "short bio", done: false },
      { id: "disciplines", label: "at least one discipline", done: false },
      { id: "rate", label: "day rate band", done: false },
      { id: "portfolio", label: "at least one portfolio link", done: false },
      { id: "references", label: "two references", done: false },
    ];
  }

  const hasName = user.firstName.length > 0 && user.lastName.length > 0 && user.firstName !== "User";
  const hasRefs = Boolean(profile.referenceOne?.trim() && profile.referenceTwo?.trim());

  return [
    { id: "profile", label: "basic profile", done: hasName },
    { id: "bio", label: "short bio", done: Boolean(profile.bio?.trim() && profile.bio.length >= 40) },
    { id: "disciplines", label: "at least one discipline", done: profile.skills.length > 0 },
    { id: "rate", label: "day rate band", done: Boolean(profile.dayRateBand?.trim()) },
    {
      id: "portfolio",
      label: "at least one portfolio link",
      done: profile.portfolioItems.some((item) => Boolean(item.projectUrl?.trim())),
    },
    { id: "references", label: "two references", done: hasRefs },
  ];
}

export function isApplicationComplete(checks: ApplicationCheck[]) {
  return checks.every((c) => c.done);
}
