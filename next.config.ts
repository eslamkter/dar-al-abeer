import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://howeyah.net https://*.howeyah.net https://howeyah-platform-demo-v2.vercel.app",
          },
        ],
      },
    ];
  },
  images: {
    // السماح بتحميل صور المنتجات من Unsplash (البيانات الوهمية).
    // لما نرفع صور حقيقية على Supabase Storage نضيف دومينها هنا.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
