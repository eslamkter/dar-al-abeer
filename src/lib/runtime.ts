import "server-only";
import { cache } from "react";
import { readFile } from "node:fs/promises";
import { storeSchema } from "./schema";
import { preview } from "@/data/preview";
import { resolveCatalogAt } from "./catalog";
export const getStore = cache(async () => {
  if (
    process.env.SHADHA_MODE === "live" &&
    !process.env.SHADHA_STORE_FILE &&
    !process.env.SHADHA_STORE_URL
  )
    throw new Error("Live mode needs a configured store source");
  let raw: unknown = preview;
  if (process.env.SHADHA_STORE_FILE)
    raw = JSON.parse(await readFile(process.env.SHADHA_STORE_FILE, "utf8"));
  else if (process.env.SHADHA_STORE_URL) {
    const url = new URL(process.env.SHADHA_STORE_URL);
    if (url.protocol !== "https:") throw Error("Store source must use HTTPS");
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      headers: process.env.SHADHA_STORE_TOKEN
        ? { Authorization: `Bearer ${process.env.SHADHA_STORE_TOKEN}` }
        : {},
    });
    if (!res.ok) throw Error("Store source unavailable");
    raw = await res.json();
  }
  const store = storeSchema.parse(raw);
  if (process.env.SHADHA_MODE === "live" && store.preview)
    throw new Error("Preview content is not allowed in live mode");
  return resolveCatalogAt(store);
});
