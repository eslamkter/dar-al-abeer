"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { Product } from "@/lib/types";

/** نموذج إضافة/تعديل منتج — منظّم في أقسام، شامل العروض و SEO. */
export function ProductForm({
  product,
  categories = [],
}: {
  product?: Product;
  categories?: string[];
}) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const d = (v?: string | null) => (v ? v.slice(0, 10) : "");
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    price: product?.price?.toString() ?? "",
    stock: product?.stock?.toString() ?? "0",
    category: product?.category ?? "",
    gender: product?.gender ?? "",
    image: product?.image ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    gallery: (product?.gallery ?? []).join("\n"),
    // العروض والتسويق
    sale_price: product?.sale_price?.toString() ?? "",
    discount_start: d(product?.discount_start),
    discount_end: d(product?.discount_end),
    badge: product?.badge ?? "",
    // إعدادات SEO
    seo_title: product?.seo_title ?? "",
    seo_description: product?.seo_description ?? "",
  });
  const [isFeatured, setIsFeatured] = useState(Boolean(product?.is_featured));
  const [isBestseller, setIsBestseller] = useState(
    Boolean(product?.is_bestseller)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const gallery = form.gallery
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category || null,
      gender: form.gender || null,
      shortDescription: form.shortDescription,
      description: form.description,
      image: form.image,
      gallery: gallery.length > 0 ? gallery : null,
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      discount_start: form.discount_start || null,
      discount_end: form.discount_end || null,
      is_featured: isFeatured,
      is_bestseller: isBestseller,
      badge: form.badge || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
    };

    const { error } = isEdit
      ? await supabase.from("products").update(payload).eq("id", product!.id)
      : await supabase.from("products").insert(payload);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {/* الأساسيات */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-4 font-semibold">الأساسيات</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="اسم المنتج" value={form.name} onChange={(v) => set("name", v)} required />
        <Field label="الرابط (slug)" value={form.slug} onChange={(v) => set("slug", v)} required hint="مثال: oud-royale" />
        <Field label="السعر" type="number" value={form.price} onChange={(v) => set("price", v)} required />
        <Field label="الكمية بالمخزون" type="number" value={form.stock} onChange={(v) => set("stock", v)} required />
        <div>
          <label className="mb-1 block text-sm font-medium">التصنيف</label>
          <input
            list="category-options"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="اختر أو اكتب تصنيفًا جديدًا"
            className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:border-gold"
          />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <p className="mt-1 text-xs text-muted">اختر من الموجود أو اكتب جديد.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">الجنس</label>
          <select
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:border-gold"
          >
            <option value="">—</option>
            <option value="رجالي">رجالي</option>
            <option value="نسائي">نسائي</option>
            <option value="للجنسين">للجنسين</option>
          </select>
        </div>
        <Field label="رابط الصورة الرئيسية" value={form.image} onChange={(v) => set("image", v)} />
      </div>

      <TextArea label="وصف مختصر" value={form.shortDescription} onChange={(v) => set("shortDescription", v)} rows={2} />
      <TextArea label="الوصف الكامل" value={form.description} onChange={(v) => set("description", v)} rows={4} />
      <TextArea
        label="صور إضافية (رابط في كل سطر)"
        value={form.gallery}
        onChange={(v) => set("gallery", v)}
        rows={3}
      />
      </div>

      {/* العروض والتسويق */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-1 font-semibold">العروض والتسويق</h3>
        <p className="mb-4 text-xs text-muted">
          سعر الخصم يظهر تلقائيًا؛ لو حطيت تاريخ نهاية، العرض يقف لوحده.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="سعر بعد الخصم" type="number" value={form.sale_price} onChange={(v) => set("sale_price", v)} hint="اتركه فارغًا = بدون عرض" />
          <div>
            <label className="mb-1 block text-sm font-medium">بداية العرض</label>
            <input type="date" value={form.discount_start} onChange={(e) => set("discount_start", e.target.value)} className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:border-gold" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">نهاية العرض</label>
            <input type="date" value={form.discount_end} onChange={(e) => set("discount_end", e.target.value)} className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:border-gold" />
          </div>
        </div>
        <div className="mt-4">
          <Field label="شارة يدوية" value={form.badge} onChange={(v) => set("badge", v)} hint='مثال: "أفضل قيمة" — تظهر على المنتج للـ شو' />
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-gold" />
            مميّز (يظهر في الرئيسية)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} className="accent-gold" />
            الأكثر مبيعًا (تثبيت يدوي)
          </label>
        </div>
      </div>

      {/* إعدادات SEO */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-3 font-semibold">إعدادات SEO</h3>
        <div className="space-y-4">
          <Field label="عنوان SEO" value={form.seo_title} onChange={(v) => set("seo_title", v)} hint="لو فاضي، بيُستخدم اسم المنتج" />
          <TextArea label="وصف ميتا (Meta description)" value={form.seo_description} onChange={(v) => set("seo_description", v)} rows={2} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark disabled:opacity-60"
        >
          {saving ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/products")}
          className="rounded-full border border-border px-8 py-3 text-sm text-muted hover:border-gold"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
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
        className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:border-gold"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:border-gold"
      />
    </div>
  );
}
