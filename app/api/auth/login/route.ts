import { NextResponse } from "next/server";
import { createAdminClient, createServerClient } from "@/lib/supabase-server";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const identifier = parsed.data.identifier.trim().toLowerCase();
    const adminUsername = (process.env.ADMIN_USERNAME ?? "admin").trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@rotalivre.pt").trim().toLowerCase();
    let email = identifier;

    if (!identifier.includes("@")) {
      if (identifier === adminUsername) {
        email = adminEmail;
      } else {
        const admin = createAdminClient();
        const { data, error } = await admin.from("users").select("email").eq("username", identifier).single();
        if (error || !data?.email) return NextResponse.json({ error: "Utilizador não encontrado." }, { status: 404 });
        email = data.email;
      }
    }

    const supabase = createServerClient();
    if (!supabase) return NextResponse.json({ error: "Supabase não está configurado." }, { status: 500 });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: parsed.data.password
    });

    if (error || !data.session) return NextResponse.json({ error: error?.message ?? "Login inválido." }, { status: 401 });

    return NextResponse.json({
      user: data.user,
      session: data.session
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado no login.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
