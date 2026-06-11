import { Badge } from "@/components/ui/badge";

const labels: Record<string, { label: string; variant: "success" | "warning" | "muted" }> = {
  open: { label: "Available", variant: "success" },
  limited: { label: "Limited", variant: "warning" },
  unavailable: { label: "Unavailable", variant: "muted" },
};

export function AvailabilityBadge({ availability }: { availability?: string | null }) {
  const key = availability ?? "open";
  const config = labels[key] ?? labels.open;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
