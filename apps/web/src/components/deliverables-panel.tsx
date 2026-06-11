import { MilestoneStatus } from "@bench/database";
import { uploadDeliverable } from "@/actions/deliverables";
import { Field } from "@/components/ui/field";
import { formatFileSize, isBlobConfigured } from "@/lib/blob";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Milestone = { id: string; title: string; status: MilestoneStatus };

type Deliverable = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  notes: string | null;
  createdAt: Date;
  milestone: { id: string; title: string };
  uploader: { firstName: string; lastName: string; username: string };
};

export function DeliverablesPanel({
  contractId,
  milestones,
  deliverables,
  isTalent,
  contractActive,
}: {
  contractId: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
  isTalent: boolean;
  contractActive: boolean;
}) {
  const blobOn = isBlobConfigured();
  const uploadableMilestones = milestones.filter(
    (m) =>
      m.status === MilestoneStatus.FUNDED || m.status === MilestoneStatus.SUBMITTED
  );

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-slate-900">Deliverables</h2>
      <p className="mt-1 text-sm text-slate-600">
        {blobOn
          ? "Talent uploads files per funded milestone (max 25 MB)."
          : "Set BLOB_READ_WRITE_TOKEN to enable file uploads."}
      </p>

      <ul className="mt-6 space-y-3">
        {deliverables.map((d) => (
          <li key={d.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <a
                  href={d.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {d.fileName}
                </a>
                <p className="mt-1 text-sm text-slate-600">
                  {d.milestone.title} · {formatFileSize(d.fileSize)}
                </p>
                {d.notes && <p className="mt-1 text-sm text-slate-500">{d.notes}</p>}
              </div>
              <p className="text-xs text-slate-500">
                {d.uploader.firstName} {d.uploader.lastName}
              </p>
            </div>
          </li>
        ))}
        {deliverables.length === 0 && (
          <p className="text-sm text-slate-500">No files uploaded yet.</p>
        )}
      </ul>

      {isTalent && contractActive && uploadableMilestones.length > 0 && (
        <form
          action={uploadDeliverable}
          encType="multipart/form-data"
          className="mt-8 space-y-4 rounded-2xl border border-dashed border-slate-300 p-6"
        >
          <input type="hidden" name="contractId" value={contractId} />
          <h3 className="font-medium">Upload deliverable</h3>
          <Field label="Milestone" name="milestoneId" as="select" required>
            {uploadableMilestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </Field>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">File</span>
            <Input name="file" type="file" required className="mt-1.5" disabled={!blobOn} />
          </label>
          <Field label="Notes (optional)" name="notes" as="textarea" rows={2} />
          <Button type="submit" disabled={!blobOn}>
            Upload
          </Button>
        </form>
      )}
    </section>
  );
}
