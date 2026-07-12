import { NextResponse } from "next/server";
import { createAdminClient, getAuthenticatedUser } from "@/lib/supabase-server";
import { adminUserCreateSchema } from "@/lib/validators";

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

function mapUser(row: {
  id: string;
  role: "cliente" | "proprietario" | "administrador";
  full_name: string;
  phone: string | null;
  status: "ativo" | "pendente" | "suspenso";
  created_at: string;
  users?: { email?: string; username?: string } | { email?: string; username?: string }[] | null;
}) {
  const relatedUser = Array.isArray(row.users) ? row.users[0] : row.users;

  return {
    id: row.id,
    role: row.role,
    fullName: row.full_name,
    email: relatedUser?.email ?? "",
    username: relatedUser?.username ?? "",
    phone: row.phone ?? "",
    status: row.status,
    createdAt: row.created_at
  };
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const { data, error } = await auth.supabase
    .from("profiles")
    .select("id, role, full_name, phone, status, created_at, users(email, username)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Não foi possível carregar utilizadores." }, { status: 400 });
  }

  return NextResponse.json({ users: data.map((row) => mapUser(row as Parameters<typeof mapUser>[0])) });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const parsed = adminUserCreateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const username = parsed.data.username?.trim() || null;
  const { data: authData, error: authError } = await auth.supabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.fullName,
      role: parsed.data.role
    }
  });

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? "Não foi possível criar o utilizador." }, { status: 400 });
  }

  const userId = authData.user.id;
  const { error: profileError } = await auth.supabase.from("profiles").insert({
    id: userId,
    role: parsed.data.role,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone || null,
    status: parsed.data.status
  });

  const { error: userError } = await auth.supabase.from("users").insert({
    id: userId,
    email: parsed.data.email,
    username
  });

  if (profileError || userError) {
    await auth.supabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: profileError?.message ?? userError?.message }, { status: 400 });
  }

  if (parsed.data.role === "proprietario") {
    const { error: ownerError } = await auth.supabase.from("owner_profiles").insert({
      user_id: userId,
      display_name: parsed.data.ownerDisplayName || parsed.data.fullName,
      fiscal_name: parsed.data.fullName,
      verified: parsed.data.status === "ativo",
      payout_status: "por_configurar"
    });

    if (ownerError) return NextResponse.json({ error: ownerError.message }, { status: 400 });
  }

  return NextResponse.json({ id: userId, message: "Utilizador criado." });
}
