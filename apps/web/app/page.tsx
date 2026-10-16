"use client";
import Link from "next/link";
import { useMemo } from "react";
import { WithData, wcEs, record } from "@/lib/data";
import { Bars, Donut } from "@/components/Charts";
import Logo from "@/components/Logo";
import FightTable from "@/components/FightTable";

export default function Home() {
  return (
    <WithData>
      {(db) => <HomeInner db={db} />}
    </WithData>
  );
}

function HomeInner({ db }: { db: import("@/lib/data").DB }) {
  const s = useMemo(() => {
    const methods: Record<string, number> = { "KO/TKO": 0, Sumisión: 0, Decisión: 0, Otros: 0 };
    const wc: Record<string, number> = {};
    for (const f of db.fights) {
      if (f.status !== "win") continue;
      const m = f.method;
      if (m.startsWith("Decision")) methods["Decisión"]++;
      else if (m.startsWith("Submission")) methods["Sumisión"]++;
      else if (m.startsWith("KO") || m.startsWith("TKO")) methods["KO/TKO"]++;
      else methods["Otros"]++;
      wc[f.weightClass] = (wc[f.weightClass] || 0) + 1;
    }
    const top = [...db.fighters].sort((a, b) => b.w - a.w).slice(0, 8);
    const latest = [...db.events].sort((a, b) => b.date.localeCompare(a.date))[0];
    return {
      methods: Object.entries(methods).map(([name, value]) => ({ name, value })),
      wc: ["Flyweight", "Bantamweight", "Featherweight", "Lightweight", "Welterweight", "Middleweight", "Light Heavyweight", "Heavyweight"]
        .map((k) => ({ name: wcEs(k), fights: wc[k] || 0 })),
      top, latest,
    };
  }, [db]);
  const latestFights = db.fights.filter((f) => f.event === s.latest.i);

  return (
    <div className="space-y-10">
      <section className="flex flex-col items-start gap-5 border-l-8 border-ufc bg-zinc-950 p-6 md:p-10">
        <Logo className="h-14" />
        <h1 className="text-4xl md:text-6xl">Toda la historia de la UFC, en un solo lugar</h1>
        <p className="max-w-2xl text-zinc-300">
          Explora peleadores, combates y eventos desde 1993, consulta datos con el asistente de IA y simula
          enfrentamientos con el modelo predictivo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/predictor/" className="btn">Predecir un combate</Link>
          <Link href="/analyst/" className="border border-white px-4 py-2 text-sm font-bold uppercase hover:bg-white hover:text-black">Preguntar a la IA</Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Peleadores", db.fighters.length], ["Combates", db.fights.length], ["Eventos", db.events.length],
          ["Desde", Math.min(...db.events.map((e) => +e.date.slice(0, 4)))]].map(([l, v]) => (
          <div key={l as string} className="card border-t-4 border-t-ufc">
            <div className="label">{l}</div>
            <div className="mt-1 text-4xl font-black">{typeof v === "number" && v > 3000 ? v.toLocaleString("es") : v}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card"><h2 className="mb-2 text-lg">Cómo terminan las peleas</h2><Donut data={s.methods} /></div>
        <div className="card"><h2 className="mb-2 text-lg">Victorias por categoría</h2><Bars data={s.wc} x="name" y="fights" name="Combates" /></div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card md:col-span-1">
          <h2 className="mb-3 text-lg">Más victorias</h2>
          <ol className="space-y-2 text-sm">
            {s.top.map((f, i) => (
              <li key={f.id} className="flex items-center justify-between border-b border-zinc-800 pb-1">
                <span><b className="mr-2 text-ufc">{i + 1}</b><Link href={`/fighter/?id=${f.id}`} className="hover:underline">{f.name}</Link></span>
                <span className="text-zinc-400">{record(f)}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="card md:col-span-2">
          <h2 className="mb-1 text-lg">Último evento</h2>
          <p className="mb-3 text-sm text-zinc-400">{s.latest.name} · {s.latest.date} · {s.latest.location}</p>
          <FightTable db={db} fights={latestFights} perPage={10} />
        </div>
      </section>
    </div>
  );
}
