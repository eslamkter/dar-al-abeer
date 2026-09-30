import {
  cartLineSchema,
  type Store,
  type Product,
  type Variant,
  type Locale,
  type CartLine,
  type Social,
} from "./schema";
export const label = (s: Store, key: string, l: Locale) =>
  s.labels[key]?.[l] ?? key;
export const money = (s: Store, n: number, l: Locale) =>
  new Intl.NumberFormat(l === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: s.currency,
    maximumFractionDigits: 2,
  }).format(n);
export const href = (l: Locale, path: string) =>
  /^https?:|^mailto:|^tel:/.test(path)
    ? path
    : `/${l}${path === "/" ? "" : path}`;
export const enabledProduct = (s: Store, p: Product) =>
  p.published &&
  (s.features.gifts || p.kind !== "gift-set") &&
  (s.features.samples ||
    (!["discovery-set"].includes(p.kind) &&
      !s.products.some((x) => x.sampleId === p.id)));
export const available = (s: Store, p: Product, v: Variant) =>
  "contents" in p
    ? Math.min(
        v.stock,
        ...p.contents.map((line) =>
          Math.floor(
            (s.products
              .find((x) => x.id === line.productId && enabledProduct(s, x))
              ?.variants.find((x) => x.id === line.variantId)?.stock ?? 0) /
              line.quantity,
          ),
        ),
      )
    : v.stock;
