import type { NextConfig } from "next";
import { PollSrcPlugin } from "./scripts/poll-src-plugin";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  watchOptions: {
    pollIntervalMs: 1000,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
      config.plugins.push(new PollSrcPlugin());
    }
    return config;
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.104",
    "192.168.56.1",
    "172.21.112.1",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
