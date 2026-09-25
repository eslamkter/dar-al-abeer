import {relatedContent} from "@/config/related";
import {discoveryValues} from "./discovery";
import { supabase, isSupabaseConfigured } from "./supabase";
import { mockProducts } from "./mock-products";
import type { Product } from "./types";
import {serviceConfig} from "@/config/service-adapter";

/**
 * طبقة الوصول للبيانات.
 * دلوقتي بترجع البيانات الوهمية. أول ما نفعّل Supabase ونعمل جدول "products"،
 * الدوال دي بتقرأ من قاعدة البيانات الحقيقية تلقائيًا — من غير تغيير في الصفحات.
 */

export async function getProducts(): Promise<Product[]> {
  if (serviceConfig.mode === "demo") return mockProducts;
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw new Error("Product service unavailable");
    return (data ?? []) as Product[];
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
    .filter(p=>p.id!==product.id && !(relatedContent.complements[product.slug]??[]).includes(p.slug) && (p.kind??"perfume")===(product.kind??"perfume"))
    .map(p=>({product:p,score:Number(p.category===product.category)*2+discoveryValues(p,"notes").filter(n=>discoveryValues(product,"notes").includes(n)).length}))
    .filter(p=>p.score>0).sort((a,b)=>b.score-a.score).map(p=>p.product)
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
  if (serviceConfig.mode === "demo") return mockProducts.find(p=>p.slug===slug)??null;
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error("Product service unavailable");
    return data as Product | null;
  }
  return mockProducts.find((p) => p.slug === slug) ?? null;
}
