"use client";
import Link from "next/link";
import { useState } from "react";
import { fighters } from "@/lib/mock";

export default function Fighters() {
  const [q, setQ] = useState("");
  const list = fighters.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fighter Intelligence</h1>
      <input aria-label="Buscar peleador" placeholder="Buscar peleador…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full md:w-80" />
      {list.length === 0 && <p className="text-slate-400">Sin resultados.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f) => (
          <Link key={f.id} href={`/fighters/${f.id}/`} className="card hover:border-accent">
            <div className="font-semibold">{f.name}</div>
            <div className="text-sm text-slate-400">{f.weightClass} · {f.record}</div>
            <div className="mt-3 flex justify-between text-sm">
              <span>Rating <b className="text-accent">{f.rating}</b></span>
              <span>Racha <b>{f.streak}</b></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
