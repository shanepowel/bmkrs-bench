import Link from "next/link";
import { UserRole } from "@bench/database";
import { BenchShell } from "@/components/bench-shell";
import { Body } from "@/components/surfaces";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export default async function ClientPage() {
  await requireRole(UserRole.CLIENT);

  return (
    <BenchShell
      kicker="client"
      title="your projects and your team"
      lead="see who is on your project, their discipline, and one line about them. no rates, no bench search, no studio notes."
    >
      <div className="col-span-12 sm:col-span-9">
        <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
          your team
        </p>
        <Body className="mt-4 text-[var(--surface-meta)]">
          phase 4: illustrated portraits and inspectable team panels per project. threads and deliverables
          stay on existing contract routes.
        </Body>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={routes.inbox}
            className="inline-flex bg-[#FF4D00] px-5 py-3 text-body font-medium text-[#181613]"
          >
            project threads
          </Link>
          <Link
            href={routes.dashboard}
            className="inline-flex border border-[color:var(--surface-rule)] px-5 py-3 text-body text-[var(--surface-heading)]"
          >
            contracts dashboard
          </Link>
        </div>
      </div>
    </BenchShell>
  );
}
