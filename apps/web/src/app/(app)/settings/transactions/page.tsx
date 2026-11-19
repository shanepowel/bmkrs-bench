import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function TransactionsPage() {
  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-lg font-medium">transactions</h2>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        in-platform milestone payments are retired on the bench. partners invoice off-platform; the
        studio keeps project records in threads.
      </p>
      <Button asChild variant="outline">
        <Link href={routes.threads}>open threads</Link>
      </Button>
    </div>
  );
}
