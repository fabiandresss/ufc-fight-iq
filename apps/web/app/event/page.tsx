"use client";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DB, WithData } from "@/lib/data";
import FightTable from "@/components/FightTable";

export default function EventPage() {
  return (
    <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
      <WithData>{(db) => <Inner db={db} />}</WithData>
    </Suspense>
  );
}

function Inner({ db }: { db: DB }) {
  const id = useSearchParams().get("id");
  const e = db.events.find((x) => x.id === id);
  if (!e) return <p>Evento no encontrado. <Link className="text-ufc underline" href="/events/">Volver</Link></p>;
  const fights = db.fights.filter((f) => f.event === e.i);
  return (
    <div className="space-y-6">
      <Link href="/events/" className="text-sm text-zinc-400 hover:text-white">← Eventos</Link>
      <div className="border-l-8 border-ufc pl-4">
        <h1 className="text-3xl">{e.name}</h1>
        <p className="text-zinc-400">{e.date} · {e.location}</p>
      </div>
      <FightTable db={db} fights={fights} perPage={30} />
    </div>
  );
}
