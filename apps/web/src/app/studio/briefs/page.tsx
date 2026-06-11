import Link from "next/link";
import { JobStatus } from "@bench/database";
import { listStudioBriefs } from "@/actions/briefs";
import { BenchAppShell } from "@/components/bench-app-shell";
import { C, Label, mono, PrimaryButton, Status, TextArea, TextField } from "@/lib/bench-ui";
import { requireStudio } from "@/lib/auth";
import { navRailFooter, studioNavItems } from "@/lib/nav-rail";
import { routes } from "@/lib/routes";

export default async function StudioBriefsPage() {
  const studio = await requireStudio();
  const briefs = await listStudioBriefs();

  return (
    <BenchAppShell
      active={routes.studioBriefs}
      footer={navRailFooter(studio.firstName, "studio")}
      items={studioNavItems}
      title="brief composer."
      lead="studio-authored, invited partners only. no open listings, no bidding."
      action={<PrimaryButton href={routes.postJob}>publish brief</PrimaryButton>}
    >
      <div className="max-w-2xl space-y-5">
        <div>
          <Label>project title</Label>
          <TextField name="title" placeholder="q3 brand refresh" disabled />
        </div>
        <div>
          <Label>brief</Label>
          <TextArea
            name="brief"
            rows={6}
            placeholder="what needs doing, by when, and what good looks like…"
            disabled
          />
        </div>
        <div>
          <Label>invite partners</Label>
          <p className="text-[14px]" style={{ color: C.paperFaint }}>
            publish via post job, set visibility to invited, then add partner proposals from the job
            page. partners respond with i&apos;m in / not this time / when.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <PrimaryButton href={routes.postJob}>compose brief</PrimaryButton>
          <Link
            href={routes.jobs}
            className="inline-block rounded-full border px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
            style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperText, background: "transparent" }}
          >
            all briefs
          </Link>
        </div>
      </div>

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
