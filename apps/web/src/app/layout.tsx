import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fragment_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
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
  title: "the bench · bmkrs",
  description: "trusted partners, real projects, no theatre.",
  icons: { icon: "/logo/bmkrs-icon-dark.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = getClerkPublishableKey();
  const hasClerk = isClerkConfigured();

  const inner = (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </>
  );

  return (
    <html lang="en-GB" className={fragmentMono.variable}>
      <body className="flex min-h-screen flex-col">
        {hasClerk && publishableKey ? (
          <ClerkProvider publishableKey={publishableKey}>{inner}</ClerkProvider>
        ) : (
          inner
        )}
      </body>
    </html>
  );
}
