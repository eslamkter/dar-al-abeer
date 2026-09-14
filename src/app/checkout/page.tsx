"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/orders";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export default function CheckoutPage() {
  const { items, totalPrice, totalOriginal, totalSavings, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const order = await createOrder(form, items, totalPrice);
      setOrderRef(order.id);
      clear();
    } finally {
      setSubmitting(false);
    }
  }

  // ===== رسالة التأكيد بعد إرسال الطلب =====
  if (orderRef) {
    return (
      <Container className="py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-3xl text-white">
          ✓
        </div>
        <h1 className="mt-6 font-heading text-3xl font-bold">
          تم استلام طلبك بنجاح
        </h1>
        <p className="mt-3 text-muted">
          شكرًا لك. رقم طلبك هو{" "}
          <span className="font-bold text-foreground">{orderRef}</span>
        </p>
        <p className="mt-1 text-muted">
          سنتواصل معك قريبًا على رقم هاتفك لتأكيد التفاصيل.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
        >
          متابعة التسوق
        </Link>
      </Container>
    );
  }

  // ===== سلة فارغة =====
  if (items.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-heading text-3xl font-bold">إتمام الطلب</h1>
        <p className="mt-4 text-muted">سلتك فارغة. أضف منتجات أولًا.</p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
        >
          تصفّح المتجر
        </Link>
      </Container>
    );
  }

  // ===== نموذج بيانات العميل =====
  return (
    <Container className="py-12">
      <h1 className="mb-8 font-heading text-3xl font-bold">إتمام الطلب</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
          <Field
            label="الاسم الكامل"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />
          <Field
            label="رقم الهاتف"
            type="tel"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            required
          />
          <div>
            <label className="mb-1 block text-sm font-medium">
              العنوان <span className="text-gold">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2 outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark disabled:opacity-60"
          >
            {submitting ? "جارٍ إرسال الطلب..." : "تأكيد الطلب"}
          </button>
          <p className="text-center text-xs text-muted">
            الدفع عند الاستلام — لا حاجة لبطاقة الآن.
          </p>
        </form>

        {/* ملخص الطلب */}
        <aside className="h-fit rounded-lg border border-border bg-surface p-6">
          <h2 className="font-heading text-xl font-bold">ملخص الطلب</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-muted">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {item.price * item.quantity} {siteConfig.currency}
                </span>
              </li>
            ))}
          </ul>
          {totalSavings > 0 && (
            <div className="mt-3 space-y-1 border-t border-border pt-3">
              <div className="flex justify-between text-sm text-muted">
                <span>قبل الخصم</span>
                <span className="line-through">
                  {totalOriginal} {siteConfig.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-ember">
                <span>وفّرت</span>
                <span>
                  {totalSavings} {siteConfig.currency}
                </span>
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>الإجمالي</span>
            <span>
              {totalPrice} {siteConfig.currency}
            </span>
          </div>
        </aside>
      </div>
    </Container>
  );
}

/** حقل إدخال بسيط. */
function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface px-4 py-2 outline-none focus:border-gold"
      />
    </div>
  );
}
