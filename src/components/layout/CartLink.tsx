"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

/** أيقونة سلة مع عدّاد — بدل رابط نصّي "السلة" (تنويع بنائي عن باقي الثيمات). */
export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="السلة"
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:text-gold"
    >
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M2.5 5h1.5l1.4 9.2A1.5 1.5 0 0 0 6.9 15.5h8.2a1.5 1.5 0 0 0 1.5-1.3L17.5 7H5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="18" r="1" fill="currentColor" />
        <circle cx="15" cy="18" r="1" fill="currentColor" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
