"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DB, WithData, norm } from "@/lib/data";
import { Pager } from "@/components/FightTable";

export default function Events() {
  return <WithData>{(db) => <Inner db={db} />}</WithData>;
}

function Inner({ db }: { db: DB }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const list = useMemo(() => {
    const n = norm(q.trim());
    return [...db.events].filter((e) => !n || norm(e.name + " " + e.location + " " + e.date).includes(n)).sort((a, b) => b.date.localeCompare(a.date));
  }, [db, q]);
  useEffect(() => { setPage(0); }, [q]);
  const per = 30;
  return (
    <div className="space-y-6">
      <h1>Eventos <span className="text-ufc">({list.length})</span></h1>
      <input aria-label="Buscar evento" className="w-full md:w-80" placeholder="Nombre, ciudad o año…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th className="py-2">Fecha</th><th>Evento</th><th>Lugar</th><th>Peleas</th></tr></thead>
          <tbody>
            {list.slice(page * per, (page + 1) * per).map((e) => (
              <tr key={e.id} className="border-t border-zinc-800">
                <td className="whitespace-nowrap py-2 pr-3 text-zinc-400">{e.date}</td>
                <td className="pr-3"><Link href={`/event/?id=${e.id}`} className="font-bold hover:text-ufc">{e.name}</Link></td>
                <td className="pr-3">{e.location}</td><td>{e.fights}</td>
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
