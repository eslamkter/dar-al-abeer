"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalOriginal, totalSavings } =
    useCart();

  if (items.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-heading text-3xl font-bold">سلة التسوق</h1>
        <p className="mt-4 text-muted">سلتك فارغة حاليًا.</p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
        >
          تصفّح المتجر
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      {/* مسار التنقل */}
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-gold">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">سلة التسوق</span>
      </nav>

      <h1 className="mb-8 font-heading text-3xl font-bold">سلة التسوق</h1>

      <div className="grid items-start gap-8 lg:grid-cols-3">
        {/* قائمة المنتجات */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-border bg-surface p-4 shadow-[0_1px_3px_rgba(28,26,23,0.06)]"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-background">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-heading text-lg font-semibold hover:text-gold"
                >
                  {item.name}
                </Link>
                <span className="text-sm text-muted">
                  {item.price} {siteConfig.currency}
                </span>

                <div className="mt-auto flex items-center justify-between">
                  {/* التحكم في الكمية */}
                  <div className="inline-flex items-center rounded-full border border-border">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:text-gold"
                      aria-label="تقليل"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:text-gold"
                      aria-label="زيادة"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-full border border-border px-4 py-1.5 text-xs text-muted transition-colors hover:border-red-300 hover:text-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>

              <div className="shrink-0 font-semibold">
                {item.price * item.quantity} {siteConfig.currency}
              </div>
            </div>
          ))}
        </div>

        {/* ملخص الطلب */}
        <aside className="h-fit rounded-xl border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(28,26,23,0.06)]">
          <h2 className="font-heading text-xl font-bold">ملخص الطلب</h2>
          {totalSavings > 0 && (
            <>
              <div className="mt-4 flex justify-between text-sm text-muted">
                <span>الإجمالي قبل الخصم</span>
                <span className="line-through">
                  {totalOriginal} {siteConfig.currency}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-sm font-semibold text-ember">
                <span>وفّرت</span>
                <span>
                  {totalSavings} {siteConfig.currency}
                </span>
              </div>
            </>
          )}
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>الإجمالي</span>
            <span>
              {totalPrice} {siteConfig.currency}
            </span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-gold px-8 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
          >
            متابعة الطلب
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm text-muted hover:text-gold"
          >
            متابعة التسوق
          </Link>
        </aside>
      </div>
    </Container>
  );
}
