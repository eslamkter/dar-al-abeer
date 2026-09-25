"use client";

import {siteConfig} from "@/config/site";
import type { Product } from "@/lib/types";
import { useSavedLists } from "@/lib/saved-lists";

/** زرّي "مفضلة" و"مقارنة" فوق صورة بطاقة المنتج — حالة حقيقية محفوظة محليًا. */
export function SaveToggleButtons({ product }: { product: Product }) {
  const { toggleWishlist, toggleCompare, isWishlisted, isCompared } = useSavedLists();

  const item = {
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
  };
  const wishlisted = isWishlisted(product.slug);
  const compared = isCompared(product.slug);

  function stop(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5 opacity-100">
      <button
        type="button"
        aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        aria-pressed={wishlisted}
        onClick={(e) => {
          stop(e);
          toggleWishlist(item);
        }}
        className={`flex h-11 w-11 items-center justify-center rounded-full shadow-sm backdrop-blur transition-colors ${
          wishlisted ? "bg-gold text-white" : "bg-white/90 text-foreground hover:text-gold"
        }`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
          <path d="M12 20.5s-7.5-4.6-9.8-9C.8 8 2 4.5 5.3 3.7c2-.5 3.9.3 5.2 2 .3.4.9.4 1.2 0 1.3-1.7 3.2-2.5 5.2-2 3.3.8 4.5 4.3 3.1 7.8-2.3 4.4-9.8 9-9.8 9Z" strokeLinejoin="round" />
        </svg>
      </button>
      {siteConfig.savedLists.compare&&      <button
        type="button"
        aria-label={compared ? "إزالة من المقارنة" : "إضافة للمقارنة"}
        aria-pressed={compared}
        onClick={(e) => {
          stop(e);
          toggleCompare(item);
        }}
        className={`flex h-11 w-11 items-center justify-center rounded-full shadow-sm backdrop-blur transition-colors ${
          compared ? "bg-gold text-white" : "bg-white/90 text-foreground hover:text-gold"
        }`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h13M13 3l4 4-4 4" />
          <path d="M20 17H7m6 4-4-4 4-4" />
        </svg>
      </button>}
    </div>
  );
}
