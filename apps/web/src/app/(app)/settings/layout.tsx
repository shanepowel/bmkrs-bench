import Link from "next/link";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-10 md:py-12">
      <h1 className="font-serif text-3xl text-slate-900">Settings</h1>
      <nav className="mt-6 flex gap-4 border-b border-slate-200 pb-px">
        <Link
          href={routes.payouts}
          className={cn(
            "border-b-2 border-blue-600 pb-2 text-sm font-medium text-blue-700"
          )}
        >
          Payouts
        </Link>
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
