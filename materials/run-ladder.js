// node materials/run-ladder.js - runs the real browser engine on the shipped sample, prints the canon as JSON.
// Units are integers or 1 dp; percentages 1 dp; BRL and yen 2 dp / whole yen; rounding is floor(x*k+0.5)/k in both languages.
const fs = require("fs"), path = require("path");
const E = require(path.join(__dirname, "..", "assets", "pra-live.js"));
const src = fs.readFileSync(path.join(__dirname, "..", "assets", "pra-sample.js"), "utf8");
const win = {}; new Function("window", src)(win);
const S = win.PRA_SAMPLE;
const rd = (x, k) => (x == null ? null : Math.floor(x * k + 0.5) / k);
const pc = (x) => rd(x * 100, 10), u1 = (x) => rd(x, 10), br = (x) => rd(x, 100), yen = (x) => rd(x, 1);
function lad(o) {
  const L = E.ladder(S, o);
  const r = { n: L.n, ok: L.ok, panel: L.panel, rung1: { lift: pc(L.rung1.lift), incr: L.rung1.incr } };
  if (!L.ok) return r;
  Object.assign(r, {
    cutU: L.cutU, heldU: L.heldU,
    rung2: { lift: pc(L.rung2.lift), incr: L.rung2.incr },
    rung3: { liftCut: pc(L.rung3.liftCut), liftHeld: pc(L.rung3.liftHeld), diff: pc(L.rung3.diff), expN: u1(L.rung3.expN), incr: u1(L.rung3.incr) },
    rung4: { expD: u1(L.rung4.expD), decGap: u1(L.rung4.decGap), incr: u1(L.rung4.incr) },
    rung5: { depth: pc(L.rung5.depth), margin: pc(L.rung5.margin), breakEven: L.rung5.breakEven == null ? null : pc(L.rung5.breakEven),
      volRise: pc(L.rung5.volRise), actual: br(L.rung5.p.actual), counter: br(L.rung5.p.counter), delta: br(L.rung5.p.delta), paid: L.rung5.paid },
    crowd: { incr: L.crowd.incr, overstated: u1(L.crowd.overstated), ratio: rd(L.crowd.ratio, 100), volRise: pc(L.crowd.volRise),
      delta: br(L.crowd.p.delta), paid: L.crowd.paid },
  });
  return r;
}
function plac(o) {
  const P = E.placebo(S, o, 200);
  if (!P.ok) return P;
  return { real: pc(P.real), above: P.above, below: P.below, mean: pc(P.mean), p5: pc(P.p5), p95: pc(P.p95), min: pc(P.min), max: pc(P.max) };
}
const W = E.waterfall(S), V0 = E.wtp(S, "original"), V1 = E.wtp(S, "narrow"), GG = E.gabor(S), PV = E.pvm(S), SR = E.series(S);
const cat = (c) => "cat:" + S.olist.cats.indexOf(c);
const RC = (inp) => {
  const R = E.rangeCalc(inp);
  return { margin: pc(R.margin), base: yen(R.base), es: R.es.map((e) => rd(e, 1000)),
    moves: R.moves.map((m) => ({ move: pc(m.move), breakEven: rd(m.breakEven, 100), verdict: m.verdict,
      profit: m.at.map((a) => yen(a.profit)), revenue: m.at.map((a) => yen(a.revenue)), units: m.at.map((a) => u1(a.units)) })) };
};
const out = {
  selfTest: E.selfTest(S),
  ladder_default: lad({}),
  ladder_cost40: lad({ cost: 0.4 }),
  ladder_cost50: lad({ cost: 0.5 }),
  ladder_cost70: lad({ cost: 0.7 }),
  ladder_thr1: lad({ thr: 0.01 }),
  ladder_thr5: lad({ thr: 0.05 }),
  ladder_thr10: lad({ thr: 0.10 }),
  ladder_home: lad({ filter: "home" }),
  ladder_other: lad({ filter: "other" }),
  ladder_garden: lad({ filter: cat("garden_tools") }),
  placebo_default: plac({}),
  placebo_thr5: plac({ thr: 0.05 }),
  series: { cut: SR.cut, held: SR.held, panel: SR.panel, nCut: SR.nCut, nHeld: SR.nHeld },
  pvm: { products: PV.products, Q0: PV.Q0, Q1: PV.Q1, R0: br(PV.R0), R1: br(PV.R1), price: br(PV.price), volume: br(PV.volume), mix: br(PV.mix),
    newLost: br(PV.newLost), all0: br(PV.all0), all1: br(PV.all1) },
  waterfall: { units: W.units, rows: W.rows, accounts: W.accounts, invoice: yen(W.invoice), pocket: yen(W.pocket),
    onInvoice: yen(W.onInvoice), offInvoice: yen(W.offInvoice), realisation: pc(W.realisation),
    per: Object.fromEntries(Object.entries(W.per).map(([k, v]) => [k, yen(v)])),
    band: { lo: yen(W.band.lo), hi: yen(W.band.hi) }, invBand: { lo: yen(W.invBand.lo), hi: yen(W.invBand.hi) },
    top5: yen(W.top5), bottom5: yen(W.bottom5) },
  wtp_original: { n: V0.n, opp: V0.opp, ipp: V0.ipp, pmc: V0.pmc, pme: V0.pme },
  wtp_narrow: { opp: V1.opp, ipp: V1.ipp, pmc: V1.pmc, pme: V1.pme },
  gabor: { cost: GG.cost, rows: GG.rows.map((r) => [r.price, r.buyers, pc(r.share)]), revMax: GG.revMax, contribMax: GG.contribMax },
  range_kettle: RC({ price: 1800, units: 10000, cost: 720, eLo: -1.2, eHi: -2.4 }),
  range_narrow: RC({ price: 1800, units: 10000, cost: 720, eLo: -1.2, eHi: -1.5 }),
  range_olist: RC({ price: 1800, units: 10000, cost: 720, eLo: -1.554, eHi: -2.154 }),
  b1_breakEven: [[0.05, 0.4], [0.10, 0.4], [0.10, 0.3], [0.10, 0.6], [0.20, 0.4]].map(([d, m]) => [pc(d), pc(m), pc(E.breakEven(d, m))]),
};
console.log(JSON.stringify(out, null, 1));
