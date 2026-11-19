import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function PayoutsSettingsPage() {
  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-lg font-medium">payouts</h2>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        the bench uses off-platform invoicing. partners invoice clients directly; the studio
        coordinates terms. milestone payments through stripe are retired in this portal.
      </p>
      <Button asChild variant="outline">
        <Link href={routes.profile}>back to bench profile</Link>
      </Button>
    </div>
  );
}
