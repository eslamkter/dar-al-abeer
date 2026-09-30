import type { Store, Product, Text } from "./schema";
import { enabledProduct } from "./catalog";
export function resolveRoute(s: Store, path: string) {
  const parts = path.split("/").filter(Boolean);
  const [root, slug] = parts;
  const all = s.products;
  let products: Product[] | undefined;
  let title: Text = s.labels.catalog;
  let intro: Text = s.labels.catalogIntro;
  let image = "";
  if (parts.length === 1 && ["oud", "bakhoor", "maamoul"].includes(root)) {
    products = all.filter((p) => p.kind === root);
    title = s.labels[root];
  }
  if (
    parts.length <= 1 &&
    ["products", "search", "scent-finder"].includes(root)
  ) {
    products = all;
    if (root === "scent-finder") {
      if (!s.features.finder) return null;
      products = all.filter((p) => p.kind === "perfume" || p.kind === "oil");
      title = s.labels.finder;
      intro = s.labels.finderIntro;
    }
  }
  const category = s.categories.find((c) => c.id === root && c.published);
  if (category && parts.length <= 2) {
    products = all.filter((p) => category.kinds.includes(p.kind));
    title = category.name;
    intro = category.description;
    if (slug) {
      if (
        root === "perfumes" &&
        s.notes.some((n) => n.id === slug && n.published)
      )
        products = products.filter((p) => p.notes.includes(slug));
      else if (
        root === "incense" &&
        ["oud", "bakhoor", "maamoul"].includes(slug)
      )
        products = products.filter((p) => p.kind === slug);
      else return null;
      title = s.notes.find((n) => n.id === slug)?.name ?? s.labels[slug];
    }
  }
  if (root === "collections" && slug === "signatures" && parts.length === 2) {
    const ids = s.home.find((h) => h.kind === "products")?.productIds ?? [];
    products = all.filter((p) => ids.includes(p.id));
    title = s.home.find((h) => h.kind === "products")?.title ?? title;
  }
  if (
    ["notes", "families", "occasions", "brands"].includes(root) &&
    slug &&
    parts.length === 2
  ) {
    if (root === "brands" && !s.features.multiBrand) return null;
    const entries = s[root as "notes" | "families" | "occasions" | "brands"];
    const entry = entries.find((e) => e.id === slug && e.published);
    if (!entry) return null;
    products = all.filter((p) =>
      root === "notes"
        ? p.notes.includes(slug)
        : root === "families"
          ? p.family === slug
          : root === "brands"
            ? p.brand === slug
            : p.occasions.includes(slug),
    );
    title = entry.name;
    intro = entry.description;
    image = entry.image;
  }
  if (parts.length === 1 && root === "gifts" && s.features.gifts) {
    products = all.filter((p) => p.kind === "gift-set");
    title = s.labels.gifts;
  }
  if (parts.length === 1 && root === "discovery-sets" && s.features.samples) {
    products = all.filter(
      (p) => p.kind === "discovery-set" || all.some((x) => x.sampleId === p.id),
    );
    title = s.labels.samples;
  }
  if (parts.length === 1 && root === "offers") {
    products = all.filter((p) =>
      p.variants.some((v) => v.compareAt !== null && v.compareAt > v.price),
    );
    if (!products.length) return null;
    title = s.labels.offers;
  }
  return products ? { products, title, intro, image } : null;
}
export function publishedLink(s: Store, value: string) {
  if (/^https:\/\/|^mailto:|^tel:/.test(value)) return true;
  const path = value.split("?")[0].replace(/\/$/, "") || "/";
  const parts = path.split("/").filter(Boolean);
  const [root, slug] = parts;
  if (path === "/") return true;
  if (root === "products" && slug)
    return (
      parts.length === 2 &&
      s.products.some((p) => p.slug === slug && enabledProduct(s, p))
    );
  if (parts.length === 1 && s.pages[root]) return true;
  if (resolveRoute(s, path)) return true;
  if (["notes", "families", "occasions", "guides"].includes(root))
    return (
      parts.length === 1 ||
      (root === "guides" &&
        parts.length === 2 &&
        s.guides.some((g) => g.id === slug && g.published))
    );
  if (root === "brands") return s.features.multiBrand && parts.length === 1;
  return (
    parts.length === 1 &&
    (root === "faq" ||
      root === "cart" ||
      root === "checkout" ||
      (root === "wishlist" && s.features.wishlist) ||
      (root === "recent" && s.features.recent) ||
      (root === "compare" && s.features.compare))
  );
}
