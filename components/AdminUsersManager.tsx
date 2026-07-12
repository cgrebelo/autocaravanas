"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Save, X } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { UserAccount, UserRole } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type EditableUser = UserAccount & {
  ownerDisplayName?: string;
};

const emptyForm: EditableUser & { password: string } = {
  id: "",
  fullName: "",
  email: "",
  username: "",
  phone: "",
  role: "cliente",
  status: "ativo",
  createdAt: "",
  password: "",
  ownerDisplayName: ""
};

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "formErrors" in error) {
    const formErrors = (error as { formErrors?: string[] }).formErrors;
    return formErrors?.[0] ?? "Dados inválidos.";
  }
  return "Ocorreu um erro.";
}

export function AdminUsersManager({ initialUsers }: { initialUsers: UserAccount[] }) {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredUsers = useMemo(() => {
    const value = filter.trim().toLowerCase();
    if (!value) return users;
    return users.filter((user) =>
      [user.fullName, user.email, user.username, user.role, user.status]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(value))
    );
  }, [filter, users]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function getAdminToken() {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  }

  async function loadUsers() {
    const token = await getAdminToken();
    if (!token) {
      setMessage("Inicie sessão como administrador para gerir utilizadores.");
      return;
    }

    const response = await fetch("/api/admin/users", {
      headers: { authorization: `Bearer ${token}` }
    });
    const result = await response.json();

    if (!response.ok) {
      setMessage(getErrorMessage(result.error));
      return;
    }

    setUsers(result.users);
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage(null);
  }

  function startEdit(user: UserAccount) {
    setEditingId(user.id);
    setForm({
      ...emptyForm,
      ...user,
      username: user.username ?? "",
      phone: user.phone ?? "",
      password: ""
    });
    setMessage(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = await getAdminToken();
      if (!token) {
        setMessage("Inicie sessão como administrador.");
        return;
      }

      const body = {
        fullName: form.fullName,
        email: form.email,
        username: form.username,
        phone: form.phone,
        password: form.password,
        role: form.role,
        status: form.status,
        ownerDisplayName: form.ownerDisplayName
      };

      const response = await fetch(editingId ? `/api/admin/users/${editingId}` : "/api/admin/users", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(body)
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(getErrorMessage(result.error));
        return;
      }

      setMessage(editingId ? "Utilizador atualizado." : "Utilizador criado.");
      setEditingId(null);
      setForm(emptyForm);
      await loadUsers();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 grid gap-6">
      <form onSubmit={onSubmit} className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-forest">{editingId ? "Editar utilizador" : "Criar utilizador"}</h2>
            <p className="text-sm text-stone-600">Crie clientes, proprietários ou administradores.</p>
          </div>
          {editingId ? (
            <button type="button" onClick={startCreate} className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">
              <X className="h-4 w-4" />
              Cancelar edição
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-road">Nome completo<input required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-road">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-road">Username<input value={form.username ?? ""} onChange={(event) => setForm({ ...form, username: event.target.value })} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-road">Telefone<input value={form.phone ?? ""} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-road">Palavra-passe<input required={!editingId} type="password" minLength={editingId ? undefined : 6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder={editingId ? "Deixe vazio para manter" : ""} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-road">Tipo de conta<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"><option value="cliente">Cliente/locatário</option><option value="proprietario">Proprietário</option><option value="administrador">Administrador</option></select></label>
          <label className="text-sm font-medium text-road">Estado<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as UserAccount["status"] })} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"><option value="ativo">Ativo</option><option value="pendente">Pendente</option><option value="suspenso">Suspenso</option></select></label>
          <label className="text-sm font-medium text-road">Nome público do proprietário<input value={form.ownerDisplayName ?? ""} onChange={(event) => setForm({ ...form, ownerDisplayName: event.target.value })} placeholder="Só para proprietários" className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
        </div>

        <button disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-md bg-forest px-4 py-3 font-semibold text-white disabled:bg-stone-300">
          {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {loading ? "A guardar..." : editingId ? "Guardar alterações" : "Criar utilizador"}
        </button>
        {message ? <p className="mt-4 rounded-md bg-sand p-3 text-sm text-road">{message}</p> : null}
      </form>

      <section>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h2 className="text-xl font-bold text-forest">Lista de utilizadores</h2>
          <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Pesquisar utilizadores" className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        </div>

        <div className="mt-4 grid gap-4">
          {filteredUsers.map((user) => (
            <article key={user.id} className="rounded-lg border border-stone-200 bg-white p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="text-lg font-bold text-forest">{user.fullName}</h3>
                  <p className="text-sm text-stone-600">{user.email} · {user.username || "sem username"} · {user.role} · criado em {formatDate(user.createdAt)}</p>
                  {user.phone ? <p className="mt-1 text-sm text-stone-500">{user.phone}</p> : null}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-road">{user.status}</span>
                  <button onClick={() => startEdit(user)} className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold hover:border-forest hover:text-forest">
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>
                </div>
              </div>
            </article>
          ))}
          {filteredUsers.length === 0 ? <p className="rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600">Não há utilizadores para mostrar.</p> : null}
        </div>
      </section>
    </div>
  );
}
