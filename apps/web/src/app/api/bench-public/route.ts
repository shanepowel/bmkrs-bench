// app/api/bench-public/route.ts — anonymised live slice for the home hero.
// names off, rates off; discipline, specialism, trust, availability, count.
import { NextResponse } from "next/server";
import { getBenchPublicSlice } from "@/lib/bench-public-data";

export const revalidate = 3600;

export async function GET() {
  // TODO supabase (public, no auth): aggregate partners where status in
  // ('trusted','core') into discipline rows. never name, never rate.
  const slice = await getBenchPublicSlice();
  return NextResponse.json(slice);
}
