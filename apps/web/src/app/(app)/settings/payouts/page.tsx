import Link from "next/link";
import { routes } from "@/lib/routes";

export default function PayoutsSettingsPage() {
  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold text-slate-900">payments</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        the bench uses off-platform invoicing. partners invoice clients directly; the studio
        coordinates terms. milestone payments through stripe are retired in this portal.
      </p>
      <Link href={routes.profile} className="mt-6 inline-block text-sm font-medium text-slate-900 underline">
        back to bench profile
      </Link>
    </div>
  );
}
