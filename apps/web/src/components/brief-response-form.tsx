"use client";

import { useState } from "react";
import { respondToBrief } from "@/actions/briefs";
import { C, mono, PrimaryButton, TextField } from "@/lib/bench-ui";

export function BriefResponseForm({
  jobId,
  responded,
}: {
  jobId: string;
  responded: boolean;
}) {
  const [whenOpen, setWhenOpen] = useState(false);
  const [pending, setPending] = useState(false);

  if (responded) {
    return (
      <span style={{ ...mono, color: C.paperFaint }} className="text-[12px]">
        responded
      </span>
    );
  }

  async function submit(formData: FormData) {
    setPending(true);
    await respondToBrief(formData);
    setPending(false);
    setWhenOpen(false);
  }

  if (whenOpen) {
    return (
      <form action={submit} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="response" value="when" />
        <TextField name="whenNote" placeholder="free from 12 jul" required className="max-w-[180px]" />
        <PrimaryButton type="submit">{pending ? "…" : "send"}</PrimaryButton>
        <button
          type="button"
          onClick={() => setWhenOpen(false)}
          className="text-[12px] underline-offset-4 hover:underline"
          style={{ ...mono, color: C.paperFaint }}
        >
          cancel
        </button>
      </form>
    );
  }

  return (
    <span className="flex flex-wrap gap-2">
      <form action={submit}>
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="response" value="in" />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full px-4 py-1.5 text-[12px] font-medium"
          style={{ background: C.orange, color: C.ink }}
        >
          i&apos;m in
        </button>
      </form>
      <form action={submit}>
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="response" value="no" />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border px-4 py-1.5 text-[12px]"
          style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperBody }}
        >
          not this time
        </button>
      </form>
      <button
        type="button"
        disabled={pending}
        onClick={() => setWhenOpen(true)}
        className="rounded-full border px-4 py-1.5 text-[12px]"
        style={{ borderColor: "rgba(24,22,19,0.3)", color: C.paperBody }}
      >
        when?
      </button>
    </span>
  );
}
