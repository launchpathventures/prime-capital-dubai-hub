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
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ebirxyrjwaulyqizcbcs.supabase.co",
      },
      {
        protocol: "https",
        hostname: "api.mapbox.com",
      },
      {
        protocol: "https",
        hostname: "vhgtbeimnkitqgekvtrz.supabase.co",
      },
      {
        protocol: "https",
        hostname: "pplx-res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "static.propsearch.ae",
      },
      {
        protocol: "https",
        hostname: "skyviewdubai.com",
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://plus.unsplash.com https://ebirxyrjwaulyqizcbcs.supabase.co https://vhgtbeimnkitqgekvtrz.supabase.co https://api.mapbox.com https://pplx-res.cloudinary.com https://static.propsearch.ae https://skyviewdubai.com; font-src 'self'; media-src 'self' https://vhgtbeimnkitqgekvtrz.supabase.co; connect-src 'self' https://ebirxyrjwaulyqizcbcs.supabase.co https://vhgtbeimnkitqgekvtrz.supabase.co https://api.mapbox.com https://va.vercel-scripts.com; frame-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
