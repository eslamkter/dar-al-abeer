import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/runtime";
import { guard, sendAdapter } from "@/lib/service";
const schema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("contact"),
    email: z.email().max(254),
    name: z.string().trim().min(1).max(100),
    message: z.string().trim().min(10).max(3000),
    website: z.string().max(0).optional(),
  }),
  z.object({
    kind: z.literal("newsletter"),
    email: z.email().max(254),
    website: z.string().max(0).optional(),
  }),
]);
export async function POST(req: NextRequest) {
  const blocked = guard(req);
  if (blocked) return blocked;
  try {
    const body = schema.parse(await req.json());
    const s = await getStore();
    if (s.preview) return NextResponse.json({ accepted: true, preview: true });
    if (!s.services[body.kind])
      return NextResponse.json({ error: "Not connected" }, { status: 503 });
    const result = await sendAdapter(
      body.kind === "contact" ? "CONTACT" : "NEWSLETTER",
      { storeId: s.id, ...body },
    );
    return NextResponse.json({ accepted: true, ...result });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof z.ZodError ? "Invalid fields" : "Service unavailable",
      },
      { status: e instanceof z.ZodError ? 400 : 503 },
    );
  }
}
