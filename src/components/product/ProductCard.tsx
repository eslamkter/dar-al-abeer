import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { siteConfig } from "@/config/site";
import { getPriceInfo, getBadges, type Badge } from "@/lib/product-helpers";
import { QuickAddButton } from "./QuickAddButton";

const toneClass: Record<Badge["tone"], string> = {
  gold: "bg-gold text-white",
  ember: "bg-ember text-white",
  new: "bg-foreground text-background",
  hot: "bg-[#9a4c42] text-white",
};

/** بطاقة منتج واحدة في الكتالوج. */
export function ProductCard({ product }: { product: Product }) {
  const price = getPriceInfo(product);
  const badges = getBadges(product);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_18px_40px_-18px_rgba(28,26,23,0.35)]">
      {/* إضافة سريعة (فوق الرابط) */}
      <QuickAddButton product={product} />

      <Link
        href={`/products/${product.slug}`}
        className="flex flex-1 flex-col"
      >
      <div className="relative aspect-square overflow-hidden bg-background">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* الشارات */}
        {badges.length > 0 && (
          <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
            {badges.slice(0, 2).map((b) => (
              <span
                key={b.label}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold shadow-sm ${toneClass[b.tone]}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <span className="text-xs text-gold">{product.category}</span>
        )}
        <h3 className="mt-1 font-heading text-lg font-semibold">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">
          {product.shortDescription}
        </p>

        {/* السعر */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-semibold text-foreground">
            {price.price} {siteConfig.currency}
          </span>
          {price.original && (
            <span className="text-sm text-muted line-through">
              {price.original} {siteConfig.currency}
            </span>
          )}
        </div>
      </div>
      </Link>
    </div>
  );
}
