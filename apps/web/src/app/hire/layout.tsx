import type { Metadata } from "next";
import { EntryChrome } from "@/components/entry-chrome";

export const metadata: Metadata = {
  title: "hire from the bench | bmkrs.",
  description:
    "hire senior bmkrs partners — references checked, track records visible, matched by a human who knows the bench.",
  robots: { index: false, follow: false },
};

export default function HireLayout({ children }: { children: React.ReactNode }) {
  return <EntryChrome>{children}</EntryChrome>;
}
