"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { MiniCart } from "@/components/cart/MiniCart";
import type { Product } from "@/lib/types";

/**
 * بيظهر شريط التنقل والفوتر والسلة المنبثقة في صفحات المتجر فقط،
 * وبيخفيهم في الداشبورد وصفحة الدخول.
 */
export function SiteChrome({
  children,
  products,
}: {
  children: ReactNode;
  products: Product[];
}) {
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
      <MiniCart products={products} />
    </>
  );
}
