"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { promotePartnerStatus } from "@/actions/pipeline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type PipelineTransition = {
  toStatus: string;
  label: string;
  primary: boolean;
};

export function PipelinePromotePanel({
  talentProfileId,
  transitions,
}: {
  talentProfileId: string;
  transitions: PipelineTransition[];
}) {
  const [openStatus, setOpenStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (transitions.length === 0) return null;

  return (
    <div className="space-y-3 rounded-xl border border-border p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        change status
      </p>
      <div className="flex flex-wrap gap-2">
        {transitions.map((transition) => (
          <Dialog
            key={transition.toStatus}
            open={openStatus === transition.toStatus}
            onOpenChange={(open) => setOpenStatus(open ? transition.toStatus : null)}
          >
            <DialogTrigger asChild>
              <Button variant={transition.primary ? "default" : "outline"} size="sm">
                {transition.label}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-paper sm:max-w-md">
              <form
                action={(formData) => {
                  startTransition(async () => {
                    try {
                      await promotePartnerStatus(formData);
                      toast.success("status updated");
                      setOpenStatus(null);
                    } catch (error) {
                      if (error && typeof error === "object" && "digest" in error) {
                        const digest = String((error as { digest?: string }).digest ?? "");
                        if (digest.startsWith("NEXT_REDIRECT")) {
                          toast.success("status updated");
                          return;
                        }
                      }
                      toast.error(error instanceof Error ? error.message : "update failed");
                    }
                  });
                }}
              >
                <DialogHeader>
                  <DialogTitle className="lowercase">{transition.label}</DialogTitle>
                  <DialogDescription>
                    a short reason is required — it becomes part of the partner&apos;s studio history.
                  </DialogDescription>
                </DialogHeader>
                <input type="hidden" name="talentProfileId" value={talentProfileId} />
                <input type="hidden" name="toStatus" value={transition.toStatus} />
                <div className="grid gap-1.5 py-4">
                  <Label htmlFor={`reason-${transition.toStatus}`}>reason</Label>
                  <Textarea
                    id={`reason-${transition.toStatus}`}
                    name="reason"
                    required
                    rows={3}
                    placeholder="portfolio strong, references checked, trial brief completed"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={pending}>
                    {pending ? "saving…" : "confirm"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
