import { BenchChrome } from "@/components/bench-chrome";
import { AppNav } from "@/components/layout/app-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BenchChrome>
      <div className="mx-auto max-w-6xl border-b border-slate-100 px-4 pt-4">
        <AppNav />
      </div>
      {children}
    </BenchChrome>
  );
}
