import { NextResponse } from "next/server";
import { statusSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  return NextResponse.json({
    bookingId: params.id,
    status: parsed.data.status,
    emailQueued: true,
    note: parsed.data.note ?? null
  });
}
