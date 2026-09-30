import Link from "next/link";
import type { Store, Locale, Product, Variant } from "@/lib/schema";
import {
  enabledProduct,
  href,
  label,
  money,
  selectVariant,
} from "@/lib/catalog";
import { StickyPurchase } from "./sticky-purchase";
import {
  Gallery,
  ProductCard,
  ProductTools,
  Purchase,
  TrackView,
} from "./products";
export function Detail({
  s,
  l,
  p,
  sku,
}: {
  s: Store;
  l: Locale;
  p: Product;
  sku?: string;
}) {
  const tr = (k: string) => label(s, k, l);
  const v = selectVariant(s, p, sku);
  const note = (id: string) => s.notes.find((x) => x.id === id)?.name[l];
  const facts: [string, string][] = [];
  const add = (key: string, value: string | number | undefined | null) => {
    if (value !== undefined && value !== null && value !== "")
      facts.push([tr(key), String(value)]);
  };
  if (p.kind === "perfume") add("audience", tr(p.audience));
  if (p.kind === "oil") {
    add("oilType", tr(p.oilType));
    add("origin", p.origin?.[l]);
    add("applicator", p.applicator[l]);
  }
  if (p.kind === "oud") {
    add("origin", p.origin?.[l]);
    add("grade", p.grade?.[l]);
  }
  if ("heatingMethod" in p) add("heatingMethod", p.heatingMethod[l]);
  if ("blend" in p) add("blend", p.blend[l]);
  if (p.kind === "bakhoor") add("baseMaterial", p.baseMaterial[l]);
  if (p.kind === "home-spray") add("suitableSurfaces", p.suitableSurfaces[l]);
  if (p.kind === "diffuser") add("reeds", p.reedCount);
  if (p.kind === "burner") {
    add("material", p.material[l]);
    add("heatSource", tr(p.heatSource));
    add("voltage", p.voltage);
    add("power", p.powerW);
  }
  if ("packaging" in p) add("packaging", p.packaging[l]);
  if (p.performanceNote) add("performance", p.performanceNote[l]);
  const variantFacts = (x: Variant) =>
    "volumeMl" in x
      ? `${x.volumeMl} ml${"concentration" in x ? " · " + x.concentration : ""}`
      : "weightG" in x
        ? `${x.weightG} g${"pieces" in x ? " · " + x.pieces + " " + tr("pieces") : ""}`
        : "widthCm" in x
          ? `${x.widthCm} × ${x.depthCm} × ${x.heightCm} cm · ${x.finish[l]}`
          : x.label[l];
  const rail = (ids: string[], key: string) => {
    const products = ids
      .map((id) => s.products.find((x) => x.id === id && enabledProduct(s, x)))
      .filter((p): p is Product => !!p);
    return products.length ? (
      <section className="section related">
        <h2>{tr(key)}</h2>
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    ) : null;
  };
  return (
    <>
      <TrackView id={p.id} />
      <StickyPurchase name={p.name[l]} />
      <section className="product-detail">
        <Gallery p={p} initialId={v.id} />
        <div className="product-copy" id="purchase">
          <span className="eyebrow">
            {s.brands.find((x) => x.id === p.brand)?.name[l]} · {tr(p.kind)}
          </span>
          <h1>{p.name[l]}</h1>
          <p className="lead">{p.summary[l]}</p>
          <div className="note-chips">
            {p.notes.map((id) => (
              <Link key={id} href={href(l, `/notes/${id}`)}>
                {note(id)}
              </Link>
            ))}
          </div>
          <Purchase p={p} initialId={v.id} sync />
          <ProductTools p={p} />
          <p className="policy-link">
            <Link href={href(l, "/shipping")}>{s.pages.shipping.title[l]}</Link>
          </p>
        </div>
      </section>
      <section className="product-story section">
        <div>
          <span className="eyebrow">{tr("details")}</span>
          <h2>{p.name[l]}</h2>
          <p>{p.description[l]}</p>
          {facts.length > 0 && (
            <dl className="facts">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div>
          {p.kind === "perfume" && (
            <div className="pyramid">
              {(["top", "heart", "base"] as const).map((key, i) => (
                <div key={key}>
                  <span className="eyebrow">0{i + 1}</span>
                  <div>
                    <h3>{tr(key + "Notes")}</h3>
                    <p>{p.pyramid[key].map(note).join(" · ")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {"contents" in p && (
            <div className="set-contents">
              <h3>{tr("contents")}</h3>
              {p.contents.map((line) => {
                const child = s.products.find((x) => x.id === line.productId)!;
                const cv = child.variants.find((x) => x.id === line.variantId)!;
                return (
                  <Link
                    key={line.productId}
                    href={href(l, `/products/${child.slug}?sku=${cv.id}`)}
                  >
                    <img
                      src={cv.media[0].src}
                      alt={cv.media[0].alt[l]}
                      width="80"
                      height="80"
                    />
                    <span>
                      {child.name[l]}
                      <small>
                        {cv.label[l]} × {line.quantity}
                      </small>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
          <h3>{tr("guide")}</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{tr("size")}</th>
                  <th>{tr("details")}</th>
                  <th>{tr("price")}</th>
                  {("volumeMl" in v || "weightG" in v) && <th>{tr("unit")}</th>}
                </tr>
              </thead>
              <tbody>
                {p.variants.map((x) => (
                  <tr key={x.id}>
                    <td>{x.label[l]}</td>
                    <td>{variantFacts(x)}</td>
                    <td>{money(s, x.price, l)}</td>
                    {("volumeMl" in x || "weightG" in x) && (
                      <td>
                        {money(
                          s,
                          x.price / ("volumeMl" in x ? x.volumeMl : x.weightG),
                          l,
                        )}{" "}
                        / {"volumeMl" in x ? "ml" : "g"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="care-section section">
        <h2>{tr("care")}</h2>
        <p>{p.usage[l]}</p>
        <p>{p.care[l]}</p>
      </section>
      {rail(p.alternatives, "similar")}
      {rail(p.complements, "complements")}
    </>
  );
}
