// DATOS MOCK / FICTICIOS: ningún peleador, evento ni métrica corresponde a datos reales.
export type Fighter = {
  id: string;
  name: string;
  weightClass: string;
  record: string;
  age: number;
  reach: number;
  height: number;
  strikingAcc: number;
  strikingDef: number;
  tdAvg: number;
  tdDef: number;
  subAvg: number;
  streak: number;
  rating: number;
  history: { opponent: string; result: "W" | "L"; method: string; date: string }[];
};

type H = [string, "W" | "L", string, string];
const h = (r: H[]) => r.map(([opponent, result, method, date]) => ({ opponent, result, method, date }));

export const fighters: Fighter[] = [
  { id: "f1", name: "Marco Valdés (mock)", weightClass: "Ligero", record: "18-3-0", age: 29, reach: 185, height: 178, strikingAcc: 51, strikingDef: 62, tdAvg: 1.8, tdDef: 78, subAvg: 0.9, streak: 5, rating: 1710,
    history: h([["Idris Kane", "W", "KO/TKO", "2025-11-02"], ["Tomás Rey", "W", "Decisión", "2025-06-14"], ["Luka Brandt", "W", "Sumisión", "2025-01-20"], ["Omar Ziyad", "L", "Decisión", "2024-08-09"], ["Felipe Cruz", "W", "KO/TKO", "2024-03-30"]]) },
  { id: "f2", name: "Dmitri Sokolov (mock)", weightClass: "Ligero", record: "21-5-0", age: 33, reach: 180, height: 175, strikingAcc: 46, strikingDef: 58, tdAvg: 3.4, tdDef: 66, subAvg: 1.6, streak: 2, rating: 1665,
    history: h([["Jae-won Park", "W", "Decisión", "2025-10-11"], ["Ryo Tanabe", "W", "Sumisión", "2025-05-03"], ["Idris Kane", "L", "KO/TKO", "2024-12-07"], ["Sam Okafor", "W", "Decisión", "2024-06-22"], ["Víctor Lemos", "W", "Sumisión", "2024-01-13"]]) },
  { id: "f3", name: "Idris Kane (mock)", weightClass: "Ligero", record: "15-4-0", age: 27, reach: 188, height: 180, strikingAcc: 54, strikingDef: 55, tdAvg: 0.6, tdDef: 71, subAvg: 0.2, streak: 1, rating: 1620,
    history: h([["Marco Valdés", "L", "KO/TKO", "2025-11-02"], ["Dmitri Sokolov", "W", "KO/TKO", "2024-12-07"], ["Ali Hassan", "W", "Decisión", "2024-07-27"], ["Pedro Nunes", "L", "Sumisión", "2024-02-17"], ["Chris Doyle", "W", "KO/TKO", "2023-10-21"]]) },
  { id: "f4", name: "Omar Ziyad (mock)", weightClass: "Wélter", record: "24-6-0", age: 31, reach: 191, height: 183, strikingAcc: 48, strikingDef: 60, tdAvg: 2.2, tdDef: 74, subAvg: 0.5, streak: 3, rating: 1690,
    history: h([["Lars Eklund", "W", "Decisión", "2025-09-20"], ["Hugo Ferrer", "W", "KO/TKO", "2025-03-15"], ["Ben Walsh", "W", "Decisión", "2024-10-05"], ["Marco Valdés", "W", "Decisión", "2024-08-09"], ["Kofi Mensah", "L", "Sumisión", "2024-02-03"]]) },
  { id: "f5", name: "Lars Eklund (mock)", weightClass: "Wélter", record: "13-2-0", age: 26, reach: 186, height: 181, strikingAcc: 50, strikingDef: 64, tdAvg: 1.1, tdDef: 82, subAvg: 0.3, streak: 6, rating: 1655,
    history: h([["Omar Ziyad", "L", "Decisión", "2025-09-20"], ["Ben Walsh", "W", "KO/TKO", "2025-04-26"], ["Kofi Mensah", "W", "Decisión", "2024-11-16"], ["Tariq Aziz", "W", "KO/TKO", "2024-06-01"], ["Noel Pierce", "W", "Decisión", "2023-12-09"]]) },
  { id: "f6", name: "Ryo Tanabe (mock)", weightClass: "Pluma", record: "17-1-0", age: 28, reach: 175, height: 168, strikingAcc: 57, strikingDef: 67, tdAvg: 0.9, tdDef: 88, subAvg: 0.1, streak: 9, rating: 1760,
    history: h([["Jae-won Park", "W", "KO/TKO", "2025-12-06"], ["Dmitri Sokolov", "L", "Sumisión", "2025-05-03"], ["Al Rahman", "W", "Decisión", "2024-09-14"], ["Tom Beck", "W", "KO/TKO", "2024-04-20"], ["Eli Sandoval", "W", "Decisión", "2023-11-11"]]) },
  { id: "f7", name: "Jae-won Park (mock)", weightClass: "Pluma", record: "14-4-0", age: 30, reach: 178, height: 170, strikingAcc: 49, strikingDef: 56, tdAvg: 2.7, tdDef: 63, subAvg: 1.3, streak: 0, rating: 1580,
    history: h([["Ryo Tanabe", "L", "KO/TKO", "2025-12-06"], ["Dmitri Sokolov", "L", "Decisión", "2025-10-11"], ["Eli Sandoval", "W", "Sumisión", "2025-02-22"], ["Tom Beck", "W", "Decisión", "2024-08-31"], ["Al Rahman", "L", "Decisión", "2024-03-09"]]) },
  { id: "f8", name: "Hugo Ferrer (mock)", weightClass: "Wélter", record: "11-3-0", age: 25, reach: 184, height: 179, strikingAcc: 45, strikingDef: 52, tdAvg: 1.5, tdDef: 60, subAvg: 0.7, streak: 1, rating: 1540,
    history: h([["Omar Ziyad", "L", "KO/TKO", "2025-03-15"], ["Ben Walsh", "W", "Decisión", "2024-12-14"], ["Noel Pierce", "W", "Sumisión", "2024-05-18"], ["Kofi Mensah", "L", "Decisión", "2023-11-25"], ["Tariq Aziz", "W", "Decisión", "2023-06-10"]]) },
];

