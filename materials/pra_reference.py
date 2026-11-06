#!/usr/bin/env python3
"""Python reference for assets/pra-live.js (learn-pricing-analytics-with-phoebe).

Internal build script. Never linked from an audience page.
Reads assets/pra-sample.js, recomputes every widget number independently of the JS engine, and
prints the same JSON as materials/run-ladder.js. materials/compare-ladder.py compares the two by
value. Rounding: floor(x*k + 0.5)/k, as in the node script.
"""
import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OCT, NOV, DEC = 3, 4, 5
FLOOR = 8


def load():
    s = open(os.path.join(HERE, "..", "assets", "pra-sample.js")).read()
    return json.loads(s[s.index("window.PRA_SAMPLE = ") + len("window.PRA_SAMPLE = "):].rstrip().rstrip(";"))


def rd(x, k):
    return None if x is None else math.floor(x * k + 0.5) / k


def pc(x): return rd(x * 100, 10)
def u1(x): return rd(x, 10)
def br(x): return rd(x, 100)
def yen(x): return rd(x, 1)


def num(x):
    """JSON numbers: 111.0 prints as 111 in node; make Python match by value only (compare is by value)."""
    return x


def mulberry32(seed):
    st = [seed & 0xFFFFFFFF]

    def imul(a, b):
        return (a * b) & 0xFFFFFFFF

    def nxt():
        st[0] = (st[0] + 0x6D2B79F5) & 0xFFFFFFFF
        a = st[0]
        t = imul(a ^ (a >> 15), 1 | a)
        t = ((t + imul(t ^ (t >> 7), 61 | t)) & 0xFFFFFFFF) ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    return nxt


class Panel:
    def __init__(self, S):
        O = S["olist"]
        self.S = S
        self.np, self.nm = len(O["prodCat"]), len(O["months"])
        self.U = [[0] * self.nm for _ in range(self.np)]
        self.P = [[0] * self.nm for _ in range(self.np)]
        for p, m, u, c in zip(O["p"], O["m"], O["units"], O["pc"]):
            self.U[p][m] = u
            self.P[p][m] = c

    def in_scope(self, i, f):
        c, home = self.S["olist"]["prodCat"][i], self.S["olist"]["home"]
        if f == "all": return True
        if f == "home": return c in home
        if f == "other": return c not in home
        if f.startswith("cat:"): return c == int(f[4:])
        return True

    def groups(self, thr, f):
        g = dict(all=[], three=[], cut=[], held=[], raised=[])
        for i in range(self.np):
            if not self.in_scope(i, f): continue
            g["all"].append(i)
            if not (self.U[i][OCT] > 0 and self.U[i][NOV] > 0 and self.U[i][DEC] > 0): continue
            g["three"].append(i)
            r = self.P[i][NOV] / self.P[i][OCT] - 1
            if r < -thr: g["cut"].append(i)
            elif r <= thr: g["held"].append(i)
            else: g["raised"].append(i)
        return g

    def su(self, lst, k): return sum(self.U[i][k] for i in lst)
    def lift(self, lst): return self.su(lst, NOV) / self.su(lst, OCT) - 1


def profit(G, cut, cost, growth):
    act = cf = A = B = rev = 0.0
    for i in cut:
        c = cost * G.P[i][OCT]
        for j, k in enumerate((NOV, DEC)):
            act += (G.P[i][k] - c) * G.U[i][k]
            cf += (G.P[i][OCT] - c) * G.U[i][OCT] * growth[j]
            rev += G.P[i][k] * G.U[i][k]
            A += G.P[i][OCT] * G.U[i][k]
            B += G.P[i][OCT] * G.U[i][OCT] * growth[j]
    return dict(actual=act / 100, counter=cf / 100, delta=(act - cf) / 100, depth=1 - rev / A, volRise=A / B - 1)


