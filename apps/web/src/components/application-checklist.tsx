import type { ApplicationCheck } from "@/lib/application-completeness";

export function ApplicationChecklist({ checks }: { checks: ApplicationCheck[] }) {
  const done = checks.filter((c) => c.done).length;

  return (
    <div className="border border-[color:var(--surface-rule)] p-5">
      <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
        application checklist · {done}/{checks.length}
      </p>
      <ul className="mt-4 space-y-2">
        {checks.map((check) => (
          <li key={check.id} className="flex items-center gap-3 font-mono text-meta">
            <span
              className={
                check.done ? "text-[var(--surface-accent)]" : "text-[var(--surface-meta)]"
              }
              aria-hidden
            >
              {check.done ? "·" : "○"}
            </span>
            <span className={check.done ? "text-[var(--surface-body)]" : "text-[var(--surface-meta)]"}>
              {check.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
