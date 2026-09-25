import {helpContent} from "@/config/help";
import { discoveryPath, discoveryValues } from "@/lib/discovery";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getProducts } from "@/lib/products";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const routes = [...helpContent.topics.filter(t=>!t.draft).map(t=>`/help/${t.slug}`),"/notes","/occasions","/perfumes","/help", "/help/shopping","/", "/products", "/about", "/contact", "/scent-finder", ...products.flatMap(p => (["perfumes", "notes", "occasions"] as const).flatMap(kind => discoveryValues(p,kind).map(value => discoveryPath(kind,value)))), ...products.map(p => `/products/${p.slug}`)];
  return [...new Set(routes)].map(route => ({ url: new URL(route, siteUrl).href }));
}
