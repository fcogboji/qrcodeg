import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/require-user";
import { updateCustomerSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const gate = await requireUserId();
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateCustomerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const gate = await requireUserId();
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  try {
    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
}
