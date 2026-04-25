import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to silence the multi-lockfile warning.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
