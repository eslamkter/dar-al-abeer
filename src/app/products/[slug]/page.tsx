import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { NotesPyramid } from "@/components/product/NotesPyramid";
import { TrustBadges } from "@/components/product/TrustBadges";
import { Countdown } from "@/components/product/Countdown";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { getFragranceProfile } from "@/lib/fragrance-notes";
import { getPriceInfo, getBadges, LOW_STOCK_THRESHOLD } from "@/lib/product-helpers";

// ديناميكية: تعكس السعر/العرض/المخزون الحيّ دائمًا (مهم للعروض المؤقتة).
export const dynamic = "force-dynamic";

// عنوان ووصف كل صفحة منتج تلقائيًا (SEO).
export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "منتج غير موجود" };

  return {
    title: product.seo_title || product.name,
    description: product.seo_description || product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const profile = getFragranceProfile(product.slug);
  const price = getPriceInfo(product);
  const badges = getBadges(product);
  const lowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  return (
    <Container className="py-10">
      {/* مسار التنقل */}
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-gold">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-gold">
          المتجر
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* معرض الصور */}
        <ProductGallery images={images} alt={product.name} />

        {/* بيانات المنتج */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {product.category && (
              <span className="text-sm text-gold">{product.category}</span>
            )}
            {badges.map((b) => (
              <span
                key={b.label}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  b.tone === "ember"
                    ? "bg-ember text-white"
                    : b.tone === "hot"
                    ? "bg-[#b23a2b] text-white"
                    : b.tone === "new"
                    ? "bg-foreground text-background"
                    : "bg-gold text-white"
                }`}
              >
                {b.label}
              </span>
            ))}
          </div>
          <h1 className="mt-1 font-heading text-3xl font-bold sm:text-4xl">
            {product.name}
          </h1>

          {/* السعر */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              {price.price} {siteConfig.currency}
            </span>
            {price.original && (
              <>
                <span className="text-lg text-muted line-through">
                  {price.original} {siteConfig.currency}
                </span>
                <span className="rounded-full bg-ember px-2 py-0.5 text-xs font-semibold text-white">
                  وفّر {price.discountPct}%
                </span>
              </>
            )}
          </div>

          {/* عدّاد نهاية العرض */}
          {price.endsAt && <Countdown endsAt={price.endsAt} />}

          {/* التوفّر / الندرة */}
          <p className={`mt-3 text-sm ${lowStock ? "font-semibold text-ember" : "text-muted"}`}>
            {product.stock <= 0
              ? "غير متوفر حاليًا"
              : lowStock
              ? `أسرع! باقي ${product.stock} قطع فقط`
              : `متوفر — ${product.stock} قطعة`}
          </p>

          <p className="mt-6 leading-relaxed text-foreground/80">
            {product.description}
          </p>

          <div className="mt-8 max-w-xs">
            <AddToCartButton product={product} />
          </div>

          <TrustBadges />
        </div>
      </div>

      {/* هرم النوتات (التركيبة) */}
      {profile && <NotesPyramid profile={profile} />}

      {/* منتجات مشابهة */}
      {related.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <h2 className="mb-8 font-heading text-2xl font-bold">
              منتجات مشابهة
            </h2>
          </Reveal>
          <ProductGrid products={related} />
        </section>
      )}
    </Container>
  );
}
