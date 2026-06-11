"use server";

import { prisma } from "@bench/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import type { JobFilters } from "@/actions/jobs";

const saveSchema = z.object({
  label: z.string().min(1).max(120),
  filters: z.string(),
});

export async function saveJobSearch(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  const parsed = saveSchema.safeParse({
    label: formData.get("label"),
    filters: formData.get("filters"),
  });

  if (!parsed.success) return { ok: false, error: "Invalid search data." };

  let filters: JobFilters;
  try {
    filters = JSON.parse(parsed.data.filters) as JobFilters;
  } catch {
    return { ok: false, error: "Invalid search filters." };
  }

  await prisma.savedSearch.create({
    data: {
      userId: user.id,
      label: parsed.data.label,
      filters,
    },
  });

  revalidatePath("/jobs");
  return { ok: true };
}

export async function getMySavedSearches() {
  const user = await requireUser();
  return prisma.savedSearch.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}
