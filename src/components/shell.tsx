"use client";
import Link from "next/link";
import { publishedLink } from "@/lib/routes";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useShop } from "./shop-context";
import { Icon } from "./icon";
import { Search } from "./search";
import { Navigation } from "./navigation";
import { href, label, money, socialUrl, whatsappUrl } from "@/lib/catalog";
export function Header({ initialPath }: { initialPath: string }) {
  const { s, l, state } = useShop();
  const path = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const bag = useRef<HTMLDialogElement>(null);
  const other = l === "ar" ? "en" : "ar";
  const tr = (k: string) => label(s, k, l);
  const switchPath = path.replace(/^\/(ar|en)/, `/${other}`);
  const localeLink = (
    <a
      href={
        initialPath.split("?")[0] === path
          ? initialPath.replace(/^\/(ar|en)/, `/${other}`)
          : switchPath
      }
      lang={other}
      onClick={(e) => {
        e.preventDefault();
        location.assign(switchPath + location.search + location.hash);
      }}
    >
      {other === "en" ? "EN" : "العربية"}
    </a>
  );
  const search = <Search />;
  const nav = s.navigation.filter((x) => publishedLink(s, x.href));
  return (
    <>
      {s.announcement.enabled && (
        <div className="announcement">
          <Link href={href(l, s.announcement.href)}>
            {s.announcement.text[l]} <Icon />
          </Link>
          <span>{localeLink}</span>
        </div>
      )}
      <header className="site-header">
        <div className="header-main">
          <button
            className="icon-button mobile-menu"
            aria-label={tr("menu")}
            onClick={() => menu.current?.showModal()}
          >
            <Icon name="menu" />
          </button>
          <Link
            className="wordmark"
            href={href(l, "/")}
            aria-label={s.brand[l]}
          >
            <span>{s.brand.ar}</span>
            <small>{s.tagline[l]}</small>
          </Link>
          {search}
          <div className="header-actions">
            {!s.announcement.enabled && localeLink}
            {s.features.wishlist && (
              <Link
                className="icon-button"
                href={href(l, "/wishlist")}
                aria-label={tr("saved")}
              >
                <Icon name="heart" />
              </Link>
            )}
            <button
              className="bag-button"
              aria-label={tr("bag")}
              onClick={() => bag.current?.showModal()}
            >
              <Icon name="bag" />
              <span className="bag-label">{tr("bag")}</span>
              <b>{state.lines.reduce((n, x) => n + x.quantity, 0)}</b>
            </button>
          </div>
        </div>
        <Navigation />
      </header>
      <dialog
        ref={menu}
        className="drawer"
        onClick={(e) => {
          if (e.target === e.currentTarget) menu.current?.close();
        }}
      >
        <div className="drawer-head">
          <strong>{s.brand[l]}</strong>
          <button
            className="icon-button"
            aria-label={tr("close")}
            onClick={() => menu.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        {search}
        <nav onClick={() => menu.current?.close()}>
          {nav.map((x) => (
            <Link key={x.href} href={href(l, x.href)}>
              {x.label[l]}
              <Icon />
            </Link>
          ))}
          {s.features.finder && (
            <Link href={href(l, "/scent-finder")}>{tr("finder")}</Link>
          )}
        </nav>
        {localeLink}
      </dialog>
      <dialog ref={bag} className="drawer bag-drawer">
        <div className="drawer-head">
          <h2>{tr("bag")}</h2>
          <button
            className="icon-button"
            aria-label={tr("close")}
            onClick={() => bag.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        {!state.lines.length ? (
          <p>{tr("emptyBag")}</p>
        ) : (
          state.lines.map((line, i) => {
            const p = s.products.find((p) => p.id === line.productId);
            const v = p?.variants.find((v) => v.id === line.variantId);
            return p && v ? (
              <div key={i} className="mini-line">
                <img
                  src={v.media[0].src}
                  alt={v.media[0].alt[l]}
                  width="72"
                  height="72"
                />
                <div>
                  <strong>{p.name[l]}</strong>
                  <p>
                    {v.label[l]} · {line.quantity}
                  </p>
                  <span>{money(s, v.price * line.quantity, l)}</span>
                </div>
              </div>
            ) : null;
          })
        )}
        <Link
          className="button"
          href={href(l, "/cart")}
          onClick={() => bag.current?.close()}
        >
          {tr("bag")}
          <Icon />
        </Link>
      </dialog>
    </>
  );
}
export function Footer() {
  const { s, l } = useShop();
  const profiles = s.socialProfiles.filter((p) => p.enabled && socialUrl(p));
  const samples = s.previewSocialProfiles.filter((p) => p.enabled);
  const tr = (k: string) => label(s, k, l);
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="wordmark" href={href(l, "/")}>
            <span>{s.brand.ar}</span>
            <small>{s.tagline[l]}</small>
          </Link>
          <p>{s.tagline[l]}</p>
          {profiles.length > 0 && (
            <div className="socials">
              {profiles.map((p) => (
                <a
                  key={p.id}
                  href={socialUrl(p)!}
                  aria-label={p.label[l]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={p.platform} />
                </a>
              ))}
            </div>
          )}
          {s.preview &&
            s.sampleSocials &&
            !profiles.length &&
            samples.length > 0 && (
              <div>
                <small>{tr("sampleSocial")}</small>
                <div className="socials">
                  {samples.map((p) => (
                    <span
                      key={p.id}
                      role="img"
                      aria-label={p.label[l]}
                      title={p.label[l]}
                    >
                      <Icon name={p.platform} />
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
        {s.footer.map((g) => (
          <div key={g.title.en}>
            <h3>{g.title[l]}</h3>
            {g.links
              .filter((x) => publishedLink(s, x.href))
              .map((x) => (
                <Link key={x.href} href={href(l, x.href)}>
                  {x.label[l]}
                </Link>
              ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>{tr("rights")}</span>
        {s.preview && <span>{tr("sample")}</span>}
        <span>{s.currency}</span>
      </div>
    </footer>
  );
}
export function Floating() {
  const { s, l } = useShop();
  const wa = whatsappUrl(s.contact.whatsapp);
  return (
    <aside className="floating">
      {s.floating.whatsapp && wa && (
        <a href={wa} aria-label="WhatsApp">
          <Icon name="phone" />
        </a>
      )}
      {s.floating.wishlist && s.features.wishlist && (
        <Link href={href(l, "/wishlist")} aria-label={label(s, "saved", l)}>
          <Icon name="heart" />
        </Link>
      )}
      {s.floating.compare && s.features.compare && (
        <Link href={href(l, "/compare")}>{label(s, "compare", l)}</Link>
      )}
      {s.floating.backToTop && (
        <a href="#top" aria-label={label(s, "backTop", l)}>
          <Icon name="top" />
        </a>
      )}
    </aside>
  );
}