def ladder(S, thr=0.03, cost=0.6, f="all"):
    G = Panel(S)
    g = G.groups(thr, f)
    n = {k: len(g[k]) for k in ("all", "three", "cut", "held", "raised")}
    panel = [G.su(g["all"], k) for k in (OCT, NOV, DEC)]
    ok = n["cut"] >= FLOOR and n["held"] >= FLOOR
    r = dict(n=n, ok=ok, panel=panel, rung1=dict(lift=pc(panel[1] / panel[0] - 1), incr=panel[1] - panel[0]))
    if not ok: return r
    cu = [G.su(g["cut"], k) for k in (OCT, NOV, DEC)]
    hu = [G.su(g["held"], k) for k in (OCT, NOV, DEC)]
    gN, gD = hu[1] / hu[0], hu[2] / hu[0]
    m = 1 - cost
    pr = profit(G, g["cut"], cost, [gN, gD])
    be = pr["depth"] / (m - pr["depth"]) if m > pr["depth"] else None
    incr3 = cu[1] - cu[0] * gN
    incr4 = incr3 + (cu[2] - cu[0] * gD)
    crowd_incr = (cu[1] - cu[0]) + (cu[2] - cu[0])
    pc_ = profit(G, g["cut"], cost, [1, 1])
    r.update(
        cutU=cu, heldU=hu,
        rung2=dict(lift=pc(cu[1] / cu[0] - 1), incr=cu[1] - cu[0]),
        rung3=dict(liftCut=pc(cu[1] / cu[0] - 1), liftHeld=pc(gN - 1), diff=pc(cu[1] / cu[0] - gN), expN=u1(cu[0] * gN), incr=u1(incr3)),
        rung4=dict(expD=u1(cu[0] * gD), decGap=u1(cu[2] - cu[0] * gD), incr=u1(incr4)),
        rung5=dict(depth=pc(pr["depth"]), margin=pc(m), breakEven=None if be is None else pc(be), volRise=pc(pr["volRise"]),
                   actual=br(pr["actual"]), counter=br(pr["counter"]), delta=br(pr["delta"]), paid=pr["delta"] > 0),
        crowd=dict(incr=crowd_incr, overstated=u1(crowd_incr - incr4), ratio=rd(crowd_incr / incr4, 100), volRise=pc(pc_["volRise"]),
                   delta=br(pc_["delta"]), paid=pc_["delta"] > 0),
    )
    return r


def placebo(S, thr=0.03, f="all", draws=200, seed=20171124):
    G = Panel(S)
    g = G.groups(thr, f)
    if len(g["cut"]) < FLOOR or len(g["held"]) < FLOOR: return dict(ok=False)
    pool = sorted(g["cut"] + g["held"])
    nc = len(g["cut"])
    real = G.lift(g["cut"]) - G.lift(g["held"])
    rnd = mulberry32(seed)
    vals = []
    for _ in range(draws):
        a = pool[:]
        for i in range(len(a) - 1, 0, -1):
            j = math.floor(rnd() * (i + 1))
            a[i], a[j] = a[j], a[i]
        vals.append(G.lift(a[:nc]) - G.lift(a[nc:]))
    above = sum(1 for v in vals if v >= real)
    s = sorted(vals)
    mean = 0.0
    for v in vals: mean += v
    mean /= draws
    return dict(real=pc(real), above=above, below=draws - above, mean=pc(mean), p5=pc(s[int(0.05 * draws)]),
                p95=pc(s[int(0.95 * draws) - 1]), min=pc(s[0]), max=pc(s[-1]))


def series(S, thr=0.03, f="all"):
    G = Panel(S)
    g = G.groups(thr, f)
    return dict(cut=[G.su(g["cut"], k) for k in range(G.nm)], held=[G.su(g["held"], k) for k in range(G.nm)],
                panel=[G.su(g["all"], k) for k in range(G.nm)], nCut=len(g["cut"]), nHeld=len(g["held"]))


