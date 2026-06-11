"use client";

import { useState } from "react";
import { submitProposal } from "@/actions/proposals";
import { Button } from "@/components/ui/button";

export function ProposalForm({ jobId }: { jobId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await submitProposal(formData);
    setPending(false);
    if (result?.error) setError(result.error);
    else window.location.reload();
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <input type="hidden" name="jobId" value={jobId} />
      <h3 className="text-lg font-semibold">Submit your proposal</h3>
      <label className="block text-sm">
        <span className="font-medium">Cover letter</span>
        <textarea
          name="coverLetter"
          required
          minLength={20}
          rows={5}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          placeholder="Why you're a great fit…"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Your bid ($)</span>
          <input
            name="bidAmount"
            type="number"
            min={1}
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Delivery (days)</span>
          <input
            name="deliveryDays"
            type="number"
            min={1}
            max={365}
            required
            defaultValue={14}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit proposal"}
      </Button>
    </form>
  );
}
