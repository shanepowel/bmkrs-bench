import {
  addApplicationPortfolioItem,
  deleteApplicationPortfolioItem,
  listApplicationPortfolio,
} from "@/actions/application-portfolio";
import { BenchField } from "@/components/bench-field";
import { Body } from "@/components/surfaces";

export async function ApplicationPortfolioPanel() {
  const items = await listApplicationPortfolio();

  return (
    <section className="space-y-6 border-t border-[color:var(--surface-rule)] pt-8">
      <div>
        <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
          portfolio links
        </p>
        <Body className="mt-2 text-[var(--surface-meta)]">
          at least one live project url. work you are proud to stand behind.
        </Body>
      </div>

      {items.length > 0 && (
        <ul className="divide-y divide-[color:var(--surface-rule)]">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-body text-[var(--surface-heading)]">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-body text-[var(--surface-body)]">{item.description}</p>
                )}
                {item.projectUrl && (
                  <a
                    href={item.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-mono text-meta text-[var(--surface-accent)] hover:underline"
                  >
                    {item.projectUrl}
                  </a>
                )}
              </div>
              <form action={deleteApplicationPortfolioItem.bind(null, item.id)}>
                <button
                  type="submit"
                  className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)] hover:text-[var(--surface-heading)]"
                >
                  remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={addApplicationPortfolioItem} className="space-y-4 border border-dashed border-[color:var(--surface-rule)] p-5">
        <p className="font-mono text-meta uppercase tracking-[0.08em] text-[var(--surface-meta)]">
          add work
        </p>
        <BenchField label="title" name="title" required placeholder="brand refresh for acme" />
        <BenchField label="url" name="projectUrl" required placeholder="https://" />
        <BenchField label="one line" name="description" placeholder="what you did, in plain language" />
        <button
          type="submit"
          className="border border-[color:var(--surface-rule)] px-5 py-2.5 text-body text-[var(--surface-heading)] hover:border-[var(--surface-accent)]"
        >
          add link
        </button>
      </form>
    </section>
  );
}