def pvm(S, a=OCT, b=NOV):
    G = Panel(S)
    R0 = R1 = Q0 = Q1 = price = mixA = all0 = all1 = 0.0
    both = 0
    for i in range(G.np):
        all0 += G.P[i][a] * G.U[i][a]
        all1 += G.P[i][b] * G.U[i][b]
        if not (G.U[i][a] > 0 and G.U[i][b] > 0): continue
        both += 1
        R0 += G.P[i][a] * G.U[i][a]; R1 += G.P[i][b] * G.U[i][b]
        Q0 += G.U[i][a]; Q1 += G.U[i][b]
        price += (G.P[i][b] - G.P[i][a]) * G.U[i][b]
        mixA += G.P[i][a] * G.U[i][b]
    avg0 = R0 / Q0
    return dict(products=both, Q0=int(Q0), Q1=int(Q1), R0=br(R0 / 100), R1=br(R1 / 100), price=br(price / 100),
                volume=br((Q1 - Q0) * avg0 / 100), mix=br((mixA - Q1 * avg0) / 100),
                newLost=br(((all1 - R1) - (all0 - R0)) / 100), all0=br(all0 / 100), all1=br(all1 / 100))


def waterfall(S):
    W = S["wholesale"]; R = W["rows"]; L = W["list"]
    keys = ["onv", "promo", "rebate", "terms", "coop", "freight"]
    tot = {k: 0 for k in keys}; units = 0
    acct = [dict(id=i, units=0, inv=0.0, pocket=0.0) for i in range(len(W["acctType"]))]
    for i in range(len(R["a"])):
        u = R["units"][i]
        inv = L - R["onv"][i] - R["promo"][i]
        pocket = inv - R["rebate"][i] - R["terms"][i] - R["coop"][i] - R["freight"][i]
        units += u
        for k in keys: tot[k] += R[k][i] * u
        a = acct[R["a"][i]]; a["units"] += u; a["inv"] += inv * u; a["pocket"] += pocket * u
    per = {k: tot[k] / units for k in keys}
    invoice = L - per["onv"] - per["promo"]
    pocket = invoice - per["rebate"] - per["terms"] - per["coop"] - per["freight"]
    for a in acct: a["inv"] /= a["units"]; a["pocket"] /= a["units"]
    byP = sorted(acct, key=lambda a: (a["pocket"], a["id"]))
    byI = sorted(acct, key=lambda a: (a["inv"], a["id"]))
    byU = sorted(acct, key=lambda a: (-a["units"], a["id"]))
    def mean(lst): return sum(a["pocket"] * a["units"] for a in lst) / sum(a["units"] for a in lst)
    return dict(units=units, rows=len(R["a"]), accounts=len(acct), invoice=yen(invoice), pocket=yen(pocket),
                onInvoice=yen(per["onv"] + per["promo"]), offInvoice=yen(per["rebate"] + per["terms"] + per["coop"] + per["freight"]),
                realisation=pc(pocket / L), per={k: yen(v) for k, v in per.items()},
                band=dict(lo=yen(byP[0]["pocket"]), hi=yen(byP[-1]["pocket"])), invBand=dict(lo=yen(byI[0]["inv"]), hi=yen(byI[-1]["inv"])),
                top5=yen(mean(byU[:5])), bottom5=yen(mean(byU[-5:])))


def cross(xs, f, g):
    for i in range(len(xs) - 1):
        d0, d1 = f[i] - g[i], f[i + 1] - g[i + 1]
        if d0 == 0: return xs[i]
        if (d0 > 0 and d1 <= 0) or (d0 < 0 and d1 >= 0):
            return xs[i] + (xs[i + 1] - xs[i]) * d0 / (d0 - d1)
    return None


