"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Fighter = {
  i: number; id: string; name: string; nick: string; heightCm: number | null; weightLbs: number | null;
  reachCm: number | null; stance: string; dob: string; slpm: number | null; strAcc: number | null;
  sapm: number | null; strDef: number | null; tdAvg: number | null; tdAcc: number | null; tdDef: number | null;
  subAvg: number | null; w: number; l: number; d: number; nc: number; koW: number; subW: number; decW: number;
  streak: number; last: string | null; wc: string | null;
};
export type UfcEvent = { i: number; id: string; name: string; date: string; location: string; fights: number };
export type Fight = {
  id: string; event: number; weightClass: string; title: number; red: number; blue: number;
  winner: number; status: string; method: string; round: number | null; time: string; format: string;
  details: string; bonuses: string;
};
export type Model = {
  features: string[]; weights: number[]; std: number[]; note: string;
  metrics: {
    accuracy: number; brier: number; logloss: number; auc: number; calibration: number[][];
    train_fights: number; test_fights: number; train_until: string; test_from: string; baseline_50: number;
  };
};
export type DB = { fighters: Fighter[]; events: UfcEvent[]; fights: Fight[]; model: Model };

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

function rows<T>(j: { cols: string[]; rows: unknown[][] }, extra?: (o: Record<string, unknown>, i: number) => void): T[] {
  return j.rows.map((r, i) => {
    const o: Record<string, unknown> = {};
    j.cols.forEach((c, k) => (o[c] = r[k]));
    extra?.(o, i);
    return o as T;
  });
}

let cache: Promise<DB> | null = null;
function load(): Promise<DB> {
  if (!cache) {
    const get = (n: string) => fetch(`${base}/data/${n}.json`).then((r) => {
      if (!r.ok) throw new Error(`No se pudo cargar ${n}.json`);
      return r.json();
    });
    cache = Promise.all([get("fighters"), get("events"), get("fights"), get("model")]).then(([f, e, fi, m]) => ({
      fighters: rows<Fighter>(f, (o, i) => (o.i = i)),
      events: rows<UfcEvent>(e, (o, i) => (o.i = i)),
      fights: rows<Fight>(fi),
      model: m,
    }));
    cache.catch(() => (cache = null));
  }
  return cache;
}

const Ctx = createContext<{ db: DB | null; error: string | null }>({ db: null, error: null });

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<{ db: DB | null; error: string | null }>({ db: null, error: null });
  useEffect(() => {
    load().then((db) => setS({ db, error: null })).catch((e) => setS({ db: null, error: String(e.message || e) }));
  }, []);
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>;
}

export const useDB = () => useContext(Ctx);

/** Renderiza hijos cuando los datos están listos; muestra estados de carga y error. */
export function WithData({ children }: { children: (db: DB) => React.ReactNode }) {
  const { db, error } = useDB();
  if (error) return <div role="alert" className="border border-ufc p-4 text-ufc">Error cargando datos: {error}</div>;
  if (!db) return <div className="p-8 text-center text-zinc-400" aria-busy="true">Cargando datos de la UFC…</div>;
  return <>{children(db)}</>;
}

export const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const WC_ES: Record<string, string> = {
  Flyweight: "Mosca", Bantamweight: "Gallo", Featherweight: "Pluma", Lightweight: "Ligero",
  Welterweight: "Wélter", Middleweight: "Mediano", "Light Heavyweight": "Semipesado", Heavyweight: "Pesado",
  "Women's Strawweight": "Paja fem.", "Women's Flyweight": "Mosca fem.", "Women's Bantamweight": "Gallo fem.",
  "Women's Featherweight": "Pluma fem.",
};
export const wcEs = (w: string | null) => (w ? WC_ES[w] || w : "—");

export function age(dob: string | null, at = new Date()) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(+d)) return null;
  return Math.floor((+at - +d) / (365.25 * 864e5));
}

export function record(f: Fighter) {
  return `${f.w}-${f.l}-${f.d}${f.nc ? ` (${f.nc} NC)` : ""}`;
}
