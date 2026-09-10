"use client";

import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

/** إضافة سريعة للسلة من الكارت (بدون فتح صفحة المنتج). */
export function QuickAddButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product); // بتفتح السلة المنبثقة تلقائيًا
  }

  if (outOfStock) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="إضافة سريعة للسلة"
      className="absolute inset-x-3 bottom-3 z-10 translate-y-2 rounded-full bg-foreground/90 px-4 py-2 text-sm font-semibold text-background opacity-0 shadow-lg backdrop-blur transition-all duration-300 hover:bg-gold hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
    >
      + إضافة سريعة
    </button>
  );
}
