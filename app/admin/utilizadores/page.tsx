import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminUsersManager } from "@/components/AdminUsersManager";
import { getAdminUsers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <section>
        <h1 className="text-3xl font-bold text-forest">Utilizadores e proprietários</h1>
        <AdminUsersManager initialUsers={users} />
      </section>
    </main>
  );
}
