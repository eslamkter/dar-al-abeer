import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/runtime";
import { guard, sendAdapter } from "@/lib/service";
import { quote } from "@/lib/catalog";
import { cartLineSchema } from "@/lib/schema";
const schema = z.object({
  lines: cartLineSchema.array().min(1).max(100),
  coupon: z.string().max(50),
  fingerprint: z.string().max(24000),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.email(),
    phone: z.string().regex(/^[+\d\s()-]{8,30}$/),
    city: z.string().trim().min(2).max(120),
    district: z.string().trim().min(2).max(120),
    address: z.string().trim().min(2).max(300),
  }),
});
export async function POST(req: NextRequest) {
  const blocked = guard(req);
  if (blocked) return blocked;
  try {
    const body = schema.parse(await req.json());
    const key = req.headers.get("idempotency-key");
    if (!key || !/^[a-f0-9-]{36}$/.test(key))
      return NextResponse.json(
        { error: "Idempotency key required" },
        { status: 400 },
      );
    const s = await getStore();
    let current;
    try {
      current = quote(s, body.lines, body.coupon);
    } catch {
      return NextResponse.json({ error: "Catalog changed" }, { status: 409 });
    }
    if (current.fingerprint !== body.fingerprint || current.delivery === null)
      return NextResponse.json({ error: "Quote changed" }, { status: 409 });
    if (s.preview)
      return NextResponse.json({
        accepted: true,
        preview: true,
        reference: `PREVIEW-${key}`,
      });
    if (!s.services.checkout || !s.commerce.taxIncluded)
      return NextResponse.json(
        { error: "Checkout not ready" },
        { status: 503 },
      );
    const result = await sendAdapter(
      "CHECKOUT",
      {
        storeId: s.id,
        customer: body.customer,
        lines: body.lines,
        coupon: body.coupon,
        quote: {
          subtotal: current.subtotal,
          wrapping: current.wrapping,
          discount: current.discount,
          delivery: current.delivery,
          total: current.total,
          currency: s.currency,
        },
      },
      key,
    );
    return NextResponse.json({ accepted: true, ...result });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof z.ZodError ? "Invalid fields" : "Checkout unavailable",
      },
      { status: e instanceof z.ZodError ? 400 : 503 },
    );
  }
}
