"use server";

import { prisma } from "@bench/database";

export async function listSkills() {
  return prisma.skill.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}
