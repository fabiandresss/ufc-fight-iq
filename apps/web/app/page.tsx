import { kpis } from "@/lib/mock";
import { MethodsPie, TrendLine, WeightBars } from "@/components/Charts";

export default function Dashboard() {
  const items = [
    ["Peleadores", kpis.fighters.toLocaleString("es")],
    ["Combates", kpis.fights.toLocaleString("es")],
    ["Eventos", kpis.events.toLocaleString("es")],
    ["Predicciones", kpis.predictions.toLocaleString("es")],
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Última actualización: {kpis.lastUpdate} · Modelo activo: {kpis.modelVersion}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map(([l, v]) => (
          <div key={l} className="card">
            <div className="label">{l}</div>
            <div className="mt-1 text-3xl font-bold text-accent">{v}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card"><h2 className="mb-2 font-semibold">Métodos de victoria</h2><MethodsPie /></section>
        <section className="card"><h2 className="mb-2 font-semibold">Combates por categoría</h2><WeightBars /></section>
        <section className="card md:col-span-2">
          <h2 className="mb-2 font-semibold">Accuracy del modelo por año (mock)</h2>
          <TrendLine />
        </section>
      </div>
    </div>
  );
}
