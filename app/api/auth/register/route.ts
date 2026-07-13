import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const supabase = createServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase não está configurado." }, { status: 500 });

    const status = parsed.data.role === "proprietario" ? "pendente" : "ativo";
    const username = parsed.data.username?.trim() || null;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${siteUrl.replace(/\/$/, "")}/login?confirmado=1`,
        data: {
          full_name: parsed.data.fullName,
          username,
          phone: parsed.data.phone ?? null,
          role: parsed.data.role,
          status,
          owner_display_name: parsed.data.ownerDisplayName ?? null
        }
      }
    });

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message ?? "Não foi possível criar a conta." }, { status: 400 });
    }

    return NextResponse.json({
      id: data.user.id,
      role: parsed.data.role,
      status,
      nextStep: "Conta criada. Confirme o registo no email que enviámos."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar a conta.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
