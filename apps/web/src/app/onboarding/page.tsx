import { redirect } from "next/navigation";
import { completeOnboarding } from "@/actions/onboarding";
import { PageShell } from "@/components/layout/page-shell";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { homeForRole } from "@/lib/bench";
import { routes } from "@/lib/routes";

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
    <PageShell
      title="complete your profile"
      description="tell us how you will use the bench"
      width="md"
    >
      <form action={completeOnboarding} className="space-y-4">
        {defaultRole === "applicant" ? (
          <input type="hidden" name="role" value="applicant" />
        ) : (
          <fieldset className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value="client"
                defaultChecked={defaultRole === "client"}
                className="peer sr-only"
              />
              <span className="block rounded-lg py-2.5 text-center text-sm font-semibold text-slate-600 transition peer-checked:bg-white peer-checked:text-blue-700 peer-checked:shadow-sm">
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
              <span className="block rounded-lg py-2.5 text-center text-sm font-semibold text-slate-600 transition peer-checked:bg-white peer-checked:text-blue-700 peer-checked:shadow-sm">
                partner
              </span>
            </label>
          </fieldset>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" name="firstName" required />
          <Field label="Last name" name="lastName" required />
        </div>
        <Field label="Username" name="username" required placeholder="your-name" />
        <Field label="Postcode" name="postcode" placeholder="e.g. SW1A 1AA" />
        <Field label="Country" name="country" placeholder="United Kingdom" />
        <Field label="City" name="city" />
        <Field label="Company (optional)" name="companyName" />
        <Field label="Headline (talent)" name="headline" placeholder="e.g. Full-stack developer" />
        <Field label="Hourly rate $ (talent)" name="hourlyRate" type="number" />
        <Button type="submit" className="w-full">
          Continue to dashboard
        </Button>
      </form>
    </PageShell>
  );
}
