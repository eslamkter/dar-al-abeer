import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // السماح بتحميل صور المنتجات من Unsplash (البيانات الوهمية).
    // لما نرفع صور حقيقية على Supabase Storage نضيف دومينها هنا.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
