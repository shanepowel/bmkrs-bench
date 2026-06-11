import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "join the network | bmkrs.",
  description: "apply to join the bmkrs bench — senior specialists we would stake our name on.",
  robots: { index: false, follow: false },
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    qs.set(key, Array.isArray(value) ? value[0]! : value);
  }
  const suffix = qs.toString() ? `?${qs}` : "";
  redirect(`${routes.apply}${suffix}`);
}
