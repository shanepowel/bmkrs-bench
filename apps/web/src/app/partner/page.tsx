import Link from "next/link";
import { UserRole } from "@bench/database";
import { listPartnerBriefs } from "@/actions/briefs";
import { BenchAppShell } from "@/components/bench-app-shell";
import { BriefResponseForm } from "@/components/brief-response-form";
import { AvailabilityToggle } from "@/components/availability-toggle";
import { C, mono, PrimaryButton, Rule, Status } from "@/lib/bench-ui";
import { getProfileForEdit } from "@/actions/profile";
import { requireRole } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";
import { navRailFooter, partnerNavItems } from "@/lib/nav-rail";
import { partnerStatusKind } from "@/lib/partner-status-ui";
import { routes } from "@/lib/routes";

export default async function PartnerPage() {
  const user = await requireRole(UserRole.TALENT);
  const [profile, briefs] = await Promise.all([getProfileForEdit(), listPartnerBriefs()]);
  const status = profile?.talentProfile?.partnerStatus;

  return (
    <BenchAppShell
      active={routes.partner}
      footer={navRailFooter(user.firstName, "partner")}
      items={partnerNavItems}
      title="partner home."
      lead="update availability, respond to briefs, and keep project threads current."
      action={<PrimaryButton href={routes.threads}>threads</PrimaryButton>}
    >
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-0 pr-0 lg:pr-8">
          {status && (
            <Status kind={partnerStatusKind(status)}>{partnerStatusLabel[status]}</Status>
          )}
          <div className="mt-6">
            <AvailabilityToggle current={profile?.talentProfile?.availability ?? "open"} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton href={routes.profile}>edit bench profile</PrimaryButton>
          </div>
          <div className="mt-4">
            <Link
              href={routes.threads}
              className="inline-block rounded-full border px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
              style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperText, background: "transparent" }}
            >
              project threads
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 lg:mt-0 lg:border-l lg:pt-0 lg:pl-8" style={{ borderColor: C.paperRule }}>
          <h2 className="mb-3 text-xl font-medium">your briefs</h2>
          <Rule />
          {briefs.length === 0 ? (
            <p style={{ ...mono, color: C.paperFaint }} className="py-4 text-[12px]">
              no open briefs right now. enjoy it; it never lasts.
            </p>
          ) : (
            briefs.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-1 items-center gap-2 py-4 sm:grid-cols-[1.2fr_1fr_1fr_auto]"
                style={{ borderBottom: `1px solid ${C.paperRule}` }}
              >
                <span className="font-medium">{b.codename}</span>
                <span style={{ ...mono, color: C.paperBody }} className="text-[12px]">
                  {b.role} · {b.dates}
                </span>
                <span style={{ ...mono, color: C.paperFaint }} className="text-[12px]">
                  respond by {b.respondBy}
                </span>
                <BriefResponseForm jobId={b.id} responded={b.responded} />
              </div>
            ))
          )}
        </div>
      </div>
    </BenchAppShell>
  );
}
