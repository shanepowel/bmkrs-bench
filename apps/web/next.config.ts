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
      {
        source: "/jobs/:slug/chat/:participantId",
        destination: "/jobs/:slug/messages/:participantId",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
