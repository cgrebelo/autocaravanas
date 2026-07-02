import { NextResponse } from "next/server";
import { documentUploadSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = documentUploadSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  return NextResponse.json({
    id: crypto.randomUUID(),
    status: "pendente",
    storageBucket: "booking-documents",
    protectedByRls: true,
    ...parsed.data
  });
}
