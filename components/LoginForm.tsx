"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export function LoginForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          identifier: formData.get("identifier"),
          password: formData.get("password")
        })
      });
      const responseText = await response.text();
      let result: { error?: string; session?: { access_token?: string; refresh_token?: string } };
      try {
        result = responseText ? JSON.parse(responseText) : { error: "O servidor não devolveu resposta." };
      } catch {
        result = { error: "O servidor devolveu uma resposta inválida. Confirme o deploy e as variáveis do Supabase." };
      }
      if (!response.ok) {
        setMessage(result.error ?? "Login inválido.");
        return;
      }
      if (!result.session?.access_token || !result.session?.refresh_token) {
        setMessage("Login incompleto. Confirme a configuração do Supabase.");
        return;
      }
      const supabase = createClient();
      await supabase.auth.setSession({
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token
      });
      setMessage("Sessão iniciada. Já pode reservar ou gerir a sua conta.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível iniciar sessão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
      <h1 className="text-2xl font-bold text-forest">Iniciar sessão</h1>
      <label className="mt-5 block text-sm font-medium text-road">Username ou email<input name="identifier" required className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
      <label className="mt-4 block text-sm font-medium text-road">Palavra-passe<input name="password" type="password" required className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
      <button disabled={loading} className="mt-6 w-full rounded-md bg-forest px-4 py-3 font-semibold text-white disabled:bg-stone-300">{loading ? "A entrar..." : "Entrar"}</button>
      {message && <p className="mt-4 rounded-md bg-sand p-3 text-sm text-road">{message}</p>}
      <p className="mt-4 text-sm text-stone-600">Ainda não tem conta? <Link href="/registo" className="font-semibold text-moss">Criar conta</Link></p>
    </form>
  );
}
