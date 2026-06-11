import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "info" | "muted";

const variants: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-900",
  info: "bg-blue-100 text-blue-800",
  muted: "bg-slate-200 text-slate-600",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
