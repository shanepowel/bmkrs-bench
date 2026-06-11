import Link from "next/link";
import { notFound } from "next/navigation";
import { PartnerStatus } from "@bench/database";
import { getTalentByUsername } from "@/actions/profile";
import { getPartnerTrackRecord } from "@/actions/track-record";
import { TeamPortrait } from "@/components/team-portrait";
import { C, mono, Status } from "@/lib/bench-ui";
import { partnerStatusLabel } from "@/lib/bench";
import { partnerStatusKind } from "@/lib/partner-status-ui";
import { routes } from "@/lib/routes";

export default async function PartnerPublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const talent = await getTalentByUsername(username);
  if (!talent?.talentProfile) notFound();

  const profile = talent.talentProfile;
  const trackRecord = await getPartnerTrackRecord(talent.id);
  const name = `${talent.firstName} ${talent.lastName}`.toLowerCase();

  return (
    <div className="flex min-h-dvh" style={{ background: C.paper }}>
      <main className="mx-auto w-full max-w-3xl px-8 py-12" style={{ color: C.paperText }}>
        <div className="mb-8 flex items-start gap-5">
          <TeamPortrait name={name} avatarUrl={talent.avatarUrl} size={72} />
          <div>
            <h1
              className="font-medium"
              style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", letterSpacing: "-0.02em" }}
            >
              {name}
            </h1>
            <p style={{ ...mono, color: C.paperFaint }} className="text-[12px]">
              @{talent.username}
            </p>
            {profile.partnerStatus !== PartnerStatus.APPLIED && (
              <div className="mt-3">
                <Status kind={partnerStatusKind(profile.partnerStatus)}>
                  {partnerStatusLabel[profile.partnerStatus]}
                  {trackRecord.trustedSince ? ` since ${trackRecord.trustedSince}` : ""}
                </Status>
              </div>
            )}
            {profile.headline && (
              <p className="mt-3 text-[15px]" style={{ color: C.paperBody }}>
                {profile.headline}
              </p>
            )}
            {profile.dayRateBand && (
              <p style={{ ...mono, color: C.paperFaint }} className="mt-2 text-[12px]">
                {profile.dayRateBand} · availability: {profile.availability ?? "open"}
              </p>
            )}
          </div>
        </div>

        {profile.bio && (
          <section className="mb-10">
            <p style={{ ...mono, color: C.paperFaint }} className="mb-2 text-[11px] uppercase tracking-[0.08em]">
              about
            </p>
            <p className="whitespace-pre-wrap text-[15px]" style={{ color: C.paperBody }}>
              {profile.bio}
            </p>
          </section>
        )}

        {profile.skills.length > 0 && (
          <section className="mb-10">
            <p style={{ ...mono, color: C.paperFaint }} className="mb-3 text-[11px] uppercase tracking-[0.08em]">
              disciplines
            </p>
            <p style={{ ...mono, color: C.paperBody }} className="text-[13px]">
              {profile.skills.map((s) => s.skill.name.toLowerCase()).join(" · ")}
            </p>
          </section>
        )}

        {profile.portfolioItems.length > 0 && (
          <section className="mb-10">
            <p style={{ ...mono, color: C.paperFaint }} className="mb-3 text-[11px] uppercase tracking-[0.08em]">
              portfolio
            </p>
            <ul>
              {profile.portfolioItems.map((item) => (
                <li key={item.id} className="py-3" style={{ borderTop: `1px solid ${C.paperRule}` }}>
                  <p className="font-medium">{item.title.toLowerCase()}</p>
                  {item.projectUrl && (
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] hover:underline"
                      style={{ ...mono, color: C.orange }}
                    >
                      {item.projectUrl}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {trackRecord.entries.length > 0 && (
          <section className="mb-10">
            <p style={{ ...mono, color: C.paperFaint }} className="mb-3 text-[11px] uppercase tracking-[0.08em]">
              track record
            </p>
            {trackRecord.entries.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-[1.4fr_1fr] gap-2 py-3"
                style={{ borderTop: `1px solid ${C.paperRule}` }}
              >
                <span className="font-medium">{entry.title}</span>
                <span style={{ ...mono, color: C.paperFaint }} className="text-[12px] text-right">
                  {entry.role}
                </span>
              </div>
            ))}
          </section>
        )}

        <Link href={routes.home} style={{ ...mono, color: C.orange }} className="text-[12px] hover:underline">
          ← the bench
        </Link>
      </main>
    </div>
  );
}
