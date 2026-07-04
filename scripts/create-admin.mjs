import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL ?? "admin@rotalivre.pt";
const fullName = process.env.ADMIN_NAME ?? "Administrador";
const password = process.env.ADMIN_PASSWORD ?? crypto.randomBytes(18).toString("base64url");

if (!url || !serviceRoleKey) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
if (listError) {
  console.error(listError.message);
  process.exit(1);
}

let user = existingUsers.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());

if (!user) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: "administrador"
    }
  });

  if (error || !data.user) {
    console.error(error?.message ?? "Não foi possível criar o admin.");
    process.exit(1);
  }
  user = data.user;
} else if (process.env.ADMIN_PASSWORD) {
  const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
}

const { error: profileError } = await supabase.from("profiles").upsert({
  id: user.id,
  role: "administrador",
  full_name: fullName,
  status: "ativo"
});

if (profileError) {
  console.error(profileError.message);
  process.exit(1);
}

await supabase.from("users").upsert({ id: user.id, email });

console.log("Conta admin pronta:");
console.log(`Email: ${email}`);
console.log(`Password: ${password}`);
