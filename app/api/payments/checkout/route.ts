import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    bookingId: body.bookingId,
    provider: "stripe",
    mode: "payment",
    status: "prepared",
    note: "Configurar STRIPE_SECRET_KEY para criar uma sessão real. A estrutura permite trocar por provider com MB Way/Multibanco."
  });
}
