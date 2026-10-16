import { Fighter, Model, age } from "./data";

/** Debe reflejar scripts/build_data.py::feats (A - B), evaluado a la fecha de hoy. */
export function features(a: Fighter, b: Fighter, now = new Date()): number[] {
  const d = (x: number | null, y: number | null) => (x != null && y != null ? x - y : 0);
  const wr = (f: Fighter) => (f.w + 1) / (f.w + f.l + f.d + 2);
  const nf = (f: Fighter) => Math.log1p(f.w + f.l + f.d);
  const fr = (f: Fighter, k: "koW" | "subW") => (f.w ? f[k] / f.w : 0);
  const inact = (f: Fighter) => (f.last ? Math.min((+now - +new Date(f.last)) / 864e5, 1500) / 365.25 : 1);
  const cap = (n: number) => Math.max(-5, Math.min(5, n));
  const ag = (f: Fighter) => {
    if (!f.dob) return null;
    const t = +new Date(f.dob);
    return isNaN(t) ? null : (+now - t) / (365.25 * 864e5);
  };
  return [
    d(ag(a), ag(b)),
    d(a.reachCm, b.reachCm) / 10,
    d(a.heightCm, b.heightCm) / 10,
    wr(a) - wr(b),
    nf(a) - nf(b),
    cap(a.streak) - cap(b.streak),
    fr(a, "koW") - fr(b, "koW"),
    fr(a, "subW") - fr(b, "subW"),
    inact(a) - inact(b),
  ];
}

export type Prediction = {
  pA: number; pB: number; contributions: { name: string; v: number }[]; warnings: string[];
};

export function predict(a: Fighter, b: Fighter, m: Model): Prediction {
  const x = features(a, b);
  const contributions = m.features.map((name, j) => ({ name, v: (m.weights[j] * x[j]) / m.std[j] }));
  const z = contributions.reduce((s, c) => s + c.v, 0);
  const pA = 1 / (1 + Math.exp(-z));
  const warnings: string[] = [];
  if (a.i === b.i) warnings.push("Selecciona dos peleadores distintos.");
  for (const f of [a, b]) {
    if (f.w + f.l + f.d < 3) warnings.push(`${f.name} tiene menos de 3 combates en el dataset: predicción poco fiable.`);
    if (!f.dob) warnings.push(`Falta la fecha de nacimiento de ${f.name}: la diferencia de edad se ignora.`);
    if (!f.reachCm) warnings.push(`Falta el alcance de ${f.name}: la diferencia de alcance se ignora.`);
    if (f.last && (+new Date() - +new Date(f.last)) / 864e5 > 730) warnings.push(`${f.name} lleva más de 2 años sin pelear en el dataset.`);
  }
  if (a.wc && b.wc && a.wc !== b.wc) warnings.push("Categorías de peso habituales distintas: caso poco común en el entrenamiento.");
  void age;
  return { pA, pB: 1 - pA, contributions, warnings: Array.from(new Set(warnings)) };
}

/** Cuotas FICTICIAS: probabilidad del modelo + margen de la casa del 6 %. */
export function fictionalOdds(p: number, margin = 0.06) {
  const dec = 1 / Math.min(0.97, Math.max(0.03, p * (1 + margin)));
  const us = dec >= 2 ? Math.round((dec - 1) * 100) : -Math.round(100 / (dec - 1));
  return { decimal: dec, american: us };
}
