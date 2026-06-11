import Link from "next/link";
import { UserRole } from "@bench/database";
import { BenchAppShell } from "@/components/bench-app-shell";
import { C, mono, PrimaryButton } from "@/lib/bench-ui";
import { requireRole } from "@/lib/auth";
import { clientNavItems, navRailFooter } from "@/lib/nav-rail";
import { routes } from "@/lib/routes";

const PLACEHOLDER_TEAM = [
  { name: "your studio lead", discipline: "account", note: "one line about who they are and what they own on your project." },
  { name: "partner name", discipline: "brand + identity", note: "assigned when your project is staffed. no rates, no bench search." },
] as const;

export default async function ClientPage() {
  const user = await requireRole(UserRole.CLIENT);

  return (
    <BenchAppShell
      active={routes.client}
      footer={navRailFooter(user.firstName, "client")}
      items={clientNavItems}
      title="your team."
      lead="see who is on your project, their discipline, and one line about them. no rates, no bench search, no studio notes."
      action={<PrimaryButton href={routes.inbox}>project threads</PrimaryButton>}
    >
      <div
        className="grid grid-cols-[1.2fr_1fr_1.5fr] py-2 text-[11px]"
        style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
      >
        <span>name</span>
        <span>discipline</span>
        <span>about</span>
      </div>

      {PLACEHOLDER_TEAM.map((member) => (
        <div
          key={member.name}
          className="grid grid-cols-[1.2fr_1fr_1.5fr] items-start py-4"
          style={{ borderTop: `1px solid ${C.paperRule}` }}
        >
          <span className="font-medium">{member.name}</span>
          <span className="text-[12px]" style={{ ...mono, color: C.paperBody }}>
            {member.discipline}
          </span>
          <span className="text-[14px]" style={{ color: C.paperFaint }}>
            {member.note}
          </span>
        </div>
      ))}

      <p
        className="mt-4 pt-3 text-[11px]"
        style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
      >
        phase 4: illustrated portraits and live team panels per project. threads and deliverables stay on
        existing contract routes.
      </p>

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
