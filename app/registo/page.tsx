export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <form className="w-full rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-forest">Criar conta</h1>
        <label className="mt-5 block text-sm font-medium text-road">Nome completo<input className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
        <label className="mt-4 block text-sm font-medium text-road">Email<input type="email" className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
        <label className="mt-4 block text-sm font-medium text-road">Telefone<input className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
        <label className="mt-4 block text-sm font-medium text-road">Palavra-passe<input type="password" className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
        <button className="mt-6 w-full rounded-md bg-clay px-4 py-3 font-semibold text-white">Registar</button>
      </form>
    </main>
  );
}
