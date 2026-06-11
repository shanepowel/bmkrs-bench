import Link from "next/link";
import { UserRole } from "@bench/database";
import { getClientTeam } from "@/actions/client-team";
import { BenchAppShell } from "@/components/bench-app-shell";
import { TeamPortrait, TeamPortraitMeta } from "@/components/team-portrait";
import { C, mono, PrimaryButton } from "@/lib/bench-ui";
import { requireRole } from "@/lib/auth";
import { clientNavItems, navRailFooter } from "@/lib/nav-rail";
import { routes } from "@/lib/routes";

export default async function ClientPage() {
  const user = await requireRole(UserRole.CLIENT);
  const team = await getClientTeam();

  return (
    <BenchAppShell
      active={routes.client}
      footer={navRailFooter(user.firstName, "client")}
      items={clientNavItems}
      title="your team."
      lead="see who is on your project, their discipline, and one line about them. no rates, no bench search, no studio notes."
      action={<PrimaryButton href={routes.threads}>project threads</PrimaryButton>}
    >
      <div
        className="grid grid-cols-[auto_1.2fr_1fr_1.5fr] gap-4 py-2 text-[11px]"
        style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
      >
        <span />
        <span>name</span>
        <span>discipline</span>
        <span>about</span>
      </div>

      {team.length === 0 ? (
        <p className="py-6 text-[15px]" style={{ color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}>
          your team appears here when the studio staffs your project. threads and deliverables stay on
          existing contract routes.
        </p>
      ) : (
        team.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-[auto_1.2fr_1fr_1.5fr] items-start gap-4 py-4"
            style={{ borderTop: `1px solid ${C.paperRule}` }}
          >
            <TeamPortrait name={member.name} avatarUrl={member.avatarUrl} />
            <div>
              <span className="font-medium">{member.name}</span>
              <TeamPortraitMeta project={member.project} />
            </div>
            <span className="text-[12px]" style={{ ...mono, color: C.paperBody }}>
              {member.discipline}
            </span>
            <span className="text-[14px]" style={{ color: C.paperFaint }}>
              {member.note}
            </span>
          </div>
        ))
      )}

      <div className="mt-6">
        <Link
          href={routes.dashboard}
          className="inline-block rounded-full border px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
          style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperText, background: "transparent" }}
        >
          contracts dashboard
        </Link>
      </div>
    </BenchAppShell>
  );
}
