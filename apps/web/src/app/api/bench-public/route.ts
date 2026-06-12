// Anonymised live slice for the home page — names off, everything else real.
import { NextResponse } from "next/server";
import { getBenchPublicSlice } from "@/lib/bench-public-data";

export const revalidate = 3600;

export async function GET() {
  // TODO supabase (public view, no auth): discipline summary from trusted/core
  // partners — never name, never rate. Pulse composes from real counts only;
  // if the week is genuinely quiet, hide the block rather than pad it.
  const slice = await getBenchPublicSlice();
  return NextResponse.json(slice);
}
