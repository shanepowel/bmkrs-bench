import type { Metadata } from "next";
import { EntryChrome } from "@/components/entry-chrome";

export const metadata: Metadata = {
  title: "apply to the bench | bmkrs.",
  description: "join the bmkrs bench — senior specialists, real briefs, no bidding.",
  robots: { index: false, follow: false },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return <EntryChrome>{children}</EntryChrome>;
}