export const kpis = { fighters: 1284, fights: 7265, events: 612, predictions: 342, lastUpdate: "2026-05-27 (mock)", modelVersion: "mock-v0.1.0" };

export const methodsData = [
  { name: "Decisión", value: 3480 },
  { name: "KO/TKO", value: 2290 },
  { name: "Sumisión", value: 1280 },
  { name: "Otros", value: 215 },
];
export const weightClassData = [
  { name: "Mosca", fights: 540 }, { name: "Gallo", fights: 880 }, { name: "Pluma", fights: 910 },
  { name: "Ligero", fights: 1290 }, { name: "Wélter", fights: 1320 }, { name: "Mediano", fights: 1010 },
  { name: "Semipesado", fights: 760 }, { name: "Pesado", fights: 555 },
];
export const trendData = [
  { year: "2019", acc: 0.61 }, { year: "2020", acc: 0.63 }, { year: "2021", acc: 0.64 },
  { year: "2022", acc: 0.62 }, { year: "2023", acc: 0.66 }, { year: "2024", acc: 0.65 }, { year: "2025", acc: 0.67 },
];

export const models = [
  { name: "Cuotas (favorito)", acc: 0.66, auc: 0.66, brier: 0.226, f1: 0.7 },
  { name: "Logistic Regression", acc: 0.65, auc: 0.7, brier: 0.219, f1: 0.69 },
  { name: "Random Forest", acc: 0.66, auc: 0.71, brier: 0.216, f1: 0.7 },
  { name: "XGBoost", acc: 0.67, auc: 0.72, brier: 0.213, f1: 0.71 },
];
export const calibration = [
  { predicted: 0.1, observed: 0.14 }, { predicted: 0.3, observed: 0.33 }, { predicted: 0.5, observed: 0.49 },
  { predicted: 0.7, observed: 0.66 }, { predicted: 0.9, observed: 0.83 },
];
export const importance = [
  { feature: "Diferencia de cuotas", value: 0.31 },
  { feature: "Diferencia de ranking", value: 0.14 },
  { feature: "Diferencia de edad", value: 0.11 },
  { feature: "Racha de victorias", value: 0.09 },
  { feature: "Diferencia de alcance", value: 0.07 },
  { feature: "Derribos", value: 0.06 },
];

export const events = [
  { id: "e1", name: "Evento Mock 301", date: "2025-12-06", fights: [
    { a: "f6", b: "f7", pA: 0.74, result: "A" }, { a: "f1", b: "f3", pA: 0.63, result: "A" }] },
  { id: "e2", name: "Evento Mock 300", date: "2025-11-02", fights: [
    { a: "f1", b: "f3", pA: 0.58, result: "A" }, { a: "f4", b: "f8", pA: 0.69, result: "A" }] },
  { id: "e3", name: "Evento Mock 299", date: "2025-09-20", fights: [
    { a: "f4", b: "f5", pA: 0.52, result: "A" }, { a: "f2", b: "f7", pA: 0.57, result: "B" }] },
];

export const fighterById = (id: string) => fighters.find((f) => f.id === id)!;

/** Predicción simulada: logística sobre diferencias de rating y rasgos. NO es el modelo real. */
export function mockPredict(a: Fighter, b: Fighter) {
  const factors = [
    { name: "Rating", v: (a.rating - b.rating) / 180 },
    { name: "Edad", v: (b.age - a.age) * 0.02 },
    { name: "Alcance", v: (a.reach - b.reach) * 0.01 },
    { name: "Racha", v: (a.streak - b.streak) * 0.04 },
  ];
  const z = factors.reduce((s, f) => s + f.v, 0);
  const pA = 1 / (1 + Math.exp(-z));
  const warnings: string[] = [];
  if (a.id === b.id) warnings.push("Selecciona dos peleadores distintos.");
  if (a.weightClass !== b.weightClass) warnings.push("Categorías de peso distintas: enfrentamiento fuera del dominio de entrenamiento.");
  return { pA, pB: 1 - pA, factors, warnings };
}
