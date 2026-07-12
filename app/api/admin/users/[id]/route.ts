import { NextResponse } from "next/server";
import { createAdminClient, getAuthenticatedUser } from "@/lib/supabase-server";
import { adminUserUpdateSchema } from "@/lib/validators";

async function requireAdmin(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) return { error: NextResponse.json({ error: "Inicie sessão." }, { status: 401 }) };

  const supabase = createAdminClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "administrador") {
    return { error: NextResponse.json({ error: "Acesso reservado ao administrador." }, { status: 403 }) };
  }

  return { supabase };
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const parsed = adminUserUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const username = parsed.data.username?.trim() || null;
  const authUpdate: { email: string; password?: string; user_metadata: { full_name: string; role: string } } = {
    email: parsed.data.email,
    user_metadata: {
      full_name: parsed.data.fullName,
      role: parsed.data.role
    }
  };

  if (parsed.data.password?.trim()) authUpdate.password = parsed.data.password;

  const { error: authError } = await auth.supabase.auth.admin.updateUserById(id, authUpdate);
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

  const { error: profileError } = await auth.supabase.from("profiles").update({
    role: parsed.data.role,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone || null,
    status: parsed.data.status
  }).eq("id", id);

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

  const { error: userError } = await auth.supabase.from("users").upsert({
    id,
    email: parsed.data.email,
    username
  });

  if (userError) return NextResponse.json({ error: userError.message }, { status: 400 });

  if (parsed.data.role === "proprietario") {
    const { error: ownerError } = await auth.supabase.from("owner_profiles").upsert({
      user_id: id,
      display_name: parsed.data.ownerDisplayName || parsed.data.fullName,
      fiscal_name: parsed.data.fullName,
      verified: parsed.data.status === "ativo",
      payout_status: "por_configurar"
    }, { onConflict: "user_id" });

    if (ownerError) return NextResponse.json({ error: ownerError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Utilizador atualizado." });
}
