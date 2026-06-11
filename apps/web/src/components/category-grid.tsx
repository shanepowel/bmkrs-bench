import Link from "next/link";
import { listCategories } from "@/actions/categories";
import { routes } from "@/lib/routes";

export async function CategoryGrid() {
  const categories = (await listCategories()).filter((cat) => cat._count.jobs > 0);
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-serif text-3xl text-slate-900">Browse by category</h2>
      <p className="mt-2 text-slate-600">Find projects and talent in your field</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={routes.category(cat.slug)}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">{cat.name}</h3>
            {cat.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{cat.description}</p>
            )}
            <p className="mt-2 text-sm text-slate-500">
              {cat._count.jobs} {cat._count.jobs === 1 ? "job" : "jobs"}
              {cat.isLocal ? " · Local" : ""}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
