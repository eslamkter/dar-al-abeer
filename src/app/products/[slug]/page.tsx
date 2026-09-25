import {relatedContent} from "@/config/related";
import {getProducts} from "@/lib/products";
import {BackToResults} from "@/components/product/CatalogNavigation";
import { ProductPresentation } from "@/components/product/ProductPresentation";
import { selectVariant } from "@/lib/variants";
import { ProductSchema } from "@/components/product/ProductSchema";
import { pageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { NotesPyramid } from "@/components/product/NotesPyramid";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { getFragranceProfile } from "@/lib/fragrance-notes";
import { getPriceInfo } from "@/lib/product-helpers";

// ديناميكية: تعكس السعر/العرض/المخزون الحيّ دائمًا (مهم للعروض المؤقتة).
export const dynamic = "force-dynamic";

// عنوان ووصف كل صفحة منتج تلقائيًا (SEO).
export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const routeParams = await params;
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "منتج غير موجود" };

  return { ...pageSeo(`/products/${encodeURIComponent(routeParams.slug)}`),
    title: product.seo_title || product.name,
    description: product.seo_description || product.shortDescription,
  };
}

export default async function ProductPage({
  params, searchParams,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product,relatedContent.max);
  const complementary=(await getProducts()).filter(p=>(relatedContent.complements[product.slug]??[]).includes(p.slug));
  const profile = getFragranceProfile(product.slug);
  const query = await searchParams;
  const requestedVariant = typeof query.variant === "string" ? query.variant : undefined;
  const variant = product.variants?.find(v=>v.id===requestedVariant)?.id || product.variants?.find(v=>v.stock>0)?.id || product.variants?.[0]?.id;
  const selected = selectVariant(product,variant);
  const price = getPriceInfo(selected);
  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  return (
    <Container className="py-10">
      <ProductSchema variants={product.variants} category={product.category} name={product.name} description={product.description} images={images} price={price.price} available={selected.stock > 0} path={`/products/${product.slug}`} />
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
        {product.category&&<><Link href={`/perfumes/${encodeURIComponent(product.category)}`} className="hover:text-gold">{product.category}</Link><span className="mx-2">/</span></>}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <BackToResults/><ProductPresentation product={product} initialVariant={variant} />

      {/* هرم النوتات (التركيبة) */}
      {profile && product.kind !== "incense" && product.kind !== "oud" && <NotesPyramid profile={profile} />}

      {/* منتجات مشابهة */}
      {related.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <h2 className="mb-8 font-heading text-2xl font-bold">
              {relatedContent.similar}
            </h2>
          </Reveal>
          <ProductGrid products={related} />
        </section>
      )}
    {!!complementary.length&&<section className="mt-16"><h2 className="mb-8 font-heading text-2xl font-bold">{relatedContent.complementary}</h2><ProductGrid products={complementary}/></section>}
    </Container>
  );
}
