import type { MetadataRoute } from "next";
import { getStore } from "@/lib/runtime";
import { enabledProduct, href } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const s = await getStore();
  if (s.preview || !s.indexable) return [];
  const routes = [
    "/",
    "/products",
    "/faq",
    ...Object.keys(s.pages).map((p) => "/" + p),
    ...s.categories.filter((p) => p.published).map((p) => "/" + p.id),
    ...s.products
      .filter((p) => enabledProduct(s, p))
      .map((p) => "/products/" + p.slug),
    ...(["notes", "families", "occasions", "guides"] as const).flatMap((k) => [
      "/" + k,
      ...s[k].filter((p) => p.published).map((p) => `/${k}/${p.id}`),
    ]),
    ...(s.features.multiBrand
      ? s.brands.filter((b) => b.published).map((b) => `/brands/${b.id}`)
      : []),
    ...(s.features.gifts ? ["/gifts"] : []),
    ...(s.features.samples ? ["/discovery-sets"] : []),
  ];
  return routes.flatMap((path) =>
    (["ar", "en"] as const).map((l) => ({
      url: s.origin + href(l, path),
      alternates: {
        languages: {
          ar: s.origin + href("ar", path),
          en: s.origin + href("en", path),
        },
      },
    })),
  );
}
