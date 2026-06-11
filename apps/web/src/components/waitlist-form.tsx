"use client";

import { useState } from "react";
import { joinWaitlist } from "@/actions/waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WaitlistForm({
  categoryId,
  defaultPostcode,
}: {
  categoryId?: string;
  defaultPostcode?: string;
}) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setStatus("idle");
    setError(null);
    const result = await joinWaitlist(formData);
    if (result.ok) {
      setStatus("ok");
    } else {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
    }
  }

  if (status === "ok") {
    return (
      <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
        You are on the list. We will email you when we launch in your area.
      </p>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name="categoryId" value={categoryId ?? ""} />
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Email</span>
        <Input name="email" type="email" required className="mt-1 bg-white" placeholder="you@example.com" />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Postcode</span>
        <Input
          name="postcode"
          defaultValue={defaultPostcode}
          className="mt-1 bg-white"
          placeholder="e.g. M1 1AA"
        />
      </label>
      <fieldset className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="radio" name="role" value="client" defaultChecked />
          I want to hire
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="role" value="talent" />
          I want to work
        </label>
      </fieldset>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit">Notify me</Button>
    </form>
  );
}
