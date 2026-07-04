export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12">
      <form className="w-full rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-forest">Criar conta</h1>
        <p className="mt-2 text-sm text-stone-600">Registe-se como locatário para reservar ou como proprietário para anunciar autocaravanas.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-road">Nome completo<input name="fullName" className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="block text-sm font-medium text-road">Email<input name="email" type="email" className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="block text-sm font-medium text-road">Telefone<input name="phone" className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="block text-sm font-medium text-road">Palavra-passe<input name="password" type="password" className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="block text-sm font-medium text-road md:col-span-2">
            Tipo de conta
            <select name="role" className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2">
              <option value="cliente">Cliente/locatário</option>
              <option value="proprietario">Proprietário de autocaravana</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-road md:col-span-2">
            Nome público do proprietário
            <input name="ownerDisplayName" className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" placeholder="Obrigatório apenas se vai anunciar autocaravanas" />
          </label>
        </div>
        <button className="mt-6 w-full rounded-md bg-clay px-4 py-3 font-semibold text-white">Registar</button>
        <p className="mt-3 text-xs text-stone-500">Contas de proprietário ficam pendentes até validação do administrador.</p>
      </form>
    </main>
  );
}
