// components/SiteHeader.tsx — the shared bmkrs nav, used by app + site.
"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { marketingUrls } from "@/lib/marketing-urls";
import { routes } from "@/lib/routes";

const NAV = [
  { label: "work", href: marketingUrls.work },
  { label: "services", href: marketingUrls.services },
  { label: "motion", href: marketingUrls.motion },
  { label: "network", href: routes.home, surface: "network" },
  { label: "journal", href: marketingUrls.journal },
  { label: "about", href: marketingUrls.about },
];

const C = { ink: "#181613", paper: "#F1EFE8", body: "#B4B2A9", orange: "#FF4D00", rule: "rgba(241,239,232,0.12)" };
const mono = { fontFamily: "var(--font-mono, ui-monospace, monospace)" } as const;

export default function SiteHeader({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  // Client-only mount flag for the portal (createPortal needs document.body).
  // useSyncExternalStore yields the server snapshot (false) during SSR and the
  // first client render, then the client snapshot (true) after hydration —
  // without a setState-in-effect (react-hooks/set-state-in-effect).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const mobileMenu =
    open && mounted
      ? createPortal(
          <nav
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="menu"
            className="mobile-nav-panel fixed inset-0 z-[100] flex flex-col gap-1 px-6 pb-6 pt-20 md:hidden"
            style={{ background: C.ink, color: C.paper }}
          >
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="py-2 text-[15px]"
                style={{ color: item.surface === active ? C.paper : C.body }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href={routes.login}
              className="py-2 text-[15px]"
              style={{ color: C.body }}
              onClick={() => setOpen(false)}
            >
              log in ↗
            </Link>
            <a
              href={marketingUrls.contact}
              className="mt-2 inline-block w-fit rounded-full px-5 py-2.5 text-[13px] font-medium"
              style={{ background: C.paper, color: C.ink }}
              onClick={() => setOpen(false)}
            >
              let&apos;s talk
            </a>
          </nav>,
          document.body,
        )
      : null;

  return (
    <>
      <header style={{ background: C.ink, borderBottom: `1px solid ${C.rule}` }} className="sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4 md:px-10">
          <Link href={routes.home} className="text-lg font-medium" style={{ color: C.paper }}>
            bmkrs<span aria-hidden className="ml-[2px] inline-block h-[0.13em] w-[0.13em] rounded-full align-baseline" style={{ background: C.orange }} />
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="main">
            {NAV.map((item) => (
              <a key={item.label} href={item.href} className="text-[13px] transition-colors" style={{ color: item.surface === active ? C.paper : C.body }}>
                {item.label}
              </a>
            ))}
            <Link href={routes.login} style={{ ...mono, color: C.body }} className="text-[12px]">log in ↗</Link>
            <a href={marketingUrls.contact} className="rounded-full px-4 py-2 text-[12px] font-medium" style={{ background: C.paper, color: C.ink }}>
              let&apos;s talk
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden"
            style={{ ...mono, color: C.paper }}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? "close menu" : "open menu"}
          >
            {open ? "close" : "menu"}
          </button>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
