"""Convierte dataset/*.csv en JSON estáticos para el front y entrena el modelo de predicción.

Solo usa la librería estándar de Python. Uso (desde la raíz del repo):
    python scripts/build_data.py
El modelo usa únicamente variables calculables ANTES de cada combate (récord previo, racha,
edad, físico) para evitar fuga de información; el corte train/test es temporal.
"""
import csv
import json
import math
import re
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DS = ROOT / "dataset"
OUT = ROOT / "apps" / "web" / "public" / "data"
OUT.mkdir(parents=True, exist_ok=True)


def rd(name):
    with open(DS / name, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def height_cm(s):
    m = re.match(r"(\d+)'\s*(\d+)", s or "")
    return round((int(m.group(1)) * 12 + int(m.group(2))) * 2.54) if m else None


def pdate(s):
    try:
        y, m, d = (int(p) for p in s.split("-"))
        return date(y, m, d)
    except Exception:
        return None


def method_group(m):
    m = m or ""
    if m.startswith("Decision"):
        return "DEC"
    if m.startswith("Submission"):
        return "SUB"
    if m.startswith("KO") or m.startswith("TKO"):
        return "KO"
    return "OTH"


events = rd("event.csv")
fighters = rd("fighter.csv")
fights = rd("fight.csv")
bonuses = defaultdict(list)
for b in rd("fighter_bonus.csv"):
    bonuses[b["fight_id"]].append(b["bonus_type"])

ev_idx = {e["event_id"]: i for i, e in enumerate(events)}
fi_idx = {f["fighter_id"]: i for i, f in enumerate(fighters)}
ev_date = {e["event_id"]: pdate(e["date"]) for e in events}

# ---- historial cronológico: récord previo a cada combate ----
fights_sorted = sorted(
    (f for f in fights if f["event_id"] in ev_idx and ev_date[f["event_id"]]),
    key=lambda f: ev_date[f["event_id"]],
)


class St:
    __slots__ = ("w", "l", "d", "ko", "sub", "dec", "streak", "last")

    def __init__(self):
        self.w = self.l = self.d = self.ko = self.sub = self.dec = self.streak = 0
        self.last = None


state = defaultdict(St)
T_MIN, T_MAX = 1, 12


def feats(a, b, fa, fb, when, title):
    """Variables A - B. a, b: St; fa, fb: filas de fighter.csv; when: date."""

    def age(f):
        d = pdate(f["dob"]) if f else None
        return (when - d).days / 365.25 if d else None

    def diff(x, y):
        return (x - y) if x is not None and y is not None else 0.0

    def wr(s):
        return (s.w + 1) / (s.w + s.l + s.d + 2)

    def nf(s):
        return math.log1p(s.w + s.l + s.d)

    def fr(s, k):
        return getattr(s, k) / s.w if s.w else 0.0

    def inact(s):
        return min((when - s.last).days, 1500) / 365.25 if s.last else 1.0

    return [
        diff(age(fa), age(fb)),
        diff(num(fa["reach_inches"]) and num(fa["reach_inches"]) * 2.54, num(fb["reach_inches"]) and num(fb["reach_inches"]) * 2.54) / 10,
        diff(height_cm(fa["height"]), height_cm(fb["height"])) / 10,
        wr(a) - wr(b),
        nf(a) - nf(b),
        max(-5, min(5, a.streak)) - max(-5, min(5, b.streak)),
        fr(a, "ko") - fr(b, "ko"),
        fr(a, "sub") - fr(b, "sub"),
        inact(a) - inact(b),
    ]


FEATURE_NAMES = [
    "Edad (años)", "Alcance (cm/10)", "Altura (cm/10)", "% victorias previo",
    "Experiencia (log nº combates)", "Racha actual", "% victorias por KO", "% victorias por sumisión",
    "Inactividad (años)",
]

rows = []  # (fecha, x, y)
fid_row = {f["fighter_id"]: f for f in fighters}
for f in fights_sorted:
    r, b = f["r_id"], f["b_id"]
    if r not in fid_row or b not in fid_row:
        continue
    when = ev_date[f["event_id"]]
    sr, sb = state[r], state[b]
    win = f["winner_id"] if f["result_status"] == "win" else None
    if win in (r, b):
        x = feats(sr, sb, fid_row[r], fid_row[b], when, f["title_fight"])
        y = 1 if win == r else 0
        rows.append((when, x, y))
    # actualizar estados DESPUÉS de usar las variables
    for me, op in ((r, b), (b, r)):
        s = state[me]
        s.last = when
        if f["result_status"] == "win" and win:
            if win == me:
                s.w += 1
                s.streak = s.streak + 1 if s.streak > 0 else 1
                g = method_group(f["method"])
                if g == "KO":
                    s.ko += 1
                elif g == "SUB":
                    s.sub += 1
                elif g == "DEC":
                    s.dec += 1
            else:
                s.l += 1
                s.streak = s.streak - 1 if s.streak < 0 else -1
        elif f["result_status"] == "draw":
            s.d += 1
            s.streak = 0

# ---- entrenamiento: logística simétrica (sin intercepto), corte temporal ----
rows.sort(key=lambda t: t[0])
cut = int(len(rows) * 0.85)
train, test = rows[:cut], rows[cut:]
k = len(FEATURE_NAMES)
mean = [sum(r[1][j] for r in train) / len(train) * 0 for j in range(k)]  # sin centrar: simetría A-B
std = [math.sqrt(sum(r[1][j] ** 2 for r in train) / len(train)) or 1.0 for j in range(k)]


def aug(data):
    X, Y = [], []
    for _, x, y in data:
        z = [x[j] / std[j] for j in range(k)]
        X.append(z)
        Y.append(y)
        X.append([-v for v in z])
        Y.append(1 - y)
    return X, Y


def sig(z):
    return 1 / (1 + math.exp(-max(-30, min(30, z))))


Xtr, Ytr = aug(train)
Xte, Yte = aug(test)
w = [0.0] * k
lr, l2 = 0.5, 1e-3
for it in range(400):
    g = [0.0] * k
    for x, y in zip(Xtr, Ytr):
        e = sig(sum(a * b for a, b in zip(w, x))) - y
        for j in range(k):
            g[j] += e * x[j]
    n = len(Xtr)
    w = [w[j] - lr * (g[j] / n + l2 * w[j]) for j in range(k)]


def evaluate(X, Y):
    p = [sig(sum(a * b for a, b in zip(w, x))) for x in X]
    acc = sum((pi >= 0.5) == (y == 1) for pi, y in zip(p, Y)) / len(Y)
    brier = sum((pi - y) ** 2 for pi, y in zip(p, Y)) / len(Y)
    ll = -sum(math.log(max(1e-9, pi if y else 1 - pi)) for pi, y in zip(p, Y)) / len(Y)
    pairs = sorted(zip(p, Y))
    pos = sum(Y)
    neg = len(Y) - pos
    rank_sum, i = 0.0, 0
    while i < len(pairs):
        j = i
        while j < len(pairs) and pairs[j][0] == pairs[i][0]:
            j += 1
        avg = (i + j + 1) / 2
        rank_sum += avg * sum(y for _, y in pairs[i:j])
        i = j
    auc = (rank_sum - pos * (pos + 1) / 2) / (pos * neg)
    bins = []
    for b in range(10):
        sel = [(pi, y) for pi, y in zip(p, Y) if b / 10 <= pi < (b + 1) / 10 or (b == 9 and pi == 1)]
        if sel:
            bins.append([round(sum(s[0] for s in sel) / len(sel), 3), round(sum(s[1] for s in sel) / len(sel), 3), len(sel)])
    return dict(accuracy=round(acc, 4), brier=round(brier, 4), logloss=round(ll, 4), auc=round(auc, 4), calibration=bins)


metrics = evaluate(Xte, Yte)
metrics["train_fights"] = len(train)
metrics["test_fights"] = len(test)
metrics["train_until"] = str(train[-1][0])
metrics["test_from"] = str(test[0][0])
metrics["baseline_50"] = 0.5

model = dict(
    features=FEATURE_NAMES,
    weights=[round(v, 5) for v in w],
    std=[round(v, 5) for v in std],
    metrics=metrics,
    note="Regresión logística simétrica entrenada con variables previas al combate; corte temporal 85/15.",
)
(OUT / "model.json").write_text(json.dumps(model, ensure_ascii=False), encoding="utf-8")

# ---- exportar fighters ----
FIGHTER_COLS = [
    "id", "name", "nick", "heightCm", "weightLbs", "reachCm", "stance", "dob", "slpm", "strAcc", "sapm",
    "strDef", "tdAvg", "tdAcc", "tdDef", "subAvg", "w", "l", "d", "nc", "koW", "subW", "decW", "streak", "last", "wc",
]
nc_count = defaultdict(int)
wc_count = defaultdict(lambda: defaultdict(int))
for f in fights:
    if f["result_status"] == "no_contest":
        nc_count[f["r_id"]] += 1
        nc_count[f["b_id"]] += 1
    wc_count[f["r_id"]][f["weight_class"]] += 1
    wc_count[f["b_id"]][f["weight_class"]] += 1

out_f = []
for f in fighters:
    s = state[f["fighter_id"]]
    reach = num(f["reach_inches"])
    wcs = wc_count[f["fighter_id"]]
    out_f.append([
        f["fighter_id"], f["fighter_name"], f["fighter_nick_name"], height_cm(f["height"]), num(f["weight_lbs"]),
        round(reach * 2.54) if reach else None, f["stance"], f["dob"], num(f["slpm"]), num(f["str_acc"]), num(f["sapm"]),
        num(f["str_def"]), num(f["td_avg"]), num(f["td_acc"]), num(f["td_def"]), num(f["sub_avg"]),
        s.w, s.l, s.d, nc_count[f["fighter_id"]], s.ko, s.sub, s.dec, s.streak,
        str(s.last) if s.last else None, max(wcs, key=wcs.get) if wcs else None,
    ])
(OUT / "fighters.json").write_text(json.dumps(dict(cols=FIGHTER_COLS, rows=out_f), ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

# ---- eventos y peleas ----
ev_count = defaultdict(int)
for f in fights:
    ev_count[f["event_id"]] += 1
(OUT / "events.json").write_text(json.dumps(dict(
    cols=["id", "name", "date", "location", "fights"],
    rows=[[e["event_id"], e["event_name"], e["date"], e["location"], ev_count[e["event_id"]]] for e in events],
), ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

fr = []
for f in fights:
    if f["event_id"] not in ev_idx or f["r_id"] not in fi_idx or f["b_id"] not in fi_idx:
        continue
    win = f["winner_id"]
    fr.append([
        f["fight_id"], ev_idx[f["event_id"]], f["weight_class"], int(f["title_fight"] or 0), fi_idx[f["r_id"]], fi_idx[f["b_id"]],
        (0 if win == f["r_id"] else 1 if win == f["b_id"] else -1), f["result_status"], f["method"],
        int(f["round"]) if f["round"].isdigit() else None, f["time"], f["time_format"],
        " ".join(f["details"].split())[:80], "|".join(bonuses.get(f["fight_id"], [])),
    ])
(OUT / "fights.json").write_text(json.dumps(dict(
    cols=["id", "event", "weightClass", "title", "red", "blue", "winner", "status", "method", "round", "time", "format", "details", "bonuses"],
    rows=fr,
), ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

print("fighters", len(out_f), "events", len(events), "fights", len(fr))
print("modelo:", json.dumps({k: v for k, v in metrics.items() if k != "calibration"}))
print("pesos:", dict(zip(FEATURE_NAMES, model["weights"])))
