import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
      <p className="font-medium text-slate-900">{title}</p>
      {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
      {action && (
        <Link href={action.href} className="mt-4 inline-block">
          <Button type="button">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
