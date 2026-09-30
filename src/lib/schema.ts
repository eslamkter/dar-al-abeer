import { z } from "zod";
export type Locale = "ar" | "en";
export const textSchema = z.object({ ar: z.string(), en: z.string() });
export type Text = z.infer<typeof textSchema>;
export const t = (v: Text, l: Locale) => v[l];
export const L = (ar: string, en: string): Text => ({ ar, en });
const id = z.string().regex(/^[a-z0-9-]+$/);
const amount = z.number().finite().nonnegative();
const media = z.object({
  src: z.string().min(1),
  alt: textSchema,
  illustrative: z.boolean(),
  fallbackSrc: z.string().nullable().default(null),
  fallbackAlt: textSchema.nullable().default(null),
  view: z.enum(["full", "detail"]).default("full"),
});
const sku = {
  id,
  sku: z.string().min(1),
  label: textSchema,
  price: amount,
  compareAt: amount.nullable(),
  offerStartsAt: z.string().datetime().nullable().default(null),
  offerEndsAt: z.string().datetime().nullable().default(null),
  stock: z.number().int().nonnegative(),
  media: z.array(media).min(1),
};
const ml = { ...sku, volumeMl: z.number().positive() };
const grams = { ...sku, weightG: z.number().positive() };
const base = {
  id,
  slug: id,
  name: textSchema,
  summary: textSchema,
  description: textSchema,
  brand: id,
  published: z.boolean(),
  sample: z.boolean(),
  family: id,
  notes: z.array(id),
  occasions: z.array(id),
  createdAt: z.string(),
  usage: textSchema,
  care: textSchema,
  alternatives: z.array(id),
  complements: z.array(id),
  giftEligible: z.boolean(),
  sampleId: id.nullable(),
  intensity: z.enum(["soft", "balanced", "rich"]).nullable(),
  performanceNote: textSchema.nullable(),
};
const pyramid = z.object({
  top: z.array(id),
  heart: z.array(id),
  base: z.array(id),
});
const line = z.object({
  productId: id,
  variantId: id,
  quantity: z.number().int().min(1).max(20),
});
export const productSchema = z.discriminatedUnion("kind", [
  z.object({
    ...base,
    kind: z.literal("perfume"),
    audience: z.enum(["women", "men", "unisex"]),
    pyramid,
    variants: z
      .array(
        z.object({ ...ml, concentration: z.enum(["EDP", "EDT", "Extrait"]) }),
      )
      .min(1),
  }),
  z.object({
    ...base,
    kind: z.literal("oil"),
    oilType: z.enum(["perfume-oil", "dehn-oud", "musk"]),
    origin: textSchema.nullable(),
    applicator: textSchema,
    variants: z.array(z.object(ml)).min(1),
  }),
  z.object({
    ...base,
    kind: z.literal("oud"),
    origin: textSchema.nullable(),
    grade: textSchema.nullable(),
    heatingMethod: textSchema,
    variants: z.array(z.object(grams)).min(1),
  }),
  z.object({
    ...base,
    kind: z.literal("bakhoor"),
    blend: textSchema,
    baseMaterial: textSchema,
    heatingMethod: textSchema,
    variants: z.array(z.object(grams)).min(1),
  }),
  z.object({
    ...base,
    kind: z.literal("maamoul"),
    blend: textSchema,
    heatingMethod: textSchema,
    variants: z
      .array(z.object({ ...grams, pieces: z.number().int().positive() }))
      .min(1),
  }),
  z.object({
    ...base,
    kind: z.literal("home-spray"),
    suitableSurfaces: textSchema,
    variants: z.array(z.object(ml)).min(1),
  }),
  z.object({
    ...base,
    kind: z.literal("diffuser"),
    reedCount: z.number().int().positive(),
    refillIds: z.array(id),
    variants: z.array(z.object(ml)).min(1),
  }),
  z.object({
    ...base,
    kind: z.literal("burner"),
    material: textSchema,
    heatSource: z.enum(["charcoal", "electric"]),
    voltage: z.number().positive().nullable(),
    powerW: z.number().positive().nullable(),
    variants: z
      .array(
        z.object({
          ...sku,
          widthCm: z.number().positive(),
          depthCm: z.number().positive(),
          heightCm: z.number().positive(),
          finish: textSchema,
        }),
      )
      .min(1),
  }),
  z.object({
    ...base,
    kind: z.literal("gift-set"),
    contents: z.array(line).min(1),
    packaging: textSchema,
    variants: z.array(z.object(sku)).min(1),
  }),
  z.object({
    ...base,
    kind: z.literal("discovery-set"),
    contents: z.array(line).min(1),
    packaging: textSchema,
    variants: z.array(z.object(sku)).min(1),
  }),
]);
export type Product = z.infer<typeof productSchema>;
export type Variant = Product["variants"][number];
export type Kind = Product["kind"];
const entry = z.object({
  id,
  name: textSchema,
  description: textSchema,
  image: z.string(),
  published: z.boolean(),
});
const link = z.object({ label: textSchema, href: z.string() });
const section = z.object({
  id,
  kind: z.enum([
    "hero",
    "trust",
    "categories",
    "products",
    "notes",
    "oud",
    "occasions",
    "gifts",
    "story",
    "reviews",
    "faq",
    "capture",
    "brands",
    "promotions",
  ]),
  enabled: z.boolean(),
  title: textSchema,
  body: textSchema,
  action: textSchema,
  href: z.string(),
  image: z.string(),
  productIds: z.array(id),
  banners: z
    .array(
      z.object({
        id,
        title: textSchema,
        body: textSchema,
        action: textSchema,
        href: z.string(),
        image: z.string(),
        mobileImage: z.string().default(""),
        enabled: z.boolean().default(true),
        startsAt: z.string().datetime().nullable().default(null),
        endsAt: z.string().datetime().nullable().default(null),
        imagePosition: z.string().default("center"),
        requirement: z.enum(["none", "gifts", "samples"]).default("none"),
      }),
    )
    .default([]),
  startsAt: z.string().nullable(),
  endsAt: z.string().nullable(),
  presentation: z.object({
    gap: z.number().min(16).max(72),
    imagePosition: z.string(),
    height: z.number().min(180).max(640),
  }),
});
export const socialSchema = z.object({
  id,
  platform: z.enum([
    "instagram",
    "facebook",
    "x",
    "youtube",
    "tiktok",
    "snapchat",
    "linkedin",
  ]),
  url: z.string(),
  label: textSchema,
  enabled: z.boolean(),
});
const color = z.string().regex(/^#[a-f0-9]{6}$/i);
export const storeSchema = z
  .object({
    version: z.literal(1),
    id,
    preview: z.boolean(),
    indexable: z.boolean(),
    origin: z.string().url(),
    brand: textSchema,
    tagline: textSchema,
    currency: z.string().length(3),
    tokens: z.object({
      canvas: color,
      ink: color,
      muted: color,
      accent: color,
      onAccent: color,
      surface: color,
      line: color,
      pageWidth: z.number().min(1100).max(1800),
      gutter: z.number().min(16).max(64),
      sectionGap: z.number().min(24).max(80),
      radius: z.number().min(12).max(40),
      microMs: z.number().min(150).max(300),
      revealMs: z.number().min(600).max(1200),
    }),
    background: z
      .object({ texture: z.string(), size: z.number().min(100).max(1000) })
      .default({ texture: "/images/mineral-grain.svg", size: 240 }),
    fonts: z.object({
      ar: z.object({ heading: z.string(), body: z.string() }),
      en: z.object({ heading: z.string(), body: z.string() }),
      registry: z.array(
        z.object({ family: z.string(), src: z.string(), weight: z.number() }),
      ),
    }),
    motion: z.enum(["off", "calm"]),
    announcement: z.object({
      enabled: z.boolean(),
      text: textSchema,
      href: z.string(),
    }),
    home: z.array(section),
    navigation: z.array(link.extend({ children: z.array(link).default([]) })),
    footer: z.array(z.object({ title: textSchema, links: z.array(link) })),
    features: z.object({
      multiBrand: z.boolean(),
      gifts: z.boolean(),
      samples: z.boolean(),
      wishlist: z.boolean(),
      recent: z.boolean(),
      compare: z.boolean(),
      finder: z.boolean(),
    }),
    floating: z.object({
      backToTop: z.boolean(),
      whatsapp: z.boolean(),
      compare: z.boolean(),
      wishlist: z.boolean(),
    }),
    products: z.array(productSchema),
    categories: z.array(
      entry.extend({
        kinds: z.array(z.string()),
        span: z.number().int().min(1).max(2).default(1),
      }),
    ),
    notes: z.array(entry),
    families: z.array(entry),
    occasions: z.array(entry),
    brands: z.array(entry),
    guides: z.array(entry.extend({ paragraphs: z.array(textSchema) })),
    faq: z.array(z.object({ question: textSchema, answer: textSchema })),
    trust: z.array(
      z.object({ title: textSchema, body: textSchema, icon: z.string() }),
    ),
    reviews: z.array(
      z.object({
        id,
        productId: id,
        name: textSchema,
        quote: textSchema,
        score: z.number().min(1).max(5),
        sample: z.boolean(),
        verified: z.boolean(),
      }),
    ),
    socialProfiles: z.array(socialSchema),
    previewSocialProfiles: z.array(socialSchema).default([]),
    sampleSocials: z.boolean(),
    contact: z.object({
      email: z.string(),
      phone: z.string(),
      whatsapp: z.string(),
      address: textSchema,
      hours: textSchema,
      mapUrl: z.string(),
      branches: z.array(z.object({ name: textSchema, address: textSchema })),
    }),
    pages: z.record(
      z.string(),
      z.object({
        title: textSchema,
        intro: textSchema,
        sections: z.array(z.object({ title: textSchema, body: textSchema })),
        image: z.string(),
      }),
    ),
    labels: z.record(z.string(), textSchema),
    commerce: z.object({
      deliveryFee: amount.nullable(),
      freeDeliveryAbove: amount.nullable(),
      taxIncluded: z.boolean(),
      giftWrapPrice: amount,
      giftMessageMax: z.number().int().min(1).max(500),
      maxSamples: z.number().int().min(1).max(10),
      coupon: z
        .object({
          code: z.string(),
          percent: z.number().min(0).max(50),
          endsAt: z.string(),
        })
        .nullable(),
    }),
    services: z.object({
      checkout: z.boolean(),
      contact: z.boolean(),
      newsletter: z.boolean(),
    }),
    redirects: z.record(z.string(), z.string()),
  })
  .superRefine((s, ctx) => {
    const err = (message: string) => ctx.addIssue({ code: "custom", message });
    for (const list of [
      s.products,
      s.categories,
      s.notes,
      s.occasions,
      s.families,
      s.brands,
      s.home,
      s.socialProfiles,
    ])
      if (new Set(list.map((x) => x.id)).size !== list.length)
        err("Duplicate identifiers");
    if (new Set(s.products.map((x) => x.slug)).size !== s.products.length)
      err("Duplicate product slug");
    const skus = s.products.flatMap((p) => p.variants.map((v) => v.sku));
    if (new Set(skus).size !== skus.length) err("Duplicate SKU");
    const products = new Map(s.products.map((p) => [p.id, p]));
    for (const p of s.products) {
      if (new Set(p.variants.map((v) => v.id)).size !== p.variants.length)
        err("Duplicate variant");
      if (!s.brands.some((b) => b.id === p.brand)) err("Unknown brand");
      if (!s.families.some((f) => f.id === p.family)) err("Unknown family");
      for (const n of p.notes)
        if (!s.notes.some((x) => x.id === n)) err("Unknown note");
      for (const n of p.occasions)
        if (!s.occasions.some((x) => x.id === n)) err("Unknown occasion");
      for (const ref of [
        ...p.alternatives,
        ...p.complements,
        ...(p.sampleId ? [p.sampleId] : []),
      ])
        if (!products.has(ref)) err("Unknown related product");
      if ("contents" in p)
        for (const l of p.contents) {
          const target = products.get(l.productId);
          if (
            !target ||
            !target.variants.some((v) => v.id === l.variantId) ||
            "contents" in target
          )
            err("Invalid set component");
        }
      if (
        p.kind === "burner" &&
        p.heatSource === "electric" &&
        (!p.voltage || !p.powerW)
      )
        err("Electrical burner needs voltage and power");
    }
    for (const h of s.home)
      for (const ref of h.productIds)
        if (!products.has(ref)) err("Unknown curated product");
    for (const r of s.reviews)
      if (!products.has(r.productId) || (r.sample && r.verified))
        err("Invalid review");
    for (const l of ["ar", "en"] as const)
      for (const f of Object.values(s.fonts[l]))
        if (!s.fonts.registry.some((x) => x.family === f))
          err("Font not registered");
    if (
      !s.preview &&
      (s.sampleSocials ||
        s.products.some(
          (p) =>
            p.sample ||
            p.variants.some((v) => v.media.some((m) => m.illustrative)),
        ) ||
        s.reviews.some((r) => r.sample) ||
        new URL(s.origin).hostname.endsWith(".example"))
    )
      err("Live store cannot contain preview content");
  });
export type Store = z.infer<typeof storeSchema>;
export type HomeSection = Store["home"][number];
export type Social = Store["socialProfiles"][number];
export const cartLineSchema = line.extend({
  wrap: z.boolean().default(false),
  message: z.string().max(500).default(""),
});
export type CartLine = z.infer<typeof cartLineSchema>;
