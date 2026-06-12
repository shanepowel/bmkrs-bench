"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref: string;
  label?: string;
  /** When set, always navigate here instead of using browser history. */
  href?: string;
  className?: string;
};

export function BackButton({
  fallbackHref,
  label = "back",
  href,
  className = "site-back",
}: BackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link href={href} className={className}>
        <span aria-hidden>←</span> {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (typeof document !== "undefined" && document.referrer) {
          router.back();
          return;
        }
        router.push(fallbackHref);
      }}
    >
      <span aria-hidden>←</span> {label}
    </button>
  );
}
