import { addPortfolioItem, deletePortfolioItem, listMyPortfolio } from "@/actions/portfolio";
import { C, Label, mono, PrimaryButton, TextArea, TextField } from "@/lib/bench-ui";

export async function BenchPortfolioPanel() {
  const items = await listMyPortfolio();

  return (
    <section className="mt-10 space-y-6" style={{ borderTop: `1px solid ${C.paperRule}`, paddingTop: "2rem" }}>
      <div>
        <h2 className="text-xl font-medium">portfolio</h2>
        <p className="mt-1 text-[14px]" style={{ color: C.paperFaint }}>
          work the studio and clients can point at. links only — no uploads yet.
        </p>
      </div>

      {items.length > 0 && (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-4 py-4"
              style={{ borderTop: `1px solid ${C.paperRule}` }}
            >
              <div>
                <p className="font-medium">{item.title.toLowerCase()}</p>
                {item.description && (
                  <p className="mt-1 text-[14px]" style={{ color: C.paperBody }}>
                    {item.description}
                  </p>
                )}
                {item.projectUrl && (
                  <a
                    href={item.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[12px] hover:underline"
                    style={{ ...mono, color: C.orange }}
                  >
                    {item.projectUrl}
                  </a>
                )}
              </div>
              <form action={deletePortfolioItem.bind(null, item.id)}>
                <button
                  type="submit"
                  className="rounded-full border px-4 py-2 text-[12px]"
                  style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperFaint }}
                >
                  remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={addPortfolioItem} className="space-y-3 p-5" style={{ border: `1px solid ${C.paperRule}` }}>
        <p style={{ ...mono, color: C.paperBody }} className="text-[12px]">
          add work
        </p>
        <div>
          <Label>title</Label>
          <TextField name="title" required />
        </div>
        <div>
          <Label>one line</Label>
          <TextArea name="description" rows={2} />
        </div>
        <div>
          <Label>url</Label>
          <TextField name="projectUrl" placeholder="https://" />
        </div>
        <PrimaryButton type="submit">add</PrimaryButton>
      </form>
    </section>
  );
}
