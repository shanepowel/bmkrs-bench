export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export const ALLOWED_MIME_PREFIXES = [
  "image/",
  "application/pdf",
  "text/",
  "application/zip",
  "application/vnd.",
  "application/msword",
  "application/vnd.openxmlformats",
];

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isAllowedMimeType(mime: string) {
  return ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p));
}
