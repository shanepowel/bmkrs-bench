// components/BenchPanel.tsx — the live bench, the page's centrepiece.
// the mix: full-width filterable table (the bold v3) sitting inside a hero
// alongside the two doors (the tighter v2). visual trust hierarchy: solid
// orange dot = core, hollow ring = trusted. specialism column makes rows read
// as people, not categories. fed by /api/bench-public.
"use client";

import { useMemo, useState } from "react";

const C = {
  ink: "#181613", panel: "#1f1d19", paper: "#F1EFE8", body: "#D3D1C7",
  faint: "#888780", meta: "#B4B2A9", orange: "#FF4D00", rule: "rgba(241,239,232,0.12)",
};
const mono = { fontFamily: "var(--font-mono, ui-monospace, monospace)" } as const;

export type BenchRow = {
  discipline: string;
  specialism: string;
  status: "core" | "trusted";
  availability: "available" | "booked" | "away";
  availNote: string;
  projects: number;
  group: "brand" | "motion" | "build" | "voice" | "growth";
};

const FILTERS: { label: string; test: (r: BenchRow) => boolean }[] = [
  { label: "all", test: () => true },
  { label: "available now", test: (r) => r.availability === "available" },
  { label: "brand", test: (r) => r.group === "brand" },
  { label: "motion", test: (r) => r.group === "motion" },
  { label: "build", test: (r) => r.group === "build" },
  { label: "voice", test: (r) => r.group === "voice" },
];

function TrustDot({ status }: { status: "core" | "trusted" }) {
  return (
    <span
      aria-hidden
      className="inline-block h-2 w-2 rounded-full"
      style={status === "core" ? { background: C.orange } : { border: `1px solid ${C.orange}` }}
    />
  );
}

export default function BenchPanel({
  rows, totals, pulse,
}: {
  rows: BenchRow[];
  totals: { partners: number; disciplines: number };
  pulse?: string;
}) {
  const [filter, setFilter] = useState("all");
  const active = FILTERS.find((f) => f.label === filter) ?? FILTERS[0];
  const shown = useMemo(() => rows.filter(active.test), [rows, active]);
  const VISIBLE = 4;
  const extra = Math.max(0, shown.length - VISIBLE);

  return (
    <div className="rounded-2xl p-4 sm:p-5" style={{ background: C.panel, border: `1px solid ${C.rule}` }}>
      <div className="mb-3 flex items-center justify-between">
        <span style={{ ...mono, color: C.meta }} className="flex items-center gap-2 text-[11px]">
          <span className="ld inline-block h-1.5 w-1.5 rounded-full" style={{ background: C.orange }} />
          the bench, live
        </span>
        <span style={{ ...mono, color: C.faint }} className="text-[10px]">names off, real otherwise</span>
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.label)}
            aria-pressed={filter === f.label}
            className="rounded-full px-3 py-1 text-[11px] transition-colors"
            style={filter === f.label ? { background: C.paper, color: C.ink } : { border: `1px solid rgba(241,239,232,0.22)`, color: C.meta }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[0.3fr_1.8fr_1.3fr_1fr_0.4fr] py-2 text-[10px]" style={{ ...mono, color: C.faint, borderTop: `1px solid ${C.rule}` }}>
        <span /><span>discipline</span><span className="hidden sm:block">specialism</span><span>status</span><span>proj</span>
      </div>

      {shown.slice(0, VISIBLE).map((r, i) => (
        <div
          key={r.discipline + r.specialism}
          className="grid grid-cols-[0.3fr_1.8fr_1.3fr_1fr_0.4fr] items-center py-2.5"
          style={{ borderTop: `1px solid ${C.rule}`, opacity: i === VISIBLE - 1 && extra > 0 ? 0.55 : 1 }}
        >
          <TrustDot status={r.status} />
          <span className="text-[14px] font-medium" style={{ color: C.paper }}>
            {r.discipline}{" "}
            <span style={{ ...mono, color: r.status === "core" ? C.orange : C.meta }} className="text-[9px]">{r.status}</span>
          </span>
          <span style={{ ...mono, color: C.faint }} className="hidden text-[10px] sm:block">{r.specialism}</span>
          <span style={{ ...mono, color: C.body }} className="text-[10px]">
            {r.availability === "available" && <span style={{ color: C.orange }}>· </span>}
            {r.availNote}
          </span>
          <span style={{ ...mono, color: C.meta }} className="text-[10px]">{r.projects}</span>
        </div>
      ))}

      <div style={{ borderTop: `1px solid ${C.rule}` }} className="mt-1 flex flex-wrap items-center justify-between gap-2 pt-2.5">
        <span style={{ ...mono, color: C.faint }} className="text-[10px]">
          {shown.length === 0
            ? "nobody free with that mix this week"
            : `${extra > 0 ? `+ ${extra} more · ` : ""}${totals.partners} partners · availability moves weekly`}
        </span>
        {pulse && <span style={{ ...mono, color: C.orange }} className="text-[10px]">this week: {pulse}</span>}
      </div>

      <style>{`
        .ld { animation: bench-live 2s ease-in-out infinite; }
        @keyframes bench-live { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @media (prefers-reduced-motion: reduce) { .ld { animation: none; } }
      `}</style>
    </div>
  );
}
