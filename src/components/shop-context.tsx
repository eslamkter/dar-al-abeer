"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  cartLineSchema,
  type CartLine,
  type Store,
  type Locale,
} from "@/lib/schema";
import { lineKey, quote } from "@/lib/catalog";
type State = {
  lines: CartLine[];
  saved: string[];
  recent: string[];
  compared: string[];
};
const empty: State = { lines: [], saved: [], recent: [], compared: [] };
const Context = createContext<null | {
  s: Store;
  l: Locale;
  state: State;
  ready: boolean;
  add: (line: CartLine) => boolean;
  setLines: (lines: CartLine[]) => void;
  toggle: (key: "saved" | "compared", id: string) => void;
  view: (id: string) => void;
}>(null);
export function ShopProvider({
  s,
  l,
  children,
}: {
  s: Store;
  l: Locale;
  children: ReactNode;
}) {
  const [state, setState] = useState<State>(empty);
  const [ready, setReady] = useState(false);
  const key = `shadha:${s.id}:${s.preview ? "preview" : "live"}:v1`;
  // Hydrate browser-only storage after the server-identical first render.
  /* eslint-disable react-hooks/set-state-in-effect -- Browser storage hydration must follow the server-identical initial render. */
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(key) ?? "null");
      if (raw) {
        const list = (v: unknown) =>
          Array.isArray(v)
            ? v.filter(
                (x) =>
                  typeof x === "string" && s.products.some((p) => p.id === x),
              )
            : [];
        setState({
          lines: cartLineSchema.array().max(100).parse(raw.lines),
          saved: list(raw.saved),
          recent: list(raw.recent).slice(0, 8),
          compared: list(raw.compared).slice(0, 3),
        });
      }
    } catch {}
    setReady(true);
  }, [key, s.products]);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch {}
  }, [key, state, ready]);
  function add(line: CartLine) {
    const next = state.lines.map((x) => ({ ...x }));
    const existing = next.find((x) => lineKey(x) === lineKey(line));
    if (existing) existing.quantity += line.quantity;
    else next.push(line);
    try {
      quote(s, next);
      setState((v) => ({ ...v, lines: next }));
      return true;
    } catch {
      return false;
    }
  }
  function toggle(k: "saved" | "compared", id: string) {
    setState((v) => {
      const compatible =
        k === "compared"
          ? v[k].filter(
              (existing) =>
                s.products.find((p) => p.id === existing)?.kind ===
                s.products.find((p) => p.id === id)?.kind,
            )
          : v[k];
      return {
        ...v,
        [k]: v[k].includes(id)
          ? v[k].filter((x) => x !== id)
          : [...compatible, id].slice(k === "compared" ? -3 : -100),
      };
    });
  }
  const view = useCallback((id: string) => {
    setState((v) =>
      v.recent[0] === id
        ? v
        : {
            ...v,
            recent: [id, ...v.recent.filter((x) => x !== id)].slice(0, 8),
          },
    );
  }, []);
  return (
    <Context.Provider
      value={{
        s,
        l,
        state,
        ready,
        add,
        setLines: (lines) => setState((v) => ({ ...v, lines })),
        toggle,
        view,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useShop() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("ShopProvider missing");
  return ctx;
}
