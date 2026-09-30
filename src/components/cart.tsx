"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useShop } from "./shop-context";
import { href, label, lineKey, money, quote } from "@/lib/catalog";
import { Icon } from "./icon";
export function Cart({
  checkout = false,
  initialCoupon = "",
}: {
  checkout?: boolean;
  initialCoupon?: string;
}) {
  const { s, l, state, ready, setLines } = useShop();
  const router = useRouter();
  const [coupon, setCoupon] = useState(initialCoupon);
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const idempotency = useRef("");
  const tr = (k: string) => label(s, k, l);
  let current: ReturnType<typeof quote> | undefined;
  let problem = "";
  try {
    current = quote(s, state.lines, coupon);
  } catch (e) {
    problem = e instanceof Error ? e.message : "Invalid cart";
  }
  if (!ready)
    return (
      <div className="empty-state" aria-busy="true">
        {tr("loading")}
        <noscript>{tr("requiresJs")}</noscript>
      </div>
    );
  if (complete)
    return (
      <section className="confirmation">
        <Icon name="check" />
        <h2>{tr(s.preview ? "orderDemoDone" : "orderDone")}</h2>
        <p>{tr(s.preview ? "orderDemoNotice" : "orderReceived")}</p>
        <Link className="button" href={href(l, "/products")}>
          {tr("continue")}
          <Icon />
        </Link>
      </section>
    );
  if (!state.lines.length)
    return (
      <div className="empty-state">
        <Icon name="bag" />
        <p>{tr("emptyBag")}</p>
        <Link className="button" href={href(l, "/products")}>
          {tr("continue")}
          <Icon />
        </Link>
      </div>
    );
  async function submit(form: FormData) {
    if (!current || pending) return;
    setPending(true);
    setStatus("");
    if (!idempotency.current) idempotency.current = crypto.randomUUID();
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotency.current,
        },
        body: JSON.stringify({
          lines: state.lines,
          coupon,
          fingerprint: current.fingerprint,
          customer: Object.fromEntries(form),
        }),
      });
      if (res.ok) {
        const result = await res.json();
        if (s.preview && result.reference) {
          try {
            localStorage.setItem(
              `shadha:${s.id}:receipt:${result.reference}`,
              JSON.stringify({
                reference: result.reference,
                items: current.rows.map((r) => ({
                  name: r.p.name,
                  size: r.v.label,
                  quantity: r.line.quantity,
                })),
                total: current.total,
              }),
            );
          } catch {}
          setLines([]);
          router.push(
            href(l, "/receipt/" + encodeURIComponent(result.reference)),
          );
        } else {
          setComplete(true);
          setLines([]);
        }
      } else {
        setStatus(tr(res.status === 409 ? "quoteChanged" : "serviceError"));
        if (res.status === 409) idempotency.current = "";
      }
    } catch {
      setStatus(tr("serviceError"));
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="cart-layout">
      <div>
        {checkout ? (
          <form
            id="checkout-form"
            className="checkout-form"
            onSubmit={(e) => {
              e.preventDefault();
              submit(new FormData(e.currentTarget));
            }}
          >
            <h2>{tr("deliveryDetails")}</h2>
            {["name", "email", "phone", "city", "district", "address"].map(
              (key) => (
                <label key={key}>
                  {tr(key)}
                  <input
                    name={key}
                    required
                    type={
                      key === "email"
                        ? "email"
                        : key === "phone"
                          ? "tel"
                          : "text"
                    }
                    autoComplete={
                      key === "name"
                        ? "name"
                        : key === "email"
                          ? "email"
                          : key === "phone"
                            ? "tel"
                            : key === "address"
                              ? "street-address"
                              : "off"
                    }
                    minLength={key === "phone" ? 8 : 2}
                    maxLength={key === "address" ? 300 : 120}
                  />
                </label>
              ),
            )}
            <label className="consent">
              <input type="checkbox" required />
              {tr("agree")} <Link href={href(l, "/terms")}>{tr("terms")}</Link>
            </label>
            <p>{tr(s.preview ? "orderDemoNotice" : "paymentHandoff")}</p>
          </form>
        ) : (
          <div className="cart-lines">
            {state.lines.map((line, i) => {
              const p = s.products.find((p) => p.id === line.productId);
              const v = p?.variants.find((v) => v.id === line.variantId);
              return (
                <article className="cart-line" key={lineKey(line) + i}>
                  {p && v ? (
                    <>
                      <Link href={href(l, `/products/${p.slug}?sku=${v.id}`)}>
                        <img
                          src={v.media[0].src}
                          alt={v.media[0].alt[l]}
                          width="150"
                          height="150"
                        />
                      </Link>
                      <div>
                        <Link href={href(l, `/products/${p.slug}?sku=${v.id}`)}>
                          <h2>{p.name[l]}</h2>
                        </Link>
                        <p>{v.label[l]}</p>
                        <strong>{money(s, v.price * line.quantity, l)}</strong>
                        <label className="cart-quantity">
                          {tr("quantity")}
                          <input
                            aria-label={`${tr("quantity")} ${p.name[l]}`}
                            type="number"
                            min="1"
                            max="20"
                            value={line.quantity}
                            onChange={(e) => {
                              const quantity = Number(e.target.value);
                              if (
                                Number.isInteger(quantity) &&
                                quantity >= 1 &&
                                quantity <= 20
                              )
                                setLines(
                                  state.lines.map((x, n) =>
                                    n === i ? { ...x, quantity } : x,
                                  ),
                                );
                            }}
                          />
                        </label>
                        {s.features.gifts && p.giftEligible && (
                          <>
                            <label className="consent">
                              <input
                                type="checkbox"
                                checked={line.wrap}
                                onChange={(e) =>
                                  setLines(
                                    state.lines.map((x, n) =>
                                      n === i
                                        ? {
                                            ...x,
                                            wrap: e.target.checked,
                                            message: e.target.checked
                                              ? x.message
                                              : "",
                                          }
                                        : x,
                                    ),
                                  )
                                }
                              />
                              {tr("wrap")} +
                              {money(s, s.commerce.giftWrapPrice, l)}
                            </label>
                            {line.wrap && (
                              <label>
                                {tr("message")}
                                <input
                                  value={line.message}
                                  maxLength={s.commerce.giftMessageMax}
                                  onChange={(e) =>
                                    setLines(
                                      state.lines.map((x, n) =>
                                        n === i
                                          ? { ...x, message: e.target.value }
                                          : x,
                                      ),
                                    )
                                  }
                                />
                              </label>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <p>{tr("unavailable")}</p>
                  )}
                  <button
                    className="icon-button"
                    aria-label={tr("remove")}
                    onClick={() =>
                      setLines(state.lines.filter((_, n) => n !== i))
                    }
                  >
                    <Icon name="close" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
      <aside className="order-summary">
        <h2>{tr("orderSummary")}</h2>
        {checkout &&
          state.lines.map((line, i) => {
            const p = s.products.find((p) => p.id === line.productId);
            return (
              <p key={i}>
                {p?.name[l]} ·{" "}
                {p?.variants.find((v) => v.id === line.variantId)?.label[l]} ×{" "}
                {line.quantity}
              </p>
            );
          })}
        <label>
          {tr("coupon")}
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.trim().toUpperCase())}
            placeholder={s.preview ? s.commerce.coupon?.code : undefined}
          />
        </label>
        {current ? (
          <dl>
            <dt>{tr("subtotal")}</dt>
            <dd>{money(s, current.subtotal, l)}</dd>
            <dt>{tr("wrap")}</dt>
            <dd>{money(s, current.wrapping, l)}</dd>
            <dt>{tr("discount")}</dt>
            <dd>−{money(s, current.discount, l)}</dd>
            <dt>{tr("shipping")}</dt>
            <dd>
              {current.delivery === null
                ? tr("deliveryPending")
                : money(s, current.delivery, l)}
            </dd>
            <dt className="total">{tr("total")}</dt>
            <dd className="total">{money(s, current.total, l)}</dd>
          </dl>
        ) : (
          <p role="alert">
            {tr(
              problem === "Invalid coupon" ? "invalidCoupon" : "stockWarning",
            )}
          </p>
        )}
        <small>
          {tr(s.commerce.taxIncluded ? "taxIncluded" : "taxExcluded")}
        </small>
        {checkout ? (
          <button
            className="button"
            type="submit"
            form="checkout-form"
            disabled={pending || !current || current.delivery === null}
          >
            {tr(pending ? "pending" : s.preview ? "orderDemo" : "checkout")}
            <Icon />
          </button>
        ) : current ? (
          <Link
            className="button"
            href={
              href(l, "/checkout") +
              (coupon ? "?coupon=" + encodeURIComponent(coupon) : "")
            }
          >
            {tr("checkout")}
            <Icon />
          </Link>
        ) : null}
        <Link
          className="text-link"
          href={
            href(l, checkout ? "/cart" : "/products") +
            (checkout && coupon ? "?coupon=" + encodeURIComponent(coupon) : "")
          }
        >
          {tr(checkout ? "editBag" : "continue")}
          <Icon />
        </Link>
        <p role="status">{status}</p>
      </aside>
    </div>
  );
}
