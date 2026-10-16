"use client";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DB, WithData, age, record, wcEs } from "@/lib/data";
import FightTable from "@/components/FightTable";
import { Donut } from "@/components/Charts";

export default function FighterPage() {
  return (
    <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
      <WithData>{(db) => <Inner db={db} />}</WithData>
    </Suspense>
  );
}

function Inner({ db }: { db: DB }) {
  const id = useSearchParams().get("id");
  const f = db.fighters.find((x) => x.id === id);
  const fights = useMemo(
    () => (f ? db.fights.filter((x) => x.red === f.i || x.blue === f.i).sort((a, b) => db.events[b.event].date.localeCompare(db.events[a.event].date)) : []),
    [db, f],
  );
  if (!f) return <p>Peleador no encontrado. <Link className="text-ufc underline" href="/fighters/">Volver al listado</Link></p>;
  const losses = fights.filter((x) => x.status === "win" && x.winner !== -1 && (x.winner === 0 ? x.blue : x.red) === f.i);
  const lossKo = losses.filter((x) => x.method.startsWith("KO") || x.method.startsWith("TKO")).length;
  const stat = (v: number | null, suf = "") => (v == null ? "—" : `${v}${suf}`);
  const basics: [string, string][] = [
    ["Categoría", wcEs(f.wc)], ["Récord", record(f)], ["Edad", stat(age(f.dob))], ["Altura", stat(f.heightCm, " cm")],
    ["Alcance", stat(f.reachCm, " cm")], ["Postura", f.stance || "—"], ["Peso", stat(f.weightLbs, " lb")], ["Nacimiento", f.dob || "—"],
  ];
  const adv: [string, string][] = [
    ["Golpes sig. / min", stat(f.slpm)], ["Precisión golpeo", stat(f.strAcc, "%")], ["Golpes recibidos / min", stat(f.sapm)],
    ["Defensa golpeo", stat(f.strDef, "%")], ["Derribos / 15 min", stat(f.tdAvg)], ["Precisión derribo", stat(f.tdAcc, "%")],
    ["Defensa derribo", stat(f.tdDef, "%")], ["Sumisiones / 15 min", stat(f.subAvg)],
  ];
  const wins = [{ name: "KO/TKO", value: f.koW }, { name: "Sumisión", value: f.subW }, { name: "Decisión", value: f.decW }].filter((x) => x.value > 0);
  const Grid = ({ items }: { items: [string, string][] }) => (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map(([l, v]) => <div key={l} className="card !p-3"><div className="label">{l}</div><div className="text-lg font-bold">{v}</div></div>)}
    </div>
  );
  return (
    <div className="space-y-8">
      <Link href="/fighters/" className="text-sm text-zinc-400 hover:text-white">← Peleadores</Link>
      <div className="border-l-8 border-ufc pl-4">
        <h1 className="text-4xl">{f.name}</h1>
        {f.nick && <p className="text-lg text-zinc-400">“{f.nick}”</p>}
        <p className="mt-1 text-sm text-zinc-400">Racha actual: <b className="text-white">{f.streak > 0 ? `${f.streak} victorias` : f.streak < 0 ? `${-f.streak} derrotas` : "—"}</b> · Último combate: {f.last ?? "—"}</p>
      </div>
      <Grid items={basics} />
      <section><h2 className="mb-3 text-lg">Estadísticas de carrera</h2><Grid items={adv} /></section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="text-lg">Cómo gana</h2>
          {wins.length ? <Donut data={wins} /> : <p className="mt-2 text-zinc-400">Sin victorias registradas.</p>}
        </div>
        <div className="card">
          <h2 className="text-lg">Derrotas</h2>
          <p className="mt-2 text-5xl font-black">{f.l}</p>
          <p className="text-sm text-zinc-400">{lossKo} por KO/TKO</p>
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg">Historial ({fights.length} combates)</h2>
        <FightTable db={db} fights={fights} highlight={f.i} perPage={15} />
      </section>
    </div>
  );
}
