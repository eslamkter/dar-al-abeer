import "server-only";
import { NextRequest, NextResponse } from "next/server";
export function guard(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin)
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (Number(req.headers.get("content-length") ?? 0) > 32000)
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  return null;
}
export async function sendAdapter(
  kind: "CONTACT" | "NEWSLETTER" | "CHECKOUT",
  body: unknown,
  key?: string,
) {
  const endpoint = process.env[`SHADHA_${kind}_URL`];
  const token = process.env.SHADHA_SERVICE_TOKEN;
  if (!endpoint || !token) throw new Error("Service adapter is not connected");
  const url = new URL(endpoint);
  if (url.protocol !== "https:")
    throw new Error("Service adapter must use HTTPS");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Service did not acknowledge request");
  const result = await res.json();
  if (
    result.accepted !== true ||
    typeof result.reference !== "string" ||
    !result.reference
  )
    throw new Error("Invalid service acknowledgment");
  return { reference: result.reference };
}
