import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@bench/database";
import { getProfileForEdit, updateProfile } from "@/actions/profile";
import { getPartnerTrackRecord } from "@/actions/track-record";
import { listSkills } from "@/actions/skills";
import { BenchAppShell } from "@/components/bench-app-shell";
import { BenchPortfolioPanel } from "@/components/bench-portfolio-panel";
import { BenchSkillPicker } from "@/components/bench-skill-picker";
import { AvailabilityToggle } from "@/components/availability-toggle";
import { C, Label, mono, PrimaryButton, TextArea, TextField } from "@/lib/bench-ui";
import { requireUser } from "@/lib/auth";
import { getBenchPartnerCompleteness } from "@/lib/bench-profile";
import { navFooterForUser, navItemsForUser } from "@/lib/nav-for-user";
import { routes } from "@/lib/routes";

const RATE_BANDS = ["£250–350/day", "£350–450/day", "£450–550/day", "£550–700/day", "£700+/day"];

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await getProfileForEdit();
  if (!profile) redirect(routes.onboarding);

  const isPartner = profile.role === UserRole.TALENT;
  const isApplicant = profile.role === UserRole.APPLICANT;
  const isPartnerLike = isPartner || isApplicant;
  const skills = isPartnerLike ? await listSkills() : [];
  const selectedSkillIds = profile.talentProfile?.skills.map((s) => s.skillId) ?? [];
  const trackRecord = isPartner ? await getPartnerTrackRecord(user.id) : null;
  const completeness = isPartnerLike && profile.talentProfile
    ? getBenchPartnerCompleteness(profile, profile.talentProfile)
    : null;

  return (
    <BenchAppShell
      active={routes.profile}
      footer={navFooterForUser(user)}
      items={navItemsForUser(user)}
      title="bench profile."
      lead={
        isPartner
          ? "what the studio and clients see when staffing. keep it current."
          : isApplicant
            ? "your application details. submit from the application page when ready."
            : "your account details."
      }
      action={
        isPartner ? (
          <Link
            href={routes.partnerProfile(profile.username)}
            className="inline-block rounded-full border px-6 py-3 text-[14px] font-medium"
            style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperText }}
          >
            view public profile
          </Link>
        ) : undefined
      }
    >
      {completeness && completeness.percent < 100 && (
        <p
          className="mb-6 rounded-md px-4 py-3 text-[13px]"
          style={{ ...mono, color: C.paperBody, border: `1px solid ${C.paperRule}` }}
        >
          {completeness.percent}% complete · still need: {completeness.missing.join(", ").toLowerCase()}
        </p>
      )}

      <form action={updateProfile} className="max-w-2xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>first name</Label>
            <TextField name="firstName" defaultValue={profile.firstName} required />
          </div>
          <div>
            <Label>last name</Label>
            <TextField name="lastName" defaultValue={profile.lastName} required />
          </div>
        </div>
        <div>
          <Label>postcode</Label>
          <TextField name="postcode" defaultValue={profile.postcode ?? ""} placeholder="m1 1aa" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>city</Label>
            <TextField name="city" defaultValue={profile.city ?? ""} />
          </div>
          <div>
            <Label>country</Label>
            <TextField name="country" defaultValue={profile.country ?? "United Kingdom"} />
          </div>
        </div>

        {profile.role === UserRole.CLIENT && profile.clientProfile && (
          <>
            <div>
              <Label>company</Label>
              <TextField name="companyName" defaultValue={profile.clientProfile.companyName ?? ""} />
            </div>
            <div>
              <Label>bio</Label>
              <TextArea name="bio" rows={4} defaultValue={profile.clientProfile.bio ?? ""} />
            </div>
          </>
        )}

        {isPartnerLike && profile.talentProfile && (
          <>
            <div>
              <Label>headline</Label>
              <TextField
                name="headline"
                defaultValue={profile.talentProfile.headline ?? ""}
                placeholder="motion designer · product launches"
              />
            </div>
            <div>
              <Label>bio</Label>
              <TextArea name="bio" rows={5} defaultValue={profile.talentProfile.bio ?? ""} />
            </div>
            <div>
              <Label>day rate band</Label>
              <select
                name="dayRateBand"
                defaultValue={profile.talentProfile.dayRateBand ?? ""}
                className="w-full rounded-md px-3.5 py-2.5 text-[15px]"
                style={{
                  background: C.field,
                  border: "1px solid rgba(24,22,19,0.2)",
                  color: C.paperText,
                }}
              >
                <option value="">select…</option>
                {RATE_BANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            {isPartner && (
              <section>
                <h2 className="mb-3 text-lg font-medium">availability</h2>
                <AvailabilityToggle current={profile.talentProfile.availability ?? "open"} />
              </section>
            )}
            <BenchSkillPicker skills={skills} selectedIds={selectedSkillIds} />
          </>
        )}

        <PrimaryButton type="submit">save profile</PrimaryButton>
      </form>

      {isPartner && <BenchPortfolioPanel />}

      {trackRecord && trackRecord.entries.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-medium">track record</h2>
          <p className="mb-4 text-[14px]" style={{ color: C.paperFaint }}>
            completed bench work — history, not star ratings.
            {trackRecord.trustedSince ? ` trusted since ${trackRecord.trustedSince}.` : ""}
          </p>
          <div
            className="grid grid-cols-[1.4fr_1fr_0.8fr] py-2 text-[11px]"
            style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
          >
            <span>project</span>
            <span>role</span>
            <span>completed</span>
          </div>
          {trackRecord.entries.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[1.4fr_1fr_0.8fr] py-3 text-[14px]"
              style={{ borderTop: `1px solid ${C.paperRule}` }}
            >
              <span className="font-medium">{entry.title}</span>
              <span style={{ ...mono, color: C.paperBody }} className="text-[12px]">
                {entry.role}
              </span>
              <span style={{ ...mono, color: C.paperFaint }} className="text-[12px]">
                {entry.completedAt
                  ? entry.completedAt.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                  : "—"}
              </span>
            </div>
          ))}
        </section>
      )}

      {isApplicant && (
        <p className="mt-8">
          <Link href={routes.application} style={{ ...mono, color: C.orange }} className="text-[12px] hover:underline">
            → full application checklist
          </Link>
        </p>
      )}
    </BenchAppShell>
  );
}
