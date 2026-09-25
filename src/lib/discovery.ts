import { getFragranceProfile } from "./fragrance-notes";
import type { Product } from "./types";
export type DiscoveryKind = "perfumes" | "notes" | "occasions";
export const discoveryConfig = {
  perfumes: { title: "تسوّق حسب التصنيف", intro: "استكشف المنتجات ضمن هذه المجموعة، وقارن النوتات والخيارات المتاحة قبل اختيار عطرك." },
  notes: { title: "اكتشف النوتات", intro: "مجموعة تشترك في هذه النوتة العطرية. تختلف تركيبة كل عطر؛ اطّلع على القمة والقلب والقاعدة في صفحة المنتج." },
  occasions: { title: "عطر لكل مناسبة", intro: "اختيارات من دليل الدار لهذه المناسبة. اكتشف تركيب كل عطر لتختار ما يناسب ذوقك." },
} as const;
export function discoveryValues(product: Product, kind: DiscoveryKind): string[] {
 const profile = getFragranceProfile(product.slug);
 if (kind === "perfumes") return product.category ? [product.category] : [];
 if (!profile || product.kind==="oud" || product.kind==="incense") return [];
 return kind === "occasions" ? [profile.occasion] : [...profile.top,...profile.heart,...profile.base];
}
export function discoveryPath(kind: DiscoveryKind, value: string) { return `/${kind}/${encodeURIComponent(value)}`; }
