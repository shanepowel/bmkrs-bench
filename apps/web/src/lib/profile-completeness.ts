import type { User, TalentProfile, ClientProfile } from "@bench/database";

export type ProfileCompleteness = {
  percent: number;
  missing: string[];
};

type TalentUser = User & {
  talentProfile: (TalentProfile & { skills?: unknown[] }) | null;
};

export function getTalentProfileCompleteness(user: TalentUser): ProfileCompleteness {
  const checks: { label: string; done: boolean }[] = [
    { label: "Headline", done: Boolean(user.talentProfile?.headline?.trim()) },
    { label: "Bio", done: Boolean(user.talentProfile?.bio?.trim()) },
    { label: "Hourly rate", done: user.talentProfile?.hourlyRate != null },
    { label: "Location", done: Boolean(user.city || user.postcode) },
    { label: "Skills", done: Boolean(user.talentProfile?.skills && user.talentProfile.skills.length > 0) },
    {
      label: "Stripe payouts",
      done: Boolean(user.talentProfile?.stripePayoutsEnabled),
    },
  ];

  const done = checks.filter((c) => c.done).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    missing: checks.filter((c) => !c.done).map((c) => c.label),
  };
}

export function getClientProfileCompleteness(
  user: User & { clientProfile: ClientProfile | null }
): ProfileCompleteness {
  const checks: { label: string; done: boolean }[] = [
    { label: "Company name", done: Boolean(user.clientProfile?.companyName?.trim()) },
    { label: "Bio", done: Boolean(user.clientProfile?.bio?.trim()) },
    { label: "Location", done: Boolean(user.city || user.postcode) },
  ];
  const done = checks.filter((c) => c.done).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    missing: checks.filter((c) => !c.done).map((c) => c.label),
  };
}
