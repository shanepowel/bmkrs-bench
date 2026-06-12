import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(rootDir, "../.."),
  turbopack: {
    root: path.join(rootDir, "../.."),
  },
  transpilePackages: ["@bench/database"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    turbopackFileSystemCacheForDev: true,
  },
  async redirects() {
    return [
      { source: "/dashboard", destination: "/home", permanent: false },
      { source: "/about", destination: "/", permanent: true },
      { source: "/how-it-works", destination: "/", permanent: true },
      { source: "/jobs", destination: "/studio/briefs", permanent: false },
      { source: "/jobs/:path*", destination: "/studio/briefs", permanent: false },
      { source: "/talents", destination: "/studio/bench", permanent: false },
      { source: "/talents/:path*", destination: "/studio/bench", permanent: false },
      { source: "/categories", destination: "/studio/bench", permanent: false },
      { source: "/categories/:path*", destination: "/studio/bench", permanent: false },
      { source: "/freelancers/:username", destination: "/partners/:username", permanent: true },
      { source: "/hire/:skill", destination: "/hire", permanent: false },
      {
        source: "/jobs/:slug/chat/:participantId",
        destination: "/studio/briefs",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
