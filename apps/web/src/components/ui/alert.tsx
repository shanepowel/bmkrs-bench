import { cn } from "@/lib/utils";

type AlertVariant = "success" | "warning" | "info";

const variants: Record<AlertVariant, string> = {
  success: "border-green-200 bg-green-50 text-green-900",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

export function Alert({
  variant = "info",
  children,
  className,
}: {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("rounded-xl border p-4 text-sm", variants[variant], className)}>
      {children}
    </p>
  );
}
