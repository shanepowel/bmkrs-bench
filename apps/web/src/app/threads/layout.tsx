import { BenchChrome } from "@/components/bench-chrome";

export default function ThreadsLayout({ children }: { children: React.ReactNode }) {
  return <BenchChrome>{children}</BenchChrome>;
}
