import { C, mono } from "@/lib/bench-ui";

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return Math.abs(h);
}

const PALETTES = [
  { bg: "#FF4D00", fg: "#181613", accent: "#F1EFE8" },
  { bg: "#181613", fg: "#F1EFE8", accent: "#FF4D00" },
  { bg: "#444441", fg: "#F1EFE8", accent: "#FF4D00" },
  { bg: "#D3D1C7", fg: "#181613", accent: "#FF4D00" },
] as const;

export function TeamPortrait({
  name,
  avatarUrl,
  size = 48,
}: {
  name: string;
  avatarUrl: string | null;
  size?: number;
}) {
  const palette = PALETTES[hashName(name) % PALETTES.length];
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
        style={{ width: size, height: size, border: `2px solid ${palette.accent}` }}
      />
    );
  }

  const eyeY = size * 0.38;
  const eyeSize = size * 0.07;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      className="shrink-0 rounded-full"
      style={{ border: `2px solid ${palette.accent}` }}
    >
      <rect width={size} height={size} rx={size / 2} fill={palette.bg} />
      <circle cx={size * 0.35} cy={eyeY} r={eyeSize} fill={palette.fg} opacity={0.85} />
      <circle cx={size * 0.65} cy={eyeY} r={eyeSize} fill={palette.fg} opacity={0.85} />
      <path
        d={`M ${size * 0.32} ${size * 0.62} Q ${size * 0.5} ${size * 0.72} ${size * 0.68} ${size * 0.62}`}
        stroke={palette.fg}
        strokeWidth={size * 0.04}
        fill="none"
        opacity={0.7}
      />
      <text
        x={size / 2}
        y={size * 0.92}
        textAnchor="middle"
        fill={palette.fg}
        fontSize={size * 0.18}
        fontFamily="var(--font-mono, monospace)"
        opacity={0.9}
      >
        {initials}
      </text>
    </svg>
  );
}

export function TeamPortraitMeta({ project }: { project: string }) {
  return (
    <p style={{ ...mono, color: C.paperFaint }} className="mt-1 text-[11px]">
      on {project}
    </p>
  );
}
