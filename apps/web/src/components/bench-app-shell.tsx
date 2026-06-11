"use client";

import type { ReactNode } from "react";
import { C, NavRail } from "@/lib/bench-ui";
import type { NavRailItem } from "@/lib/nav-rail";

const titleStyle = {
  fontSize: "clamp(1.75rem,3vw,2.5rem)",
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
} as const;

export function BenchAppShell({
  active,
  footer,
  items,
  title,
  lead,
  action,
  children,
}: {
  active: string;
  footer: string;
  items: NavRailItem[];
  title: string;
  lead?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex" style={{ background: C.paper }}>
      <NavRail active={active} footer={footer} items={items} />
      <main className="min-h-dvh flex-1 px-8 py-8" style={{ color: C.paperText }}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-medium" style={titleStyle}>
              {title}
            </h1>
            {lead && (
              <p className="mt-3 max-w-[52ch] text-[15px]" style={{ color: C.paperBody }}>
                {lead}
              </p>
            )}
          </div>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
