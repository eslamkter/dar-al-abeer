"use client";
import Link from "next/link";
import { useState } from "react";
import { useShop } from "./shop-context";
import { href, label, searchCatalog, money } from "@/lib/catalog";
import { Icon } from "./icon";
export function Search() {
  const { s, l } = useShop();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const matches = query.trim()
    ? searchCatalog(s, s.products, { q: query }).slice(0, 4)
    : [];
  return (
    <form
      className="header-search"
      action={href(l, "/search")}
      role="search"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <Icon name="search" />
      <input
        type="search"
        aria-label={label(s, "search", l)}
        name="q"
        placeholder={label(s, "search", l)}
        value={query}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      <button className="sr-only" type="submit">
        {label(s, "searchAction", l)}
      </button>
      {open && query.trim() && (
        <div className="search-results">
          <span role="status" className="eyebrow">
            {matches.length ? label(s, "suggestions", l) : label(s, "empty", l)}
          </span>
          {matches.map(({ p, v }) => (
            <Link
              key={p.id}
              href={href(l, `/products/${p.slug}?sku=${v.id}`)}
              onClick={() => setOpen(false)}
            >
              <img src={v.media[0].src} alt="" width="50" height="50" />
              <span>
                {p.name[l]}
                <small>{v.label[l]}</small>
              </span>
              <small>{money(s, v.price, l)}</small>
            </Link>
          ))}
          <Link
            className="text-link"
            href={href(l, "/search") + "?q=" + encodeURIComponent(query)}
            onClick={() => setOpen(false)}
          >
            {label(s, "all", l)}
            <Icon />
          </Link>
        </div>
      )}
    </form>
  );
}
