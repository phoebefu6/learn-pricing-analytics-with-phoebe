#!/usr/bin/env python3
"""Writes index.html (landing page) with the knowledge map data serialised by json.dumps.
Internal build script; never linked from an audience page."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
B = [("b1-price-is-the-biggest-lever", "Price is the\nbiggest lever", "#34D399", ["Price lands whole", "1% = 1 / margin", "Discount break-even"]),
     ("b2-value-cost-or-competitor", "Value, cost\nor competitor", "#34D399", ["Three anchors", "Economic value", "Cost-plus gap"]),
     ("b3-where-the-money-leaks", "Where the\nmoney leaks", "#FBBF24", ["Pocket price waterfall", "The price band", "Who owns each leak"]),
     ("b4-reading-a-pricing-recommendation", "Reading a pricing\nrecommendation", "#FB923C", ["Challenge checklist", "Regulators, dated", "Help or harm"])]
A = [("a1-the-pricing-data-model", "The pricing\ndata model", "#34D399", ["The order-line row", "Unit-weighted waterfall", "Realisation and band"]),
     ("a2-measuring-willingness-to-pay", "Measuring\nwillingness to pay", "#34D399", ["Van Westendorp", "Two definitions", "Gabor-Granger"]),
     ("a3-deciding-with-a-borrowed-elasticity", "Deciding with a\nborrowed elasticity", "#FBBF24", ["Elasticity as input", "Break-even elasticity", "Survive the range"]),
     ("a4-promo-lift-and-the-dip-after", "Promo lift and\nthe dip after", "#FBBF24", ["Baseline and lift", "Pull-forward", "Comparison group"]),
     ("a5-tiers-bundles-and-price-fences", "Tiers, bundles\nand price fences", "#FB923C", ["Good-better-best", "Price fences", "Price-volume-mix"]),
     ("a6-the-promo-and-discount-lab", "The promo and\ndiscount lab", "#F87171", ["Five rungs", "Counting the crowd", "Shuffle to break it"])]
MM = {"title": "Pricing\nanalytics", "centerColor": "#7C1428",
      "sessions": [{"label": s[1], "href": "courses/%s.html" % s[0], "color": s[2],
                    "concepts": [{"label": c, "href": "courses/%s.html" % s[0]} for c in s[3]]} for s in B + A]}
tpl = open(os.path.join(HERE, "index.template.html")).read()
out = tpl.replace("/*MINDMAP*/", "window.MINDMAP_DATA = " + json.dumps(MM, indent=2) + ";")
open(os.path.join(HERE, "..", "index.html"), "w").write(out)
print("index.html written")
