import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getStore } from "@/lib/runtime";
import type { Locale } from "@/lib/schema";
import {
  available,
  enabledProduct,
  href,
  label,
  type Query,
} from "@/lib/catalog";
import { resolveRoute } from "@/lib/routes";
import { Home, FAQ } from "@/components/home";
import { Listing } from "@/components/listing";
import { Detail } from "@/components/detail";
import { Cart } from "@/components/cart";
import { Receipt } from "@/components/receipt";
import { Compare, SavedProducts } from "@/components/products";
import { ServiceForm } from "@/components/forms";
import { Icon } from "@/components/icon";
type Props = {
  params: Promise<{ locale: string; path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale, path = [] } = await params;
  const s = await getStore();
  const l = locale === "en" ? "en" : "ar";
  const p = "/" + path.join("/");
  const product =
    path[0] === "products" && path.length === 2
      ? s.products.find((p) => p.slug === path[1] && enabledProduct(s, p))
      : null;
  const route = resolveRoute(s, p);
  const guide =
    path[0] === "guides"
      ? s.guides.find((g) => g.id === path[1] && g.published)
      : undefined;
  const title =
    product?.name[l] ??
    guide?.name[l] ??
    route?.title[l] ??
    s.pages[path[0]]?.title[l] ??
    s.labels[path[0]]?.[l] ??
    s.brand[l];
  const description =
    product?.summary[l] ??
    guide?.description[l] ??
    route?.intro[l] ??
    s.pages[path[0]]?.intro[l] ??
    s.tagline[l];
  const query = await searchParams;
  const canonical = s.origin + href(l, p);
  return {
    metadataBase: new URL(s.origin),
    title: `${title} — ${s.brand[l]}`,
    description,
    robots: {
      index:
        s.indexable &&
        !s.preview &&
        !Object.keys(query).some((k) => k !== "sku") &&
        ![
          "cart",
          "checkout",
          "search",
          "wishlist",
          "compare",
          "recent",
          "receipt",
        ].includes(path[0]),
      follow: true,
    },
    alternates: {
      canonical,
      languages: { ar: s.origin + href("ar", p), en: s.origin + href("en", p) },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [
        product?.variants[0].media[0].src ??
          s.home.find((h) => h.kind === "hero")?.image ??
          "",
      ],
    },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { locale, path = [] } = await params;
  if (locale !== "ar" && locale !== "en") notFound();
  const l = locale as Locale;
  const s = await getStore();
  const raw = await searchParams;
  const q: Query = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
  const url = "/" + path.join("/");
  const tr = (k: string) => label(s, k, l);
  const [root, slug] = path;
  const crumbProduct =
    root === "products"
      ? s.products.find((p) => p.slug === slug && enabledProduct(s, p))
      : undefined;
  const crumbCategory = crumbProduct
    ? s.categories.find(
        (c) => c.published && c.kinds.includes(crumbProduct.kind),
      )
    : undefined;
  const crumbTitle =
    crumbProduct?.name[l] ??
    resolveRoute(s, url)?.title[l] ??
    s.guides.find((g) => g.id === slug)?.name[l] ??
    s.pages[root]?.title[l] ??
    s.labels[root]?.[l];
  const crumbs = (
    <nav className="breadcrumbs">
      <Link href={href(l, "/")}>{tr("home")}</Link>
      <Icon />
      <Link
        href={href(l, crumbCategory ? "/" + crumbCategory.id : "/products")}
      >
        {crumbCategory?.name[l] ?? tr("catalog")}
      </Link>
      {(crumbTitle && root !== "products") || crumbProduct ? (
        <>
          <Icon />
          <span>{crumbTitle}</span>
        </>
      ) : null}
    </nav>
  );
  if (root === "receipt" && slug && s.preview && path.length === 2)
    return <Receipt reference={slug} />;
  if (!path.length) return <Home s={s} l={l} />;
  if (s.redirects[url] && !s.redirects[url].match(/^\/(ar|en)/))
    permanentRedirect(href(l, s.redirects[url]));
  if (root === "products" && slug && path.length === 2) {
    const p = s.products.find((p) => p.slug === slug && enabledProduct(s, p));
    if (!p) notFound();
    const schema =
      !s.preview && s.indexable
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name[l],
            description: p.description[l],
            image: p.variants.flatMap((v) =>
              v.media.map((m) => new URL(m.src, s.origin).href),
            ),
            offers: p.variants.map((v) => ({
              "@type": "Offer",
              sku: v.sku,
              price: v.price,
              priceCurrency: s.currency,
              url: s.origin + href(l, url) + `?sku=${v.id}`,
              availability: `https://schema.org/${available(s, p, v) > 0 ? "InStock" : "OutOfStock"}`,
            })),
          }
        : null;
    return (
      <>
        {crumbs}
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
            }}
          />
        )}
        <Detail s={s} l={l} p={p} sku={q.sku} />
      </>
    );
  }
  const listing = resolveRoute(s, url);
  if (listing)
    return (
      <>
        {crumbs}
        <Listing
          s={s}
          l={l}
          {...listing}
          q={q}
          path={url}
          finder={root === "scent-finder"}
        />
      </>
    );
  if (
    path.length === 1 &&
    ["cart", "checkout", "wishlist", "recent", "compare"].includes(root)
  ) {
    if (
      (root === "wishlist" && !s.features.wishlist) ||
      (root === "recent" && !s.features.recent) ||
      (root === "compare" && !s.features.compare)
    )
      notFound();
    return (
      <>
        {crumbs}
        <section className="page-intro compact">
          <span className="eyebrow">{s.tagline[l]}</span>
          <h1>
            {tr(root === "cart" ? "bag" : root === "wishlist" ? "saved" : root)}
          </h1>
        </section>
        <section className="section">
          {root === "cart" || root === "checkout" ? (
            <Cart checkout={root === "checkout"} initialCoupon={q.coupon} />
          ) : root === "compare" ? (
            <Compare />
          ) : (
            <SavedProducts mode={root === "recent" ? "recent" : "saved"} />
          )}
        </section>
      </>
    );
  }
  if (
    path.length === 1 &&
    ["notes", "families", "occasions", "brands", "guides"].includes(root)
  ) {
    if (root === "brands" && !s.features.multiBrand) notFound();
    const entries =
      s[root as "notes" | "families" | "occasions" | "brands" | "guides"];
    return (
      <>
        {crumbs}
        <section className="page-intro">
          <span className="eyebrow">{s.tagline[l]}</span>
          <h1>{tr(root)}</h1>
          <p>{tr("catalogIntro")}</p>
        </section>
        <section className="section discovery-grid">
          {entries
            .filter((e) => e.published)
            .map((e, i) => (
              <Link key={e.id} href={href(l, `/${root}/${e.id}`)}>
                <img src={e.image} alt={e.name[l]} width="600" height="500" />
                <div>
                  <span className="eyebrow">0{i + 1}</span>
                  <h2>{e.name[l]}</h2>
                  <p>{e.description[l]}</p>
                  <Icon />
                </div>
              </Link>
            ))}
        </section>
      </>
    );
  }
  if (root === "guides" && slug && path.length === 2) {
    const g = s.guides.find((g) => g.id === slug && g.published);
    if (!g) notFound();
    return (
      <>
        {crumbs}
        <article className="guide-page">
          <header className="page-intro">
            <span className="eyebrow">{tr("journal")}</span>
            <h1>{g.name[l]}</h1>
            <p>{g.description[l]}</p>
          </header>
          <img
            className="guide-cover"
            src={g.image}
            alt={g.name[l]}
            width="1200"
            height="800"
          />
          <div className="reading">
            {g.paragraphs.map((p, i) => (
              <p key={i}>{p[l]}</p>
            ))}
            <Link className="button" href={href(l, "/scent-finder")}>
              {tr("finder")}
              <Icon />
            </Link>
          </div>
        </article>
      </>
    );
  }
  if (root === "faq" && path.length === 1)
    return (
      <>
        <section className="page-intro">
          <h1>{tr("faq")}</h1>
        </section>
        <section className="section">
          <FAQ s={s} l={l} />
        </section>
      </>
    );
  const page = s.pages[root];
  if (page && path.length === 1)
    return (
      <>
        {crumbs}
        <section
          className={`page-intro ${root === "about" ? "about-intro" : ""}`}
        >
          <span className="eyebrow">{s.tagline[l]}</span>
          <h1>{page.title[l]}</h1>
          <p>{page.intro[l]}</p>
        </section>
        {root === "contact" ? (
          <>
            <section className="contact-layout section">
              <div>
                {s.contact.email && (
                  <p>
                    <a href={`mailto:${s.contact.email}`}>{s.contact.email}</a>
                  </p>
                )}
                {s.contact.phone && (
                  <p>
                    <a dir="ltr" href={`tel:${s.contact.phone}`}>
                      {s.contact.phone}
                    </a>
                  </p>
                )}
                {s.contact.address[l] && <p>{s.contact.address[l]}</p>}
                {s.contact.hours[l] && <p>{s.contact.hours[l]}</p>}
                {/^https:\/\//.test(s.contact.mapUrl) && (
                  <p>
                    <a
                      className="text-link"
                      href={s.contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tr("viewMap")}
                      <Icon />
                    </a>
                  </p>
                )}
                {s.contact.branches.length > 0 && (
                  <div id="branches">
                    {s.contact.branches.map((b, i) => (
                      <div key={i}>
                        <h3>{b.name[l]}</h3>
                        <p>{b.address[l]}</p>
                      </div>
                    ))}
                  </div>
                )}
                <h2>{tr("contactSideTitle")}</h2>
                <p>{tr("contactSideBody")}</p>
                <Link className="text-link" href={href(l, "/scent-finder")}>
                  {tr("finder")}
                  <Icon />
                </Link>
              </div>
              <ServiceForm kind="contact" />
            </section>
            <section className="section">
              <FAQ s={s} l={l} />
            </section>
          </>
        ) : root === "about" ? (
          <>
            <section className="about-story section">
              <img
                src={page.image}
                alt={page.title[l]}
                width="1000"
                height="700"
              />
              <div>
                {page.sections.map((x) => (
                  <div key={x.title.en}>
                    <h2>{x.title[l]}</h2>
                    <p>{x.body[l]}</p>
                  </div>
                ))}
                <Link className="button" href={href(l, "/products")}>
                  {tr("continue")}
                  <Icon />
                </Link>
              </div>
            </section>
            <section className="about-notes section">
              <h2>{tr("aboutNotesTitle")}</h2>
              <div>
                {s.families
                  .filter((f) => f.published)
                  .map((f) => (
                    <Link key={f.id} href={href(l, `/families/${f.id}`)}>
                      <h3>{f.name[l]}</h3>
                      <p>{f.description[l]}</p>
                      <Icon />
                    </Link>
                  ))}
              </div>
            </section>
          </>
        ) : (
          <article className="reading section">
            {page.sections.map((x) => (
              <section key={x.title.en}>
                <h2>{x.title[l]}</h2>
                <p>{x.body[l]}</p>
              </section>
            ))}
            {root === "shipping" && (
              <dl className="facts">
                <div>
                  <dt>{tr("shipping")}</dt>
                  <dd>
                    {s.commerce.deliveryFee === null
                      ? tr("deliveryPending")
                      : `${s.commerce.deliveryFee} ${s.currency}`}
                  </dd>
                </div>
                <div>
                  <dt>{tr("freeAbove")}</dt>
                  <dd>
                    {s.commerce.freeDeliveryAbove ?? "—"} {s.currency}
                  </dd>
                </div>
              </dl>
            )}
          </article>
        )}
      </>
    );
  notFound();
}
