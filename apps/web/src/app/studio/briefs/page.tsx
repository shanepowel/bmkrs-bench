import Link from "next/link";
import { BenchShell } from "@/components/bench-shell";
import { Body } from "@/components/surfaces";
import { requireStudio } from "@/lib/auth";
import { routes } from "@/lib/routes";

export default async function StudioBriefsPage() {
  await requireStudio();

  return (
    <BenchShell
      kicker="briefs"
      title="project briefs"
      lead="studio-authored, invited partners only. no open listings, no bidding."
    >
      <div className="col-span-12 sm:col-span-9">
        <Body className="text-[var(--surface-meta)]">
          phase 3: brief composer with project linkage and partner invitations. jobs table and routes remain
          for the underlying mechanics.
        </Body>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={routes.postJob}
            className="inline-flex bg-[#FF4D00] px-5 py-3 text-body font-medium text-[#181613]"
          >
            compose brief (legacy post job)
          </Link>
          <Link
            href={routes.jobs}
            className="inline-flex border border-[color:var(--surface-rule)] px-5 py-3 text-body text-[var(--surface-heading)]"
          >
            all briefs
          </Link>
        </div>
      </div>
    </BenchShell>
  );
}
