import Link from "next/link";
import { BenchAppShell } from "@/components/bench-app-shell";
import { C, Label, mono, PrimaryButton, TextArea, TextField } from "@/lib/bench-ui";
import { requireStudio } from "@/lib/auth";
import { navRailFooter, studioNavItems } from "@/lib/nav-rail";
import { routes } from "@/lib/routes";

export default async function StudioBriefsPage() {
  const studio = await requireStudio();

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
            phase 3: pick from the bench and send yes/no/when invites. jobs table and routes remain for the
            underlying mechanics.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <PrimaryButton href={routes.postJob}>compose brief (legacy post job)</PrimaryButton>
          <Link
            href={routes.jobs}
            className="inline-block rounded-full border px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
            style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperText, background: "transparent" }}
          >
            all briefs
          </Link>
        </div>
      </div>

      <p
        className="mt-10 max-w-[52ch] text-[13px]"
        style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}`, paddingTop: "1rem" }}
      >
        drafts save to the jobs table. invited partners see briefs on their home and respond through existing
        proposal routes until the dedicated flow ships.
      </p>
    </BenchAppShell>
  );
}
