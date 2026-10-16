import { models } from "@/lib/mock";
import { CalibrationChart, ImportanceBars } from "@/components/Charts";

export default function Models() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Prediction Intelligence</h1>
      <p className="text-sm text-slate-400">
        Métricas MOCK sobre un conjunto de prueba temporal ficticio. Las reales se mostrarán al conectar el backend.
      </p>
      <section className="card overflow-x-auto">
        <h2 className="mb-3 font-semibold">Comparación de modelos</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-400">
            <th className="font-normal">Modelo</th><th className="font-normal">Accuracy</th><th className="font-normal">ROC-AUC</th>
            <th className="font-normal" title="Menor es mejor">Brier ↓</th><th className="font-normal">F1</th></tr></thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.name} className="border-t border-line">
                <td className="py-1.5">{m.name}</td><td>{m.acc.toFixed(2)}</td><td>{m.auc.toFixed(2)}</td>
                <td>{m.brier.toFixed(3)}</td><td>{m.f1.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card"><h2 className="mb-2 font-semibold">Calibración</h2><CalibrationChart /></section>
        <section className="card"><h2 className="mb-2 font-semibold">Importancia de variables</h2><ImportanceBars /></section>
      </div>
    </div>
  );
}
