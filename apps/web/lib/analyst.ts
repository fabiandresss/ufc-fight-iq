import { DB, Fighter, age, norm, record, wcEs } from "./data";
import { fictionalOdds, predict } from "./predict";

export type Answer = { text: string; fighters?: Fighter[] };

function findFighters(db: DB, q: string): Fighter[] {
  const n = " " + norm(q).replace(/[^a-z0-9' ]/g, " ") + " ";
  const hits: { f: Fighter; at: number; len: number }[] = [];
  for (const f of db.fighters) {
    const nm = norm(f.name);
    if (nm.length < 5) continue;
    const at = n.indexOf(" " + nm + " ");
    if (at >= 0) hits.push({ f, at, len: nm.length });
  }
  if (hits.length) return hits.sort((a, b) => a.at - b.at).map((h) => h.f).slice(0, 2);
  // apellidos únicos (>=4 letras) citados en la consulta
  const words = Array.from(new Set(n.trim().split(/\s+/).filter((w) => w.length >= 4)));
  const found: { f: Fighter; at: number }[] = [];
  for (const w of words) {
    const m = db.fighters.filter((f) => norm(f.name).split(" ").slice(-1)[0] === w);
    if (m.length) found.push({ f: m.sort((a, b) => b.w + b.l - (a.w + a.l))[0], at: n.indexOf(w) });
  }
  return found.sort((a, b) => a.at - b.at).map((x) => x.f).slice(0, 2);
}

function last5(db: DB, f: Fighter) {
  return db.fights
    .filter((x) => x.red === f.i || x.blue === f.i)
    .sort((a, b) => db.events[b.event].date.localeCompare(db.events[a.event].date))
    .slice(0, 5)
    .map((x) => {
      const opp = db.fighters[x.red === f.i ? x.blue : x.red];
      const mine = x.red === f.i ? 0 : 1;
      const res = x.status !== "win" ? (x.status === "draw" ? "Empate" : "NC") : x.winner === mine ? "Victoria" : "Derrota";
      return `• ${db.events[x.event].date} — ${res} vs ${opp.name} (${x.method}${x.round ? `, R${x.round}` : ""})`;
    })
    .join("\n");
}

function summary(db: DB, f: Fighter): string {
  const a = age(f.dob);
  return `**${f.name}**${f.nick ? ` “${f.nick}”` : ""} — récord ${record(f)}, categoría ${wcEs(f.wc)}${a ? `, ${a} años` : ""}.\n` +
    `Victorias: ${f.koW} KO/TKO, ${f.subW} sumisión, ${f.decW} decisión. Racha actual: ${f.streak}.\n` +
    `Últimos 5 combates:\n${last5(db, f)}`;
}

function compare(db: DB, a: Fighter, b: Fighter): string {
  const p = predict(a, b, db.model);
  const oa = fictionalOdds(p.pA), ob = fictionalOdds(p.pB);
  const top = [...p.contributions].sort((x, y) => Math.abs(y.v) - Math.abs(x.v)).slice(0, 2);
  const fv = p.pA >= 0.5 ? a : b;
  const h2h = db.fights.filter((f) => (f.red === a.i && f.blue === b.i) || (f.red === b.i && f.blue === a.i));
  return `**Datos:** ${a.name} (${record(a)}, ${a.reachCm ?? "?"} cm alcance, ${age(a.dob) ?? "?"} años) vs ${b.name} (${record(b)}, ${b.reachCm ?? "?"} cm, ${age(b.dob) ?? "?"} años).` +
    (h2h.length ? `\nYa se enfrentaron ${h2h.length} vez/veces.` : "") +
    `\n**Modelo:** ${a.name} ${(p.pA * 100).toFixed(1)}% vs ${b.name} ${(p.pB * 100).toFixed(1)}%. Favorito: ${fv.name}.` +
    `\n**Cuotas ficticias:** ${oa.decimal.toFixed(2)} / ${ob.decimal.toFixed(2)}.` +
    `\n**Interpretación:** pesan más ${top.map((t) => `${t.name.toLowerCase()} (${t.v >= 0 ? "a favor de" : "en contra de"} ${a.name})`).join(" y ")}.` +
    (p.warnings.length ? `\n⚠ ${p.warnings.join(" ")}` : "");
}

export function answer(db: DB, q: string): Answer {
  const n = norm(q);
  const fs = findFighters(db, q);

  if (fs.length >= 2 && !/historial|ultimos|perfil/.test(n)) return { text: compare(db, fs[0], fs[1]), fighters: fs };
  if (fs.length === 1) {
    const f = fs[0];
    if (/ko|knockout/.test(n) && /cuant|victorias|gan/.test(n)) return { text: `${f.name} tiene ${f.koW} victorias por KO/TKO de ${f.w} en total.`, fighters: fs };
    if (/alcance|reach|altura|edad|cuanto mide/.test(n)) return { text: `${f.name}: alcance ${f.reachCm ?? "sin dato"} cm, altura ${f.heightCm ?? "sin dato"} cm, edad ${age(f.dob) ?? "sin dato"}.`, fighters: fs };
    return { text: summary(db, f), fighters: fs };
  }

  const wcKey = Object.keys({ Flyweight: 1, Bantamweight: 1, Featherweight: 1, Lightweight: 1, Welterweight: 1, Middleweight: 1, "Light Heavyweight": 1, Heavyweight: 1 })
    .find((k) => n.includes(norm(k)) || n.includes(norm(wcEs(k))));
  const pool = wcKey ? db.fighters.filter((f) => f.wc === wcKey) : db.fighters;
  const scope = wcKey ? ` en ${wcEs(wcKey)}` : "";

  if (/mas victorias|mejor record|mas ganadas|top/.test(n)) {
    const t = [...pool].sort((a, b) => b.w - a.w).slice(0, 5);
    return { text: `Más victorias${scope}:\n` + t.map((f, i) => `${i + 1}. ${f.name} — ${record(f)}`).join("\n") };
  }
  if (/\bko\b|knockout|noqueador/.test(n)) {
    const t = [...pool].sort((a, b) => b.koW - a.koW).slice(0, 5);
    return { text: `Más victorias por KO/TKO${scope}:\n` + t.map((f, i) => `${i + 1}. ${f.name} — ${f.koW} KO`).join("\n") };
  }
  if (/sumision|submission/.test(n)) {
    const t = [...pool].sort((a, b) => b.subW - a.subW).slice(0, 5);
    return { text: `Más victorias por sumisión${scope}:\n` + t.map((f, i) => `${i + 1}. ${f.name} — ${f.subW}`).join("\n") };
  }
  if (/racha/.test(n)) {
    const t = [...pool].filter((f) => f.last && f.last >= "2025-01-01").sort((a, b) => b.streak - a.streak).slice(0, 5);
    return { text: `Mayores rachas activas${scope}:\n` + t.map((f, i) => `${i + 1}. ${f.name} — ${f.streak} seguidas`).join("\n") };
  }
  if (/alcance/.test(n)) {
    const t = [...pool].filter((f) => f.reachCm).sort((a, b) => b.reachCm! - a.reachCm!).slice(0, 5);
    return { text: `Mayor alcance${scope}:\n` + t.map((f, i) => `${i + 1}. ${f.name} — ${f.reachCm} cm`).join("\n") };
  }
  const yr = n.match(/\b(19|20)\d\d\b/);
  if (/evento|eventos/.test(n) && yr) {
    const ev = db.events.filter((e) => e.date.startsWith(yr[0]));
    return { text: `Hubo ${ev.length} eventos en ${yr[0]} (${ev.reduce((s, e) => s + e.fights, 0)} peleas).` };
  }
  if (/cuantos peleadores|cuantas peleas|cuantos eventos/.test(n))
    return { text: `El dataset tiene ${db.fighters.length} peleadores, ${db.fights.length} peleas y ${db.events.length} eventos.` };

  return { text: "No encontré datos para esa consulta. Prueba con el nombre de un peleador, dos nombres para compararlos y predecir, o rankings como «más KO en peso ligero»." };
}
