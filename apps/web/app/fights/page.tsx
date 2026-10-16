"use client";
import { useMemo, useState } from "react";
import { DB, WC_ES, WithData, norm, wcEs } from "@/lib/data";
import FightTable from "@/components/FightTable";

export default function Fights() {
  return <WithData>{(db) => <Inner db={db} />}</WithData>;
}

function Inner({ db }: { db: DB }) {
  const [q, setQ] = useState("");
  const [wc, setWc] = useState("");
  const [method, setMethod] = useState("");
  const [year, setYear] = useState("");
  const [title, setTitle] = useState(false);
  const classes = Object.keys(WC_ES);
  const years = useMemo(() => Array.from(new Set(db.events.map((e) => e.date.slice(0, 4)))).sort().reverse(), [db]);
  const list = useMemo(() => {
    const n = norm(q.trim());
    return db.fights
      .filter((f) => {
        if (wc && f.weightClass !== wc) return false;
        if (title && !f.title) return false;
        if (year && db.events[f.event].date.slice(0, 4) !== year) return false;
        if (method === "KO" && !(f.method.startsWith("KO") || f.method.startsWith("TKO"))) return false;
        if (method === "SUB" && !f.method.startsWith("Submission")) return false;
        if (method === "DEC" && !f.method.startsWith("Decision")) return false;
        if (n && !(norm(db.fighters[f.red].name).includes(n) || norm(db.fighters[f.blue].name).includes(n))) return false;
        return true;
      })
      .sort((a, b) => db.events[b.event].date.localeCompare(db.events[a.event].date));
  }, [db, q, wc, method, year, title]);

  return (
    <div className="space-y-6">
      <h1>Peleas <span className="text-ufc">({list.length.toLocaleString("es")})</span></h1>
      <div className="flex flex-wrap items-center gap-3">
        <input aria-label="Buscar peleador" className="w-full md:w-64" placeholder="Peleador…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Categoría" value={wc} onChange={(e) => setWc(e.target.value)}>
          <option value="">Todas las categorías</option>{classes.map((c) => <option key={c} value={c}>{wcEs(c)}</option>)}
        </select>
        <select aria-label="Método" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="">Todos los métodos</option><option value="KO">KO/TKO</option><option value="SUB">Sumisión</option><option value="DEC">Decisión</option>
        </select>
        <select aria-label="Año" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Todos los años</option>{years.map((y) => <option key={y}>{y}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={title} onChange={(e) => setTitle(e.target.checked)} /> Solo título</label>
      </div>
      <FightTable db={db} fights={list} />
    </div>
  );
}
