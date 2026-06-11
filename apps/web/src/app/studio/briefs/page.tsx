import Link from "next/link";
import { JobStatus } from "@bench/database";
import { listStudioBriefs, listTrustedPartnersForInvite } from "@/actions/briefs";
import { BenchAppShell } from "@/components/bench-app-shell";
import { BriefComposerForm } from "@/components/brief-composer-form";
import { C, mono, Status } from "@/lib/bench-ui";
import { requireStudio } from "@/lib/auth";
import { navRailFooter, studioNavItems } from "@/lib/nav-rail";
import { routes } from "@/lib/routes";

export default async function StudioBriefsPage() {
  const studio = await requireStudio();
  const [briefs, partners] = await Promise.all([listStudioBriefs(), listTrustedPartnersForInvite()]);

  const invitePartners = partners.map((p) => ({
    userId: p.user.id,
    name: `${p.user.firstName} ${p.user.lastName}`.toLowerCase(),
    disciplines: p.skills.map((s) => s.skill.name.toLowerCase()),
  }));

  return (
    <BenchAppShell
      active={routes.studioBriefs}
      footer={navRailFooter(studio.firstName, "studio")}
      items={studioNavItems}
      title="brief composer."
      lead="studio-authored, invited partners only. no open listings, no bidding."
    >
      <BriefComposerForm partners={invitePartners} />

      <section className="mt-12">
        <h2 className="mb-3 text-xl font-medium">published briefs</h2>
        <div
          className="grid grid-cols-[1.4fr_0.8fr_0.8fr] py-2 text-[11px]"
          style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
        >
          <span>title</span>
          <span>status</span>
          <span>invites</span>
        </div>
        {briefs.length === 0 ? (
          <p className="py-4 text-[14px]" style={{ color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}>
            no briefs yet.
          </p>
        ) : (
          briefs.map((brief) => (
            <Link
              key={brief.id}
              href={routes.job(brief.slug)}
              className="grid grid-cols-[1.4fr_0.8fr_0.8fr] items-center py-3 transition-transform hover:translate-x-1 motion-reduce:transform-none"
              style={{ borderTop: `1px solid ${C.paperRule}` }}
            >
              <span className="font-medium">{brief.title.toLowerCase()}</span>
              <Status kind={brief.status === JobStatus.OPEN ? "available" : "booked"}>
                {brief.status.toLowerCase()}
              </Status>
              <span style={{ ...mono, color: C.paperBody }} className="text-[12px]">
                {brief._count.proposals} invited
              </span>
            </Link>
          ))
        )}
      </section>
    </BenchAppShell>
  );
}
