"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingButtons } from "./FloatingButtons";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { MiniCart } from "@/components/cart/MiniCart";
import { SavedListsProvider } from "@/lib/saved-lists";
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
    <SavedListsProvider>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MiniCart products={products} />
      <FloatingButtons />
    </SavedListsProvider>
  );
}
