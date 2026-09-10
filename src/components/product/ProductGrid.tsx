import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Reveal } from "@/components/motion/Reveal";

/** شبكة منتجات متجاوبة. */
export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-muted">لا توجد منتجات حاليًا.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {products.map((product, i) => (
        <Reveal key={product.id} delay={Math.min(i * 0.06, 0.3)}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
