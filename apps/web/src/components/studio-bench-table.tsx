"use client";

import { useMemo, useState } from "react";
import { C, mono, Status, PrimaryButton, type StatusKind } from "@/lib/bench-ui";
import { BenchAppShell } from "@/components/bench-app-shell";
import { studioNavItems } from "@/lib/nav-rail";
import { routes } from "@/lib/routes";

export type BenchRow = {
  id: string;
  name: string;
  status: "core" | "trusted";
  disciplines: string[];
  availability: "available" | "booked" | "away";
  availNote: string;
  band: string;
  projects: number;
};

const FILTERS = [
  "all",
  "brand + identity",
  "voice + copy",
  "pr + comms",
  "product design",
  "engineering",
  "motion + 3d",
  "growth",
];

export function StudioBenchTable({ rows, footer }: { rows: BenchRow[]; footer: string }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () =>
      rows.filter(
        (p) =>
          (filter === "all" || p.disciplines.some((d) => d.toLowerCase().includes(filter))) &&
          (q === "" ||
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.disciplines.join(" ").toLowerCase().includes(q.toLowerCase()))
      ),
    [q, filter, rows]
  );

  return (
    <BenchAppShell
      active={routes.studioBench}
      footer={footer}
      items={studioNavItems}
      title="the bench."
      action={<PrimaryButton href={routes.studioBriefs}>send a brief</PrimaryButton>}
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search the bench…"
          aria-label="search the bench"
          className="rounded-full border px-4 py-1.5 text-[13px] outline-none focus:shadow-[0_0_0_3px_rgba(255,77,0,0.25)]"
          style={{ borderColor: "rgba(24,22,19,0.25)", background: "#FFFFFF", color: C.paperText }}
        />
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className="rounded-full border px-3.5 py-1.5 text-[12px] transition-colors"
            style={
              filter === f
                ? { background: C.ink, color: C.paper, borderColor: C.ink }
                : { background: "transparent", color: C.paperFaint, borderColor: "rgba(24,22,19,0.25)" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-[1.4fr_1.5fr_1.1fr_0.6fr_0.7fr] py-2 text-[11px]"
        style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
      >
        <span>name</span>
        <span>disciplines</span>
        <span>availability</span>
        <span>band</span>
        <span>projects</span>
      </div>

      {filtered.map((p) => (
        <a
          key={p.id}
          href={routes.studioPipelineApplicant(p.id)}
          className="grid w-full grid-cols-[1.4fr_1.5fr_1.1fr_0.6fr_0.7fr] items-center py-3 text-left transition-transform hover:translate-x-1 motion-reduce:transform-none"
          style={{ borderTop: `1px solid ${C.paperRule}` }}
        >
          <span className="font-medium">
            {p.name}{" "}
            <Status kind={p.status as StatusKind}>{p.status}</Status>
          </span>
          <span style={{ ...mono, color: C.paperBody }} className="text-[12px]">
            {p.disciplines.join(" · ")}
          </span>
          <Status kind={p.availability as StatusKind}>{p.availNote}</Status>
          <span style={{ ...mono, color: C.paperBody }} className="text-[12px]">
            {p.band}
          </span>
          <span style={{ ...mono, color: C.paperBody }} className="text-[12px]">
            {p.projects}
          </span>
        </a>
      ))}

      <p
        className="mt-4 pt-3 text-[11px]"
        style={{ ...mono, color: C.paperFaint, borderTop: `1px solid ${C.paperRule}` }}
      >
        {filtered.length === 0
          ? "nobody free with that mix right now. widen a filter or check back thursday; availability moves weekly."
          : `${filtered.length} on the bench with that mix · availability moves weekly`}
      </p>
    </BenchAppShell>
  );
}
