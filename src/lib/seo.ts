import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"));
export const indexable = process.env.STOREFRONT_LIVE === "true" && !!process.env.NEXT_PUBLIC_SITE_URL;
export function pageSeo(path: string, functional = false): Metadata {
  return { alternates: { canonical: new URL(path, siteUrl).href }, openGraph: { url: new URL(path, siteUrl).href, siteName: siteConfig.name, locale: "ar_SA", type: "website" }, robots: { index: indexable && !functional, follow: true } };
}
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
