#!/usr/bin/env python3
"""Build assets/pra-sample.js for learn-pricing-analytics-with-phoebe.

Internal build script. Never linked from an audience page.

Usage:  python3 materials/build-pra-sample.py

ONE source of truth for the real rows, no re-download:
  REAL rows are DERIVED from learn-economics-with-phoebe/assets/econ-sample.js, the Olist
  product x month panel built by learn-economics-with-phoebe/materials/build-olist-elasticity.py
  (Brazilian E-Commerce Public Dataset by Olist, Kaggle, CC BY-NC-SA 4.0; delivered orders
  before 2018-09-01; 203 products with >= 30 delivered items, >= 6 months, >= 3 prices).
  This script keeps the months 2017-07 to 2018-01 (Black Friday 2017 was 24 November) and every
  product with a row in that window. Derived numbers only; no Olist text ships.

CONSTRUCTED (seeded, labelled "constructed" on every widget), the Kettle & Co examples:
  wholesale   40 accounts x 6 orders of the 1 kg catering bag, list 9,600 yen; on-invoice and
              off-invoice discounts per bag (a1 waterfall, b3 band)
  survey      200 Van Westendorp answers for the 100 g tin, rounded to 50 yen (a2)
  gabor       the same 200 respondents' highest "yes, I would buy" price, rounded to 10 yen (a2)
Serialised with json.dumps, never string interpolation.
"""
import json
import os
import subprocess

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
ECON = os.path.join(os.path.dirname(REPO), "learn-economics-with-phoebe", "assets", "econ-sample.js")
OUT = os.path.join(REPO, "assets", "pra-sample.js")
SEED = 20171124
WINDOW = ["2017-07", "2017-08", "2017-09", "2017-10", "2017-11", "2017-12", "2018-01"]
HOME = ["bed_bath_table", "furniture_decor", "garden_tools", "housewares", "home_confort",
        "home_appliances", "office_furniture", "construction_tools_lights"]


def read_econ():
    js = "global.window={};require(%s);process.stdout.write(JSON.stringify(window.ECON_PANEL))" % json.dumps(ECON)
    return json.loads(subprocess.check_output(["node", "-e", js]))


def olist():
    P = read_econ()
    keep = {P["months"].index(m): i for i, m in enumerate(WINDOW)}
    rows = [(p, keep[m], u, pc) for p, m, u, pc in zip(P["p"], P["m"], P["units"], P["pc"]) if m in keep]
    prods = sorted({r[0] for r in rows})
    pid = {p: i for i, p in enumerate(prods)}
    rows.sort(key=lambda r: (pid[r[0]], r[1]))
    cats = P["cats"]
    return {
        "months": WINDOW,
        "cats": cats,
        "home": [cats.index(c) for c in HOME if c in cats],
        "prodCat": [P["prodCat"][p] for p in prods],
        "p": [pid[r[0]] for r in rows],
        "m": [r[1] for r in rows],
        "units": [r[2] for r in rows],
        "pc": [r[3] for r in rows],
    }


def wholesale(rng):
    types = ["cafe", "grocer", "hotel"]
    acct_type, rows = [], {k: [] for k in ["a", "units", "onv", "promo", "rebate", "terms", "coop", "freight"]}
    for a in range(40):
        t = 0 if a < 16 else 1 if a < 30 else 2
        acct_type.append(t)
        size = float(np.exp(rng.normal(2.6, 0.7)))           # bags per order, median ~13
        rebate_rate = [0.0, 0.02, 0.04][int(rng.integers(0, 3))]
        coop = int(rng.choice([0, 0, 0, 200, 450, 900]))      # yen per bag, marketing support
        freight = int(round(float(rng.uniform(150, 1300)) / 10) * 10)  # absorbed delivery per bag
        terms = 0.02 if rng.random() < 0.5 else 0.0
        for _ in range(6):
            u = max(1, int(round(size * float(rng.uniform(0.6, 1.4)))))
            tier = 0.0 if u < 10 else 0.05 if u < 25 else 0.10
            promo = 0.03 if rng.random() < 0.25 else 0.0
            rows["a"].append(a)
            rows["units"].append(u)
            rows["onv"].append(int(round(9600 * tier)))
            rows["promo"].append(int(round(9600 * promo)))
            inv = 9600 - int(round(9600 * tier)) - int(round(9600 * promo))
            rows["rebate"].append(int(round(inv * rebate_rate)))
            rows["terms"].append(int(round(inv * terms)))
            rows["coop"].append(coop)
            rows["freight"].append(freight)
    return {"list": 9600, "types": types, "acctType": acct_type, "rows": rows}


def survey(rng):
    n = 200
    fair = np.exp(rng.normal(np.log(1600), 0.25, n))
    r50 = lambda x: [int(round(v / 50.0) * 50) for v in x]
    tc = r50(fair * rng.uniform(0.45, 0.65, n))
    ch = r50(fair * rng.uniform(0.75, 0.90, n))
    ex = r50(fair * rng.uniform(1.15, 1.35, n))
    te = r50(fair * rng.uniform(1.50, 1.90, n))
    for i in range(n):  # keep each respondent's four answers strictly ordered
        ch[i] = max(ch[i], tc[i] + 50); ex[i] = max(ex[i], ch[i] + 50); te[i] = max(te[i], ex[i] + 50)
    wtp = [int(round(v / 10.0) * 10) for v in fair * rng.uniform(1.00, 1.45, n)]
    return {"tooCheap": tc, "cheap": ch, "expensive": ex, "tooExpensive": te,
            "ggPrices": [1200, 1400, 1600, 1800, 2000, 2200], "wtp": wtp, "unitCost": 640}


def main():
    rng = np.random.default_rng(SEED)
    data = {
        "meta": {"seed": SEED, "source": "Olist via learn-economics-with-phoebe/assets/econ-sample.js (CC BY-NC-SA 4.0)",
                 "blackFriday": "2017-11-24"},
        "olist": olist(),
        "wholesale": wholesale(rng),
        "survey": survey(rng),
    }
    head = ("/* pra-sample.js - data for the pricing widgets (learn-pricing-analytics-with-phoebe).\n"
            " * REAL: data.olist, product x month rows 2017-07 to 2018-01 derived from the Olist panel in\n"
            " *   learn-economics-with-phoebe/assets/econ-sample.js (builder: learn-economics-with-phoebe/\n"
            " *   materials/build-olist-elasticity.py). Brazilian E-Commerce Public Dataset by Olist, Kaggle,\n"
            " *   CC BY-NC-SA 4.0. units = items sold that month; pc = mean item price that month in centavos.\n"
            " * CONSTRUCTED (seeded %d): data.wholesale and data.survey, the Kettle & Co examples.\n"
            " * Generated by materials/build-pra-sample.py with json.dumps. Do not edit by hand. */\n" % SEED)
    with open(OUT, "w") as f:
        f.write(head + "window.PRA_SAMPLE = " + json.dumps(data, separators=(",", ":")) + ";\n")
    print("wrote", OUT, os.path.getsize(OUT), "bytes;", len(data["olist"]["p"]), "olist rows,",
          len(data["olist"]["prodCat"]), "products")


if __name__ == "__main__":
    main()
