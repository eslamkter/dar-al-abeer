"use client";

import {CatalogLink} from "./CatalogNavigation";
import { productUi } from "@/config/product";
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

  if (product.variants?.length) return <CatalogLink href={`/products/${product.slug}${product.selectedVariantId?`?variant=${encodeURIComponent(product.selectedVariantId)}`:""}`} className="mx-4 mb-4 rounded-full border border-border px-4 py-3 text-center text-sm">{productUi.select}</CatalogLink>;
  if (outOfStock) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="إضافة سريعة للسلة"
      className="mx-4 mb-4 min-h-11 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors duration-200 hover:bg-gold hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      + إضافة سريعة
    </button>
  );
}
