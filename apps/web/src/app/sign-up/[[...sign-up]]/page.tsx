import { SignUp } from "@clerk/nextjs";
import { SetupNotice } from "@/components/setup-notice";
import { isClerkConfigured } from "@/lib/env";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const onboardingUrl =
    role === "client" || role === "talent" || role === "applicant"
      ? `/onboarding?role=${role}`
      : "/onboarding";
  if (!isClerkConfigured()) {
    return (
      <SetupNotice title="Sign-up is not configured">
        <p>
          Add <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{" "}
          <code className="rounded bg-slate-100 px-1">CLERK_SECRET_KEY</code> in Vercel → Environment
          Variables, then redeploy.
        </p>
      </SetupNotice>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <SignUp forceRedirectUrl={onboardingUrl} signInForceRedirectUrl="/dashboard" />
    </div>
  );
}
