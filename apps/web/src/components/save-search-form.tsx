"use client";

import { useState } from "react";
import { saveJobSearch } from "@/actions/saved-searches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SaveSearchForm({ filtersJson }: { filtersJson: string }) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function handleSubmit(formData: FormData) {
    formData.set("filters", filtersJson);
    const result = await saveJobSearch(formData);
    setStatus(result.ok ? "ok" : "error");
  }

  if (status === "ok") {
    return <p className="text-sm text-green-700">Search saved. We will add alerts in a future update.</p>;
  }

  return (
    <form action={handleSubmit} className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <label className="block flex-1 text-sm">
        <span className="font-medium text-slate-700">Save this search</span>
        <Input name="label" required placeholder="e.g. React jobs near Manchester" className="mt-1 bg-white" />
      </label>
      <Button type="submit" variant="secondary">
        Save alert
      </Button>
      {status === "error" && (
        <p className="w-full text-sm text-red-600">Sign in to save searches.</p>
      )}
    </form>
  );
}
