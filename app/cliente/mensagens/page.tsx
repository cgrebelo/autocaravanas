import { messages } from "@/lib/sample-data";

export default function MessagesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-forest">Mensagens</h1>
      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`max-w-[80%] rounded-lg p-3 ${message.sender === "cliente" ? "bg-sand" : "ml-auto bg-forest text-white"}`}>
              <p className="text-sm font-semibold">{message.sender === "cliente" ? "Cliente" : "Administrador"}</p>
              <p>{message.body}</p>
            </div>
          ))}
        </div>
        <form className="mt-5 flex gap-2">
          <input className="flex-1 rounded-md border border-stone-300 px-3 py-2" placeholder="Escrever mensagem" />
          <button className="rounded-md bg-clay px-4 py-2 font-semibold text-white">Enviar</button>
        </form>
      </section>
    </main>
  );
}
