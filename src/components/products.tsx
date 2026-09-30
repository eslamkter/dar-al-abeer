"use client";
import Link from "next/link";
import { Photo } from "./photo";
import { useEffect, useRef, useState } from "react";
import { type Product, type Variant } from "@/lib/schema";
import {
  available,
  enabledProduct,
  href,
  label,
  money,
  selectVariant,
} from "@/lib/catalog";
import { useShop } from "./shop-context";
import { Icon } from "./icon";
export function ProductCard({ p, v: chosen }: { p: Product; v?: Variant }) {
  const { s, l, state, toggle } = useShop();
  const dialog = useRef<HTMLDialogElement>(null);
  const v = chosen ?? selectVariant(s, p);
  const tr = (k: string) => label(s, k, l);
  const url = href(l, `/products/${p.slug}?sku=${v.id}`);
  return (
    <article className="product-card">
      <div className="product-stage">
        <Link href={url}>
          <Photo
            src={v.media[0].src}
            fallbackSrc={v.media[0].fallbackSrc}
            fallbackLabel={v.media[0].fallbackAlt?.[l]}
            alt={v.media[0].alt[l]}
            loading="lazy"
            width="600"
            height="600"
          />
        </Link>
        <span className="product-family">
          {s.families.find((x) => x.id === p.family)?.name[l]}
        </span>
        {s.features.wishlist && (
          <button
            className={`save-button icon-button ${state.saved.includes(p.id) ? "selected" : ""}`}
            aria-label={`${tr(state.saved.includes(p.id) ? "unsave" : "save")} ${p.name[l]}`}
            aria-pressed={state.saved.includes(p.id)}
            onClick={() => toggle("saved", p.id)}
          >
            <Icon name="heart" />
          </button>
        )}
        <button
          className="quick-view"
          aria-label={tr("quick")}
          onClick={() => dialog.current?.showModal()}
        >
          {tr("choose")}
          <Icon name="plus" />
        </button>
      </div>
      <div className="product-info">
        <Link href={url}>
          <h3>{p.name[l]}</h3>
        </Link>
        <p>
          {p.notes
            .map((n) => s.notes.find((x) => x.id === n)?.name[l])
            .filter(Boolean)
            .join(" · ") || p.summary[l]}
        </p>
        <div className="product-price">
          <span>
            {money(s, v.price, l)}
            {v.compareAt !== null && v.compareAt > v.price && (
              <del>{money(s, v.compareAt, l)}</del>
            )}
          </span>
          <small>{v.label[l]}</small>
        </div>
        {available(s, p, v) === 0 && <small>{tr("unavailable")}</small>}
      </div>
      <dialog className="quick-dialog" ref={dialog}>
        <button
          className="icon-button dialog-close"
          aria-label={tr("close")}
          onClick={() => dialog.current?.close()}
        >
          <Icon name="close" />
        </button>
        <div className="quick-layout">
          <Photo
            src={v.media[0].src}
            fallbackSrc={v.media[0].fallbackSrc}
            fallbackLabel={v.media[0].fallbackAlt?.[l]}
            alt={v.media[0].alt[l]}
            width="500"
            height="500"
          />
          <div>
            <h2>{p.name[l]}</h2>
            <p>{p.summary[l]}</p>
            <Purchase p={p} initialId={v.id} />
            <Link
              className="text-link"
              href={url}
              onClick={() => dialog.current?.close()}
            >
              {tr("details")}
              <Icon />
            </Link>
          </div>
        </div>
      </dialog>
    </article>
  );
}
export function Purchase({
  p,
  initialId,
  sync = false,
}: {
  p: Product;
  initialId?: string;
  sync?: boolean;
}) {
  const { s, l, add } = useShop();
  const [id, setId] = useState(selectVariant(s, p, initialId).id);
  const [qty, setQty] = useState(1);
  const [wrap, setWrap] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const v = p.variants.find((x) => x.id === id)!;
  const stock = available(s, p, v);
  const tr = (k: string) => label(s, k, l);
  function choose(id: string) {
    setId(id);
    setQty(1);
    setStatus("");
    if (sync) {
      const u = new URL(location.href);
      u.searchParams.set("sku", id);
      history.replaceState(null, "", u);
      dispatchEvent(
        new CustomEvent("shadha-variant", { detail: { product: p.id, id } }),
      );
    }
  }
  return (
    <div className="purchase">
      <div className="pdp-price">
        {money(s, v.price + (wrap ? s.commerce.giftWrapPrice : 0), l)}
        {v.compareAt !== null && v.compareAt > v.price && (
          <del>
            {money(s, v.compareAt + (wrap ? s.commerce.giftWrapPrice : 0), l)}
          </del>
        )}
        <small>
          {tr(stock ? "available" : "unavailable")} · {v.sku}
        </small>
      </div>
      <fieldset>
        <legend>{tr("size")}</legend>
        <div className="variant-options">
          {p.variants.map((option) => (
            <button
              type="button"
              key={option.id}
              className={id === option.id ? "active" : ""}
              aria-pressed={id === option.id}
              onClick={() => choose(option.id)}
            >
              {option.label[l]}
            </button>
          ))}
        </div>
      </fieldset>
      {s.features.gifts && p.giftEligible && (
        <div className="gift-option">
          <label>
            <input
              type="checkbox"
              checked={wrap}
              onChange={(e) => setWrap(e.target.checked)}
            />
            {tr("wrap")} <span>+{money(s, s.commerce.giftWrapPrice, l)}</span>
          </label>
          {wrap && (
            <label>
              {tr("message")}
              <textarea
                maxLength={s.commerce.giftMessageMax}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
          )}
        </div>
      )}
      <div className="add-row">
        <label className="quantity">
          <span className="sr-only">{tr("quantity")}</span>
          <input
            type="number"
            min="1"
            max={Math.min(20, stock)}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />
        </label>
        <button
          className="button"
          disabled={
            !stock ||
            !Number.isInteger(qty) ||
            qty < 1 ||
            qty > Math.min(20, stock)
          }
          onClick={() => {
            const ok = add({
              productId: p.id,
              variantId: id,
              quantity: qty,
              wrap,
              message: wrap ? message : "",
            });
            setStatus(tr(ok ? "added" : "stockWarning"));
          }}
        >
          {tr("add")}
          <Icon name="plus" />
        </button>
      </div>
      <p role="status" className="status">
        {status}
      </p>
    </div>
  );
}
export function Gallery({ p, initialId }: { p: Product; initialId?: string }) {
  const { s, l } = useShop();
  const [id, setId] = useState(selectVariant(s, p, initialId).id);
  const [index, setIndex] = useState(0);
  const touch = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const media =
    p.variants.find((v) => v.id === id)?.media ?? p.variants[0].media;
  const img = media[index] ?? media[0];
  useEffect(() => {
    const change = (event: Event) => {
      const e = event as CustomEvent<{ product: string; id: string }>;
      if (e.detail.product === p.id) {
        setId(e.detail.id);
        setIndex(0);
      }
    };
    window.addEventListener("shadha-variant", change);
    return () => window.removeEventListener("shadha-variant", change);
  }, [p.id]);
  return (
    <div className="gallery">
      <button
        className="gallery-main"
        onTouchStart={(e) => (touch.current = e.changedTouches[0].clientX)}
        onTouchEnd={(e) => {
          const d = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(d) > 45)
            setIndex(
              (i) =>
                (i + ((l === "ar" ? d > 0 : d < 0) ? 1 : media.length - 1)) %
                media.length,
            );
        }}
        aria-label={label(s, "zoom", l)}
        onClick={() => dialog.current?.showModal()}
      >
        <Photo
          style={{
            transform: img.view === "detail" ? "scale(1.55)" : undefined,
          }}
          src={img.src}
          fallbackSrc={img.fallbackSrc}
          fallbackLabel={img.fallbackAlt?.[l]}
          alt={img.alt[l]}
          width="900"
          height="900"
          fetchPriority="high"
        />
        <span>
          <Icon name="plus" />
        </span>
      </button>
      {media.length > 1 && (
        <div className="gallery-thumbs">
          {media.map((m, i) => (
            <button
              key={m.src + i}
              aria-label={m.alt[l]}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              <Photo
                style={{
                  transform: m.view === "detail" ? "scale(1.55)" : undefined,
                }}
                src={m.src}
                fallbackSrc={m.fallbackSrc}
                fallbackLabel={m.fallbackAlt?.[l]}
                alt=""
                width="80"
                height="80"
              />
            </button>
          ))}
        </div>
      )}
      {img.illustrative && (
        <small className="photo-note">{label(s, "photoNote", l)}</small>
      )}
      <dialog ref={dialog} className="zoom-dialog">
        <button
          className="icon-button dialog-close"
          aria-label={label(s, "close", l)}
          onClick={() => dialog.current?.close()}
        >
          <Icon name="close" />
        </button>
        <Photo
          src={img.src}
          fallbackSrc={img.fallbackSrc}
          fallbackLabel={img.fallbackAlt?.[l]}
          alt={img.alt[l]}
          width="1000"
          height="1000"
        />
      </dialog>
    </div>
  );
}
export function TrackView({ id }: { id: string }) {
  const { view, ready } = useShop();
  useEffect(() => {
    if (ready) view(id);
  }, [id, view, ready]);
  return null;
}
export function ProductTools({ p }: { p: Product }) {
  const { s, l, state, toggle } = useShop();
  return (
    <div className="product-tools">
      {s.features.wishlist && (
        <button
          className="text-link"
          aria-pressed={state.saved.includes(p.id)}
          onClick={() => toggle("saved", p.id)}
        >
          <Icon name="heart" />
          {label(s, state.saved.includes(p.id) ? "unsave" : "save", l)}
        </button>
      )}
      {s.features.compare && (
        <button
          className="text-link"
          aria-pressed={state.compared.includes(p.id)}
          onClick={() => toggle("compared", p.id)}
        >
          {label(s, "compare", l)}
          <Icon name="plus" />
        </button>
      )}
      {s.features.samples && p.sampleId && (
        <Link
          className="text-link"
          href={href(
            l,
            `/products/${s.products.find((x) => x.id === p.sampleId)?.slug}`,
          )}
        >
          {label(s, "sampleAction", l)}
          <Icon />
        </Link>
      )}
      {s.features.compare && (
        <Link href={href(l, "/compare")}>
          {label(s, "compare", l)} ({state.compared.length})
        </Link>
      )}
    </div>
  );
}
export function SavedProducts({
  mode = "saved",
}: {
  mode?: "saved" | "recent";
}) {
  const { s, l, state, ready } = useShop();
  const products = state[mode]
    .map((id) => s.products.find((p) => p.id === id && enabledProduct(s, p)))
    .filter((p): p is Product => !!p);
  return (
    <>
      {ready && !products.length && (
        <div className="empty-state">
          <Icon name="heart" />
          <p>{label(s, "noSaved", l)}</p>
          <Link className="button" href={href(l, "/products")}>
            {label(s, "continue", l)}
            <Icon />
          </Link>
        </div>
      )}
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}
export function Compare() {
  const { s, l, state, toggle } = useShop();
  const products = state.compared
    .map((id) => s.products.find((p) => p.id === id && enabledProduct(s, p)))
    .filter((p): p is Product => !!p);
  return products.length ? (
    <>
      <p className="compare-notice">{label(s, "compareNotice", l)}</p>
      <div className="compare-grid">
        {products.map((p) => {
          const v = selectVariant(s, p);
          return (
            <article key={p.id}>
              <ProductCard p={p} />
              <dl>
                <dt>{label(s, "type", l)}</dt>
                <dd>{label(s, p.kind, l)}</dd>
                <dt>{label(s, "size", l)}</dt>
                <dd>{p.variants.map((v) => v.label[l]).join(" / ")}</dd>
                <dt>{label(s, "family", l)}</dt>
                <dd>{s.families.find((f) => f.id === p.family)?.name[l]}</dd>
                <dt>{label(s, "unit", l)}</dt>
                <dd>
                  {"volumeMl" in v
                    ? money(s, v.price / Number(v.volumeMl), l) + " / ml"
                    : "weightG" in v
                      ? money(s, v.price / Number(v.weightG), l) + " / g"
                      : "—"}
                </dd>
                <dt>{label(s, "intensity", l)}</dt>
                <dd>{p.intensity ? label(s, p.intensity, l) : "—"}</dd>
                <dt>{label(s, "available", l)}</dt>
                <dd>
                  {label(
                    s,
                    available(s, p, v) ? "available" : "unavailable",
                    l,
                  )}
                </dd>
              </dl>
              <button
                className="text-link"
                onClick={() => toggle("compared", p.id)}
              >
                {label(s, "remove", l)}
              </button>
            </article>
          );
        })}
      </div>
    </>
  ) : (
    <p className="empty-state">{label(s, "noSaved", l)}</p>
  );
}
