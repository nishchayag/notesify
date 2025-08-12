import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  eslint: {
    // Only run ESLint on specific directories during build
    dirs: ["app", "components", "libs"],
  },
  transpilePackages: ["motion"],
};

export default nextConfig;
