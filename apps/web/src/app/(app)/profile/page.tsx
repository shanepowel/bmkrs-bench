import { redirect } from "next/navigation";
import { UserRole } from "@bench/database";
import { getProfileForEdit, updateProfile } from "@/actions/profile";
import { listSkills } from "@/actions/skills";
import { PageShell } from "@/components/layout/page-shell";
import { SkillPicker } from "@/components/skill-picker";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PortfolioPanel } from "@/components/portfolio-panel";
import { requireUser } from "@/lib/auth";
import { routes } from "@/lib/routes";

export default async function ProfilePage() {
  await requireUser();
  const profile = await getProfileForEdit();
  if (!profile) redirect(routes.onboarding);

  const skills = profile.role === UserRole.TALENT ? await listSkills() : [];
  const selectedSkillIds = profile.talentProfile?.skills.map((s) => s.skillId) ?? [];

  return (
    <PageShell
      title="Your profile"
      description={`@${profile.username}`}
      back={{ href: routes.dashboard, label: "Dashboard" }}
      width="md"
    >
      <form action={updateProfile} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" name="firstName" defaultValue={profile.firstName} required />
          <Field label="Last name" name="lastName" defaultValue={profile.lastName} required />
        </div>
        <Field label="Postcode" name="postcode" defaultValue={profile.postcode ?? ""} placeholder="e.g. M1 1AA" />
        <Field label="City" name="city" defaultValue={profile.city ?? ""} />
        <Field label="Country" name="country" defaultValue={profile.country ?? "United Kingdom"} />

        {profile.role === UserRole.CLIENT && profile.clientProfile && (
          <>
            <Field
              label="Company"
              name="companyName"
              defaultValue={profile.clientProfile.companyName ?? ""}
            />
            <Field
              label="Company size"
              name="companySize"
              defaultValue={profile.clientProfile.companySize ?? ""}
            />
            <Field
              label="Website"
              name="website"
              defaultValue={profile.clientProfile.website ?? ""}
            />
            <Field
              label="Bio"
              name="bio"
              as="textarea"
              defaultValue={profile.clientProfile.bio ?? ""}
            />
          </>
        )}

        {profile.role === UserRole.TALENT && profile.talentProfile && (
          <>
            <Field
              label="Headline"
              name="headline"
              defaultValue={profile.talentProfile.headline ?? ""}
            />
            <Field label="Bio" name="bio" as="textarea" defaultValue={profile.talentProfile.bio ?? ""} />
            <Field
              label="Hourly rate ($)"
              name="hourlyRate"
              type="number"
              defaultValue={profile.talentProfile.hourlyRate?.toString() ?? ""}
            />
            <Field label="Availability" name="availability" as="select" defaultValue={profile.talentProfile.availability ?? "open"}>
              <option value="open">Open</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Unavailable</option>
            </Field>
            <SkillPicker skills={skills} selectedIds={selectedSkillIds} />
          </>
        )}

        <Button type="submit" className="w-full">
          Save profile
        </Button>
      </form>

      {profile.role === UserRole.TALENT && (
        <>
          <PortfolioPanel />
          <p className="mt-6 text-center text-sm text-slate-500">
            <a href={routes.freelancer(profile.username)} className="font-medium text-blue-600 hover:underline">
              View public profile
            </a>
          </p>
        </>
      )}
    </PageShell>
  );
}
