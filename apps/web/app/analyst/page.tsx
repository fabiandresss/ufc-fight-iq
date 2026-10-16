"use client";
import { useEffect, useRef, useState } from "react";
import { DB, WithData } from "@/lib/data";
import { answer } from "@/lib/analyst";

type Msg = { role: "user" | "bot"; text: string };

const examples = [
  "Compara a Islam Makhachev y Charles Oliveira",
  "Resumen de Jon Jones",
  "Quién tiene más KO en peso pesado",
  "Mayores rachas de victorias en peso ligero",
  "Cuántos eventos hubo en 2019",
];

export default function Analyst() {
  return <WithData>{(db) => <Chat db={db} />}</WithData>;
}

function Bold({ t }: { t: string }) {
  return <>{t.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") ? <b key={i} className="text-white">{p.slice(2, -2)}</b> : p))}</>;
}

function Chat({ db }: { db: DB }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Soy el analista de UFC Fight IQ. Consulto el dataset histórico y el modelo predictivo para responderte. Prueba uno de los ejemplos." },
  ]);
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [msgs]);
  const send = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: answer(db, q).text }]);
    setText("");
  };
  return (
    <div className="space-y-4">
      <h1>Analista IA</h1>
      <p className="text-sm text-zinc-400">
        Motor de consulta local sobre el dataset: entiende preguntas sobre peleadores, comparaciones y rankings. Aún no hay un LLM
        conectado; las respuestas se generan con datos verificables del dataset y del modelo.
      </p>
      <div className="flex flex-wrap gap-2">
        {examples.map((e) => <button key={e} onClick={() => send(e)} className="border border-zinc-700 px-3 py-1 text-xs hover:border-ufc hover:text-ufc">{e}</button>)}
      </div>
      <div className="card max-h-[55vh] space-y-3 overflow-y-auto" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[90%] whitespace-pre-line px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-ufc text-white" : "border border-zinc-800 bg-black text-zinc-300"}`}>
            <Bold t={m.text} />
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex gap-2">
        <input aria-label="Mensaje" className="flex-1" value={text} maxLength={300} onChange={(e) => setText(e.target.value)} placeholder="Pregunta sobre peleadores, peleas o eventos…" />
        <button className="btn">Enviar</button>
      </form>
    </div>
  );
}
