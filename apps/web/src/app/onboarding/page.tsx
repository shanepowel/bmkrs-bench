import { redirect } from "next/navigation";
import { completeOnboarding } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/auth";
import { homeForRole } from "@/lib/bench";

const RATE_BANDS = ["£250–350/day", "£350–450/day", "£450–550/day", "£550–700/day", "£700+/day"];

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role: roleParam } = await searchParams;
  const user = await getCurrentUser();
  if (user && user.username && user.firstName !== "User") {
    redirect(homeForRole(user.role));
  }

  const defaultRole =
    roleParam === "client" ? "client" : roleParam === "applicant" ? "applicant" : "talent";

  return (
    <main className="min-h-dvh bg-paper text-foreground">
      <div className="mx-auto max-w-lg px-4 py-12 md:py-16">
        <p className="mb-3 font-mono text-[12px] tracking-[0.08em] text-orange lowercase">
          the bench
        </p>
        <h1 className="text-h3 font-medium tracking-tight">complete your profile.</h1>
        <p className="mt-3 max-w-[42ch] text-[15px] text-muted-foreground">
          tell us how you will use the bench. partners set a day-rate band — not an hourly marketplace
          rate.
        </p>

        <form action={completeOnboarding} className="mt-8 space-y-5">
          {defaultRole === "applicant" ? (
            <input type="hidden" name="role" value="applicant" />
          ) : (
            <fieldset className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="client"
                  defaultChecked={defaultRole === "client"}
                  className="peer sr-only"
                />
                <span className="block rounded-full py-2.5 text-center text-sm font-medium text-muted-foreground transition peer-checked:bg-card peer-checked:text-foreground peer-checked:shadow-sm">
                  client
                </span>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="talent"
                  defaultChecked={defaultRole === "talent"}
                  className="peer sr-only"
                />
                <span className="block rounded-full py-2.5 text-center text-sm font-medium text-muted-foreground transition peer-checked:bg-card peer-checked:text-foreground peer-checked:shadow-sm">
                  partner
                </span>
              </label>
            </fieldset>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="firstName">first name</Label>
              <Input id="firstName" name="firstName" required autoComplete="given-name" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lastName">last name</Label>
              <Input id="lastName" name="lastName" required autoComplete="family-name" />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="username">username</Label>
            <Input id="username" name="username" required placeholder="your-name" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="postcode">postcode</Label>
            <Input id="postcode" name="postcode" placeholder="e.g. SW1A 1AA" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="city">city</Label>
              <Input id="city" name="city" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="country">country</Label>
              <Input
                id="country"
                name="country"
                placeholder="United Kingdom"
                defaultValue="United Kingdom"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="companyName">company (optional)</Label>
            <Input id="companyName" name="companyName" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="headline">headline (partner)</Label>
            <Input id="headline" name="headline" placeholder="e.g. brand systems designer" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="dayRateBand">day rate band (partner)</Label>
            <Select id="dayRateBand" name="dayRateBand" defaultValue="">
              <option value="" disabled>
                select a band
              </option>
              {RATE_BANDS.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </Select>
          </div>

          <Button type="submit" size="lg" className="w-full">
            continue to dashboard
          </Button>
        </form>
      </div>
    </main>
  );
}
