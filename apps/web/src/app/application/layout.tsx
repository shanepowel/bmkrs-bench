import { BenchChrome } from "@/components/bench-chrome";

export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  return <BenchChrome>{children}</BenchChrome>;
}
