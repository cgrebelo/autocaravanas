import { NextResponse } from "next/server";
import { createServerClient, getAuthenticatedUser } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ user: null });

  const supabase = createServerClient();
  if (!supabase) return NextResponse.json({ user: null });

  const [{ data: profile }, { data: userRow }] = await Promise.all([
    supabase.from("profiles").select("role, full_name, status").eq("id", user.id).maybeSingle(),
    supabase.from("users").select("username, email").eq("id", user.id).maybeSingle()
  ]);

  return NextResponse.json({
    user: {
      id: user.id,
      email: userRow?.email ?? user.email ?? "",
      username: userRow?.username ?? null,
      fullName: profile?.full_name ?? user.user_metadata?.full_name ?? null,
      role: profile?.role ?? null,
      status: profile?.status ?? null
    }
  });
}
