import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQr } from "@/lib/qr";
import { requireUserId } from "@/lib/require-user";
import { qrRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const gate = await requireUserId();
  if (gate instanceof NextResponse) return gate;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = qrRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let darkColor = parsed.data.darkColor ?? "#000000";
  let lightColor = parsed.data.lightColor ?? "#ffffff";

  if (parsed.data.customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: parsed.data.customerId },
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    darkColor = customer.darkColor;
    lightColor = customer.lightColor;
  }

  const { content, width, errorCorrectionLevel, format } = parsed.data;

  try {
    const out = await generateQr({
      content,
      darkColor,
      lightColor,
      width,
      errorCorrectionLevel,
      format,
    });

    if (format === "svg") {
      return new NextResponse(out as string, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "private, max-age=60",
        },
      });
    }

    return new NextResponse(new Uint8Array(out as Buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "QR generation failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
