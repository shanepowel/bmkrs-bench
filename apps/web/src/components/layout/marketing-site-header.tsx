"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { BackButton } from "@/components/layout/back-button";
import { marketingUrls } from "@/lib/marketing-urls";
import { routes } from "@/lib/routes";

const MARKETING_NAV = [
  { label: "work", href: marketingUrls.work },
  { label: "services", href: marketingUrls.services },
  { label: "motion", href: marketingUrls.motion },
  { label: "network", href: marketingUrls.network },
  { label: "journal", href: marketingUrls.journal },
  { label: "about", href: marketingUrls.about },
] as const;

type BenchNavItem = { href: string; label: string };

export function MarketingSiteHeader({
  accountSlot,
  benchNav,
}: {
  accountSlot?: React.ReactNode;
  benchNav?: BenchNavItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onHome = pathname === routes.home;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-start">
          {onHome ? (
            <BackButton
              fallbackHref={marketingUrls.studio}
              label="bmkrs.com"
              href={marketingUrls.studio}
            />
          ) : (
            <BackButton fallbackHref={marketingUrls.studio} label="back" />
          )}
          <Link href={marketingUrls.studio} className="wordmark" aria-label="bmkrs, home">
            <Logo variant="wordmark-light" href={undefined} />
          </Link>
        </div>

        <nav className="site-nav" aria-label="primary">
          {MARKETING_NAV.map((item) => (
            <a key={item.href} href={item.href} rel="noopener noreferrer">
              {item.label}
            </a>
          ))}
          {accountSlot ?? (
            <Link href={routes.login} className="nav-login">
              log in
            </Link>
          )}
          <a href={marketingUrls.contact} className="btn-primary nav-cta">
            let&apos;s talk
          </a>
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "close menu" : "open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "close" : "menu"}
        </button>
      </div>

      {benchNav && benchNav.length > 0 ? (
        <nav className="site-bench-nav" aria-label="bench">
          {benchNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}

      {open ? (
        <nav id="mobile-nav" className="mobile-nav" aria-label="primary">
          {MARKETING_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {accountSlot ?? (
            <Link href={routes.login} onClick={() => setOpen(false)}>
              log in
            </Link>
          )}
          <a
            href={marketingUrls.contact}
            className="btn-primary"
            onClick={() => setOpen(false)}
          >
            let&apos;s talk
          </a>
        </nav>
      ) : null}
    </header>
  );
}
