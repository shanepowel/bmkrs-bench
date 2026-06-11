import { cn } from "@/lib/utils";
import { BackLink } from "@/components/layout/back-link";

type PageShellProps = {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
  width?: "md" | "lg" | "xl" | "2xl" | "full";
  children: React.ReactNode;
};

const widths = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
  full: "max-w-6xl",
};

export function PageShell({
  title,
  description,
  back,
  actions,
  width = "lg",
  children,
}: PageShellProps) {
  return (
    <div className={cn("mx-auto px-4 py-10 md:py-12", widths[width])}>
      {back && (
        <div className="mb-6">
          <BackLink href={back.href}>{back.label}</BackLink>
        </div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-slate-900 md:text-4xl">{title}</h1>
          {description && <p className="mt-2 text-slate-600">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
