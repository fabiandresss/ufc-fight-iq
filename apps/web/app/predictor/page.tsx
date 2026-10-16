"use client";
import { useMemo, useState } from "react";
import { DB, Fighter, WithData, age, record, wcEs } from "@/lib/data";
import { fictionalOdds, predict } from "@/lib/predict";
import FighterPicker from "@/components/FighterPicker";
import { Factors } from "@/components/Charts";

export default function Predictor() {
  return <WithData>{(db) => <Inner db={db} />}</WithData>;
}

const fmt = (v: number | null | undefined, s = "") => (v == null ? "—" : `${v}${s}`);

function Inner({ db }: { db: DB }) {
  const [a, setA] = useState<Fighter | null>(null);
  const [b, setB] = useState<Fighter | null>(null);
  const [stake, setStake] = useState(100);
  const r = useMemo(() => (a && b ? predict(a, b, db.model) : null), [a, b, db]);
  const oa = r ? fictionalOdds(r.pA) : null;
  const ob = r ? fictionalOdds(r.pB) : null;

  const rows: [string, (f: Fighter) => string][] = [
    ["Récord", record], ["Categoría", (f) => wcEs(f.wc)], ["Edad", (f) => fmt(age(f.dob))],
    ["Altura", (f) => fmt(f.heightCm, " cm")], ["Alcance", (f) => fmt(f.reachCm, " cm")],
    ["Racha", (f) => String(f.streak)], ["Victorias KO", (f) => String(f.koW)], ["Victorias sumisión", (f) => String(f.subW)],
    ["Golpes sig. / min", (f) => fmt(f.slpm)], ["Defensa golpeo", (f) => fmt(f.strDef, "%")],
    ["Derribos / 15 min", (f) => fmt(f.tdAvg)], ["Defensa derribo", (f) => fmt(f.tdDef, "%")],
  ];

  return (
    <div className="space-y-6">
      <h1>Predictor de combates</h1>
      <p className="max-w-3xl text-sm text-zinc-400">
        Elige dos peleadores. El modelo usa solo información previa al combate (récord, racha, edad, físico,
        inactividad) y entrega una probabilidad. Las cuotas son <b className="text-white">ficticias</b>: se derivan de la probabilidad con un margen del 6 %.
      </p>
      <div className="card grid gap-5 md:grid-cols-2">
        <FighterPicker label="Peleador A" accent="text-ufc" fighters={db.fighters} value={a} onChange={setA} />
        <FighterPicker label="Peleador B" accent="text-white" fighters={db.fighters} value={b} onChange={setB} />
      </div>

      {!r && <p className="text-zinc-400">Selecciona ambos peleadores para ver la predicción.</p>}

      {r && a && b && oa && ob && (
        <>
          {r.warnings.map((w) => <div key={w} role="alert" className="border-l-4 border-ufc bg-zinc-950 p-3 text-sm">{w}</div>)}

          <section className="card">
            <div className="label mb-2">Probabilidad estimada por el modelo</div>
            <div className="flex items-end justify-between gap-4">
              <div><div className="text-sm text-zinc-400">{a.name}</div><div className="text-5xl font-black text-ufc">{(r.pA * 100).toFixed(1)}%</div></div>
              <div className="text-right"><div className="text-sm text-zinc-400">{b.name}</div><div className="text-5xl font-black">{(r.pB * 100).toFixed(1)}%</div></div>
            </div>
            <div className="mt-3 flex h-3 overflow-hidden bg-zinc-800" role="img" aria-label={`A ${(r.pA * 100).toFixed(0)} por ciento, B ${(r.pB * 100).toFixed(0)} por ciento`}>
              <div className="bg-ufc" style={{ width: `${r.pA * 100}%` }} /><div className="bg-white" style={{ width: `${r.pB * 100}%` }} />
            </div>
            <p className="mt-3 text-sm text-zinc-400">
              Favorito del modelo: <b className="text-white">{(r.pA >= 0.5 ? a : b).name}</b>. Precisión histórica del modelo en
              combates no vistos: {(db.model.metrics.accuracy * 100).toFixed(1)}% (azar = 50%). Una probabilidad no garantiza el resultado.
            </p>
          </section>

          <section className="card">
            <h2 className="mb-3 text-lg">Cuotas ficticias</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[[a, oa, r.pA], [b, ob, r.pB]].map(([f, o]) => {
                const ff = f as Fighter, oo = o as typeof oa;
                return (
                  <div key={ff.id} className="border border-zinc-800 p-4">
                    <div className="font-bold">{ff.name}</div>
                    <div className="mt-1 text-3xl font-black">{oo.decimal.toFixed(2)} <span className="text-sm font-normal text-zinc-400">decimal</span></div>
                    <div className="text-zinc-400">{oo.american > 0 ? `+${oo.american}` : oo.american} americana</div>
                    <div className="mt-2 text-sm">Apuesta ficticia de ${stake}: retorno ${(stake * oo.decimal).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm">Monto ficticio ($)
              <input type="number" min={1} max={100000} value={stake} onChange={(e) => setStake(Math.max(1, Math.min(100000, +e.target.value || 1)))} className="w-28" />
            </label>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="card overflow-x-auto">
              <h2 className="mb-3 text-lg">Comparación</h2>
              <table className="w-full text-sm">
                <thead><tr><th className="py-1">Métrica</th><th className="text-ufc">A</th><th>B</th></tr></thead>
                <tbody>
                  {rows.map(([l, fn]) => (
                    <tr key={l} className="border-t border-zinc-800"><td className="py-1.5 text-zinc-400">{l}</td><td>{fn(a)}</td><td>{fn(b)}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="card">
              <h2 className="text-lg">Factores de la predicción</h2>
              <p className="mb-2 text-xs text-zinc-400">Rojo = favorece a A; blanco = favorece a B.</p>
              <Factors data={r.contributions} />
            </section>
          </div>
        </>
      )}
    </div>
  );
}
