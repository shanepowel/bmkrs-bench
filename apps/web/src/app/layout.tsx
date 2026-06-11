import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fragment_Mono } from "next/font/google";
import { getClerkPublishableKey, isClerkConfigured } from "@/lib/env-clerk";
import "./globals.css";

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "the bench | bmkrs.",
  description: "trusted partners, real projects, no theatre.",
  icons: { icon: "/logo/bmkrs-icon-dark.svg" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = getClerkPublishableKey();
  const hasClerk = isClerkConfigured();

  const inner = <div className="flex min-h-screen flex-col">{children}</div>;

  return (
    <html lang="en-GB" className={fragmentMono.variable}>
      <body className="flex min-h-screen flex-col" style={{ fontFamily: "var(--font-sans)" }}>
        {hasClerk && publishableKey ? (
          <ClerkProvider publishableKey={publishableKey}>{inner}</ClerkProvider>
        ) : (
          inner
        )}
      </body>
    </html>
  );
}
