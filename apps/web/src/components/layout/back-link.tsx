import Link from "next/link";

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="site-back inline-flex items-center gap-1">
      <span aria-hidden>←</span>
      {children}
    </Link>
  );
}
