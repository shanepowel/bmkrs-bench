import { MarketingSiteHeader } from "@/components/layout/marketing-site-header";

export function EntryChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingSiteHeader />
      {children}
    </>
  );
}
