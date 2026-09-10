import type { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/products";
import { getPriceInfo, hasActiveDiscount, isNewArrival } from "@/lib/product-helpers";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/ui/Hero";
import { siteConfig } from "@/config/site";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "المتجر",
  description: "تصفح تشكيلتنا من العطور الفاخرة.",
};

const GENDERS = ["رجالي", "نسائي", "للجنسين"];

type SP = { [k: string]: string | string[] | undefined };
const s = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

function applyFilters(products: Product[], sp: SP): Product[] {
  const q = s(sp.q).trim();
  const gender = s(sp.gender);
  const category = s(sp.category);
  const sort = s(sp.sort);
  const offersOnly = s(sp.offers) === "1";

  let list = products.filter((p) => {
    if (q && !`${p.name} ${p.shortDescription} ${p.category ?? ""}`.includes(q))
      return false;
    if (gender && p.gender !== gender) return false;
    if (category && p.category !== category) return false;
    if (offersOnly && !hasActiveDiscount(p)) return false;
    return true;
  });

  if (sort === "price-asc")
    list = [...list].sort((a, b) => getPriceInfo(a).price - getPriceInfo(b).price);
  else if (sort === "price-desc")
    list = [...list].sort((a, b) => getPriceInfo(b).price - getPriceInfo(a).price);
  else if (sort === "bestseller")
    list = [...list].sort((a, b) => Number(b.is_bestseller) - Number(a.is_bestseller));
  else
    list = [...list].sort((a, b) => Number(isNewArrival(b)) - Number(isNewArrival(a)));

  return list;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const [all, categories] = await Promise.all([getProducts(), getCategories()]);
  const products = applyFilters(all, sp);

  const cur = { q: s(sp.q), gender: s(sp.gender), category: s(sp.category), sort: s(sp.sort), offers: s(sp.offers) };
  const sel = (v: string, target: string) => (v === target ? " selected" : "");

  return (
    <>
      <Hero
        title="المتجر"
        subtitle="تشكيلة مختارة من أرقى العطور الشرقية والعالمية"
        image={siteConfig.images.shop}
      />

      <Container className="py-12">
        {/* شريط الفلاتر (GET — يشتغل بدون جافاسكربت) */}
        <form
          method="get"
          className="mb-8 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          <input
            type="search"
            name="q"
            defaultValue={cur.q}
            placeholder="ابحث عن عطر..."
            className="rounded-md border border-border bg-background px-4 py-2 text-sm outline-none focus:border-gold lg:col-span-2"
          />
          <select name="gender" defaultValue={cur.gender} className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold">
            <option value="">كل الأنواع</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select name="category" defaultValue={cur.category} className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold">
            <option value="">كل التصنيفات</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select name="sort" defaultValue={cur.sort} className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold">
            <option value="">الأحدث</option>
            <option value="price-asc">السعر: الأقل أولًا</option>
            <option value="price-desc">السعر: الأعلى أولًا</option>
            <option value="bestseller">الأكثر مبيعًا</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="offers" value="1" defaultChecked={cur.offers === "1"} className="accent-gold" />
            العروض فقط
          </label>
          <div className="flex gap-2 lg:col-span-4">
            <button type="submit" className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-white hover:bg-gold-dark">
              تطبيق
            </button>
            <a href="/products" className="rounded-full border border-border px-6 py-2 text-sm text-muted hover:border-gold">
              مسح
            </a>
          </div>
        </form>

        <p className="mb-6 text-sm text-muted">{products.length} منتج</p>
        <ProductGrid products={products} />
      </Container>
    </>
  );
}
