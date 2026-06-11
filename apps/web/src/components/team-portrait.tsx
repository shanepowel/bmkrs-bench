import { C, mono } from "@/lib/bench-ui";

export function TeamPortrait({
  name,
  avatarUrl,
  size = 48,
}: {
  name: string;
  avatarUrl: string | null;
  size?: number;
}) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size, border: `1px solid ${C.paperRule}` }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center rounded-full font-medium"
      style={{
        width: size,
        height: size,
        background: C.ink,
        color: C.paper,
        fontSize: size * 0.34,
        border: `1px solid ${C.paperRule}`,
      }}
    >
      {initials}
    </span>
  );
}

export function TeamPortraitMeta({ project }: { project: string }) {
  return (
    <p style={{ ...mono, color: C.paperFaint }} className="mt-1 text-[11px]">
      on {project}
    </p>
  );
}
