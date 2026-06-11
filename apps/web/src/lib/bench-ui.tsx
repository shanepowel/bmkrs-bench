// the bench design system primitives (app scale). see docs/BRAND-KIT.md
"use client";

import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";

export const C = {
  ink: "#181613",
  paper: "#F1EFE8",
  orange: "#FF4D00",
  inkText: "#F1EFE8",
  inkBody: "#D3D1C7",
  inkFaint: "#B4B2A9",
  inkRule: "rgba(241,239,232,0.16)",
  paperText: "#181613",
  paperBody: "#444441",
  paperFaint: "#5F5E5A",
  paperRule: "rgba(24,22,19,0.15)",
  field: "#FFFFFF",
} as const;

export const mono: CSSProperties = {
  fontFamily: "var(--font-mono, ui-monospace, monospace)",
};

export type StatusKind =
  | "applied"
  | "reviewed"
  | "trusted"
  | "core"
  | "available"
  | "booked"
  | "away"
  | "stage-active"
  | "stage-idle";

const STATUS_STYLE: Record<StatusKind, { dot: string; text: string }> = {
  applied: { dot: C.paperFaint, text: C.paperFaint },
  reviewed: { dot: C.paperBody, text: C.paperBody },
  trusted: { dot: C.orange, text: C.paperBody },
  core: { dot: C.orange, text: C.orange },
  available: { dot: C.orange, text: C.paperBody },
  booked: { dot: C.paperBody, text: C.paperBody },
  away: { dot: C.paperFaint, text: C.paperFaint },
  "stage-active": { dot: C.orange, text: C.paperText },
  "stage-idle": { dot: C.paperFaint, text: C.paperFaint },
};

export function Status({ kind, children }: { kind: StatusKind; children: ReactNode }) {
  const s = STATUS_STYLE[kind];
  return (
    <span style={{ ...mono, color: s.text }} className="inline-flex items-center gap-1.5 text-[12px]">
      <span aria-hidden className="inline-block h-[7px] w-[7px] rounded-full" style={{ background: s.dot }} />
      {children}
    </span>
  );
}

const STAGES = ["listen", "decide", "make", "ship", "motion"] as const;
export type Stage = (typeof STAGES)[number];

export function StageStrip({ current }: { current: Stage }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      {STAGES.map((stage) => (
        <Status key={stage} kind={stage === current ? "stage-active" : "stage-idle"}>
          {stage}
        </Status>
      ))}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  href,
  type,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  type?: "submit";
}) {
  const cls =
    "inline-block rounded-full px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none";
  const style = { background: C.orange, color: C.ink };
  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  surface = "paper",
}: {
  children: ReactNode;
  onClick?: () => void;
  surface?: "ink" | "paper";
}) {
  const text = surface === "ink" ? C.inkText : C.paperText;
  const border = surface === "ink" ? "rgba(241,239,232,0.4)" : "rgba(24,22,19,0.3)";
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
      style={{ borderColor: border, color: text, background: "transparent" }}
    >
      {children}
    </button>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label style={{ ...mono, color: C.paperBody }} className="mb-1.5 block text-[12px]">
      {children}
    </label>
  );
}

const fieldCls =
  "w-full rounded-md px-3.5 py-2.5 text-[15px] outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(255,77,0,0.25)]";
const fieldStyle: CSSProperties = {
  background: C.field,
  border: "1px solid rgba(24,22,19,0.2)",
  color: C.paperText,
};

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldCls} style={fieldStyle} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={props.rows ?? 4} className={fieldCls} style={fieldStyle} />;
}

export function PillSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((v) => v !== opt) : [...value, opt])}
            className="rounded-full border px-4 py-2 text-[13px] transition-colors"
            style={
              on
                ? { background: C.ink, color: C.paper, borderColor: C.ink }
                : { background: "transparent", color: C.paperBody, borderColor: "rgba(24,22,19,0.25)" }
            }
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function Rule({ surface = "paper" }: { surface?: "ink" | "paper" }) {
  return (
    <div aria-hidden style={{ borderTop: `1px solid ${surface === "ink" ? C.inkRule : C.paperRule}` }} />
  );
}

export function Kicker({ surface = "paper", children }: { surface?: "ink" | "paper"; children: ReactNode }) {
  return (
    <p style={{ ...mono, color: C.orange, letterSpacing: "0.08em" }} className="mb-4 text-[13px]">
      {children}
    </p>
  );
}

export function NavRail({
  items,
  active,
  footer,
}: {
  items: { label: string; href: string }[];
  active: string;
  footer: string;
}) {
  return (
    <nav
      aria-label="app navigation"
      className="flex w-[200px] shrink-0 flex-col gap-1 p-4"
      style={{ background: C.ink, minHeight: "100dvh" }}
    >
      <Link href="/" className="mb-6 px-2 text-2xl font-medium" style={{ color: C.inkText }}>
        b
        <span
          aria-hidden
          className="ml-[2px] inline-block rounded-full align-baseline"
          style={{ width: "0.14em", height: "0.14em", background: C.orange }}
        />
      </Link>
      {items.map((item) => {
        const on = item.href === active;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={on ? "page" : undefined}
            className="rounded-md px-2.5 py-2 text-[12px]"
            style={{ ...mono, background: on ? C.paper : "transparent", color: on ? C.ink : C.inkFaint }}
          >
            {item.label}
          </Link>
        );
      })}
      <div className="flex-1" />
      <p style={{ ...mono, color: "#888780" }} className="px-2.5 text-[11px]">
        {footer}
      </p>
    </nav>
  );
}
