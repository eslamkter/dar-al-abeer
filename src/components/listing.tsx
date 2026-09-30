import Link from "next/link";
import type { Store, Locale, Product, Text } from "@/lib/schema";
import { href, label, searchCatalog, type Query } from "@/lib/catalog";
import { ProductCard } from "./products";
import { Icon } from "./icon";
import { MobileFilters } from "./mobile-filters";
export function Listing({
  s,
  l,
  products,
  q,
  title,
  intro,
  path,
  finder = false,
  image = "",
}: {
  s: Store;
  l: Locale;
  products: Product[];
  q: Query;
  title: Text;
  intro: Text;
  path: string;
  finder?: boolean;
  image?: string;
}) {
  const tr = (k: string) => label(s, k, l);
  const rows = searchCatalog(
    s,
    products,
    finder
      ? { ...q, stock: "1" }
      : path === "/offers"
        ? { ...q, sale: "1" }
        : q,
  );
  const page = Math.max(1, Number(q.page) || 1);
  const pageSize = finder ? 3 : 12;
  const shown = finder
    ? rows.slice(0, 3)
    : rows.slice((page - 1) * pageSize, page * pageSize);
  const kinds = [...new Set(products.map((p) => p.kind))];
  const sizes = [
    ...new Set(
      products.flatMap((p) =>
        p.variants.map((v) =>
          "volumeMl" in v
            ? `ml:${v.volumeMl}`
            : "weightG" in v
              ? `g:${v.weightG}`
              : "",
        ),
      ),
    ),
  ]
    .filter(Boolean)
    .sort((a, b) => Number(a.split(":")[1]) - Number(b.split(":")[1]));
  const pagination = (n: number) => {
    const params = new URLSearchParams(
      Object.entries(q).filter(
        (x): x is [string, string] => typeof x[1] === "string",
      ),
    );
    params.set("page", String(n));
    return href(l, path) + "?" + params;
  };
  const select = (
    name: string,
    key: string,
    options: { id: string; name: Text }[],
  ) =>
    options.length > 0 && (
      <label>
        {tr(key)}
        <select name={name} defaultValue={q[name] ?? ""}>
          <option value="">{tr("all")}</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name[l]}
            </option>
          ))}
        </select>
      </label>
    );
  const filters = (
    <form
      action={href(l, path)}
      className={`filter-form ${finder ? "finder-form" : ""}`}
    >
      <label className="search-field">
        {tr("searchAction")}
        <input
          name="q"
          type="search"
          defaultValue={q.q}
          placeholder={tr("search")}
        />
      </label>
      {select(
        "note",
        "notes",
        s.notes.filter(
          (n) => n.published && products.some((p) => p.notes.includes(n.id)),
        ),
      )}
      {products.some((p) => p.kind !== "burner") &&
        select(
          "family",
          "family",
          s.families.filter(
            (n) => n.published && products.some((p) => p.family === n.id),
          ),
        )}
      {select(
        "occasion",
        "occasion",
        s.occasions.filter(
          (n) =>
            n.published && products.some((p) => p.occasions.includes(n.id)),
        ),
      )}
      {finder &&
        select(
          "intensity",
          "intensity",
          ["soft", "balanced", "rich"].map((id) => ({
            id,
            name: s.labels[id],
          })),
        )}
      {!finder &&
        kinds.length > 1 &&
        select(
          "kind",
          "type",
          kinds.map((id) => ({ id, name: s.labels[id] })),
        )}
      {!finder && sizes.length > 0 && (
        <label>
          {tr("size")}
          <select
            name="size"
            defaultValue={
              q.size?.includes(":")
                ? q.size
                : (sizes.find((size) => size.endsWith(":" + q.size)) ?? "")
            }
          >
            <option value="">{tr("all")}</option>
            {sizes.map((n) => (
              <option key={n} value={n}>
                {n.split(":")[1]} {n.split(":")[0]}
              </option>
            ))}
          </select>
        </label>
      )}
      {!finder &&
        select(
          "oilType",
          "oilType",
          [
            ...new Set(
              products.flatMap((p) => (p.kind === "oil" ? [p.oilType] : [])),
            ),
          ].map((id) => ({ id, name: s.labels[id] })),
        )}
      {!finder &&
        select("origin", "origin", [
          ...new Map(
            products.flatMap((p) =>
              "origin" in p && p.origin
                ? [[p.origin.en, { id: p.origin.en, name: p.origin }] as const]
                : [],
            ),
          ).values(),
        ])}
      {!finder &&
        select("grade", "grade", [
          ...new Map(
            products.flatMap((p) =>
              p.kind === "oud" && p.grade
                ? [[p.grade.en, { id: p.grade.en, name: p.grade }] as const]
                : [],
            ),
          ).values(),
        ])}
      {!finder &&
        select(
          "heatSource",
          "heatSource",
          [
            ...new Set(
              products.flatMap((p) =>
                p.kind === "burner" ? [p.heatSource] : [],
              ),
            ),
          ].map((id) => ({ id, name: s.labels[id] })),
        )}
      {!finder &&
        select(
          "audience",
          "audience",
          [
            ...new Set(
              products.flatMap((p) =>
                p.kind === "perfume" ? [p.audience] : [],
              ),
            ),
          ].map((id) => ({ id, name: s.labels[id] })),
        )}
      {s.features.multiBrand &&
        select(
          "brand",
          "brand",
          s.brands.filter(
            (n) => n.published && products.some((p) => p.brand === n.id),
          ),
        )}
      {!finder && products.some((p) => p.kind === "perfume") && (
        <label>
          {tr("concentration")}
          <select name="concentration" defaultValue={q.concentration ?? ""}>
            <option value="">{tr("all")}</option>
            {[
              ...new Set(
                products.flatMap((p) =>
                  p.kind === "perfume"
                    ? p.variants.map((v) => v.concentration)
                    : [],
                ),
              ),
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      )}
      <label>
        {tr("min")} ({s.currency})
        <input name="min" type="number" min="0" defaultValue={q.min} />
      </label>
      <label>
        {tr("max")} ({s.currency})
        <input name="max" type="number" min="0" defaultValue={q.max} />
      </label>
      <div className="filter-actions">
        <label className="filter-sort">
          {tr("sort")}
          <select name="sort" defaultValue={q.sort ?? "newest"}>
            {["newest", "priceAsc", "priceDesc"].map((k) => (
              <option key={k} value={k}>
                {tr(k)}
              </option>
            ))}
          </select>
        </label>
        <label className="stock-filter">
          <input
            name="stock"
            type="checkbox"
            value="1"
            defaultChecked={q.stock === "1"}
          />
          <span>{tr("inStock")}</span>
        </label>
        <button className="button" type="submit">
          {tr(finder ? "find" : "filter")}
          <Icon name="filter" />
        </button>
      </div>
    </form>
  );
  return (
    <>
      <section className={`page-intro ${image ? "discovery-intro" : ""}`}>
        <div>
          <span className="eyebrow">{s.tagline[l]}</span>
          <h1>{title[l]}</h1>
          <p>{intro[l]}</p>
        </div>
        {image && <img src={image} alt={title[l]} width="360" height="260" />}
      </section>
      <section className="catalog-section">
        <div className="desktop-filters">{filters}</div>
        <MobileFilters>{filters}</MobileFilters>
        <form className="mobile-sort" action={href(l, path)}>
          {Object.entries(q)
            .filter(([k, v]) => k !== "sort" && k !== "page" && v)
            .map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} />
            ))}
          <label>
            {tr("sort")}
            <select name="sort" defaultValue={q.sort ?? "newest"}>
              {["newest", "priceAsc", "priceDesc"].map((k) => (
                <option key={k} value={k}>
                  {tr(k)}
                </option>
              ))}
            </select>
          </label>
          <button className="icon-button" aria-label={tr("sort")}>
            <Icon />
          </button>
        </form>
        <noscript>
          <style>
            {
              ".desktop-filters{display:block!important}.mobile-filter-control{display:none!important}"
            }
          </style>
        </noscript>
        {Object.entries(q).some(
          ([key, value]) => value && !["page", "sort", "sale"].includes(key),
        ) && (
          <div className="active-filters">
            {Object.entries(q)
              .filter(
                ([key, value]) =>
                  value && !["page", "sort", "sale"].includes(key),
              )
              .map(([key, value]) => {
                const params = new URLSearchParams(
                  Object.entries(q).filter(
                    (entry): entry is [string, string] =>
                      !!entry[1] && entry[0] !== key && entry[0] !== "page",
                  ),
                );
                const text =
                  key === "note"
                    ? s.notes.find((n) => n.id === value)?.name[l]
                    : key === "family"
                      ? s.families.find((n) => n.id === value)?.name[l]
                      : key === "occasion"
                        ? s.occasions.find((n) => n.id === value)?.name[l]
                        : key === "brand"
                          ? s.brands.find((n) => n.id === value)?.name[l]
                          : key === "stock"
                            ? tr("inStock")
                            : (s.labels[value ?? ""]?.[l] ?? value);
                return (
                  <Link
                    key={key}
                    href={href(l, path) + (params.size ? "?" + params : "")}
                  >
                    {tr(
                      key === "q"
                        ? "searchAction"
                        : key === "note"
                          ? "notes"
                          : key,
                    )}
                    : {text}
                    <Icon name="close" />
                  </Link>
                );
              })}
          </div>
        )}
        <div className="results-head">
          <p>
            {finder ? shown.length : rows.length} {tr("results")}
          </p>
          <Link className="text-link" href={href(l, path)}>
            {tr("clear")}
            <Icon name="close" />
          </Link>
        </div>
        {shown.length ? (
          <div className={`product-grid ${finder ? "featured-grid" : ""}`}>
            {shown.map(({ p, v }) => (
              <div key={p.id}>
                <ProductCard p={p} v={v} />
                {finder && (
                  <p className="match-reason">
                    {tr("matchReason")}{" "}
                    {[
                      q.note
                        ? s.notes.find((n) => n.id === q.note)?.name[l]
                        : s.families.find((f) => f.id === p.family)?.name[l],
                      q.occasion
                        ? s.occasions.find((o) => o.id === q.occasion)?.name[l]
                        : null,
                      q.intensity ? tr(q.intensity) : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}{" "}
                    · {tr("available")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>{tr("empty")}</p>
            <Link className="button" href={href(l, path)}>
              {tr("clear")}
              <Icon />
            </Link>
          </div>
        )}
        {!finder && rows.length > pageSize && (
          <nav className="pagination" aria-label={tr("pagination")}>
            {Array.from(
              { length: Math.ceil(rows.length / pageSize) },
              (_, i) => (
                <Link
                  key={i}
                  aria-current={page === i + 1 ? "page" : undefined}
                  href={pagination(i + 1)}
                >
                  {i + 1}
                </Link>
              ),
            )}
          </nav>
        )}
      </section>
    </>
  );
}
