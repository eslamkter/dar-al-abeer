"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShop } from "./shop-context";
import { href, label, money } from "@/lib/catalog";
export function Receipt({ reference }: { reference: string }) {
  const { s, l } = useShop();
  const [receipt, setReceipt] = useState<null | {
    reference: string;
    items: {
      name: { ar: string; en: string };
      size: { ar: string; en: string };
      quantity: number;
    }[];
    total: number;
  }>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const data = JSON.parse(
          localStorage.getItem(`shadha:${s.id}:receipt:${reference}`) ?? "null",
        );
        if (
          data?.reference === reference &&
          Array.isArray(data.items) &&
          typeof data.total === "number"
        )
          setReceipt(data);
      } catch {}
      setReady(true);
    });
  }, [reference, s.id]);
  return (
    <section className="confirmation section">
      <h1>{label(s, receipt ? "orderDemoDone" : "receipt", l)}</h1>
      <p>
        {label(
          s,
          receipt ? "orderDemoNotice" : ready ? "receiptMissing" : "loading",
          l,
        )}
      </p>
      {receipt && (
        <>
          <strong dir="ltr">{receipt.reference}</strong>
          <ul>
            {receipt.items.map((item, i) => (
              <li key={i}>
                {item.name[l]} · {item.size[l]} × {item.quantity}
              </li>
            ))}
          </ul>
          <h2>
            {label(s, "total", l)} {money(s, receipt.total, l)}
          </h2>
          <button className="text-link" onClick={() => window.print()}>
            {label(s, "print", l)}
          </button>
        </>
      )}
      <p>
        <Link className="button" href={href(l, "/products")}>
          {label(s, "continue", l)}
        </Link>
      </p>
    </section>
  );
}
