import type { Metadata } from "next";
import { isClerkConfigured } from "@/lib/env";
import { ClerkLoginPanel } from "./clerk-panel";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "log in | bmkrs.",
  description: "member login for the bmkrs bench — partners, clients and studio.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  if (isClerkConfigured()) {
    return <ClerkLoginPanel />;
  }

  return <LoginForm />;
}
