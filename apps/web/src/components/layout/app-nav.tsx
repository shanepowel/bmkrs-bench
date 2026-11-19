"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

const navItems = [
  { href: routes.dashboardHome, label: "home" },
  { href: routes.threads, label: "threads" },
  { href: routes.profile, label: "profile" },
  { href: routes.transactions, label: "payments" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Account"
      className="mb-8 flex gap-1 overflow-x-auto border-b border-border pb-px"
    >
      {navItems.map((item) => {
        const active =
          pathname === item.href ||
          (item.href === routes.dashboardHome && pathname === "/home") ||
          (item.href === routes.threads && pathname.startsWith("/threads")) ||
          (item.href === routes.transactions && pathname.startsWith("/settings/"));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium lowercase transition",
              active
                ? "border-orange text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
