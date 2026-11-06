/* pra-live.js - the pricing engine for learn-pricing-analytics-with-phoebe.
 * Pure functions over window.PRA_SAMPLE (assets/pra-sample.js). Runs in the browser and in node.
 * materials/pra_reference.py mirrors every function; materials/compare-ladder.py checks the two
 * agree by value (and fails a planted fault).
 * REAL: Olist product x month rows, 2017-07 to 2018-01 (Black Friday 2017 = 24 November).
 * CONSTRUCTED (labelled on every widget): the Kettle & Co wholesale rows and survey answers,
 * the assumed cost ratio, and every input of the elasticity-range calculator. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PRA = factory();
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var OCT = 3, NOV = 4, DEC = 5;   /* indexes into olist.months */
  var FLOOR = 8;                    /* refuse to compute with fewer than 8 cut or 8 held products */

  /* ---------- seeded generator, identical in pra_reference.py ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ---------- Olist panel: products x months ---------- */
  function grid(S) {
    var O = S.olist, np = O.prodCat.length, nm = O.months.length, U = [], P = [], i, k;
    for (i = 0; i < np; i++) { var u = [], p = []; for (k = 0; k < nm; k++) { u.push(0); p.push(0); } U.push(u); P.push(p); }
    for (i = 0; i < O.p.length; i++) { U[O.p[i]][O.m[i]] = O.units[i]; P[O.p[i]][O.m[i]] = O.pc[i]; }
    return { U: U, P: P, np: np, nm: nm };
  }
  function inScope(S, i, filter) {
    var c = S.olist.prodCat[i];
    if (filter === "all") return true;
    if (filter === "home") return S.olist.home.indexOf(c) >= 0;
    if (filter === "other") return S.olist.home.indexOf(c) < 0;
    if (filter.indexOf("cat:") === 0) return c === parseInt(filter.slice(4), 10);
    return true;
  }
  function groups(S, G, thr, filter) {
    var all = [], three = [], cut = [], held = [], raised = [], i;
    for (i = 0; i < G.np; i++) {
      if (!inScope(S, i, filter)) continue;
      all.push(i);
      if (!(G.U[i][OCT] > 0 && G.U[i][NOV] > 0 && G.U[i][DEC] > 0)) continue;
      three.push(i);
      var r = G.P[i][NOV] / G.P[i][OCT] - 1;
      if (r < -thr) cut.push(i); else if (r <= thr) held.push(i); else raised.push(i);
    }
    return { all: all, three: three, cut: cut, held: held, raised: raised };
  }
  function sumU(G, list, k) { var s = 0; list.forEach(function (i) { s += G.U[i][k]; }); return s; }
  function lift(G, list) { return sumU(G, list, NOV) / sumU(G, list, OCT) - 1; }

  function opt(o) {
    o = o || {};
    return { thr: o.thr == null ? 0.03 : o.thr, cost: o.cost == null ? 0.6 : o.cost,
      filter: o.filter == null ? "all" : o.filter, crowd: !!o.crowd };
  }

  /* profit of the cut group over Nov + Dec, actual vs counterfactual (Oct price, Oct units x growth).
   * A = actual units valued at October prices, B = counterfactual units at October prices.
   * depth = 1 - actual revenue / A; volRise = A / B - 1. The discount pays exactly when
   * volRise > depth / (margin - depth), so the identity and the profit verdict always agree. */
  function profit(G, cut, cost, growth) {
    var act = 0, cf = 0, A = 0, B = 0, rev = 0;
    cut.forEach(function (i) {
      var c = cost * G.P[i][OCT];
      [NOV, DEC].forEach(function (k, j) {
        act += (G.P[i][k] - c) * G.U[i][k];
        cf += (G.P[i][OCT] - c) * G.U[i][OCT] * growth[j];
        rev += G.P[i][k] * G.U[i][k];
        A += G.P[i][OCT] * G.U[i][k];
        B += G.P[i][OCT] * G.U[i][OCT] * growth[j];
      });
    });
    return { actual: act / 100, counter: cf / 100, delta: (act - cf) / 100, depth: 1 - rev / A, volRise: A / B - 1 };
  }

  /* ---------- the five-rung ladder (a6 bench; a4 shows rungs 1 to 4) ---------- */
  function ladder(S, o) {
    o = opt(o);
    var G = grid(S), g = groups(S, G, o.thr, o.filter);
    var n = { all: g.all.length, three: g.three.length, cut: g.cut.length, held: g.held.length, raised: g.raised.length };
    var panel = [sumU(G, g.all, OCT), sumU(G, g.all, NOV), sumU(G, g.all, DEC)];
    var out = { opts: o, n: n, floor: FLOOR, panel: panel, ok: n.cut >= FLOOR && n.held >= FLOOR };
    out.rung1 = { lift: panel[1] / panel[0] - 1, incr: panel[1] - panel[0] };
    if (!out.ok) return out;
    var cu = [sumU(G, g.cut, OCT), sumU(G, g.cut, NOV), sumU(G, g.cut, DEC)];
    var hu = [sumU(G, g.held, OCT), sumU(G, g.held, NOV), sumU(G, g.held, DEC)];
    out.cutU = cu; out.heldU = hu;
    var gN = hu[1] / hu[0], gD = hu[2] / hu[0];
    out.rung2 = { lift: cu[1] / cu[0] - 1, incr: cu[1] - cu[0] };
    out.rung3 = { liftCut: cu[1] / cu[0] - 1, liftHeld: gN - 1, diff: (cu[1] / cu[0]) - gN, expN: cu[0] * gN, incr: cu[1] - cu[0] * gN };
    out.rung4 = { expD: cu[0] * gD, decGap: cu[2] - cu[0] * gD, incr: (cu[1] - cu[0] * gN) + (cu[2] - cu[0] * gD) };
    var m = 1 - o.cost, pr = profit(G, g.cut, o.cost, [gN, gD]);
    out.rung5 = { depth: pr.depth, margin: m, breakEven: m > pr.depth ? pr.depth / (m - pr.depth) : null,
      volRise: pr.volRise, p: pr };
    out.rung5.paid = out.rung5.p.delta > 0;
    /* anti-lever: no comparison group, the Black Friday crowd counted as discount lift */
    var crowdIncr = (cu[1] - cu[0]) + (cu[2] - cu[0]);
    out.crowd = { incr: crowdIncr, overstated: crowdIncr - out.rung4.incr, ratio: crowdIncr / out.rung4.incr,
      p: profit(G, g.cut, o.cost, [1, 1]) };
    out.crowd.volRise = out.crowd.p.volRise;
    out.crowd.paid = out.crowd.p.delta > 0;
    return out;
  }

  /* ---------- break button: shuffle which products were cut (seeded placebo) ---------- */
  function placebo(S, o, draws, seed) {
    o = opt(o); draws = draws || 200; seed = seed == null ? 20171124 : seed;
    var G = grid(S), g = groups(S, G, o.thr, o.filter);
    if (g.cut.length < FLOOR || g.held.length < FLOOR) return { ok: false };
    var pool = g.cut.concat(g.held).sort(function (a, b) { return a - b; });
    var nc = g.cut.length, real = lift(G, g.cut) - lift(G, g.held), rnd = mulberry32(seed), vals = [], d, i;
    for (d = 0; d < draws; d++) {
      var a = pool.slice();
      for (i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
      vals.push(lift(G, a.slice(0, nc)) - lift(G, a.slice(nc)));
    }
    var above = vals.filter(function (v) { return v >= real; }).length;
    var s = vals.slice().sort(function (x, y) { return x - y; }), mean = 0;
    vals.forEach(function (v) { mean += v; }); mean /= draws;
    return { ok: true, real: real, draws: draws, above: above, below: draws - above, mean: mean,
      p5: s[Math.floor(0.05 * draws)], p95: s[Math.floor(0.95 * draws) - 1], min: s[0], max: s[draws - 1], vals: vals };
  }

  /* ---------- a4: monthly units of the cut and held groups ---------- */
  function series(S, o) {
    o = opt(o);
    var G = grid(S), g = groups(S, G, o.thr, o.filter), cut = [], held = [], panel = [], k;
    for (k = 0; k < G.nm; k++) { cut.push(sumU(G, g.cut, k)); held.push(sumU(G, g.held, k)); panel.push(sumU(G, g.all, k)); }
    return { months: S.olist.months, cut: cut, held: held, panel: panel, nCut: g.cut.length, nHeld: g.held.length };
  }

  /* ---------- a5: price-volume-mix bridge, October to November 2017 (real rows, BRL) ---------- */
  function pvm(S, from, to) {
    from = from == null ? OCT : from; to = to == null ? NOV : to;
    var G = grid(S), R0 = 0, R1 = 0, Q0 = 0, Q1 = 0, price = 0, mixA = 0, all0 = 0, all1 = 0, both = 0, i;
    for (i = 0; i < G.np; i++) {
      all0 += G.P[i][from] * G.U[i][from]; all1 += G.P[i][to] * G.U[i][to];
      if (!(G.U[i][from] > 0 && G.U[i][to] > 0)) continue;
      both += 1;
      R0 += G.P[i][from] * G.U[i][from]; R1 += G.P[i][to] * G.U[i][to];
      Q0 += G.U[i][from]; Q1 += G.U[i][to];
      price += (G.P[i][to] - G.P[i][from]) * G.U[i][to];
      mixA += G.P[i][from] * G.U[i][to];
    }
    var avg0 = R0 / Q0, volume = (Q1 - Q0) * avg0, mix = mixA - Q1 * avg0;
    var c = function (x) { return x / 100; };
    return { products: both, Q0: Q0, Q1: Q1, R0: c(R0), R1: c(R1), price: c(price), volume: c(volume), mix: c(mix),
      newLost: c((all1 - R1) - (all0 - R0)), all0: c(all0), all1: c(all1) };
  }

  /* ---------- a1 / b3: the pocket price waterfall (constructed Kettle wholesale rows) ---------- */
  function waterfall(S) {
    var W = S.wholesale, R = W.rows, n = R.a.length, keys = ["onv", "promo", "rebate", "terms", "coop", "freight"];
    var tot = { units: 0 }, i, k;
    keys.forEach(function (key) { tot[key] = 0; });
    var acct = [];
    for (i = 0; i < W.acctType.length; i++) acct.push({ id: i, type: W.types[W.acctType[i]], units: 0, inv: 0, pocket: 0 });
    for (i = 0; i < n; i++) {
      var u = R.units[i], inv = W.list - R.onv[i] - R.promo[i];
      var pocket = inv - R.rebate[i] - R.terms[i] - R.coop[i] - R.freight[i];
      tot.units += u;
      keys.forEach(function (key) { tot[key] += R[key][i] * u; });
      var a = acct[R.a[i]]; a.units += u; a.inv += inv * u; a.pocket += pocket * u;
    }
    var per = {};
    keys.forEach(function (key) { per[key] = tot[key] / tot.units; });
    var invoice = W.list - per.onv - per.promo;
    var pocketP = invoice - per.rebate - per.terms - per.coop - per.freight;
    acct.forEach(function (a) { a.inv = a.inv / a.units; a.pocket = a.pocket / a.units; });
    var byP = acct.slice().sort(function (x, y) { return x.pocket - y.pocket || x.id - y.id; });
    var byI = acct.slice().sort(function (x, y) { return x.inv - y.inv || x.id - y.id; });
    var byU = acct.slice().sort(function (x, y) { return y.units - x.units || x.id - y.id; });
    var mean = function (L) { var s = 0, u = 0; L.forEach(function (a) { s += a.pocket * a.units; u += a.units; }); return s / u; };
    return { list: W.list, units: tot.units, rows: n, accounts: acct.length, per: per, invoice: invoice, pocket: pocketP,
      onInvoice: per.onv + per.promo, offInvoice: per.rebate + per.terms + per.coop + per.freight,
      realisation: pocketP / W.list,
      band: { lo: byP[0].pocket, hi: byP[byP.length - 1].pocket, loId: byP[0].id, hiId: byP[byP.length - 1].id },
      invBand: { lo: byI[0].inv, hi: byI[byI.length - 1].inv },
      top5: mean(byU.slice(0, 5)), bottom5: mean(byU.slice(-5)), accts: acct };
  }

  /* ---------- a2: Van Westendorp (two published definitions) and Gabor-Granger ---------- */
  function cross(xs, f, g) {
    for (var i = 0; i + 1 < xs.length; i++) {
      var d0 = f[i] - g[i], d1 = f[i + 1] - g[i + 1];
      if (d0 === 0) return xs[i];
      if ((d0 > 0 && d1 <= 0) || (d0 < 0 && d1 >= 0)) return xs[i] + (xs[i + 1] - xs[i]) * d0 / (d0 - d1);
    }
    return null;
  }
  function wtp(S, defn) {
    var V = S.survey, n = V.tooCheap.length, xs = [], tc = [], ch = [], nch = [], ex = [], nex = [], te = [], p, i;
    for (p = 500; p <= 3500; p += 50) xs.push(p);
    xs.forEach(function (x) {
      var a = 0, b = 0, c = 0, d = 0;
      for (i = 0; i < n; i++) {
        if (V.tooCheap[i] >= x) a++; if (V.cheap[i] >= x) b++;
        if (V.expensive[i] <= x) c++; if (V.tooExpensive[i] <= x) d++;
      }
      tc.push(a); ch.push(b); nch.push(n - b); ex.push(c); nex.push(n - c); te.push(d);
    });
    var narrow = defn === "narrow";
    var r = function (x) { return x == null ? null : Math.floor(x + 0.5); };
    return { n: n, defn: narrow ? "narrow" : "original", xs: xs, curves: { tooCheap: tc, cheap: ch, notCheap: nch, expensive: ex, notExpensive: nex, tooExpensive: te },
      opp: r(cross(xs, tc, te)), ipp: r(cross(xs, ch, ex)),
      pmc: r(narrow ? cross(xs, tc, ex) : cross(xs, tc, nch)),
      pme: r(narrow ? cross(xs, te, ch) : cross(xs, te, nex)) };
  }
  function gabor(S, cost) {
    var V = S.survey, n = V.wtp.length, c = cost == null ? V.unitCost : cost;
    var rows = V.ggPrices.map(function (p) {
      var b = 0; for (var i = 0; i < n; i++) if (V.wtp[i] >= p) b++;
      return { price: p, buyers: b, share: b / n, revenue: p * b, contribution: (p - c) * b };
    });
    var best = function (key) { return rows.reduce(function (a, r) { return r[key] > a[key] ? r : a; }, rows[0]).price; };
    return { n: n, cost: c, rows: rows, revMax: best("revenue"), contribMax: best("contribution") };
  }

  /* ---------- a3: deciding with an elasticity range you were handed (constructed inputs) ---------- */
  function rangeCalc(inp) {
    var price = inp.price, units = inp.units, cost = inp.cost, m = (price - cost) / price;
    var es = [inp.eLo, (inp.eLo + inp.eHi) / 2, inp.eHi];
    var base = (price - cost) * units;
    var moves = (inp.moves || [-0.10, -0.05, 0.05, 0.10]).map(function (x) {
      var p1 = price * (1 + x);
      var at = es.map(function (e) {
        var q1 = units * Math.pow(1 + x, e);
        return { e: e, units: q1, revenue: p1 * q1 - price * units, profit: (p1 - cost) * q1 - base };
      });
      var lo = at[0].profit, hi = at[2].profit;
      var verdict = lo > 0 && hi > 0 ? "wins across the range" : lo < 0 && hi < 0 ? "loses across the range" : "depends on the point estimate";
      return { move: x, breakEven: Math.log(m / (m + x)) / Math.log(1 + x), at: at, verdict: verdict };
    });
    return { margin: m, base: base, es: es, moves: moves };
  }

  /* ---------- discount break-even identity (b1): volume rise needed = d / (m - d) ---------- */
  function breakEven(d, m) { return m > d ? d / (m - d) : null; }

  /* ---------- on-load self-test: the bench must be able to report a worse number ---------- */
  function selfTest(S) {
    var L = ladder(S), fails = [];
    if (!L.ok) fails.push("default scope must clear the floor");
    else {
      if (!(L.crowd.incr > L.rung4.incr)) fails.push("counting the crowd must overstate the lift");
      if (!(L.rung1.lift > L.rung3.diff)) fails.push("the naive lift must exceed the comparison-group lift");
    }
    if (ladder(S, { filter: "cat:" + S.olist.cats.indexOf("garden_tools") }).ok) fails.push("a single small category must be refused");
    var P = placebo(S, {}, 50);
    if (!(Math.abs(P.mean) < Math.abs(P.real))) fails.push("placebo mean must sit nearer zero than the real gap");
    var W = waterfall(S);
    if (!(W.pocket < W.invoice && W.invoice < W.list)) fails.push("pocket < invoice < list");
    return { ok: fails.length === 0, fails: fails };
  }

  return { ladder: ladder, placebo: placebo, series: series, pvm: pvm, waterfall: waterfall, wtp: wtp, gabor: gabor,
    rangeCalc: rangeCalc, breakEven: breakEven, selfTest: selfTest, mulberry32: mulberry32, FLOOR: FLOOR };
}));
