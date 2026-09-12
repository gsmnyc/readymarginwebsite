import type { NextConfig } from "next";
const config: NextConfig = {
  distDir:
    process.env.RM_NATIVE_NEXT === "1" || process.env.VERCEL === "1"
      ? ".next-vercel"
      : ".next",
  images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/products", destination: "/what-we-handle", permanent: true },
      {
        source: "/book-a-demo",
        destination: "/book-a-review",
        permanent: true,
      },
      { source: "/blog", destination: "/insights", permanent: true },
      {
        source: "/new-york-restaurant-bookkeeping",
        destination: "/new-york/restaurant-bookkeeping-services",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};
export default config;
