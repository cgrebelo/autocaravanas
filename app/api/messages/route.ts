import { NextResponse } from "next/server";
import { messageSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = messageSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  return NextResponse.json({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    emailQueued: true,
    ...parsed.data
  });
}
