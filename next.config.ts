import type { NextConfig } from "next";
import { createSecureHeaders } from "next-secure-headers";
const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {},
          },
          xssProtection: "sanitize",
          nosniff: "nosniff",
          frameGuard: "deny",
        }),
      },
    ];
  },
};

export default nextConfig;
