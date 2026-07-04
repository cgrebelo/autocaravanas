import { AdminSidebar } from "@/components/AdminSidebar";
import { owners, users, vehicles } from "@/lib/sample-data";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <section>
        <h1 className="text-3xl font-bold text-forest">Utilizadores e proprietários</h1>
        <div className="mt-6 grid gap-4">
          {users.map((user) => {
            const owner = owners.find((item) => item.userId === user.id);
            const vehicleCount = owner ? vehicles.filter((vehicle) => vehicle.ownerId === owner.id).length : 0;
            return (
              <article key={user.id} className="rounded-lg border border-stone-200 bg-white p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-bold text-forest">{user.fullName}</h2>
                    <p className="text-sm text-stone-600">{user.email} · {user.role} · criado em {formatDate(user.createdAt)}</p>
                    {owner && <p className="mt-1 text-sm text-moss">{owner.displayName} · {vehicleCount} autocaravanas · pagamentos: {owner.payoutStatus}</p>}
                  </div>
                  <span className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-road">{user.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-md bg-forest px-3 py-2 text-sm font-semibold text-white">Validar</button>
                  <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Suspender</button>
                  <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Tornar admin</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
