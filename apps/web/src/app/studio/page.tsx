import Link from "next/link";
import { BenchShell } from "@/components/bench-shell";
import { Body } from "@/components/surfaces";
import { requireStudio } from "@/lib/auth";
import { routes } from "@/lib/routes";

export default async function StudioPage() {
  await requireStudio();

  return (
    <BenchShell
      kicker="studio"
      title="the bench"
      lead="pipeline, search, briefs, assignments. one trusted network, staffed by a human."
    >
      <div className="col-span-12 grid gap-6 sm:col-span-9 md:grid-cols-3">
        {[
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
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block border border-[color:var(--surface-rule)] p-6 transition hover:border-[var(--surface-accent)]"
          >
            <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
              {card.label}
            </p>
            <Body className="mt-3">{card.copy}</Body>
          </Link>
        ))}
      </div>
    </BenchShell>
  );
}
