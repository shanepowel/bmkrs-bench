import Link from "next/link";
import { UserRole } from "@bench/database";
import { BenchAppShell } from "@/components/bench-app-shell";
import { C, mono, PrimaryButton, Status } from "@/lib/bench-ui";
import { getProfileForEdit } from "@/actions/profile";
import { requireRole } from "@/lib/auth";
import { partnerStatusLabel } from "@/lib/bench";
import { navRailFooter, partnerNavItems } from "@/lib/nav-rail";
import { partnerStatusKind } from "@/lib/partner-status-ui";
import { routes } from "@/lib/routes";

function availabilityKind(value: string | null | undefined): "available" | "booked" | "away" {
  if (value === "unavailable") return "away";
  if (value === "limited") return "booked";
  return "available";
}

export default async function PartnerPage() {
  const user = await requireRole(UserRole.TALENT);
  const profile = await getProfileForEdit();
  const status = profile?.talentProfile?.partnerStatus;
  const availability = profile?.talentProfile?.availability ?? "open";
  const availKind = availabilityKind(profile?.talentProfile?.availability);

  return (
    <BenchAppShell
      active={routes.partner}
      footer={navRailFooter(user.firstName, "partner")}
      items={partnerNavItems}
      title="partner home."
      lead="update availability, respond to briefs, and keep project threads current."
      action={<PrimaryButton href={routes.profile}>edit profile</PrimaryButton>}
    >
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-0 pr-0 lg:pr-8">
          {status && (
            <Status kind={partnerStatusKind(status)}>{partnerStatusLabel[status]}</Status>
          )}
          <p className="mt-4 text-[15px]" style={{ color: C.paperBody }}>
            availability:{" "}
            <Status kind={availKind}>{availability}</Status>
          </p>
          <div className="mt-6">
            <Link
              href={routes.inbox}
              className="inline-block rounded-full border px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
              style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperText, background: "transparent" }}
            >
              project threads
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 lg:mt-0 lg:border-l lg:pt-0 lg:pl-8" style={{ borderColor: C.paperRule }}>
          <p style={{ ...mono, color: C.paperFaint }} className="text-[11px] uppercase tracking-[0.08em]">
            invited briefs
          </p>
          <p className="mt-4 max-w-[52ch] text-[15px]" style={{ color: C.paperFaint }}>
            phase 3: yes/no/when responses for studio briefs you are invited to. marketplace job routes remain
            wired underneath.
          </p>
          <Link
            href={routes.jobs}
            className="mt-4 inline-block text-[12px] hover:underline"
            style={{ ...mono, color: C.orange }}
          >
            view briefs (legacy jobs route)
          </Link>
        </div>
      </div>
    </BenchAppShell>
  );
}
