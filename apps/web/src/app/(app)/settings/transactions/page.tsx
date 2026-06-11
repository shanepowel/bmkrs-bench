import Link from "next/link";
import { routes } from "@/lib/routes";

export default function TransactionsPage() {
  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold text-slate-900">transactions</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        in-platform milestone payments are retired on the bench. partners invoice off-platform;
        the studio keeps project records in threads and contracts.
      </p>
      <Link href={routes.threads} className="mt-6 inline-block text-sm font-medium text-slate-900 underline">
        open threads
      </Link>
    </div>
  );
}
