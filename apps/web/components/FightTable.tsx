"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DB, Fight, wcEs } from "@/lib/data";

export function Pager({ page, pages, setPage }: { page: number; pages: number; setPage: (n: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-sm">
      <button className="btn disabled:opacity-30" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
      <span className="text-zinc-400">Página {page + 1} de {pages}</span>
      <button className="btn disabled:opacity-30" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Siguiente</button>
    </div>
  );
}

export function methodLabel(m: string) {
  return m.replace("Decision - ", "Decisión ").replace("Unanimous", "unánime").replace("Split", "dividida").replace("Majority", "mayoritaria");
}

export default function FightTable({ db, fights, perPage = 25, highlight }: { db: DB; fights: Fight[]; perPage?: number; highlight?: number }) {
  const [page, setPage] = useState(0);
  useEffect(() => { setPage(0); }, [fights]);
  const pages = Math.ceil(fights.length / perPage);
  const slice = fights.slice(page * perPage, (page + 1) * perPage);
  if (!fights.length) return <p className="text-zinc-400">Sin resultados.</p>;
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th className="py-2">Fecha</th><th>Combate</th><th>Categoría</th><th>Resultado</th></tr></thead>
          <tbody>
            {slice.map((f) => {
              const r = db.fighters[f.red], b = db.fighters[f.blue], e = db.events[f.event];
              const win = f.winner === 0 ? r : f.winner === 1 ? b : null;
              const res = f.status === "win" && win
                ? `${win.name.split(" ").slice(-1)[0]} · ${methodLabel(f.method)}${f.round ? ` R${f.round} ${f.time}` : ""}`
                : f.status === "draw" ? "Empate" : "Sin resultado";
              const cls = (x: typeof r, w: number) => (f.winner === w ? "font-bold text-white" : "text-zinc-400") + (highlight === x.i ? " text-ufc" : "");
              return (
                <tr key={f.id} className="border-t border-zinc-800 align-top">
                  <td className="whitespace-nowrap py-2 pr-3 text-zinc-400">
                    <Link className="hover:text-white" href={`/event/?id=${e.id}`}>{e.date}</Link>
                  </td>
                  <td className="pr-3">
                    <Link href={`/fighter/?id=${r.id}`} className={cls(r, 0)}>{r.name}</Link>
                    <span className="mx-1 text-ufc">vs</span>
                    <Link href={`/fighter/?id=${b.id}`} className={cls(b, 1)}>{b.name}</Link>
                    {f.title ? <span className="ml-2 bg-ufc px-1.5 py-0.5 text-[10px] font-bold uppercase">Título</span> : null}
                    {f.bonuses ? <div className="text-xs text-zinc-500">{f.bonuses.split("|").join(" · ")}</div> : null}
                  </td>
                  <td className="pr-3">{wcEs(f.weightClass)}</td>
                  <td>{res}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pager page={page} pages={pages} setPage={setPage} />
    </>
  );
}
