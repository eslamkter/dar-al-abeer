"use client";
import { useState } from "react";
import { useShop } from "./shop-context";
import { label } from "@/lib/catalog";
import { Icon } from "./icon";
export function ServiceForm({ kind }: { kind: "contact" | "newsletter" }) {
  const { s, l } = useShop();
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const tr = (k: string) => label(s, k, l);
  if (!s.preview && !s.services[kind]) return <p>{tr("serviceUnavailable")}</p>;
  return (
    <form
      className={`service-form ${kind}`}
      onSubmit={async (e) => {
        e.preventDefault();
        if (pending) return;
        setPending(true);
        setStatus("");
        const data = Object.fromEntries(new FormData(e.currentTarget));
        try {
          const res = await fetch("/api/service", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind, ...data }),
          });
          const result = await res.json();
          setStatus(
            tr(
              res.ok
                ? result.preview
                  ? "demoSuccess"
                  : "sent"
                : "serviceError",
            ),
          );
        } catch {
          setStatus(tr("serviceError"));
        } finally {
          setPending(false);
        }
      }}
    >
      {kind === "contact" && (
        <label>
          {tr("name")}
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
      )}
      <label>
        <span className={kind === "newsletter" ? "sr-only" : ""}>
          {tr("email")}
        </span>
        <input
          type="email"
          name="email"
          placeholder={tr("email")}
          autoComplete="email"
          required
          maxLength={254}
        />
      </label>
      {kind === "contact" && (
        <label>
          {tr("contactMessage")}
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={3000}
            rows={5}
          />
        </label>
      )}
      <label className="trap" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button className="button" type="submit" disabled={pending}>
        {tr(pending ? "pending" : kind === "newsletter" ? "subscribe" : "send")}
        <Icon />
      </button>
      {s.preview && (
        <small className="form-notice">
          {tr(kind === "newsletter" ? "newsletterNotice" : "sample")}
        </small>
      )}
      <p role="status" className="status">
        {status}
      </p>
      <noscript>{tr("requiresJs")}</noscript>
    </form>
  );
}
