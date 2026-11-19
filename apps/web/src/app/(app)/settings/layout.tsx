"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const tabs = [
  { href: routes.payouts, label: "payouts" },
  { href: routes.transactions, label: "transactions" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-lg px-4 py-10 md:py-12">
      <p className="mb-2 font-mono text-[12px] tracking-[0.08em] text-orange lowercase">settings</p>
      <h1 className="text-h3 font-medium tracking-tight">payments.</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        the bench keeps invoicing off-platform. these pages explain how that works.
      </p>
      <nav className="mt-6 flex gap-4 border-b border-border pb-px">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "border-b-2 pb-2 text-sm font-medium lowercase transition",
                active
                  ? "border-orange text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