export function selectVariant(s: Store, p: Product, id?: string) {
  return (
    p.variants.find((v) => v.id === id) ??
    [...p.variants].sort(
      (a, b) =>
        Number(available(s, p, b) > 0) - Number(available(s, p, a) > 0) ||
        a.price - b.price,
    )[0]
  );
}
export type Query = Record<string, string | undefined>;
export function resolveCatalogAt(s: Store, now = Date.now()): Store {
  const current = structuredClone(s);
  for (const p of current.products)
    for (const v of p.variants) {
      if (
        v.compareAt !== null &&
        ((v.offerStartsAt && Date.parse(v.offerStartsAt) > now) ||
          (v.offerEndsAt && Date.parse(v.offerEndsAt) <= now))
      ) {
        v.price = v.compareAt;
        v.compareAt = null;
      }
    }
  return current;
}
export function searchCatalog(s: Store, products: Product[], q: Query) {
  const normalized = (v: string) =>
    v
      .normalize("NFKD")
      .replace(/[\u064B-\u065F]/g, "")
      .replace(/[أإآ]/g, "ا")
      .toLowerCase();
  const rows = products
    .filter((p) => enabledProduct(s, p))
    .flatMap((p) => {
      if (
        q.q &&
        !normalized(
          [
            p.name.ar,
            p.name.en,
            p.summary.ar,
            p.summary.en,
            s.brands.find((b) => b.id === p.brand)?.name.ar ?? "",
            s.brands.find((b) => b.id === p.brand)?.name.en ?? "",
            ...s.categories
              .filter((c) => c.published && c.kinds.includes(p.kind))
              .flatMap((c) => [c.name.ar, c.name.en]),
            ...p.notes.flatMap((n) => {
              const x = s.notes.find((n2) => n2.id === n);
              return [x?.name.ar ?? "", x?.name.en ?? ""];
            }),
            ...p.variants.map((v) => v.sku),
          ].join(" "),
        ).includes(normalized(q.q))
      )
        return [];
      if (
        (q.intensity && p.intensity !== q.intensity) ||
        (q.note && !p.notes.includes(q.note)) ||
        (q.family && p.family !== q.family) ||
        (q.occasion && !p.occasions.includes(q.occasion)) ||
        (q.kind && p.kind !== q.kind) ||
        (q.oilType && (p.kind !== "oil" || p.oilType !== q.oilType)) ||
        (q.heatSource &&
          (p.kind !== "burner" || p.heatSource !== q.heatSource)) ||
        (q.audience && (p.kind !== "perfume" || p.audience !== q.audience)) ||
        (q.origin && (!("origin" in p) || p.origin?.en !== q.origin)) ||
        (q.grade && (p.kind !== "oud" || p.grade?.en !== q.grade)) ||
        (q.brand && p.brand !== q.brand)
      )
        return [];
      const variants = p.variants.filter(
        (v) =>
          (!q.size ||
            ("volumeMl" in v
              ? `ml:${v.volumeMl}`
              : "weightG" in v
                ? `g:${v.weightG}`
                : v.id) === q.size ||
            String(
              "volumeMl" in v ? v.volumeMl : "weightG" in v ? v.weightG : v.id,
            ) === q.size) &&
          (!q.concentration ||
            ("concentration" in v && v.concentration === q.concentration)) &&
          (!q.min || v.price >= Number(q.min)) &&
          (!q.max || v.price <= Number(q.max)) &&
          (q.sale !== "1" || (v.compareAt !== null && v.compareAt > v.price)) &&
          (q.stock !== "1" || available(s, p, v) > 0),
      );
      if (!variants.length) return [];
      const v = [...variants].sort((a, b) => a.price - b.price)[0];
      return [{ p, v }];
    });
  if (q.sort === "priceAsc") rows.sort((a, b) => a.v.price - b.v.price);
  if (q.sort === "priceDesc") rows.sort((a, b) => b.v.price - a.v.price);
  if (q.sort === "newest")
    rows.sort((a, b) => b.p.createdAt.localeCompare(a.p.createdAt));
  return rows;
}
export function socialUrl(p: Social) {
  try {
    const u = new URL(p.url);
    const hosts: Record<string, string[]> = {
      instagram: ["instagram.com"],
      facebook: ["facebook.com", "fb.com"],
      x: ["x.com", "twitter.com"],
      youtube: ["youtube.com", "youtu.be"],
      tiktok: ["tiktok.com"],
      snapchat: ["snapchat.com"],
      linkedin: ["linkedin.com"],
    };
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      !hosts[p.platform].some(
        (h) => u.hostname === h || u.hostname === "www." + h,
      ) ||
      u.pathname === "/"
    )
      return null;
    return u.href;
  } catch {
    return null;
  }
}
export const whatsappUrl = (value: string) => {
  const v = value.replace(/\D/g, "");
  return /^\d{10,15}$/.test(v) && !/(\d)\1{6}|123456|555555/.test(v)
    ? `https://wa.me/${v}`
    : null;
};
export function quote(s: Store, input: unknown, coupon = "", now = Date.now()) {
  const parsed = cartLineSchema.array().max(100).safeParse(input);
  if (!parsed.success) throw new Error("Invalid cart");
  const lines = parsed.data;
  const demand = new Map<string, number>();
  let subtotal = 0,
    wrapping = 0;
  let samples = 0;
  const rows = lines.map((line) => {
    const p = s.products.find(
      (x) => x.id === line.productId && enabledProduct(s, x),
    );
    const v = p?.variants.find((x) => x.id === line.variantId);
    if (!p || !v) throw new Error("Unavailable product");
    if (
      (line.wrap && (!s.features.gifts || !p.giftEligible)) ||
      line.message.length > s.commerce.giftMessageMax
    )
      throw new Error("Invalid gift options");
    const add = (pid: string, vid: string, n: number) => {
      const key = pid + ":" + vid;
      demand.set(key, (demand.get(key) ?? 0) + n);
    };
    add(p.id, v.id, line.quantity);
    if ("contents" in p)
      for (const c of p.contents)
        add(c.productId, c.variantId, c.quantity * line.quantity);
    if (s.products.some((x) => x.sampleId === p.id)) samples += line.quantity;
    subtotal += v.price * line.quantity;
    wrapping += line.wrap ? s.commerce.giftWrapPrice * line.quantity : 0;
    return { line, p, v };
  });
  if (samples > s.commerce.maxSamples) throw new Error("Too many samples");
  for (const [key, n] of demand) {
    const [pid, vid] = key.split(":");
    const p = s.products.find((x) => x.id === pid && enabledProduct(s, x));
    if (!p || n > (p.variants.find((v) => v.id === vid)?.stock ?? 0))
      throw new Error("Insufficient stock");
  }
  const c = s.commerce.coupon;
  if (
    coupon &&
    (!c ||
      coupon.toUpperCase() !== c.code ||
      new Date(c.endsAt).getTime() <= now)
  )
    throw new Error("Invalid coupon");
  const discount = coupon && c ? Math.round(subtotal * c.percent) / 100 : 0;
  const delivery =
    lines.length === 0
      ? 0
      : s.commerce.freeDeliveryAbove !== null &&
          subtotal - discount >= s.commerce.freeDeliveryAbove
        ? 0
        : s.commerce.deliveryFee;
  const total =
    Math.round((subtotal - discount + wrapping + (delivery ?? 0)) * 100) / 100;
  const fingerprint = JSON.stringify({
    lines,
    prices: rows.map((r) => r.v.price),
    subtotal,
    wrapping,
    discount,
    delivery,
    total,
  });
  return { rows, subtotal, wrapping, discount, delivery, total, fingerprint };
}
export const lineKey = (line: CartLine) =>
  [line.productId, line.variantId, line.wrap, line.message].join("|");
