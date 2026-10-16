"use client";
import { useMemo, useState } from "react";
import { Fighter, norm, record } from "@/lib/data";

export default function FighterPicker({
  label, fighters, value, onChange, accent,
}: { label: string; fighters: Fighter[]; value: Fighter | null; onChange: (f: Fighter | null) => void; accent: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => {
    const n = norm(q.trim());
    if (n.length < 2) return [];
    return fighters
      .filter((f) => norm(f.name).includes(n) || norm(f.nick || "").includes(n))
      .sort((a, b) => b.w + b.l - (a.w + a.l))
      .slice(0, 8);
  }, [q, fighters]);

  return (
    <div className="relative">
      <div className={`mb-1 text-xs font-bold uppercase tracking-widest ${accent}`}>{label}</div>
      {value ? (
        <div className="flex items-center justify-between border border-zinc-700 bg-zinc-950 px-3 py-2">
          <div>
            <div className="font-bold">{value.name}</div>
            <div className="text-xs text-zinc-400">{record(value)}</div>
          </div>
          <button onClick={() => { onChange(null); setQ(""); }} className="text-xs uppercase text-zinc-400 hover:text-white">Cambiar</button>
        </div>
      ) : (
        <>
          <input aria-label={label} className="w-full" placeholder="Buscar peleador…" value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} />
          {open && results.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full border border-zinc-700 bg-zinc-950 shadow-xl">
              {results.map((f) => (
                <li key={f.id}>
                  <button className="flex w-full justify-between px-3 py-2 text-left text-sm hover:bg-ufc"
                    onClick={() => { onChange(f); setOpen(false); }}>
                    <span>{f.name}</span><span className="text-zinc-400">{record(f)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
