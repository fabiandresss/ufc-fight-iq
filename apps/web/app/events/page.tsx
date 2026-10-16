import { events, fighterById } from "@/lib/mock";

export default function Events() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Event Center</h1>
      <p className="text-sm text-slate-400">Eventos históricos ficticios con la predicción registrada y el resultado.</p>
      {events.map((e) => (
        <section key={e.id} className="card">
          <h2 className="font-semibold">{e.name} <span className="text-sm font-normal text-slate-400">· {e.date}</span></h2>
          <ul className="mt-3 space-y-2 text-sm">
            {e.fights.map((f, i) => {
              const a = fighterById(f.a), b = fighterById(f.b);
              const predA = f.pA >= 0.5;
              const hit = predA === (f.result === "A");
              return (
                <li key={i} className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
                  <span>{a.name} vs {b.name}</span>
                  <span className="text-slate-400">Pred.: {(f.pA * 100).toFixed(0)}% rojo</span>
                  <span className={hit ? "text-green-400" : "text-corner-red"}>{hit ? "Acierto" : "Fallo"}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
