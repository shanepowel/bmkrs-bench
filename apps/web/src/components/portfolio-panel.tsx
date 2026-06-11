import { addPortfolioItem, deletePortfolioItem, listMyPortfolio } from "@/actions/portfolio";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export async function PortfolioPanel() {
  const items = await listMyPortfolio();

  return (
    <section className="mt-10 space-y-6 border-t border-slate-200 pt-10">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Portfolio</h2>
        <p className="mt-1 text-sm text-slate-600">Showcase past work on your public profile.</p>
      </div>

      {items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                {item.description && <p className="mt-1 text-sm text-slate-600">{item.description}</p>}
                {item.projectUrl && (
                  <a
                    href={item.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                  >
                    View project →
                  </a>
                )}
              </div>
              <form action={deletePortfolioItem.bind(null, item.id)}>
                <Button type="submit" variant="secondary" className="shrink-0 text-xs">
                  Remove
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={addPortfolioItem} className="space-y-3 rounded-xl border border-dashed border-slate-300 p-4">
        <p className="text-sm font-medium text-slate-900">Add portfolio item</p>
        <Field label="Title" name="title" required />
        <Field label="Description" name="description" as="textarea" />
        <Field label="Project URL" name="projectUrl" placeholder="https://…" />
        <Field label="Image URL (optional)" name="imageUrl" placeholder="https://…" />
        <Button type="submit" variant="secondary">
          Add item
        </Button>
      </form>
    </section>
  );
}
