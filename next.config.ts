import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile @base-ui/react to fix production rendering issues
  transpilePackages: ["@base-ui/react"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/auth/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
