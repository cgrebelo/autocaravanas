import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  return NextResponse.json({
    id: crypto.randomUUID(),
    role: parsed.data.role,
    status: parsed.data.role === "proprietario" ? "pendente" : "ativo",
    ownerProfileCreated: parsed.data.role === "proprietario",
    nextStep: parsed.data.role === "proprietario" ? "O administrador vai validar a conta de proprietário." : "Conta criada. Já pode enviar pedidos de reserva."
  });
}
