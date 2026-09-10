"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

/** زرار الإضافة للسلة. */
export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleClick() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (outOfStock) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-full bg-border px-8 py-3 text-sm font-semibold text-muted"
      >
        غير متوفر حاليًا
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-gold-dark hover:scale-[1.02] active:scale-95 ${
        added ? "cart-pulse" : ""
      }`}
    >
      {added ? "✓ تمت الإضافة" : "أضف للسلة"}
      <style>{`
        .cart-pulse{animation:cartPulse .3s ease}
        @keyframes cartPulse{0%{transform:scale(1)}50%{transform:scale(1.06)}100%{transform:scale(1)}}
      `}</style>
    </button>
  );
}
