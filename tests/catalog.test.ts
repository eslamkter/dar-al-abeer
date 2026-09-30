import { test } from "node:test";
import assert from "node:assert/strict";
import { preview } from "../src/data/preview";
import { storeSchema, type CartLine } from "../src/lib/schema";
import {
  available,
  enabledProduct,
  quote,
  searchCatalog,
  resolveCatalogAt,
  socialUrl,
  whatsappUrl,
} from "../src/lib/catalog";
import { resolveRoute } from "../src/lib/routes";
const clone = () => structuredClone(preview);
const line = (
  productId: string,
  variantId: string,
  quantity = 1,
): CartLine => ({ productId, variantId, quantity, wrap: false, message: "" });
test("complete typed preview validates with ten purchasing models", () => {
  assert.equal(new Set(preview.products.map((p) => p.kind)).size, 10);
  assert.ok(preview.home.length >= 12);
  assert.ok(preview.products.length >= 24);
});
test("price boundaries, size, sorting and display use the matching variant", () => {
  const rows = searchCatalog(preview, preview.products, {
    size: "100",
    min: "385",
    max: "385",
    sort: "priceAsc",
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].p.id, "amber-nights");
  assert.equal(rows[0].v.id, "100");
  assert.equal(rows[0].v.price, 385);
  assert.equal(
    searchCatalog(preview, preview.products, {
      size: "50",
      min: "385",
      max: "385",
    }).length,
    0,
  );
});
test("Arabic normalization and SKU search resolve actual records", () => {
  assert.ok(searchCatalog(preview, preview.products, { q: "العنبر" }).length);
  assert.equal(
    searchCatalog(preview, preview.products, { q: "SH-AMBER-NIGHTS-100" })[0].p
      .id,
    "amber-nights",
  );
});
test("selected unavailable size does not inherit other size stock", () => {
  const p = preview.products.find((p) => p.id === "cedar-path")!;
  assert.equal(available(preview, p, p.variants[0]), 0);
  assert.equal(
    searchCatalog(preview, [p], { size: "50", stock: "1" }).length,
    0,
  );
  assert.equal(
    searchCatalog(preview, [p], { size: "100", stock: "1" }).length,
    1,
  );
});
test("set and separate lines share component inventory", () => {
  const s = clone();
  s.products.find((p) => p.id === "amber-nights")!.variants[0].stock = 1;
  assert.throws(() =>
    quote(s, [line("house-gift", "set"), line("amber-nights", "50")]),
  );
});
test("cart rejects tampering, negative quantities and stale IDs", () => {
  assert.throws(() => quote(preview, [line("amber-nights", "50", -1)]));
  assert.throws(() => quote(preview, [line("missing", "50")]));
  assert.throws(() => quote(preview, [line("amber-nights", "200")]));
});
test("duplicate cart lines aggregate stock even with different messages", () => {
  assert.throws(() =>
    quote(preview, [
      line("amber-nights", "50", 8),
      { ...line("amber-nights", "50", 8), wrap: true, message: "gift" },
    ]),
  );
});
test("quote wrapping, delivery, coupon expiration and fingerprint are deterministic", () => {
  const s = clone();
  const lines = [
    { ...line("amber-nights", "50"), wrap: true, message: "Hello" },
  ];
  const q = quote(s, lines, "DISCOVER", Date.parse("2026-10-01"));
  assert.equal(q.subtotal, 285);
  assert.equal(q.wrapping, 20);
  assert.equal(q.discount, 28.5);
  assert.equal(q.total, 301.5);
  assert.throws(() => quote(s, lines, "DISCOVER", Date.parse("2027-01-02")));
  s.products.find((p) => p.id === "amber-nights")!.variants[0].price++;
  assert.notEqual(
    quote(s, lines).fingerprint,
    quote(preview, lines).fingerprint,
  );
});
test("disabled gifts/samples disappear and are not purchasable", () => {
  const s = clone();
  s.features.gifts = false;
  s.features.samples = false;
  assert.equal(resolveRoute(s, "/gifts"), null);
  assert.equal(resolveRoute(s, "/discovery-sets"), null);
  assert.equal(
    enabledProduct(
      s,
      s.products.find((p) => p.id === "amber-sample")!,
    ),
    false,
  );
  assert.throws(() => quote(s, [line("house-gift", "set")]));
});
test("invalid fields and live illustrative records are rejected", () => {
  const s = clone();
  s.preview = false;
  assert.equal(storeSchema.safeParse(s).success, false);
  const bad = clone();
  bad.products[0].brand = "missing";
  assert.equal(storeSchema.safeParse(bad).success, false);
});
test("social profiles support Facebook and legacy Twitter, reject fake hosts and scripts", () => {
  const x = {
    id: "x",
    platform: "x" as const,
    label: { ar: "س", en: "X" },
    enabled: true,
    url: "https://twitter.com/howeyah",
  };
  assert.equal(socialUrl(x), "https://twitter.com/howeyah");
  assert.equal(
    socialUrl({ ...x, url: "https://twitter.com.evil.test/account" }),
    null,
  );
  assert.equal(socialUrl({ ...x, url: "javascript:alert(1)" }), null);
  assert.equal(socialUrl({ ...x, url: "https://x.com" }), null);
  assert.ok(
    socialUrl({
      ...x,
      platform: "facebook",
      url: "https://www.facebook.com/howeyah",
    }),
  );
  assert.equal(whatsappUrl("1234567890"), null);
  assert.equal(whatsappUrl(""), null);
});
test("deep routes enforce category-specific kinds and invalid paths are absent", () => {
  assert.ok(
    resolveRoute(preview, "/incense/oud")!.products.every(
      (p) => p.kind === "oud",
    ),
  );
  assert.ok(
    resolveRoute(preview, "/perfumes/oud")!.products.every(
      (p) => p.kind === "perfume" && p.notes.includes("oud"),
    ),
  );
  assert.equal(resolveRoute(preview, "/perfumes/unknown"), null);
  assert.equal(resolveRoute(preview, "/products/extra/extra"), null);
});
test("offer schedule controls actual SKU prices and unit-specific filters stay distinct", () => {
  const s = clone();
  const v = s.products.find((p) => p.id === "amber-nights")!.variants[0];
  v.compareAt = 400;
  v.offerStartsAt = "2026-10-01T00:00:00Z";
  v.offerEndsAt = "2026-11-01T00:00:00Z";
  assert.equal(
    resolveCatalogAt(s, Date.parse("2026-09-30")).products[0].variants[0].price,
    400,
  );
  assert.equal(
    resolveCatalogAt(s, Date.parse("2026-10-15")).products[0].variants[0].price,
    285,
  );
  assert.equal(
    resolveCatalogAt(s, Date.parse("2026-11-01")).products[0].variants[0]
      .compareAt,
    null,
  );
  assert.ok(
    searchCatalog(s, s.products, { size: "ml:50" }).every(
      ({ v }) => "volumeMl" in v && v.volumeMl === 50,
    ),
  );
  assert.ok(
    searchCatalog(s, s.products, { size: "g:50" }).every(
      ({ v }) => "weightG" in v && v.weightG === 50,
    ),
  );
});
