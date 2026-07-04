import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = createAdminClient();
  const status = parsed.data.role === "proprietario" ? "pendente" : "ativo";

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.fullName,
      role: parsed.data.role
    }
  });

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? "Não foi possível criar a conta." }, { status: 400 });
  }

  const userId = authData.user.id;
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    role: parsed.data.role,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone ?? null,
    status
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  await supabase.from("users").insert({ id: userId, email: parsed.data.email });

  if (parsed.data.role === "proprietario") {
    const { error: ownerError } = await supabase.from("owner_profiles").insert({
      user_id: userId,
      display_name: parsed.data.ownerDisplayName,
      fiscal_name: parsed.data.fullName,
      verified: false,
      payout_status: "por_configurar"
    });

    if (ownerError) {
      return NextResponse.json({ error: ownerError.message }, { status: 400 });
    }
  }

  return NextResponse.json({
    id: userId,
    role: parsed.data.role,
    status,
    nextStep: parsed.data.role === "proprietario" ? "O administrador vai validar a conta de proprietário." : "Conta criada. Já pode iniciar sessão."
  });
}
