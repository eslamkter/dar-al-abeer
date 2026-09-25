"use client";

import Link from "next/link";
import {siteConfig} from "@/config/site";
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
      {siteConfig.announcement.enabled&&<aside className="bg-surface px-4 py-2 text-center text-sm"><Link href={siteConfig.announcement.href} className="inline-flex min-h-11 flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full px-4"><span>{siteConfig.announcement.text}</span><span className="underline">{siteConfig.announcement.label}</span></Link></aside>}
      <Navbar products={products} />
      <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
      <Footer />
      <MiniCart products={products} />
      <FloatingButtons />
    </SavedListsProvider>
  );
}
