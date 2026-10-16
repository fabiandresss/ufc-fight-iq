"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DB, WC_ES, WithData, age, norm, record, wcEs } from "@/lib/data";
import { Pager } from "@/components/FightTable";

export default function Fighters() {
  return <WithData>{(db) => <Inner db={db} />}</WithData>;
}

function Inner({ db }: { db: DB }) {
  const [q, setQ] = useState("");
  const [wc, setWc] = useState("");
  const [sort, setSort] = useState("w");
  const [page, setPage] = useState(0);
  const classes = Object.keys(WC_ES);
  const list = useMemo(() => {
    const n = norm(q.trim());
    return db.fighters
      .filter((f) => (!n || norm(f.name).includes(n) || norm(f.nick || "").includes(n)) && (!wc || f.wc === wc))
      .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "fights" ? b.w + b.l + b.d - (a.w + a.l + a.d) : b.w - a.w));
  }, [db, q, wc, sort]);
  useEffect(() => { setPage(0); }, [q, wc, sort]);
  const per = 30;

  return (
    <div className="space-y-6">
      <h1>Peleadores <span className="text-ufc">({list.length.toLocaleString("es")})</span></h1>
      <div className="flex flex-wrap gap-3">
        <input aria-label="Buscar peleador" className="w-full md:w-72" placeholder="Buscar por nombre o apodo…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Categoría" value={wc} onChange={(e) => setWc(e.target.value)}>
          <option value="">Todas las categorías</option>
          {classes.map((c) => <option key={c} value={c}>{wcEs(c)}</option>)}
        </select>
        <select aria-label="Ordenar" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="w">Más victorias</option><option value="fights">Más combates</option><option value="name">Nombre A-Z</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th className="py-2">Peleador</th><th>Categoría</th><th>Récord</th><th>Edad</th><th>Alcance</th><th>Racha</th></tr></thead>
          <tbody>
            {list.slice(page * per, (page + 1) * per).map((f) => (
              <tr key={f.id} className="border-t border-zinc-800">
                <td className="py-2 pr-3">
                  <Link href={`/fighter/?id=${f.id}`} className="font-bold hover:text-ufc">{f.name}</Link>
                  {f.nick && <span className="ml-2 text-zinc-500">“{f.nick}”</span>}
                </td>
                <td className="pr-3">{wcEs(f.wc)}</td><td className="pr-3">{record(f)}</td>
                <td className="pr-3">{age(f.dob) ?? "—"}</td><td className="pr-3">{f.reachCm ? `${f.reachCm} cm` : "—"}</td>
                <td>{f.streak > 0 ? `+${f.streak}` : f.streak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && <p className="text-zinc-400">Sin resultados.</p>}
      <Pager page={page} pages={Math.ceil(list.length / per)} setPage={setPage} />
    </div>
  );
}
