"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createStudioBrief } from "@/actions/briefs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type InvitePartner = {
  userId: string;
  name: string;
  disciplines: string[];
};

export function BriefComposerForm({ partners }: { partners: InvitePartner[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  function toggle(userId: string) {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  return (
    <form
      action={(formData) => {
        if (selected.length === 0) {
          toast.error("invite at least one partner");
          return;
        }
        startTransition(async () => {
          try {
            await createStudioBrief(formData);
          } catch (error) {
            // Next.js redirect throws; ignore NEXT_REDIRECT
            if (error && typeof error === "object" && "digest" in error) {
              const digest = String((error as { digest?: string }).digest ?? "");
              if (digest.startsWith("NEXT_REDIRECT")) return;
            }
            toast.error(error instanceof Error ? error.message : "could not send brief");
          }
        });
      }}
      className="max-w-2xl space-y-5"
    >
      <div className="grid gap-1.5">
        <Label htmlFor="title">project title</Label>
        <Input id="title" name="title" placeholder="project copper" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="description">brief</Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          placeholder="what needs doing, by when, and what good looks like…"
          required
          className="min-h-32"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="budgetMin">budget min (£)</Label>
          <Input id="budgetMin" name="budgetMin" type="number" defaultValue="3000" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="budgetMax">budget max (£)</Label>
          <Input id="budgetMax" name="budgetMax" type="number" defaultValue="6000" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="deliveryDays">delivery (days)</Label>
          <Input id="deliveryDays" name="deliveryDays" type="number" defaultValue="14" required />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label>invite partners</Label>
          <p className="mt-1 text-[13px] text-muted-foreground">
            pick from the bench. they see yes / no / when on their home.
          </p>
        </div>
        <div className="divide-y divide-border border-t border-border">
          {partners.map((p) => {
            const on = selected.includes(p.userId);
            return (
              <label
                key={p.userId}
                className="flex cursor-pointer items-center gap-3 py-3"
              >
                <Checkbox
                  checked={on}
                  onCheckedChange={() => toggle(p.userId)}
                  aria-label={`invite ${p.name}`}
                />
                {on ? <input type="hidden" name="partnerIds" value={p.userId} /> : null}
                <span className="font-medium">{p.name}</span>
                <span className="font-mono text-[12px] text-muted-foreground">
                  {p.disciplines.join(" · ")}
                </span>
              </label>
            );
          })}
          {partners.length === 0 ? (
            <p className="py-4 text-[14px] text-muted-foreground">no trusted partners to invite yet.</p>
          ) : null}
        </div>
      </div>

      <Button type="submit" size="lg" disabled={pending || partners.length === 0}>
        {pending ? "sending…" : "send brief invites"}
      </Button>
    </form>
  );
}
