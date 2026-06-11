import { BenchChrome } from "@/components/bench-chrome";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <BenchChrome>{children}</BenchChrome>;
}
