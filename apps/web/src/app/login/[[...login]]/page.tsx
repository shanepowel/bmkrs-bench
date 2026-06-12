import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthSession, getCurrentUser, syncUserFromClerk } from "@/lib/auth";
import { homeForRole } from "@/lib/bench";
import { isBenchDevAuth, isClerkConfigured } from "@/lib/env";
import { routes } from "@/lib/routes";
import { ClerkLoginPanel } from "../clerk-panel";
import { ClerkSignedInWithoutBench } from "../clerk-signed-in-without-bench";
import { LoginForm } from "../login-form";

export const metadata: Metadata = {
  title: "log in | bmkrs.",
  description: "member login for the bmkrs bench — partners, clients and studio.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(isBenchDevAuth() ? routes.dashboardHome : homeForRole(user.role));
  }

  const session = await getAuthSession();
  if (session) {
    redirect(routes.dashboardHome);
  }

  if (isClerkConfigured()) {
    const { userId } = await auth();
    if (userId) {
      const synced = await syncUserFromClerk();
      if (synced) redirect(homeForRole(synced.role));
      return <ClerkSignedInWithoutBench />;
    }
    return <ClerkLoginPanel />;
  }

  return <LoginForm />;
}