def wtp(S, narrow=False):
    V = S["survey"]; n = len(V["tooCheap"])
    xs = list(range(500, 3501, 50))
    tc = [sum(1 for v in V["tooCheap"] if v >= x) for x in xs]
    ch = [sum(1 for v in V["cheap"] if v >= x) for x in xs]
    ex = [sum(1 for v in V["expensive"] if v <= x) for x in xs]
    te = [sum(1 for v in V["tooExpensive"] if v <= x) for x in xs]
    nch = [n - v for v in ch]; nex = [n - v for v in ex]
    r = lambda x: None if x is None else math.floor(x + 0.5)
    out = dict(opp=r(cross(xs, tc, te)), ipp=r(cross(xs, ch, ex)),
               pmc=r(cross(xs, tc, ex) if narrow else cross(xs, tc, nch)),
               pme=r(cross(xs, te, ch) if narrow else cross(xs, te, nex)))
    if not narrow: out = dict(n=n, **out)
    return out


def gabor(S):
    V = S["survey"]; n = len(V["wtp"]); c = V["unitCost"]
    rows = []
    for p in V["ggPrices"]:
        b = sum(1 for w in V["wtp"] if w >= p)
        rows.append(dict(price=p, buyers=b, share=b / n, revenue=p * b, contribution=(p - c) * b))
    def best(k):
        a = rows[0]
        for r in rows:
            if r[k] > a[k]: a = r
        return a["price"]
    return dict(cost=c, rows=[[r["price"], r["buyers"], pc(r["share"])] for r in rows], revMax=best("revenue"), contribMax=best("contribution"))


def range_calc(price, units, cost, eLo, eHi, moves=(-0.10, -0.05, 0.05, 0.10)):
    m = (price - cost) / price
    es = [eLo, (eLo + eHi) / 2, eHi]
    base = (price - cost) * units
    out = []
    for x in moves:
        p1 = price * (1 + x)
        at = []
        for e in es:
            q1 = units * (1 + x) ** e
            at.append(dict(units=q1, revenue=p1 * q1 - price * units, profit=(p1 - cost) * q1 - base))
        lo, hi = at[0]["profit"], at[2]["profit"]
        v = "wins across the range" if lo > 0 and hi > 0 else "loses across the range" if lo < 0 and hi < 0 else "depends on the point estimate"
        out.append(dict(move=pc(x), breakEven=rd(math.log(m / (m + x)) / math.log(1 + x), 100), verdict=v,
                        profit=[yen(a["profit"]) for a in at], revenue=[yen(a["revenue"]) for a in at], units=[u1(a["units"]) for a in at]))
    return dict(margin=pc(m), base=yen(base), es=[rd(e, 1000) for e in es], moves=out)


def main():
    S = load()
    cat = lambda c: "cat:%d" % S["olist"]["cats"].index(c)
    out = dict(
        meta_check=None,
        ladder_default=ladder(S), ladder_cost40=ladder(S, cost=0.4), ladder_cost50=ladder(S, cost=0.5), ladder_cost70=ladder(S, cost=0.7),
        ladder_thr1=ladder(S, thr=0.01), ladder_thr5=ladder(S, thr=0.05), ladder_thr10=ladder(S, thr=0.10),
        ladder_home=ladder(S, f="home"), ladder_other=ladder(S, f="other"), ladder_garden=ladder(S, f=cat("garden_tools")),
        placebo_default=placebo(S), placebo_thr5=placebo(S, thr=0.05),
        series=series(S), pvm=pvm(S), waterfall=waterfall(S),
        wtp_original=wtp(S), wtp_narrow=wtp(S, narrow=True), gabor=gabor(S),
        range_kettle=range_calc(1800, 10000, 720, -1.2, -2.4),
        range_narrow=range_calc(1800, 10000, 720, -1.2, -1.5),
        range_olist=range_calc(1800, 10000, 720, -1.554, -2.154),
        b1_breakEven=[[pc(d), pc(m), pc(d / (m - d))] for d, m in [(0.05, 0.4), (0.10, 0.4), (0.10, 0.3), (0.10, 0.6), (0.20, 0.4)]],
    )
    del out["meta_check"]
    print(json.dumps(out, indent=1))


if __name__ == "__main__":
    main()
