import { SiteHeader } from "@/components/site-header";

export function BenchChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
