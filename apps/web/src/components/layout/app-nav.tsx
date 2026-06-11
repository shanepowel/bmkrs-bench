"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

const navItems = [
  { href: routes.dashboard, label: "Dashboard" },
  { href: routes.inbox, label: "Inbox" },
  { href: routes.jobs, label: "Jobs" },
  { href: routes.notifications, label: "Notifications" },
  { href: routes.transactions, label: "Transactions" },
  { href: routes.profile, label: "Profile" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Account"
      className="mb-8 flex gap-1 overflow-x-auto border-b border-slate-200 pb-px"
    >
      {navItems.map((item) => {
        const active =
          pathname === item.href ||
          (item.href === routes.dashboard && pathname.startsWith("/contracts")) ||
          (item.href === routes.inbox && pathname.startsWith("/inbox")) ||
          (item.href === routes.transactions && pathname.startsWith("/settings/transactions")) ||
          (item.href === routes.jobs && pathname.startsWith("/jobs/post"));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition",
              active
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
