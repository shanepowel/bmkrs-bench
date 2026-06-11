import { UserRole } from "@bench/database";
import {
  getTalentStripeStatus,
  refreshStripeConnectStatus,
  startStripeConnectOnboarding,
} from "@/actions/stripe-connect";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";

export default async function PayoutsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; refresh?: string }>;
}) {
  await requireRole(UserRole.TALENT);
  const params = await searchParams;

  if (params.connected || params.refresh) {
    await refreshStripeConnectStatus();
  }

  const status = await getTalentStripeStatus();

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">Stripe payouts</h2>
      <p className="mt-2 text-sm text-slate-600">
        Connect Stripe to receive milestone payments when clients approve your work.
      </p>

      {!status.configured && (
        <Alert variant="warning" className="mt-6">
          Stripe is not configured. Add <code className="text-xs">STRIPE_SECRET_KEY</code> to enable
          payouts in this environment.
        </Alert>
      )}

      {status.configured && (
        <Card className="mt-6">
          <CardBody className="space-y-4">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Account</dt>
                <dd className="truncate font-mono text-xs">{status.accountId ?? "Not connected"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Charges enabled</dt>
                <dd>{status.chargesEnabled ? "Yes" : "No"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Payouts enabled</dt>
                <dd>{status.payoutsEnabled ? "Yes" : "No"}</dd>
              </div>
            </dl>

            {status.ready ? (
              <Alert variant="success">You&apos;re ready to receive payments.</Alert>
            ) : (
              <form action={startStripeConnectOnboarding}>
                <Button type="submit" className="w-full">
                  {status.accountId ? "Complete Stripe setup" : "Connect with Stripe"}
                </Button>
              </form>
            )}

            {status.accountId && (
              <form action={refreshStripeConnectStatus}>
                <Button type="submit" variant="secondary" className="w-full">
                  Refresh status
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
