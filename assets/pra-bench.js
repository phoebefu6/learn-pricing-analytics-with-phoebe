/* pra-bench.js - the pricing widgets. Renders into any element with class "pra-widget":
 *   data-mode="waterfall"  Analyst session 1, list to invoice to pocket price (constructed Kettle rows)
 *   data-mode="wtp"        Analyst session 2, Van Westendorp and Gabor-Granger (constructed survey)
 *   data-mode="range"      Analyst session 3, a decision across a handed elasticity range (constructed)
 *   data-mode="promo"      Analyst session 4, baseline, lift and the month after (real Olist rows)
 *   data-mode="pvm"        Analyst session 5, price-volume-mix bridge (real Olist rows)
 *   data-mode="bench"      Analyst session 6, the promo and discount lab (real Olist rows)
 * Every number is computed by pra-live.js when the page loads or a control changes. */
(function () {
  "use strict";
  var S, E;
  var REAL = "Real Olist product-month rows (Brazilian marketplace, delivered orders, prices in BRL). ";
  var KETTLE = "Constructed Kettle & Co example: invented rows, seeded, for practice. ";

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function rd(x, k) { return Math.floor(x * k + 0.5) / k; }
  function grp(x) { var neg = typeof x === "string" ? x.charAt(0) === "-" : x < 0, s = typeof x === "string" ? x.replace("-", "") : String(Math.abs(x)), p = s.split("."); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); return (neg ? "-" : "") + p.join("."); }
  function pc(x) { return rd(x * 100, 10).toFixed(1) + "%"; }
  function pp(x) { var v = rd(x * 100, 10); return (v > 0 ? "+" : v < 0 ? "-" : "") + Math.abs(v).toFixed(1); }
  function sgn(v, f) { return (v > 0 ? "+" : v < 0 ? "-" : "") + f(Math.abs(v)); }
  function yen(x) { return grp(rd(x, 1)) + " yen"; }
  function brl(x) { return "R$ " + grp(rd(x, 100).toFixed(2)); }
  function un(x) { return grp(rd(x, 10)); }
  function kind(parent, real, text) {
    var p = el("p", "pra-honesty");
    p.appendChild(el("span", "pra-kind " + (real ? "is-real" : "is-constructed"), real ? "real rows" : "constructed"));
    p.appendChild(document.createTextNode(text)); parent.appendChild(p); return p;
  }
  function both(parent, text) {
    var p = el("p", "pra-honesty");
    p.appendChild(el("span", "pra-kind is-real", "real rows"));
    p.appendChild(el("span", "pra-kind is-constructed", "assumed"));
    p.appendChild(document.createTextNode(text)); parent.appendChild(p); return p;
  }
  function table(head, rows, opts) {
    var w = el("div", "mk-tablewrap"), t = el("table", "mk-table pra-table");
    t.style.minWidth = opts && opts.narrow ? "30rem" : "38rem";
    var tr = el("tr"); head.forEach(function (h) { tr.appendChild(el("th", null, h)); }); var th = el("thead"); th.appendChild(tr); t.appendChild(th);
    var tb = el("tbody");
    rows.forEach(function (r) {
      var row = el("tr", r.cls || null);
      r.cells.forEach(function (c) { row.appendChild(el("td", c && c.cls ? c.cls : null, c && c.t != null ? c.t : c)); });
      tb.appendChild(row);
    });
    t.appendChild(tb); w.appendChild(t); return w;
  }
  function check(parent, label, onChange) {
    var lab = el("label", "mb-ctl"), inp = document.createElement("input"); inp.type = "checkbox";
    inp.setAttribute("aria-label", label);
    inp.addEventListener("change", function () { onChange(inp.checked); });
    lab.appendChild(inp); lab.appendChild(document.createTextNode(label)); parent.appendChild(lab); return inp;
  }
  function select(parent, label, options, value, onChange) {
    var lab = el("label", "mb-ctl"); lab.appendChild(document.createTextNode(label + " "));
    var s = document.createElement("select"); s.setAttribute("aria-label", label);
    options.forEach(function (o) { var op = document.createElement("option"); op.value = o[0]; op.textContent = o[1]; s.appendChild(op); });
    s.value = value; s.addEventListener("change", function () { onChange(s.value); });
    lab.appendChild(s); parent.appendChild(lab); return s;
  }
  function metric(box, value, label) {
    var m = el("div", "mb-metric"); m.appendChild(el("span", "mb-mvalue", value)); m.appendChild(el("span", "mb-mlabel", label)); box.appendChild(m);
  }
  function lines(parent, arr) { var u = el("ul", "mb-hint pra-lines"); arr.forEach(function (t) { u.appendChild(el("li", null, t)); }); parent.appendChild(u); }
  function shell(root, title, intro) {
    var w = el("div", "mb-wrap"); w.appendChild(el("h4", null, title)); if (intro) w.appendChild(el("p", "mb-intro", intro)); root.appendChild(w); return w;
  }

  /* ---------- a1: the pocket price waterfall ---------- */
  function buildWaterfall(root) {
    var W = E.waterfall(S), st = { invoiceOnly: false };
    var wrap = shell(root, "From list price to pocket price, 40 Kettle wholesale accounts",
      "Every bag starts at the list price. Some discounts print on the invoice; the rest leave later, as rebates, payment terms, marketing money and freight.");
    kind(wrap, false, KETTLE + "240 orders of the 1 kg catering bag, list 9,600 yen.");
    var ctl = el("div", "mb-ctls"); wrap.appendChild(ctl);
    check(ctl, "Judge accounts by invoice price only (anti-lever)", function (v) { st.invoiceOnly = v; render(); });
    var verdict = el("div", "mb-verdict is-ok"); wrap.appendChild(verdict);
    var body = el("div"); wrap.appendChild(body);
    function step(label, v, from, cls) {
      var r = el("div", "pra-step" + (cls ? " " + cls : "")); r.appendChild(el("span", null, label));
      var tr = el("span", "pra-track"), i = el("i"), max = W.list;
      i.style.left = (100 * from / max).toFixed(2) + "%"; i.style.width = (100 * Math.abs(v) / max).toFixed(2) + "%";
      tr.appendChild(i); r.appendChild(tr); r.appendChild(el("b", null, (cls ? "" : "-") + grp(rd(Math.abs(v), 1)))); return r;
    }
    function render() {
      body.innerHTML = "";
      var P = W.per, box = el("div", "pra-steps"), at = W.list;
      box.appendChild(step("List price", W.list, 0, "is-total"));
      [["Volume discount (on invoice)", P.onv], ["Promotional allowance (on invoice)", P.promo]].forEach(function (s) { at -= s[1]; box.appendChild(step(s[0], s[1], at)); });
      box.appendChild(step("Invoice price", W.invoice, 0, "is-total"));
      if (!st.invoiceOnly) {
        [["Volume rebate (off invoice)", P.rebate], ["Early-payment discount (off invoice)", P.terms], ["Co-op marketing (off invoice)", P.coop], ["Freight absorbed (off invoice)", P.freight]].forEach(function (s) { at -= s[1]; box.appendChild(step(s[0], s[1], at)); });
        box.appendChild(step("Pocket price", W.pocket, 0, "is-pocket"));
      }
      body.appendChild(box);
      var mt = el("div", "mb-metrics"); body.appendChild(mt);
      if (st.invoiceOnly) {
        verdict.className = "mb-verdict is-bad";
        verdict.textContent = "Invoice view: price realisation " + pc(W.invoice / W.list) + ". The " + yen(W.offInvoice) + " a bag that leaves after the invoice is invisible here.";
        metric(mt, yen(W.invoice), "average invoice price per bag");
        metric(mt, yen(W.invBand.lo) + " to " + grp(rd(W.invBand.hi, 1)), "invoice band across 40 accounts");
      } else {
        verdict.className = "mb-verdict is-good";
        verdict.textContent = "Pocket price " + yen(W.pocket) + " a bag: " + pc(W.realisation) + " of list. Off-invoice leakage " + yen(W.offInvoice) + ", on-invoice " + yen(W.onInvoice) + ".";
        metric(mt, yen(W.pocket), "average pocket price per bag");
        metric(mt, yen(W.band.lo) + " to " + grp(rd(W.band.hi, 1)), "pocket band across 40 accounts");
        metric(mt, yen(W.top5), "5 largest accounts, average pocket");
        metric(mt, yen(W.bottom5), "5 smallest accounts, average pocket");
      }
      lines(body, ["Pocket band " + yen(W.band.lo) + " to " + yen(W.band.hi) + " (" + yen(W.band.hi - W.band.lo) + " wide); invoice band " + yen(W.invBand.lo) + " to " + yen(W.invBand.hi) + " (" + yen(W.invBand.hi - W.invBand.lo) + " wide).",
        "Unit-weighted over " + grp(W.units) + " bags in " + W.rows + " orders."]);
    }
    render();
  }

  /* ---------- a2: willingness to pay ---------- */
  function buildWtp(root) {
    var st = { defn: "original", cost: 640 };
    var wrap = shell(root, "Willingness to pay for the 100 g tin, two survey methods",
      "Van Westendorp asks four price questions; Gabor-Granger asks yes or no at set prices. Both run on the same 200 constructed respondents.");
    kind(wrap, false, KETTLE + "200 survey answers, prices in yen. Stated answers, not purchases.");
    var ctl = el("div", "mb-ctls"); wrap.appendChild(ctl);
    select(ctl, "Van Westendorp definition", [["original", "Original: too cheap x not cheap"], ["narrow", "Narrower: too cheap x expensive"]], "original", function (v) { st.defn = v; render(); });
    select(ctl, "Unit cost (constructed)", [["640", "640 yen"], ["400", "400 yen"], ["900", "900 yen"]], "640", function (v) { st.cost = +v; render(); });
    var verdict = el("div", "mb-verdict is-ok"); wrap.appendChild(verdict);
    var body = el("div"); wrap.appendChild(body);
    function render() {
      body.innerHTML = "";
      var V = E.wtp(S, st.defn), G = E.gabor(S, st.cost);
      verdict.textContent = "Acceptable range " + yen(V.pmc) + " to " + yen(V.pme) + " (" + (st.defn === "narrow" ? "narrower" : "original") + " definition); optimal price point " + yen(V.opp) + ".";
      body.appendChild(table(["Van Westendorp point", "Curves that cross", "Price"], [
        { cells: ["Point of marginal cheapness", st.defn === "narrow" ? "too cheap x expensive" : "too cheap x not cheap", yen(V.pmc)] },
        { cells: ["Optimal price point", "too cheap x too expensive", yen(V.opp)] },
        { cells: ["Indifference price point", "cheap x expensive", yen(V.ipp)] },
        { cells: ["Point of marginal expensiveness", st.defn === "narrow" ? "too expensive x cheap" : "too expensive x not expensive", yen(V.pme)] }], { narrow: true }));
      body.appendChild(table(["Price", "Would buy", "Share", "Revenue per 200 asked", "Contribution per 200 asked"], G.rows.map(function (r) {
        return { cls: r.price === G.contribMax ? "is-total" : null, cells: [yen(r.price), String(r.buyers), pc(r.share), yen(r.revenue), yen(r.contribution)] };
      })));
      lines(body, ["Gabor-Granger: revenue peaks at " + yen(G.revMax) + "; contribution at a unit cost of " + yen(G.cost) + " peaks at " + yen(G.contribMax) + ".",
        "Stated willingness to pay runs above what people pay at the till: treat both methods as a range finder, not a price."]);
    }
    render();
  }

  /* ---------- a3: a decision across a handed elasticity range ---------- */
  var RANGES = { kettle: [-1.2, -2.4, "Handed range -1.2 to -2.4 (constructed)"], narrow: [-1.2, -1.5, "Narrower range -1.2 to -1.5 (constructed)"],
    olist: [-1.554, -2.154, "Olist two-way estimate -1.854, plus or minus two standard errors"] };
  function buildRange(root) {
    var st = { r: "kettle" };
    var wrap = shell(root, "Which price move survives the whole range?",
      "The elasticity arrives from the estimation team as a range. Price, cost and volume below are Kettle's 100 g tin.");
    kind(wrap, false, KETTLE + "Price 1,800 yen, unit cost 720 yen, 10,000 tins a month. Constant-elasticity demand: units x (1 + move) ^ elasticity.");
    var ctl = el("div", "mb-ctls"); wrap.appendChild(ctl);
    select(ctl, "Elasticity range", Object.keys(RANGES).map(function (k) { return [k, RANGES[k][2]]; }), "kettle", function (v) { st.r = v; render(); });
    var verdict = el("div", "mb-verdict is-ok"); wrap.appendChild(verdict);
    var body = el("div"); wrap.appendChild(body);
    function render() {
      body.innerHTML = "";
      var R = E.rangeCalc({ price: 1800, units: 10000, cost: 720, eLo: RANGES[st.r][0], eHi: RANGES[st.r][1] });
      var safe = R.moves.filter(function (m) { return m.verdict === "wins across the range"; });
      verdict.className = "mb-verdict " + (safe.length ? "is-good" : "is-bad");
      verdict.textContent = safe.length ? "Survives the whole range: " + safe.map(function (m) { return sgn(rd(m.move * 100, 1), String) + "% price"; }).join(", ") + "."
        : "No price move wins across the whole range: every move depends on the point estimate.";
      body.appendChild(table(["Price move", "Break-even elasticity", "Profit change at " + R.es[0], "at " + rd(R.es[1], 1000), "at " + R.es[2], "Verdict"], R.moves.map(function (m) {
        return { cells: [sgn(rd(m.move * 100, 1), String) + "%", rd(m.breakEven, 100).toFixed(2)].concat(m.at.map(function (a) { return sgn(rd(a.profit, 1), grp) + " yen"; })).concat([m.verdict]) };
      })));
      lines(body, ["Contribution margin " + pc(R.margin) + "; monthly contribution before any move " + yen(R.base) + ".",
        "A price rise pays while demand is less elastic than its break-even; a cut pays only when demand is more elastic than its break-even."]);
    }
    render();
  }

  /* ---------- a4: baseline, lift and the month after ---------- */
  function buildPromo(root) {
    var st = { thr: 0.03 };
    var wrap = shell(root, "Black Friday 2017: who cut prices, and what happened next",
      "Products sold in October, November and December 2017, split by their November price move against October.");
    kind(wrap, true, REAL + "Monthly grain: Black Friday (24 November) is one day inside the November row.");
    var ctl = el("div", "mb-ctls"); wrap.appendChild(ctl);
    select(ctl, "Counts as a cut", [["0.01", "price down more than 1%"], ["0.03", "price down more than 3%"], ["0.05", "price down more than 5%"], ["0.1", "price down more than 10%"]], "0.03", function (v) { st.thr = +v; render(); });
    var verdict = el("div", "mb-verdict is-ok"); wrap.appendChild(verdict);
    var body = el("div"); wrap.appendChild(body);
    function render() {
      body.innerHTML = "";
      var R = E.series(S, { thr: st.thr }), L = E.ladder(S, { thr: st.thr });
      verdict.textContent = "Cut group " + pp(L.rung3.liftCut) + "% in November, held group " + pp(L.rung3.liftHeld) + "%: the comparison leaves " + un(L.rung3.incr) + " of " + grp(L.rung2.incr) + " extra units.";
      body.appendChild(table(["Month"].concat(R.months), [
        { cells: ["Cut (" + R.nCut + " products)"].concat(R.cut.map(String)) },
        { cells: ["Held (" + R.nHeld + " products)"].concat(R.held.map(String)) },
        { cls: "is-total", cells: ["Whole panel"].concat(R.panel.map(String)) }]));
      lines(body, ["Rung 1, whole panel: November units " + pp(L.rung1.lift) + "% on October.",
        "Rung 2, cut group alone: " + grp(L.rung2.incr) + " extra units (" + pp(L.rung2.lift) + "%).",
        "Rung 3, cut minus held: " + un(L.rung3.incr) + " extra units; the gap is " + pp(L.rung3.diff) + " percentage points.",
        "Rung 4, December against the held group: " + sgn(rd(L.rung4.decGap, 10), un) + " units, so " + un(L.rung4.incr) + " extra units over two months.",
        "Sellers chose which products to cut. This is a comparison group, not a randomised test."]);
    }
    render();
  }

  /* ---------- a5: price-volume-mix ---------- */
  function buildPvm(root) {
    var V = E.pvm(S);
    var wrap = shell(root, "October to November 2017, revenue split into price, volume and mix",
      "Products sold in both months. Price is what the same units cost more or less; volume is more units at October's average price; mix is which products those units were.");
    kind(wrap, true, REAL + "Revenue = mean item price x items, in BRL, freight excluded.");
    var verdict = el("div", "mb-verdict is-ok"); wrap.appendChild(verdict);
    verdict.textContent = "Revenue " + brl(V.R0) + " to " + brl(V.R1) + ": price " + sgn(V.price, brl) + ", volume " + sgn(V.volume, brl) + ", mix " + sgn(V.mix, brl) + ".";
    wrap.appendChild(table(["Bridge step", "BRL", "What it isolates"], [
      { cells: ["October revenue, " + V.products + " products", brl(V.R0), grp(V.Q0) + " items"] },
      { cells: ["Price effect", sgn(V.price, brl), "November units at November minus October prices"] },
      { cells: ["Volume effect", sgn(V.volume, brl), "extra items at October's average price"] },
      { cells: ["Mix effect", sgn(V.mix, brl), "the items shifted toward cheaper or dearer products"] },
      { cls: "is-total", cells: ["November revenue, same products", brl(V.R1), grp(V.Q1) + " items"] },
      { cells: ["Products sold in only one of the months", sgn(V.newLost, brl), "new and lost, outside the bridge"] }]));
    lines(wrap, ["Whole panel: " + brl(V.all0) + " in October, " + brl(V.all1) + " in November.",
      "Order matters: price is valued at November units, volume at October's average price. Another order gives other splits with the same total."]);
  }

  /* ---------- a6: the promo and discount lab ---------- */
  var RUNGS = [
    { id: 1, name: "Rung 1 · whole panel lift", note: "November against October, every product: credits the season to the discount." },
    { id: 2, name: "Rung 2 · cut group alone", note: "Only the products whose price fell, against their own October." },
    { id: 3, name: "Rung 3 · minus the held group", note: "Subtract what products that held price did in the same month." },
    { id: 4, name: "Rung 4 · net of the month after", note: "Add December against the held group: pull-forward shows as a dip." },
    { id: 5, name: "Rung 5 · did it pay?", note: "Margin at an assumed cost ratio: break-even volume vs measured volume." },
    { id: 6, name: "Count the Black Friday crowd as discount lift", note: "No comparison group: October is the baseline for both months.", anti: true }];
  var CATS = [["all", "All products"], ["home", "Home and garden (grouped)"], ["other", "Everything else (grouped)"]];
  ["bed_bath_table", "garden_tools", "watches_gifts", "health_beauty"].forEach(function (c) { CATS.push(["cat:" + c, c + " only"]); });

  function buildBench(root) {
    var st = { rung: 5, thr: 0.03, cost: 0.6, filter: "all", placebo: false };
    var wrap = shell(root, "The promo and discount lab",
      "Black Friday 2017 on real rows. Climb the rungs, move the controls, then try to break it.");
    both(wrap, REAL + "The cost ratio is assumed: Olist publishes no costs. Sellers chose which products to cut, so this is a comparison group, never a randomised test. Monthly grain: Black Friday is one day inside the November row.");
    var pre = el("div", "mb-presets"); wrap.appendChild(pre);
    var buttons = RUNGS.map(function (r) {
      var b = el("label", "mb-preset" + (r.anti ? " is-anti" : "")), inp = document.createElement("input");
      inp.type = "radio"; inp.name = "pra-rung"; inp.checked = r.id === st.rung; b.appendChild(inp);
      var name = el("span", "mb-pname", r.name); b.appendChild(name); if (r.anti) name.appendChild(el("em", "mb-anti", " · anti-lever"));
      b.appendChild(el("span", "mb-pnote", r.note));
      inp.addEventListener("change", function () { if (inp.checked) { st.rung = r.id; render(); } });
      pre.appendChild(b); return { label: b, input: inp };
    });
    var ctl = el("div", "mb-ctls"); wrap.appendChild(ctl);
    var thrSel = select(ctl, "Counts as a cut", [["0.01", "down > 1%"], ["0.03", "down > 3%"], ["0.05", "down > 5%"], ["0.1", "down > 10%"]], "0.03", function (v) { st.thr = +v; render(); });
    var catSel = select(ctl, "Scope", CATS.map(function (c) { return [c[0].indexOf("cat:") === 0 ? "cat:" + S.olist.cats.indexOf(c[0].slice(4)) : c[0], c[1]]; }), "all", function (v) { st.filter = v; render(); });
    var rl = el("label", "mb-ctl mb-range"); rl.appendChild(document.createTextNode("Assumed cost ratio"));
    var rng = document.createElement("input"); rng.type = "range"; rng.min = "30"; rng.max = "80"; rng.step = "5"; rng.value = "60"; rng.setAttribute("aria-label", "Assumed cost ratio");
    var rv = el("b", null, "60%"); rl.appendChild(rng); rl.appendChild(rv); ctl.appendChild(rl);
    rng.addEventListener("input", function () { st.cost = +rng.value / 100; rv.textContent = rng.value + "%"; render(); });
    var brk = el("button", "mb-break", "Break it: shuffle which products were cut"); brk.type = "button";
    brk.addEventListener("click", function () { st.placebo = !st.placebo; brk.setAttribute("aria-pressed", String(st.placebo)); brk.textContent = st.placebo ? "Hide the shuffle" : "Break it: shuffle which products were cut"; render(); });
    ctl.appendChild(brk);
    var verdict = el("div", "mb-verdict is-ok"); wrap.appendChild(verdict);
    var mt = el("div", "mb-metrics"); wrap.appendChild(mt);
    var body = el("div"); wrap.appendChild(body);

    function render() {
      buttons.forEach(function (b, k) { b.label.classList.toggle("is-on", k === st.rung - 1); b.input.checked = k === st.rung - 1; });
      mt.innerHTML = ""; body.innerHTML = "";
      var L = E.ladder(S, { thr: st.thr, cost: st.cost, filter: st.filter });
      var nline = "n: " + L.n.three + " products sold in all three months; " + L.n.cut + " cut, " + L.n.held + " held, " + L.n.raised + " raised. Floor: " + L.floor + " cut and " + L.floor + " held.";
      if (!L.ok) {
        verdict.className = "mb-verdict is-bad";
        verdict.textContent = "Refused: " + L.n.cut + " cut and " + L.n.held + " held products is under the floor of " + L.floor + " each. Widen the scope.";
        lines(body, [nline]); return;
      }
      var r = st.rung, line;
      if (r === 1) {
        verdict.className = "mb-verdict is-bad";
        line = "Rung 1: November units " + pp(L.rung1.lift) + "% on October across the panel (" + grp(L.panel[0]) + " to " + grp(L.panel[1]) + "). Every product rode the season.";
        metric(mt, pp(L.rung1.lift) + "%", "whole-panel November lift");
        metric(mt, grp(L.rung1.incr), "extra units, all credited to discounts");
      } else if (r === 2) {
        verdict.className = "mb-verdict is-bad";
        line = "Rung 2: the cut group rose " + pp(L.rung2.lift) + "% (" + grp(L.cutU[0]) + " to " + grp(L.cutU[1]) + " units): " + grp(L.rung2.incr) + " extra units, but held products rose too.";
        metric(mt, pp(L.rung2.lift) + "%", "cut group November lift");
        metric(mt, grp(L.rung2.incr), "extra units, no comparison");
      } else if (r === 3) {
        verdict.className = "mb-verdict is-ok";
        line = "Rung 3: cut " + pp(L.rung3.liftCut) + "% minus held " + pp(L.rung3.liftHeld) + "% leaves " + pp(L.rung3.diff) + " points: " + un(L.rung3.incr) + " extra units in November.";
        metric(mt, pp(L.rung3.diff) + " pts", "cut lift minus held lift");
        metric(mt, un(L.rung3.incr), "extra November units vs comparison");
        metric(mt, un(L.rung3.expN), "cut-group units expected without the cut");
      } else if (r === 4) {
        verdict.className = "mb-verdict is-ok";
        line = "Rung 4: December " + sgn(rd(L.rung4.decGap, 10), un) + " units against the held group, so " + un(L.rung4.incr) + " extra units over November and December.";
        metric(mt, sgn(rd(L.rung4.decGap, 10), un), "December gap (a dip would be negative)");
        metric(mt, un(L.rung4.incr), "extra units, two months, net");
      } else {
        var anti = r === 6, R5 = L.rung5, C = L.crowd;
        var vr = anti ? C.volRise : R5.volRise, paid = anti ? C.paid : R5.paid, delta = anti ? C.p.delta : R5.p.delta;
        verdict.className = "mb-verdict " + (anti ? "is-bad" : paid ? "is-good" : "is-bad");
        var be = R5.breakEven == null ? "no volume rise is enough" : pc(R5.breakEven);
        line = (anti ? "Anti-lever: " : "Rung 5: ") + "discount depth " + pc(R5.depth) + " at an assumed " + pc(st.cost) + " cost ratio needs " + be + " more volume; measured " + pc(vr) + ". " + (paid ? "It paid: " : "It did not pay: ") + sgn(delta, brl) + ".";
        metric(mt, pc(R5.depth), "average discount depth, Nov and Dec");
        metric(mt, be, "volume rise needed to break even");
        metric(mt, pc(vr), anti ? "volume rise if the crowd counts" : "measured volume rise vs comparison");
        metric(mt, sgn(delta, brl), "profit vs no discount, two months");
        if (anti) lines(body, ["Counting the crowd credits " + grp(C.incr) + " extra units where the comparison group allows " + un(L.rung4.incr) + ": overstated by " + un(C.overstated) + " units, " + rd(C.ratio, 100).toFixed(2) + " times the honest figure."]);
      }
      verdict.textContent = line;
      var extra = [nline];
      if (r >= 3) extra.push("Rung 3 needs parallel trends: without the cut, cut products would have moved like held ones. Sellers chose what to cut, so that is an assumption, not a fact.");
      if (r >= 5) extra.push("Break-even rule: volume rise needed = d / (m - d), with discount depth d and contribution margin m = 1 - cost ratio. Volume is valued at October prices.");
      lines(body, extra);
      if (st.placebo) {
        var P = E.placebo(S, { thr: st.thr, filter: st.filter }, 200);
        var box = el("div"); body.appendChild(box);
        box.appendChild(el("p", "mb-hint", "Break it: 200 seeded shuffles of which products count as cut (same group sizes). Each grey dot is one shuffle's cut-minus-held gap; the bar is the real gap."));
        var lo = Math.min(P.min, P.real), hi = Math.max(P.max, P.real), span = hi - lo || 1, strip = el("div", "pra-strip");
        strip.setAttribute("role", "img"); strip.setAttribute("aria-label", "Placebo gaps from " + pp(P.min) + " to " + pp(P.max) + " points; real gap " + pp(P.real));
        var x = function (v) { return (3 + 94 * (v - lo) / span).toFixed(2) + "%"; };
        var R2 = E.mulberry32(7); /* vertical jitter only, no effect on any number */
        P.vals.forEach(function (v) { var d = el("i"); d.style.left = x(v); d.style.top = (6 + Math.floor(R2() * 30)) + "px"; strip.appendChild(d); });
        var z = el("em"); z.style.left = x(0); strip.appendChild(z);
        var u = el("u"); u.style.left = x(P.real); strip.appendChild(u);
        box.appendChild(strip);
        var lab = el("div", "pra-strip-lab"); lab.appendChild(el("span", null, pp(lo) + " pts")); lab.appendChild(el("span", null, "dashed line = 0")); lab.appendChild(el("span", null, pp(hi) + " pts")); box.appendChild(lab);
        lines(box, ["Real gap " + pp(P.real) + " points sits above " + P.below + " of 200 shuffles; " + P.above + " shuffles reach it. Middle 90% of shuffles: " + pp(P.p5) + " to " + pp(P.p95) + " points.",
          "Moving the threshold until the shuffle test passes is its own bias: pick the threshold before you look.",
          P.above >= 10 ? "At this n the gap is inside the shuffle spread: the cut-group advantage is not separable from which products happened to be cut." : "Fewer than 10 of 200 shuffles reach the real gap: the split is doing more than chance would."]);
      }
    }
    window.PRA_BENCH = {
      setRung: function (k) { st.rung = k; render(); }, set: function (o) { for (var k in o) st[k] = o[k]; thrSel.value = String(st.thr); catSel.value = st.filter; rng.value = String(Math.round(st.cost * 100)); rv.textContent = rng.value + "%"; render(); },
      state: st, text: function () { return wrap.innerText; }
    };
    render();
  }

  function boot() {
    S = window.PRA_SAMPLE; E = window.PRA;
    if (!S || !E) return;
    var t = E.selfTest(S);
    if (!t.ok && window.console) console.warn("pra self-test failed", t.fails);
    var B = { waterfall: buildWaterfall, wtp: buildWtp, range: buildRange, promo: buildPromo, pvm: buildPvm, bench: buildBench };
    Array.prototype.forEach.call(document.querySelectorAll(".pra-widget"), function (n) {
      var f = B[n.getAttribute("data-mode")]; if (f) f(n);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
}());
