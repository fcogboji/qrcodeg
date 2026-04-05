import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";
import { createCustomerSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";

export async function GET() {
  const gate = await requireSession();
  if (gate instanceof NextResponse) return gate;
  const customers = await prisma.customer.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ customers });
}

export async function POST(request: Request) {
  const gate = await requireSession();
  if (gate instanceof NextResponse) return gate;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createCustomerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, slug: slugInput, darkColor, lightColor } = parsed.data;
  const base = slugInput ?? slugify(name);
  let slug = base;
  let n = 0;
  while (await prisma.customer.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }

  const customer = await prisma.customer.create({
    data: { name, slug, darkColor, lightColor },
  });

  return NextResponse.json({ customer }, { status: 201 });
}
