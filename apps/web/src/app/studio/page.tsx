import Link from "next/link";
import { BenchAppShell } from "@/components/bench-app-shell";
import { C, mono } from "@/lib/bench-ui";
import { requireStudio } from "@/lib/auth";
import { navRailFooter, studioNavItems } from "@/lib/nav-rail";
import { routes } from "@/lib/routes";

const cards = [
  {
    href: routes.studioPipeline,
    label: "pipeline",
    copy: "applied → reviewed → trusted, with audit trail",
  },
  {
    href: routes.studioBench,
    label: "bench search",
    copy: "discipline, availability, rate band",
  },
  {
    href: routes.studioBriefs,
    label: "briefs",
    copy: "compose briefs and invite partners",
  },
] as const;

export default async function StudioPage() {
  const studio = await requireStudio();

  return (
    <BenchAppShell
      active={routes.studio}
      footer={navRailFooter(studio.firstName, "studio")}
      items={studioNavItems}
      title="studio."
      lead="pipeline, search, briefs, assignments. one trusted network, staffed by a human."
    >
      <div className="grid gap-0 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block p-6 transition-transform hover:translate-x-1 motion-reduce:transform-none"
            style={{ borderTop: `1px solid ${C.paperRule}` }}
          >
            <p style={{ ...mono, color: C.paperFaint }} className="text-[11px] uppercase tracking-[0.08em]">
              {card.label}
            </p>
            <p className="mt-3 text-[15px]" style={{ color: C.paperBody }}>
              {card.copy}
            </p>
          </Link>
        ))}
      </div>
    </BenchAppShell>
  );
}
