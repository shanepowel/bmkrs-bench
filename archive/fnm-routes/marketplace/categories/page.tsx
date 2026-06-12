import Link from "next/link";
import { listCategories } from "@/actions/categories";
import { PageShell } from "@/components/layout/page-shell";
import { routes } from "@/lib/routes";

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <PageShell title="Categories" description="Browse jobs and skills by category" width="full">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) =>
          cat._count.jobs > 0 ? (
            <Link
              key={cat.id}
              href={routes.category(cat.slug)}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <h2 className="font-semibold text-slate-900">{cat.name}</h2>
              {cat.description && (
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{cat.description}</p>
              )}
              <p className="mt-2 text-sm text-slate-500">
                {cat._count.jobs} open {cat._count.jobs === 1 ? "job" : "jobs"}
              </p>
              {cat.children.length > 0 && (
                <p className="mt-3 text-xs text-slate-400">
                  {cat.children.map((c) => c.name).join(" · ")}
                </p>
              )}
            </Link>
          ) : (
            <div
              key={cat.id}
              className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6"
            >
              <h2 className="font-semibold text-slate-700">{cat.name}</h2>
              <p className="mt-2 text-sm text-slate-500">Coming soon in your area</p>
            </div>
          )
        )}
      </div>
    </PageShell>
  );
}
