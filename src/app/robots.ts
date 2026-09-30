import type { MetadataRoute } from "next";
import { getStore } from "@/lib/runtime";
export const dynamic = "force-dynamic";
export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getStore();
  return {
    rules: {
      userAgent: "*",
      ...(s.preview || !s.indexable
        ? { disallow: "/" }
        : {
            allow: "/",
            disallow: ["/api/", "/*/cart", "/*/checkout", "/*/search", "/*?"],
          }),
    },
    ...(!s.preview && s.indexable
      ? { sitemap: s.origin + "/sitemap.xml" }
      : {}),
  };
}
