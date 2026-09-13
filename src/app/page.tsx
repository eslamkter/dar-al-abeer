import Link from "next/link";
import { getProducts, getCategories } from "@/lib/products";
import { hasActiveDiscount, isNewArrival } from "@/lib/product-helpers";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { HomeHero } from "@/components/home/HomeHero";
import { BrandStatement } from "@/components/home/BrandStatement";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import type { Product } from "@/lib/types";

// ديناميكية: تعكس المميّز/العروض/الأكثر مبيعًا الحيّ دائمًا.
export const dynamic = "force-dynamic";

function Section({
  eyebrow,
  title,
  href,
  products,
}: {
  eyebrow: string;
  title: string;
  href: string;
  products: Product[];
}) {
  if (products.length === 0) return null;
  return (
    <Container className="py-16">
      <Reveal>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="mt-2 font-heading text-3xl font-bold">{title}</h2>
          </div>
          <Link href={href} className="text-sm text-gold hover:underline">
            عرض الكل
          </Link>
        </div>
      </Reveal>
      <ProductGrid products={products.slice(0, 3)} />
    </Container>
  );
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const featured = products.filter((p) => p.is_featured);
  const offers = products.filter((p) => hasActiveDiscount(p));
  const bestsellers = products.filter((p) => p.is_bestseller);
  const newArrivals = products.filter((p) => isNewArrival(p));

  return (
    <>
      <HomeHero />

      {/* شريط قيم */}
      <section className="border-b border-border bg-surface">
        <Container className="grid grid-cols-1 gap-6 py-8 text-center sm:grid-cols-3">
          {[
            ["أصالة مضمونة", "منتج أصلي 100%"],
            ["دفع عند الاستلام", "ادفع وقت التسليم"],
            ["شحن لكل الخليج", "توصيل سريع وآمن"],
          ].map(([t, s]) => (
            <div key={t}>
              <div className="font-heading text-base font-bold text-foreground">{t}</div>
              <div className="mt-1 text-sm text-muted">{s}</div>
            </div>
          ))}
        </Container>
      </section>

      <Marquee items={["عطور شرقية", "عود فاخر", "مسك أبيض", "ورد دمشقي", "زعفران", "عنبر"]} />

      {/* بلاطات التصنيفات */}
      <CategoryTiles categories={categories} />

      {/* المجموعة المميّزة */}
      <Section eyebrow="اختيار الدار" title="المجموعة المميّزة" href="/products" products={featured} />

      {/* بانر عرض */}
      {offers.length > 0 && (
        <section className="relative bg-foreground py-20 text-center text-background">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background to-transparent" />
          <Container>
            <Reveal>
              <span className="eyebrow text-gold">لفترة محدودة</span>
              <h2 className="mt-3 font-heading text-3xl font-bold">
                عروض حصرية على تشكيلة مختارة
              </h2>
              <p className="mx-auto mt-2 max-w-md text-background/70">
                خصومات تنتهي قريبًا — اقتنِ عطرك المفضّل قبل انتهاء العرض.
              </p>
              <Link
                href="/products?offers=1"
                className="mt-6 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
              >
                تسوّق العروض
              </Link>
            </Reveal>
          </Container>
        </section>
      )}

      <Section eyebrow="لفترة محدودة" title="عروض حصرية" href="/products?offers=1" products={offers} />

      <BrandStatement />

      <Section eyebrow="اختيار عملائنا" title="الأكثر مبيعًا" href="/products?sort=bestseller" products={bestsellers} />

      <Section eyebrow="جديدنا" title="وصل حديثًا" href="/products" products={newArrivals} />

      <Container className="pb-24 text-center">
        <Link
          href="/products"
          className="inline-block rounded-full border border-gold px-8 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-white"
        >
          عرض كل العطور
        </Link>
      </Container>
    </>
  );
}
