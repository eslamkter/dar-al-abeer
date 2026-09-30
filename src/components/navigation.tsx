"use client";
import Link from "next/link";
import { publishedLink } from "@/lib/routes";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useShop } from "./shop-context";
import { href, label } from "@/lib/catalog";
import { Icon } from "./icon";
export function Navigation() {
  const { s, l } = useShop();
  const path = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setActive(null);
        setPinned(false);
      }
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
        setPinned(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", key);
    };
  }, []);
  const close = () => {
    setActive(null);
    setPinned(false);
  };
  return (
    <nav
      ref={ref}
      className="desktop-nav"
      aria-label={label(s, "menu", l)}
      onMouseLeave={() => {
        if (!pinned) setActive(null);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) close();
      }}
    >
      {s.navigation
        .filter((x) => publishedLink(s, x.href))
        .map((x, i) => (
          <div
            className="nav-item"
            key={x.href}
            onMouseEnter={() => {
              if (!pinned) setActive(x.children.length ? x.href : null);
            }}
          >
            <Link
              href={href(l, x.href)}
              aria-current={path === href(l, x.href) ? "page" : undefined}
              onClick={close}
            >
              {x.label[l]}
            </Link>
            {x.children.length > 0 && (
              <>
                <button
                  className="nav-expand"
                  aria-label={`${label(s, "explore", l)} ${x.label[l]}`}
                  aria-expanded={active === x.href}
                  aria-controls={`nav-panel-${i}`}
                  onClick={(e) => {
                    toggleRef.current = e.currentTarget;
                    if (pinned && active === x.href) close();
                    else {
                      setActive(x.href);
                      setPinned(true);
                    }
                  }}
                >
                  <span aria-hidden="true">⌄</span>
                </button>
                <div
                  id={`nav-panel-${i}`}
                  className="mega-menu"
                  hidden={active !== x.href}
                >
                  <div>
                    <span className="eyebrow">{s.tagline[l]}</span>
                    <h2>{x.label[l]}</h2>
                    <Link
                      className="text-link"
                      href={href(l, x.href)}
                      onClick={close}
                    >
                      {label(s, "all", l)}
                      <Icon />
                    </Link>
                  </div>
                  <div className="mega-links">
                    {x.children
                      .filter((c) => publishedLink(s, c.href))
                      .map((c) => (
                        <Link
                          key={c.href}
                          href={href(l, c.href)}
                          onClick={close}
                        >
                          {c.label[l]}
                          <Icon />
                        </Link>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      {s.features.finder && (
        <Link
          className="finder-link"
          href={href(l, "/scent-finder")}
          onClick={close}
        >
          <Icon name="spark" />
          {label(s, "finder", l)}
          <Icon />
        </Link>
      )}
    </nav>
  );
}
