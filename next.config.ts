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
        // AgentCRM property-images bucket (CRM is the source of truth)
        protocol: "https",
        hostname: "uozpalmasfxjsxhfyghn.supabase.co",
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
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "api.reelly.io",
      },
    ],
  },
  async redirects() {
    // Hostname-scoped 301s for the Tahir surface. These cover legacy
    // Squarespace URLs and event-specific landing pages that have been
    // folded back into the main site. The `has` matcher keeps these
    // redirects scoped to tahirmajithia.com so the same paths can still
    // exist on other brands.
    const tahirHost = {
      type: "host" as const,
      value: "(www\\.)?tahirmajithia\\.com",
    };
    const tahirRedirects = [
      { from: "/home", to: "/" },
      { from: "/property-services", to: "/services" },
      { from: "/connect", to: "/contact" },
      { from: "/feedback", to: "/contact" },
      { from: "/checkin", to: "/contact" },
      { from: "/glasgow-checkin", to: "/" },
      { from: "/strategy-kit-thank-you", to: "/strategy-kit/thank-you" },
      { from: "/consultation-thank-you", to: "/consultation/thank-you" },
      { from: "/glasgow-event-april-2025", to: "/" },
      { from: "/1-to-1-glasgow-event-april-2025", to: "/" },
      { from: "/1-to-1-london-event-april-2025", to: "/" },
      { from: "/dubai-property-market-live-qa-with-tahir-majithia", to: "/" },
    ].map((entry) => ({
      source: entry.from,
      destination: entry.to,
      permanent: true,
      has: [tahirHost],
    }));

    return [
      {
        source: "/auth",
        destination: "/auth/login",
        permanent: false,
      },
      ...tahirRedirects,
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
            value: "camera=(), microphone=(self), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://assets.calendly.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://plus.unsplash.com https://ebirxyrjwaulyqizcbcs.supabase.co https://vhgtbeimnkitqgekvtrz.supabase.co https://uozpalmasfxjsxhfyghn.supabase.co https://api.mapbox.com https://pplx-res.cloudinary.com https://static.propsearch.ae https://skyviewdubai.com https://i.ytimg.com https://api.reelly.io https://purecatamphetamine.github.io; font-src 'self' https://fonts.gstatic.com; media-src 'self' https://vhgtbeimnkitqgekvtrz.supabase.co; connect-src 'self' https://ebirxyrjwaulyqizcbcs.supabase.co https://vhgtbeimnkitqgekvtrz.supabase.co https://api.mapbox.com https://va.vercel-scripts.com https://www.youtube.com https://youtube.com; frame-src https://calendly.com https://crm.primecapitaldubai.com https://www.youtube.com https://www.youtube-nocookie.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
