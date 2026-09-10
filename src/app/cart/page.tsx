"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

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
      <h1 className="mb-8 font-heading text-3xl font-bold">سلة التسوق</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* قائمة المنتجات */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-lg border border-border bg-surface p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-background">
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
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 rounded-md border border-border hover:border-gold"
                      aria-label="تقليل"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 rounded-md border border-border hover:border-gold"
                      aria-label="زيادة"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-muted hover:text-red-600"
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
        <aside className="h-fit rounded-lg border border-border bg-surface p-6">
          <h2 className="font-heading text-xl font-bold">ملخص الطلب</h2>
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
