export type SurfaceTheme = "ink" | "paper" | "orange";

export const SURFACE = {
  ink: {
    bg: "#181613",
    heading: "#F1EFE8",
    body: "#D3D1C7",
    meta: "#B4B2A9",
    rule: "rgba(241,239,232,0.16)",
    accent: "#FF4D00",
  },
  paper: {
    bg: "#F1EFE8",
    heading: "#181613",
    body: "#444441",
    meta: "#5F5E5A",
    rule: "rgba(24,22,19,0.15)",
    accent: "#FF4D00",
  },
  orange: {
    bg: "#FF4D00",
    heading: "#181613",
    body: "#2C1005",
    meta: "#4A1B0C",
    rule: "rgba(24,22,19,0.25)",
    accent: "#181613",
  },
} as const;

export function surfaceVars(theme: SurfaceTheme) {
  const s = SURFACE[theme];
  return {
    "--surface-bg": s.bg,
    "--surface-heading": s.heading,
    "--surface-body": s.body,
    "--surface-meta": s.meta,
    "--surface-rule": s.rule,
    "--surface-accent": s.accent,
  } as Record<string, string>;
}
