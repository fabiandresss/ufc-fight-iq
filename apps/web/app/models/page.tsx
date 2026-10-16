"use client";
import { DB, WithData } from "@/lib/data";
import { Calibration, Factors } from "@/components/Charts";

export default function Models() {
  return <WithData>{(db) => <Inner db={db} />}</WithData>;
}

function Inner({ db }: { db: DB }) {
  const m = db.model.metrics;
  const w = db.model.features.map((name, j) => ({ name, v: db.model.weights[j] }));
  const kpis: [string, string, string][] = [
    ["Accuracy", `${(m.accuracy * 100).toFixed(1)}%`, "Aciertos en combates posteriores al corte (azar = 50%)"],
    ["ROC-AUC", m.auc.toFixed(3), "Capacidad de ordenar ganadores (0,5 = azar)"],
    ["Brier", m.brier.toFixed(3), "Error de las probabilidades; menor es mejor (0,25 = siempre 50%)"],
    ["Log-loss", m.logloss.toFixed(3), "Menor es mejor (0,693 = siempre 50%)"],
  ];
  return (
    <div className="space-y-6">
      <h1>Modelo predictivo</h1>
      <p className="max-w-3xl text-sm text-zinc-400">{db.model.note} Entrenado con {m.train_fights.toLocaleString("es")} combates hasta {m.train_until} y evaluado con
        {" "}{m.test_fights.toLocaleString("es")} combates desde {m.test_from}.</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map(([l, v, d]) => (
          <div key={l} className="card border-t-4 border-t-ufc"><div className="label">{l}</div><div className="text-3xl font-black">{v}</div><p className="mt-1 text-xs text-zinc-500">{d}</p></div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card"><h2 className="mb-2 text-lg">Calibración</h2><Calibration bins={m.calibration} /><p className="text-xs text-zinc-500">Cuanto más cerca de la diagonal, más fiables son las probabilidades.</p></section>
        <section className="card"><h2 className="mb-2 text-lg">Peso de cada variable</h2><Factors data={w} /><p className="text-xs text-zinc-500">Variables estandarizadas; el signo indica la dirección del efecto para el peleador A.</p></section>
      </div>
      <section className="card space-y-2 text-sm text-zinc-300">
        <h2 className="text-lg">Limitaciones</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Predecir combates es difícil: este modelo mejora poco sobre el azar y no incorpora cuotas reales de casas de apuestas.</li>
          <li>Solo usa variables calculadas con información anterior a cada pelea (sin fuga de datos); las estadísticas de golpeo del perfil son acumuladas actuales y no entran al modelo.</li>
          <li>Peleadores con pocos combates o datos faltantes (edad, alcance) producen predicciones menos fiables.</li>
          <li>Las cuotas mostradas son ficticias. Esto no es consejo de apuestas.</li>
        </ul>
      </section>
    </div>
  );
}
