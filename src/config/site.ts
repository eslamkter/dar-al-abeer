/**
 * إعدادات الموقع المركزية.
 * أي ثيم جديد (عيادة، مطعم، عقارات...) يعدّل الملف ده بس،
 * من غير ما يلمس باقي الكود.
 */
export const siteConfig = {
  name: "دار العبير",
  tagline: "عطور فاخرة تروي حكايتك",
  description:
    "متجر عطور فاخرة — تشكيلة مختارة من أرقى العطور الشرقية والعالمية.",
  locale: "ar",
  direction: "rtl" as const,
  currency: "ر.س",
  contact: {
    phone: "+966 50 000 0000",
    // رقم واتساب بصيغة دولية بدون + أو مسافات (للرابط wa.me)
    whatsapp: "966500000000",
    email: "info@example.com",
    address: "الرياض، المملكة العربية السعودية",
    hours: "السبت – الخميس: 10 صباحًا – 10 مساءً",
    social: {
      instagram: "https://instagram.com/",
      tiktok: "https://tiktok.com/",
      snapchat: "https://snapchat.com/",
    },
  },
  // صور الهوية — صورة مميّزة لكل صفحة (تتغيّر من هنا بس).
  images: {
    hero: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&q=80",
    shop: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1600&q=80",
    about: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=1600&q=80",
    contact: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1600&q=80",
  },
  nav: [
    { label: "الرئيسية", href: "/" },
    { label: "المتجر", href: "/products" },
    { label: "من نحن", href: "/about" },
    { label: "تواصل معنا", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
