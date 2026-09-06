import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.cloudflare.com", // Or a custom domain if they use one for R2 public bucket
      },
    ],
  },
};

export default nextConfig;
