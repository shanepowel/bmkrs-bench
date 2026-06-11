import { SignIn } from "@clerk/nextjs";
import { SetupNotice } from "@/components/setup-notice";
import { isClerkConfigured } from "@/lib/env";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <SetupNotice title="Sign-in is not configured">
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
      <SignIn />
    </div>
  );
}
