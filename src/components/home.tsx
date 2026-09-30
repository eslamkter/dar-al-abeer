import Link from "next/link";
import type { Store, Locale, HomeSection } from "@/lib/schema";
import { enabledProduct, href, label } from "@/lib/catalog";
import { Icon } from "./icon";
import { ProductCard } from "./products";
import { ServiceForm } from "./forms";
import { publishedLink } from "@/lib/routes";
export function SectionHeading({
  section,
  l,
  index,
}: {
  section: HomeSection;
  l: Locale;
  index?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {index && <span className="sr-only">{index}</span>}
        <h2>{section.title[l]}</h2>
        <p>{section.body[l]}</p>
      </div>
      {section.href && (
        <Link className="text-link" href={href(l, section.href)}>
          {section.action[l]}
          <Icon />
        </Link>
      )}
    </div>
  );
}
export function FAQ({ s, l }: { s: Store; l: Locale }) {
  return (
    <div className="faq-grid" data-faq>
      {s.faq.map((f, i) => (
        <article key={f.question.en}>
          <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
          <h3>{f.question[l]}</h3>
          <p>{f.answer[l]}</p>
        </article>
      ))}
    </div>
  );
}
export function Home({ s, l }: { s: Store; l: Locale }) {
  const now = new Date().getTime();
  return (
    <>
      {s.home
        .filter(
          (h) =>
            h.enabled &&
            (!h.startsAt || new Date(h.startsAt).getTime() <= now) &&
            (!h.endsAt || new Date(h.endsAt).getTime() > now),
        )
        .map((h) => {
          const common = {
            id: h.id,
            style: {
              "--section-gap": `${h.presentation.gap}px`,
              "--section-height": `${h.presentation.height}px`,
            } as React.CSSProperties,
          };
          const photo = (
            <img
              src={h.image}
              alt={h.title[l].replace("\n", " ")}
              width="1200"
              height="1000"
              loading={h.kind === "hero" ? "eager" : "lazy"}
              fetchPriority={h.kind === "hero" ? "high" : "auto"}
              style={{ objectPosition: h.presentation.imagePosition }}
            />
          );
          const action = (
            <Link className="button" href={href(l, h.href)}>
              {h.action[l]}
              <Icon />
            </Link>
          );
          switch (h.kind) {
            case "hero":
              return (
                <section
                  key={h.id}
                  {...common}
                  className="hero campaign-hero"
                  data-hero-mechanic="photographic-campaign"
                >
                  <div className="hero-copy">
                    <span className="eyebrow">
                      <i />
                      {s.tagline[l]}
                    </span>
                    <h1>{h.title[l]}</h1>
                    <p>{h.body[l]}</p>
                    {action}
                    <span className="hero-caption">
                      {label(s, "heroCaption", l)}
                    </span>
                  </div>
                  <div className="hero-art">
                    {photo}
                    <span className="image-signature">
                      {s.brand.en}
                      <small>{s.tagline[l]}</small>
                    </span>
                  </div>
                </section>
              );
            case "trust":
              return s.trust.length ? (
                <section
                  key={h.id}
                  {...common}
                  className="trust-strip"
                  data-trust
                  aria-label={h.title[l]}
                >
                  {s.trust.map((x) => (
                    <div key={x.title.en}>
                      <span className="trust-number">
                        {String(s.trust.indexOf(x) + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <strong>{x.title[l]}</strong>
                        <small>{x.body[l]}</small>
                      </div>
                    </div>
                  ))}
                </section>
              ) : null;
            case "promotions": {
              const banners = h.banners.filter(
                (b) =>
                  b.enabled && !!b.image &&
                  (!b.startsAt || new Date(b.startsAt).getTime() <= now) &&
                  (!b.endsAt || new Date(b.endsAt).getTime() > now) &&
                  (b.requirement === "none" || s.features[b.requirement]) &&
                  publishedLink(s, b.href),
              );
              return banners.length ? (
                <section
                  key={h.id}
                  {...common}
                  className="promotion-section"
                  aria-label={h.title[l]}
                  data-campaigns
                >
                  <div className="promotion-grid">
                    {banners.map((b) => (
                      <article key={b.id} className="promotion-banner">
                        <picture>
                          {b.mobileImage && (
                            <source
                              media="(max-width:600px)"
                              srcSet={b.mobileImage}
                            />
                          )}
                          <img
                            src={b.image}
                            alt={b.title[l]}
                            width="800"
                            height="600"
                            loading="lazy"
                            style={{ objectPosition: b.imagePosition }}
                          />
                        </picture>
                        <div>
                          <h2>{b.title[l]}</h2>
                          <p>{b.body[l]}</p>
                          <Link className="text-link" href={href(l, b.href)}>
                            {b.action[l]}
                            <Icon />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null;
            }
            case "categories":
              return s.categories.some((x) => x.published) ? (
                <section key={h.id} {...common} className="section">
                  <SectionHeading section={h} l={l} index="01" />
                  <div className="category-grid">
                    {s.categories
                      .filter((c) => c.published)
                      .map((c, i) => (
                        <Link
                          key={c.id}
                          style={
                            { "--category-span": c.span } as React.CSSProperties
                          }
                          href={href(l, `/${c.id}`)}
                        >
                          <div className="category-image">
                            <img
                              src={c.image}
                              alt={c.name[l]}
                              width="400"
                              height="400"
                              loading="lazy"
                            />
                          </div>
                          <span>
                            <small>{String(i + 1).padStart(2, "0")}</small>
                            <h3>{c.name[l]}</h3>
                            <Icon />
                          </span>
                          <p>{c.description[l]}</p>
                        </Link>
                      ))}
                  </div>
                </section>
              ) : null;
            case "products": {
              const products = h.productIds
                .map((id) =>
                  s.products.find((p) => p.id === id && enabledProduct(s, p)),
                )
                .filter((p) => !!p);
              return products.length ? (
                <section key={h.id} {...common} className="section">
                  <SectionHeading section={h} l={l} index="02" />
                  <div className="product-grid featured-grid">
                    {products.map((p) => (
                      <ProductCard key={p.id} p={p} />
                    ))}
                  </div>
                </section>
              ) : null;
            }
            case "notes":
              if (!s.notes.some((n) => n.published)) return null;
              return (
                <section key={h.id} {...common} className="note-section">
                  <div className="note-intro">
                    <span className="eyebrow">{label(s, "notes", l)}</span>
                    <h2>{h.title[l]}</h2>
                    <p>{h.body[l]}</p>
                    {action}
                  </div>
                  <div className="note-index" data-linked-index>
                    {s.notes
                      .filter((n) => n.published)
                      .map((n, i) => (
                        <Link href={href(l, `/notes/${n.id}`)} key={n.id}>
                          <img
                            className="note-thumb"
                            src={n.image}
                            alt=""
                            width="64"
                            height="64"
                            loading="lazy"
                          />
                          <span className="eyebrow">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <strong>{n.name[l]}</strong>
                          <span>{n.description[l]}</span>
                          <Icon />
                        </Link>
                      ))}
                  </div>
                </section>
              );
            case "oud":
            case "gifts":
              if (
                h.kind === "gifts" &&
                (!s.features.gifts ||
                  !s.products.some(
                    (p) => p.kind === "gift-set" && enabledProduct(s, p),
                  ))
              )
                return null;
              return (
                <section
                  key={h.id}
                  {...common}
                  className={`editorial ${h.kind} ${h.kind === "oud" ? "collection-campaign" : ""}`}
                >
                  <div className="editorial-photo">{photo}</div>
                  <div className="editorial-copy">
                    <span className="eyebrow">
                      {s.brand[l]} ·{" "}
                      {label(s, h.kind === "oud" ? "ritual" : "gifts", l)}
                    </span>
                    <h2>{h.title[l]}</h2>
                    <p>{h.body[l]}</p>
                    {action}
                    {h.productIds.length > 0 && (
                      <div className="editorial-products">
                        {h.productIds
                          .map((id) =>
                            s.products.find(
                              (p) => p.id === id && enabledProduct(s, p),
                            ),
                          )
                          .filter((p) => !!p)
                          .map((p) => (
                            <ProductCard key={p.id} p={p} />
                          ))}
                      </div>
                    )}
                    {h.kind === "oud" && (
                      <div className="editorial-links">
                        {s.categories
                          .filter((x) => ["incense", "burners"].includes(x.id))
                          .map((c) => (
                            <Link
                              key={c.id}
                              style={
                                {
                                  "--category-span": c.span,
                                } as React.CSSProperties
                              }
                              href={href(l, `/${c.id}`)}
                            >
                              {c.name[l]}
                              <Icon />
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                </section>
              );
            case "occasions":
              if (!s.occasions.some((n) => n.published)) return null;
              return (
                <section key={h.id} {...common} className="section">
                  <SectionHeading section={h} l={l} index="04" />
                  <div className="occasion-list">
                    {s.occasions
                      .filter((o) => o.published)
                      .map((o, i) => (
                        <Link key={o.id} href={href(l, `/occasions/${o.id}`)}>
                          <span className="eyebrow">0{i + 1}</span>
                          <img
                            src={o.image}
                            alt=""
                            width="100"
                            height="100"
                            loading="lazy"
                          />
                          <div>
                            <h3>{o.name[l]}</h3>
                            <p>{o.description[l]}</p>
                          </div>
                          <Icon />
                        </Link>
                      ))}
                  </div>
                </section>
              );
            case "story":
              return (
                <section key={h.id} {...common} className="journal-banner">
                  <div>
                    <span className="eyebrow">{label(s, "journal", l)}</span>
                    <h2>{h.title[l]}</h2>
                    <p>{h.body[l]}</p>
                    <Link className="text-link" href={href(l, h.href)}>
                      {h.action[l]}
                      <Icon />
                    </Link>
                  </div>
                  <div>{photo}</div>
                </section>
              );
            case "reviews":
              return s.reviews.length ? (
                <section key={h.id} {...common} className="section reviews">
                  <SectionHeading section={h} l={l} />
                  <div className="quote-grid">
                    {s.reviews.map((r) => (
                      <blockquote key={r.id}>
                        <span aria-hidden="true" className="quote-mark">
                          “
                        </span>
                        <p>{r.quote[l]}</p>
                        <div className="quote-credit">
                          {r.name[l]}
                          <span>
                            {r.sample
                              ? label(s, "sampleReview", l)
                              : r.verified
                                ? label(s, "verified", l)
                                : ""}
                          </span>
                        </div>
                      </blockquote>
                    ))}
                  </div>
                </section>
              ) : null;
            case "faq":
              return s.faq.length ? (
                <section key={h.id} {...common} className="section">
                  <SectionHeading section={h} l={l} />
                  <FAQ s={s} l={l} />
                </section>
              ) : null;
            case "capture":
              return s.preview || s.services.newsletter ? (
                <section key={h.id} {...common} className="capture">
                  <div>
                    <span className="eyebrow">{s.tagline[l]}</span>
                    <h2>{h.title[l]}</h2>
                    <p>{h.body[l]}</p>
                  </div>
                  <ServiceForm kind="newsletter" />
                </section>
              ) : null;
            case "brands":
              return s.features.multiBrand &&
                s.brands.some((b) => b.published) ? (
                <section key={h.id} {...common} className="section">
                  <SectionHeading section={h} l={l} />
                  <div className="brand-list">
                    {s.brands
                      .filter((b) => b.published)
                      .map((b) => (
                        <Link key={b.id} href={href(l, `/brands/${b.id}`)}>
                          {b.name[l]}
                        </Link>
                      ))}
                  </div>
                </section>
              ) : null;
          }
        })}
    </>
  );
}
