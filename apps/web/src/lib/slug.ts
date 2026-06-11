export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(base: string, suffix?: string) {
  const s = slugify(base);
  if (!suffix) return s;
  return `${s}-${suffix.slice(0, 8)}`;
}
