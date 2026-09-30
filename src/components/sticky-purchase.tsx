"use client";
import { useEffect, useRef, useState } from "react";
import { useShop } from "./shop-context";
import { label } from "@/lib/catalog";
import { Icon } from "./icon";
export function StickyPurchase({ name }: { name: string }) {
  const { s, l } = useShop();
  const marker = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const target = document.querySelector(".product-copy .add-row");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0),
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <span ref={marker} />
      {visible && (
        <div className="sticky-purchase">
          <span>{name}</span>
          <a className="button" href="#purchase">
            {label(s, "choose", l)}
            <Icon name="plus" />
          </a>
        </div>
      )}
    </>
  );
}
