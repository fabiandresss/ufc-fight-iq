import Link from "next/link";
import { notFound } from "next/navigation";
import { fighters } from "@/lib/mock";

export const dynamicParams = false;
export function generateStaticParams() {
  return fighters.map((f) => ({ id: f.id }));
}

export default function FighterPage({ params }: { params: { id: string } }) {
  const f = fighters.find((x) => x.id === params.id);
  if (!f) notFound();
  const facts: [string, string | number][] = [
    ["Categoría", f.weightClass], ["Récord", f.record], ["Edad", f.age], ["Altura", `${f.height} cm`],
    ["Alcance", `${f.reach} cm`], ["Rating ELO (mock)", f.rating], ["Precisión golpeo", `${f.strikingAcc}%`],
    ["Defensa golpeo", `${f.strikingDef}%`], ["Derribos/15'", f.tdAvg], ["Defensa derribos", `${f.tdDef}%`],
  ];
  return (
    <div className="space-y-6">
      <Link href="/fighters/" className="text-sm text-slate-400 hover:text-white">← Volver</Link>
      <h1 className="text-2xl font-bold">{f.name}</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {facts.map(([l, v]) => (
          <div key={l} className="card !p-3"><div className="label">{l}</div><div className="font-semibold">{v}</div></div>
        ))}
      </div>
      <section className="card">
        <h2 className="mb-3 font-semibold">Últimos combates (ficticios)</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-400"><th className="font-normal">Fecha</th><th className="font-normal">Rival</th><th className="font-normal">Resultado</th><th className="font-normal">Método</th></tr></thead>
          <tbody>
            {f.history.map((h, i) => (
              <tr key={i} className="border-t border-line">
                <td className="py-1.5">{h.date}</td><td>{h.opponent}</td>
                <td className={h.result === "W" ? "text-green-400" : "text-corner-red"}>{h.result === "W" ? "Victoria" : "Derrota"}</td>
                <td>{h.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
