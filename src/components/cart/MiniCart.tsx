"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { siteConfig } from "@/config/site";
import { getPriceInfo } from "@/lib/product-helpers";
import type { Product } from "@/lib/types";

/** سلة منبثقة تفتح عند الإضافة — فيها الملخص + التوفير + "قد يعجبك أيضًا". */
export function MiniCart({ products }: { products: Product[] }) {
  const { items, totalPrice, totalSavings, isOpen, closeCart, addItem } =
    useCart();

  const inCart = new Set(items.map((i) => i.id));
  const suggestions = products
    .filter((p) => !inCart.has(p.id) && p.stock > 0)
    .sort((a, b) => Number(b.is_bestseller) - Number(a.is_bestseller))
    .slice(0, 3);

  return (
    <>
      {/* الخلفية المعتّمة */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* اللوحة */}
      <aside
        className={`fixed inset-y-0 left-0 z-[80] flex w-full max-w-sm flex-col bg-surface shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="سلة التسوق"
      >
        {/* الرأس */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="font-heading text-lg font-bold">
            {items.length > 0 ? "✓ تمت الإضافة للسلة" : "سلة التسوق"}
          </span>
          <button
            type="button"
            onClick={closeCart}
            aria-label="إغلاق"
            className="text-muted hover:text-gold"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-muted">سلتك فارغة.</p>
            <Link
              href="/products"
              onClick={closeCart}
              className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-white hover:bg-gold-dark"
            >
              تصفّح المتجر
            </Link>
          </div>
        ) : (
          <>
            {/* عناصر السلة */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-background">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-muted">
                        {item.quantity} × {item.price} {siteConfig.currency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* قد يعجبك أيضًا */}
              {suggestions.length > 0 && (
                <div className="mt-6 border-t border-border pt-4">
                  <h3 className="mb-3 text-sm font-semibold">قد يعجبك أيضًا</h3>
                  <div className="space-y-3">
                    {suggestions.map((p) => {
                      const price = getPriceInfo(p);
                      return (
                        <div key={p.id} className="flex items-center gap-3">
                          <Link href={`/products/${p.slug}`} onClick={closeCart} className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-background">
                            <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                          </Link>
                          <div className="flex-1">
                            <Link href={`/products/${p.slug}`} onClick={closeCart} className="text-sm font-medium hover:text-gold">
                              {p.name}
                            </Link>
                            <div className="text-xs text-muted">
                              {price.price} {siteConfig.currency}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addItem(p)}
                            className="rounded-full border border-gold px-3 py-1 text-xs font-semibold text-gold hover:bg-gold hover:text-white"
                          >
                            إضافة
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* التذييل: التوفير + الإجمالي + الأزرار */}
            <div className="border-t border-border p-4">
              {totalSavings > 0 && (
                <div className="mb-2 flex justify-between text-sm font-semibold text-ember">
                  <span>وفّرت</span>
                  <span>{totalSavings} {siteConfig.currency}</span>
                </div>
              )}
              <div className="mb-4 flex justify-between text-lg font-bold">
                <span>الإجمالي</span>
                <span>{totalPrice} {siteConfig.currency}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block rounded-full bg-gold px-6 py-3 text-center text-sm font-semibold text-white hover:bg-gold-dark"
              >
                إتمام الطلب
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-2 block text-center text-sm text-muted hover:text-gold"
              >
                عرض السلة
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
