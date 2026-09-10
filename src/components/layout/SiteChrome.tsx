"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

/**
 * بيظهر شريط التنقل والفوتر بتوع المتجر في صفحات المتجر فقط،
 * وبيخفيهم في الداشبورد وصفحة الدخول (ليهم واجهتهم الخاصة).
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin =
    pathname.startsWith("/dashboard") || pathname.startsWith("/login");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
