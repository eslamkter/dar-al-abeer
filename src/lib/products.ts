import { supabase, isSupabaseConfigured } from "./supabase";
import { mockProducts } from "./mock-products";
import type { Product } from "./types";

/**
 * طبقة الوصول للبيانات.
 * دلوقتي بترجع البيانات الوهمية. أول ما نفعّل Supabase ونعمل جدول "products"،
 * الدوال دي بتقرأ من قاعدة البيانات الحقيقية تلقائيًا — من غير تغيير في الصفحات.
 */

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("products").select("*");
    if (!error && data) return data as Product[];
  }
  return mockProducts;
}

/** منتجات من نفس التصنيف (باستثناء المنتج الحالي). */
export async function getRelatedProducts(
  product: Product,
  limit = 3
): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

/** التصنيفات المتاحة (مشتقّة من المنتجات). */
export async function getCategories(): Promise<string[]> {
  const all = await getProducts();
  return Array.from(
    new Set(all.map((p) => p.category).filter(Boolean) as string[])
  );
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!error && data) return data as Product;
  }
  return mockProducts.find((p) => p.slug === slug) ?? null;
}
