import {Testimonials,Newsletter} from "@/components/home/Community";
import {Fragment} from "react";
import {homeLayout,homeSections,homeContent} from "@/config/home";
import { ShoppingHelp } from "@/components/home/ShoppingHelp";
import { ScentDiscovery } from "@/components/home/ScentDiscovery";
import { pageSeo } from "@/lib/seo";
export const metadata = { ...pageSeo("/", false) };
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

  const blocks={
    hero:<HomeHero/>,
    trust:<section className="border-b border-border bg-surface"><Container className="grid grid-cols-1 gap-6 py-8 text-center sm:grid-cols-3">{homeContent.trust.map(([title,text])=><div key={title}><svg className="mx-auto mb-3 text-gold" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg><div className="font-heading text-base font-bold text-foreground">{title}</div><div className="mt-1 text-sm text-muted">{text}</div></div>)}</Container></section>,
    marquee:<Marquee items={homeContent.marquee}/>,
    categories:<CategoryTiles categories={categories}/>,
    featured:<Section {...homeContent.showcases.featured} products={featured}/>,
    discovery:<ScentDiscovery products={products}/>,
    offers:<Section {...homeContent.showcases.offers} products={offers}/>,
    story:<BrandStatement/>,
    bestsellers:<Section {...homeContent.showcases.bestsellers} products={bestsellers}/>,
    new:<Section {...homeContent.showcases.new} products={newArrivals}/>,
    help:<ShoppingHelp/>,
    testimonials:<Testimonials/>,
    newsletter:<Newsletter/>,
    browse:<Container className="pb-24 text-center"><Link href="/products" className="inline-block rounded-full border border-gold px-8 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-white">{homeContent.browse}</Link></Container>,
  };
  return <>{homeLayout.filter(id=>homeSections[id]).map(id=><Fragment key={id}>{blocks[id]}</Fragment>)}</>;
}
