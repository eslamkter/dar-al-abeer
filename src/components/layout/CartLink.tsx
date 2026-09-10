"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

/** رابط السلة مع عدّاد عدد المنتجات. */
export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-sm text-muted transition-colors hover:text-gold"
    >
      السلة
      {totalItems > 0 && (
        <span className="absolute -top-2 -left-4 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
