import type { ActivityType } from "@bench/database";

type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  body: string | null;
  createdAt: Date;
  actor: {
    firstName: string;
    lastName: string;
    username: string;
  } | null;
};

const typeColors: Partial<Record<ActivityType, string>> = {
  CONTRACT_OFFERED: "bg-blue-100 text-blue-800",
  CONTRACT_ACCEPTED: "bg-green-100 text-green-800",
  MILESTONE_FUNDED: "bg-emerald-100 text-emerald-800",
  MILESTONE_PAID: "bg-emerald-100 text-emerald-800",
  DELIVERABLE_UPLOADED: "bg-violet-100 text-violet-800",
};

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function ContractActivityTimeline({ activities }: { activities: Activity[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Activity</h2>
      <ul className="mt-4 space-y-4">
        {activities.map((a) => (
          <li key={a.id} className="relative border-l-2 border-slate-200 pl-4">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[a.type] ?? "bg-slate-100 text-slate-700"}`}
            >
              {a.type.replace(/_/g, " ").toLowerCase()}
            </span>
            <p className="mt-1 text-sm font-medium text-slate-900">{a.title}</p>
            {a.body && <p className="text-sm text-slate-600">{a.body}</p>}
            <p className="mt-1 text-xs text-slate-500">
              {a.actor
                ? `${a.actor.firstName} ${a.actor.lastName} · `
                : null}
              {formatWhen(a.createdAt)}
            </p>
          </li>
        ))}
        {activities.length === 0 && (
          <p className="text-sm text-slate-500">No activity yet.</p>
        )}
      </ul>
    </section>
  );
}
