"use client";
import { useState } from "react";
import { fighters, mockPredict } from "@/lib/mock";

type Msg = { role: "user" | "bot"; text: string };

// Respuestas guionadas: no hay LLM conectado todavía.
function reply(q: string): string {
  const named = fighters.filter((f) => q.toLowerCase().includes(f.name.split(" ")[0].toLowerCase()));
  if (named.length >= 2) {
    const [a, b] = named;
    const r = mockPredict(a, b);
    const top = [...r.factors].sort((x, y) => Math.abs(y.v) - Math.abs(x.v))[0];
    return `[Modelo mock] ${a.name}: ${(r.pA * 100).toFixed(0)}% vs ${b.name}: ${(r.pB * 100).toFixed(0)}%. Factor principal: ${top.name}. [Interpretación] Es una simulación; no hay LLM ni backend conectado.`;
  }
  if (named.length === 1) {
    const f = named[0];
    return `[Datos mock] ${f.name}: récord ${f.record}, racha ${f.streak}, rating ${f.rating}.`;
  }
  return "No tengo datos para esa consulta. Menciona uno o dos peleadores del catálogo mock (p. ej. «Compara a Marco e Idris»).";
}

export default function Analyst() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hola, soy el UFC AI Analyst (demo con respuestas guionadas). Prueba: «Compara a Marco e Idris»." },
  ]);
  const [text, setText] = useState("");
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }, { role: "bot", text: reply(text) }]);
    setText("");
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">UFC AI Analyst</h1>
      <div className="card space-y-3" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-line" : "bg-bg"}`}>{m.text}</div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input aria-label="Mensaje" className="flex-1" value={text} onChange={(e) => setText(e.target.value)} placeholder="Pregunta sobre un peleador…" />
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black">Enviar</button>
      </form>
    </div>
  );
}
