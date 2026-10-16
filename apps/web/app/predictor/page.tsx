"use client";
import { useState } from "react";
import { fighters, mockPredict } from "@/lib/mock";
import { FactorBars } from "@/components/Charts";

const stats: { key: "strikingAcc" | "strikingDef" | "tdAvg" | "tdDef" | "subAvg" | "reach" | "age"; label: string }[] = [
  { key: "strikingAcc", label: "Precisión de golpeo %" },
  { key: "strikingDef", label: "Defensa de golpes %" },
  { key: "tdAvg", label: "Derribos / 15 min" },
  { key: "tdDef", label: "Defensa de derribos %" },
  { key: "subAvg", label: "Sumisiones / 15 min" },
  { key: "reach", label: "Alcance (cm)" },
  { key: "age", label: "Edad" },
];

export default function Predictor() {
  const [ia, setIa] = useState("f1");
  const [ib, setIb] = useState("f3");
  const a = fighters.find((f) => f.id === ia)!;
  const b = fighters.find((f) => f.id === ib)!;
  const r = mockPredict(a, b);
  const fav = r.pA >= 0.5 ? a : b;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fight Predictor</h1>
      <div className="card grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="label text-corner-red">Esquina roja</span>
          <select className="w-full" value={ia} onChange={(e) => setIa(e.target.value)}>
            {fighters.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
        <label className="space-y-1">
          <span className="label text-corner-blue">Esquina azul</span>
          <select className="w-full" value={ib} onChange={(e) => setIb(e.target.value)}>
            {fighters.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
      </div>

      {r.warnings.map((w) => (
        <div key={w} role="alert" className="rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm text-accent">{w}</div>
      ))}

      <section className="card">
        <div className="label mb-2">Probabilidad estimada (simulada)</div>
        <div className="flex items-end justify-between text-2xl font-bold">
          <span className="text-corner-red">{(r.pA * 100).toFixed(1)}%</span>
          <span className="text-corner-blue">{(r.pB * 100).toFixed(1)}%</span>
        </div>
        <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-line" role="img" aria-label={`Rojo ${(r.pA * 100).toFixed(0)} por ciento, azul ${(r.pB * 100).toFixed(0)} por ciento`}>
          <div className="bg-corner-red" style={{ width: `${r.pA * 100}%` }} />
          <div className="bg-corner-blue" style={{ width: `${r.pB * 100}%` }} />
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Favorecido por el modelo mock: <strong className="text-white">{fav.name}</strong>. Esta cifra es una simulación del
          frontend; en producción vendrá del backend. Una probabilidad no garantiza el resultado.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card">
          <h2 className="mb-3 font-semibold">Comparación de estadísticas</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-slate-400"><th className="text-left font-normal">Métrica</th><th className="text-right font-normal">Rojo</th><th className="text-right font-normal">Azul</th></tr></thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.key} className="border-t border-line">
                  <td className="py-1.5">{s.label}</td>
                  <td className="text-right">{a[s.key]}</td>
                  <td className="text-right">{b[s.key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="card">
          <h2 className="mb-1 font-semibold">Factores (estilo SHAP, mock)</h2>
          <p className="mb-2 text-xs text-slate-400">Rojo = favorece a la esquina roja; azul = favorece a la azul.</p>
          <FactorBars data={r.factors} />
        </section>
      </div>
    </div>
  );
}
