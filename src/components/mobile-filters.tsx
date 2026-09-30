"use client";
import { useRef, type ReactNode } from "react";
import { useShop } from "./shop-context";
import { label } from "@/lib/catalog";
import { Icon } from "./icon";
export function MobileFilters({ children }: { children: ReactNode }) {
  const { s, l } = useShop();
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <div className="mobile-filter-control">
      <button className="button" onClick={() => dialog.current?.showModal()}>
        {label(s, "filter", l)} / {label(s, "sort", l)}
        <Icon name="filter" />
      </button>
      <dialog className="filter-sheet" ref={dialog}>
        <div className="drawer-head">
          <h2>{label(s, "filter", l)}</h2>
          <button
            className="icon-button"
            aria-label={label(s, "close", l)}
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </dialog>
    </div>
  );
}
