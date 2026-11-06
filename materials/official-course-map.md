# Official course map - learn-pricing-analytics-with-phoebe ("Pricing Analytics")

Internal build document, written 2026-11-06 before any page. Never linked from an audience page.
Two tracks, 10 sessions x 45 min: Business b1-b4 (no code) + Analyst a1-a6 (hands-on); a6 is the
bench. Bucket data, audience both (commercial leads who set prices, analysts who model them).
Running case: Kettle & Co, a constructed DTC tea brand in Japan, prices in yen (the same case as
learn-marketing-analytics, learn-market-sizing and learn-sales-pipeline-analytics; its office-tea
B2B arm lives in Sales Pipeline). Every Kettle number is invented and labelled "Constructed Kettle
&amp; Co example". Never Phoebe's own employer, clients or projects.

The elasticity is an INPUT here, never refitted: learn-economics-with-phoebe owns the estimation.

## Evidence tiers

| Tier | Meaning |
|---|---|
| **read-at-source** | The words were read on the page or document named (2026-11-06) |
| **reported** | Only seen described elsewhere; pages must say "reported" |
| **computed** | Recomputed in this build from real rows by `assets/pra-live.js`; `materials/pra_reference.py` agrees by value (654 values, `materials/compare-ladder.py` exit 0; the planted 0.1% fault exits 1 with 86 differences) |
| **constructed** | Invented Kettle & Co numbers (seeded 20171124 where a widget computes them); always labelled |

## Verified facts

### F1. Marn & Rosiello 1992 (read-at-source, full text via a hosted reproduction; hbr.org shows an excerpt)

Michael V. Marn and Robert L. Rosiello, "Managing Price, Gaining Profit", Harvard Business Review
70(5), September-October 1992, pp. 84-94. https://hbr.org/1992/09/managing-price-gaining-profit
(full text read in a reproduction carrying the HBR copyright line, hosted on a UNC Charlotte course page).

- Exhibit 1 "Comparison of Profits Levers": a 1% improvement in price gives 11.1% more operating
  profit; variable cost 7.8%; volume 3.3%; fixed cost 2.3%. Base: "average economics of 2,463
  companies in Compustat aggregate".
- The text states the condition: a 1% price improvement, "assuming no loss of volume", increases
  operating profit by 11.1%. A 1% volume improvement gives 3.3%.
- The waterfall: revenue cascading from list price to invoice price to pocket price "is called the
  pocket price waterfall". Pocket price, not invoice price, is the right measure.
- Off-invoice items named: prompt-payment discounts, volume bonuses, cooperative advertising,
  freight. The case also shows an on-invoice exception discount.
- Pocket price band: the range over which one item sells. Flooring example: a 35% difference
  between highest and lowest priced transactions; bands up to 60% (lighting), 70% (computer
  peripherals), 200% (specialty chemicals), 500% (a fastener supplier). Invoice-to-pocket drop in the
  flooring example: 22.7%.
- Castle Battery case: return on sales around 7%; a 1% price rise with no volume loss would raise
  operating profit by 14%.
- The margin is NOT printed. Derived (label it "our arithmetic"): 1 / 11.1% implies an operating
  margin of about 9% of revenue.

### F1b. Marn, Roegner & Zawada 2003 (read-at-source via a hosted copy of the Quarterly pages)

"The power of pricing", The McKinsey Quarterly, 2003 Number 1.
- A 1% price rise, "if volumes remained stable", gives an 8% increase in operating profit for the
  average S&P 1500 income statement (operating profit 12.5% of revenue, variable costs 68.3%, fixed
  costs 19.2%; Compustat, McKinsey analysis).
- Volumes would have to rise by 18.7% just to offset a 5% price cut. (Check: 0.05 / (0.317 - 0.05)
  = 18.7% at a 31.7% contribution margin, our arithmetic.)

**The teaching point (Disagreement A):** "1% price = about 11% profit" is an identity, not a law:
with volume and cost fixed, the profit gain is 1 / operating margin. The same authors print 11.1%
(about 9% margin), 8% (12.5%) and 14% (about 7%). No peer-reviewed critique was found; the critique
is the sources' own arithmetic and their own stated condition (no volume loss).

### F2. Nagle & Mueller (bibliographic read-at-source; the value definitions are reported)

Thomas T. Nagle and Georg Mueller, The Strategy and Tactics of Pricing, 6th edition, Routledge 2018
(Hogan co-wrote earlier editions, not the 6th). 7th edition: Nagle, Mueller and Gruyaert, Routledge
2023, chapter 2 "Economic Value". Reported (Ibbaka blog, undated): economic value = reference value
(the price of the next best alternative) + differentiation value (positive and negative). Pages say
"reported" and paraphrase; never quote the book.

### F3. Ramanujam & Tacke, Monetizing Innovation (Wiley 2016; publisher page read-at-source)

Subtitle and thesis: "How Smart Companies Design the Product Around the Price". The publisher blurb
says 72% of innovations fail to meet financial targets or fail entirely; the underlying study is not
cited on the page, so pages may mention it only as "the publisher's blurb says", or not at all.
Anything inside the book is reported.

### F4. Van Westendorp (method read-at-source in the CRAN pricesensitivitymeter manual v1.3.3 and Wikipedia; the 1976 ESOMAR paper is reported)

Four questions: too expensive (would not consider buying), too cheap (doubt the quality),
expensive (starting to get expensive), cheap (a bargain).
- Optimal price point (OPP) = too cheap x too expensive. Indifference price point (IPP) = cheap x
  expensive. Every source agrees on these two.
- **Sources disagree on the bounds.** Original definition (R manual): point of marginal cheapness
  (PMC) = too cheap x not cheap; point of marginal expensiveness (PME) = too expensive x not
  expensive. Narrower definition (some firms, Wikipedia): PMC = too cheap x expensive; PME = too
  expensive x cheap, which gives a narrower acceptable range. Teach both; the a2 widget switches.
- Multiple crossings are possible and need a stated rule. Newton, Miller and Smith (1993) add
  purchase-intent questions (reported).

### F5. Gabor & Granger (citations read-at-source via Crossref; method description reported)

Gabor and Granger 1961, "On the Price Consciousness of Consumers", Applied Statistics 10(3);
1964, "Price Sensitivity of the Consumer", Journal of Advertising Research 4(4); 1966, "Price as an
Indicator of Quality", Economica 33(129). Method (reported): ask buy / not buy at set prices; the
acceptance shares form a stepwise demand curve; price x share gives the revenue-maximising candidate.
Some summaries pair the 1964 title with Economica 1966: that is a citation error, do not copy it.

### F6. US FTC surveillance pricing (read-at-source on ftc.gov; re-verify before delivery)

- 23 July 2024: 6(b) orders to eight firms, vote 5-0: Mastercard, Revionics, Bloomreach,
  JPMorgan Chase, Task Software, PROS, Accenture, McKinsey & Co.
- 17 January 2025: preliminary staff findings from six firms' documents, vote 3-2: data used can
  include precise location or browser history, and behaviour down to mouse movements; the study
  "is still ongoing"; a request for information ran to 17 April 2025. Commissioner Ferguson,
  joined by Commissioner Holyoak, dissented from releasing summaries before the study was finished
  (a process objection, not a defence of the practice).
- 19 August 2026: proposed enforcement policy statement on personalised pricing, vote 2-0: the FTC
  says it does not have the legal authority to ban personalised pricing in all circumstances;
  undisclosed use of personal data to set prices could violate the FTC Act.
- 28 October 2026: new 6(b) inquiry into personalised pricing and compensation, orders to nine
  firms including Delta, Uber, Walmart and Target, vote 2-0.

### F7. UK CMA (read-at-source on gov.uk; re-verify before delivery)

- "Algorithms: How they can reduce competition and harm consumers", 19 January 2021: personalised
  pricing can be beneficial, increasing output and consumer welfare; it can harm efficiency,
  especially when complex or opaque.
- "Online Choice Architecture", discussion paper CMA155, 5 April 2022: a taxonomy of 21 practices;
  drip pricing among those the literature finds almost always harmful; warns of opaque personalised
  pricing.
- "Dynamic pricing: project update", 20 June 2025: dynamic pricing can be consistent with effective
  competition and good outcomes; consumer law does not generally prohibit pricing strategies; risk
  when prices change rapidly and consumers are confused.
- Ticketmaster / Oasis (case closed 25 September 2025): the CMA did not find evidence of real-time
  algorithmic pricing; the issue was standing tickets sold in two tiers without fans being told.
  Ticketmaster gave undertakings (24 hours' notice of tiered pricing, among others); the CMA made no
  finding that consumer law was infringed.

### F8. OECD 2018 (read-at-source, full text via the US DOJ-hosted copy)

"Personalised Pricing in the Digital Era", background note DAF/COMP(2018)13, 20 November 2018:
personalised pricing can improve allocative efficiency and benefit low-end consumers who would
otherwise be underserved; in some cases it lowers total consumer welfare and creates a perception of
unfairness; "it is still hard to find evidence of actual cases".

**Disagreement B (teach it, never resolve it):** OECD and CMA say personalised pricing can help and
can harm; FTC staff document the data being used; both regulators converge on disclosure rather
than a ban; both admit the evidence of real cases is thin.

### F9. Olist (read-at-source, Kaggle dataset API record)

Brazilian E-Commerce Public Dataset by Olist, Kaggle (olistbr/brazilian-ecommerce): about 100k
orders 2016-2018 across multiple Brazilian marketplaces, anonymised real commercial data, licence
CC BY-NC-SA 4.0. Derived numbers only ship here. The product x month panel was built by
learn-economics-with-phoebe (2,216 product-month rows, 203 products, delivered orders before
2018-09-01); this course derives its sample from that file (`materials/build-pra-sample.py`).

### F10. Black Friday 2017 (read-at-source)

Friday 24 November 2017 (Ebit report via Mercado e Consumo, 29 November 2017, calls it the main
offers day). The panel is monthly: Black Friday is one day inside the November row.

## Real numbers from the rows (computed; node engine = Python reference)

Products sold in October, November and December 2017: 99 (of 195 products with a row between
July 2017 and January 2018). Price move = November mean price / October mean price - 1.

| Threshold for "cut" | cut | held (within +/-) | raised | cut units O/N/D | held units O/N/D |
|---|---|---|---|---|---|
| 1% | 37 | 45 | 17 | 357 / 748 / 441 | 262 / 412 / 311 |
| **3% (default)** | **29** | **54** | **16** | **310 / 654 / 388** | **310 / 513 / 365** |
| 5% | 19 | 66 | 14 | 236 / 545 / 298 | 401 / 634 / 470 |
| 10% | 11 | 84 | 4 | 127 / 354 / 182 | 567 / 888 / 679 |

Whole panel units July 2017 to January 2018: 669, 681, 681, 877, 1,532, 1,092, 1,443.
Cut group (3%): 134, 217, 244, 310, 654, 388, 331. Held group: 300, 251, 250, 310, 513, 365, 445.

Price-volume-mix, October to November 2017, 112 products sold in both months (BRL): October
R$ 90,798.12 (832 items) to November R$ 135,018.48 (1,397 items); price -R$ 4,534.68, volume
+R$ 61,659.78, mix -R$ 12,904.74; products sold in only one of the months +R$ 11,181.47; whole
panel R$ 94,404.67 to R$ 149,806.50.

## Constructed (Kettle & Co, seeded 20171124, labelled on every widget)

- **Wholesale (a1, b3):** 1 kg catering bag, list 9,600 yen; 40 accounts (16 cafes, 14 grocers, 10
  hotels) x 6 orders = 240 orders, 3,812 bags. Per bag, unit-weighted: volume discount 629, promo
  allowance 97 (on-invoice 726) -> invoice 8,874; volume rebate 116, early-payment discount 104,
  co-op marketing 275, freight absorbed 714 (off-invoice 1,209) -> pocket 7,665 yen = 79.8% of list
  (invoice is 92.4% of list). Pocket band 6,371 to 8,986 yen (2,615 wide); invoice band 8,498 to
  9,600 (1,102 wide). 5 largest accounts by bags average 7,402 pocket; 5 smallest 8,328.
  Per account (computed from the constructed rows, drawn in a1's scatter, not a widget line):
  lowest pocket 6,371 yen (a 164-bag cafe), 6,626 yen (a 49-bag cafe), highest 8,986 yen (a 47-bag grocer).
- **Survey (a2):** 200 respondents, 100 g tin. Van Westendorp original: PMC 1,117, OPP 1,600, IPP
  1,624, PME 2,330 yen; narrower: PMC 1,360, PME 1,900 (OPP and IPP unchanged). Gabor-Granger at
  1,200 / 1,400 / 1,600 / 1,800 / 2,000 / 2,200 yen: 191 / 179 / 157 / 130 / 103 / 72 would buy
  (95.5% / 89.5% / 78.5% / 65.0% / 51.5% / 36.0%); revenue peaks at 1,600 yen, contribution at unit
  cost 640 yen peaks at 1,800 yen.
- **Range calculator (a3):** 100 g tin, price 1,800 yen, unit cost 720 yen (contribution margin
  60%), 10,000 tins a month (monthly contribution 10,800,000 yen). Constant-elasticity demand.
  Break-even elasticities: -10% price -1.73; -5% -1.70; +5% -1.64; +10% -1.62.
- **b1 identity (constructed arithmetic, shown on the page):** volume rise needed = d / (m - d).
  Kettle tin: m = 60%, a 10% discount needs 20.0% more volume; at m = 40%, 33.3%; at m = 30%, 50.0%;
  a 5% discount at 40% needs 14.3%; a 20% discount at 40% needs 100.0%. Kettle's constructed P&L
  for the 1% claim: revenue 100, variable costs 40, fixed costs 50, operating profit 10 -> a 1%
  price rise with no volume loss = +10% operating profit (1 / 10%).

## Bench canon (node `materials/run-ladder.js` = python `materials/pra_reference.py`; full dump `materials/canon.json`)

Default: threshold 3%, scope all products, assumed cost ratio 60%. Window for rungs 4-5: November +
December. Comparison growth = held group's units / its October units.

| Rung | What it measures | Canon |
|---|---|---|
| 1 naive | whole panel November vs October | +74.7% (877 -> 1,532), 655 extra units credited to discounts |
| 2 cut group alone | cut group November vs its October | +111.0% (310 -> 654), 344 extra units |
| 3 minus held group | cut lift minus held lift | +111.0% - 65.5% = +45.5 points; 141 extra units (expected 513) |
| 4 net of the month after | December vs comparison | +23 units (expected 365, actual 388): no dip at monthly grain; 164 extra units over two months |
| 5 did it pay (60% cost) | depth, break-even, measured | depth 7.9%; needs 24.6% more volume; measured 20.4%; did not pay: -R$ 1,058.10 |
| 5 at 50% cost | | needs 18.7%; measured 20.4%; paid +R$ 550.78 |
| 5 at 40% cost | | needs 15.1%; paid +R$ 2,159.66 |
| 5 at 70% cost | | needs 35.7%; did not pay -R$ 2,666.98 |
| anti-lever (crowd counted) | October as baseline for both months | 422 extra units vs 164: overstated by 258 units, 2.57 times; measured volume rise 70.5%; "paid" +R$ 8,210.60 at 60% |
| break button (placebo) | 200 seeded shuffles of who was cut | real +45.5 points sits above 186 of 200; 14 reach it; middle 90% -53.9 to +50.2 points: inside the shuffle spread |
| placebo at 5% threshold | | real +72.8 above 198 of 200; 2 reach it; middle 90% -57.9 to +52.5 (and moving the threshold until it passes is its own bias) |
| scope Home and garden (grouped) | 37 products: 16 cut, 20 held | rung 3 +21.6 points, 47.1 units; rung 4 December -16.6 (a dip); 30.5 units net; rung 5 at 60%: needs 25.6%, measured 4.4%, -R$ 3,003.04 |
| scope Everything else | 62 products: 13 cut, 34 held | rung 3 +25.5 points; rung 4 +36.9; 60.4 units; rung 5 at 60%: paid +R$ 1,441.67 |
| scope garden_tools only | 11 products: 7 cut, 4 held | refused (floor 8 cut and 8 held) |

Identity check: the discount pays exactly when measured volume rise (valued at October prices) >
d / (m - d); verified in both engines at every cost ratio above.

The selfTest (node and browser): default scope clears the floor; the anti-lever overstates; rung 1
exceeds rung 3; a single small category is refused; the placebo mean sits nearer zero than the real
gap; pocket < invoice < list.

## Widget-printed lines (captured headless from the real widgets 2026-11-06; pages may quote ONLY these, verbatim)

- **a1 waterfall** verdict: "Pocket price 7,665 yen a bag: 79.8% of list. Off-invoice leakage 1,209
  yen, on-invoice 726 yen." Steps: List price 9,600; Volume discount (on invoice) -629; Promotional
  allowance (on invoice) -97; Invoice price 8,874; Volume rebate (off invoice) -116; Early-payment
  discount (off invoice) -104; Co-op marketing (off invoice) -275; Freight absorbed (off invoice)
  -714; Pocket price 7,665. Tiles: "7,665 yen" average pocket; "6,371 yen to 8,986" pocket band;
  "7,402 yen" 5 largest accounts; "8,328 yen" 5 smallest. Line: "Pocket band 6,371 yen to 8,986 yen
  (2,615 yen wide); invoice band 8,498 yen to 9,600 yen (1,102 yen wide)." Anti-lever on: "Invoice
  view: price realisation 92.4%. The 1,209 yen a bag that leaves after the invoice is invisible here."
- **a2 wtp** original: "Acceptable range 1,117 yen to 2,330 yen (original definition); optimal price
  point 1,600 yen." IPP 1,624 yen. Narrower: "Acceptable range 1,360 yen to 1,900 yen (narrower
  definition); optimal price point 1,600 yen." Gabor-Granger: "Gabor-Granger: revenue peaks at 1,600
  yen; contribution at a unit cost of 640 yen peaks at 1,800 yen." Table: 1,200 yen 191 95.5% revenue
  229,200 contribution 106,960; 1,400 179 89.5% 250,600 136,040; 1,600 157 78.5% 251,200 150,720;
  1,800 130 65.0% 234,000 150,800; 2,000 103 51.5% 206,000 140,080; 2,200 72 36.0% 158,400 112,320.
- **a3 range** handed -1.2 to -2.4: "No price move wins across the whole range: every move depends on
  the point estimate." Profit change at -1.2 / -1.8 / -2.4: -10% -587,043 / +79,426 / +789,388; -5%
  -271,491 / +57,572 / +396,919; +5% +234,654 / -83,694 / -392,856; +10% +438,266 / -186,376 /
  -776,299 yen. Narrower -1.2 to -1.5: "Survives the whole range: +5% price, +10% price." (+5% at
  -1.2 / -1.35 / -1.5: +234,654 / +154,191 / +74,315; +10%: +438,266 / +278,741 / +121,481; both cuts
  lose across the range.) Olist two-way -1.854 +/- two standard errors (-1.554 to -2.154): every move
  depends on the point estimate (+5%: +45,703 / -111,890 / -267,193). Line: "Contribution margin
  60.0%; monthly contribution before any move 10,800,000 yen."
- **a4 promo** (3%): "Cut group +111.0% in November, held group +65.5%: the comparison leaves 141 of
  344 extra units." Lines: "Rung 1, whole panel: November units +74.7% on October." "Rung 2, cut group
  alone: 344 extra units (+111.0%)." "Rung 3, cut minus held: 141 extra units; the gap is +45.5
  percentage points." "Rung 4, December against the held group: +23 units, so 164 extra units over
  two months." Table months 2017-07 to 2018-01 as in "Real numbers" above.
- **a5 pvm**: "Revenue R$ 90,798.12 to R$ 135,018.48: price -R$ 4,534.68, volume +R$ 61,659.78, mix
  -R$ 12,904.74." Rows: October revenue, 112 products R$ 90,798.12 (832 items); November revenue,
  same products R$ 135,018.48 (1,397 items); products sold in only one of the months +R$ 11,181.47.
  "Whole panel: R$ 94,404.67 in October, R$ 149,806.50 in November."
- **a6 bench**: verdicts verbatim:
  - "Rung 1: November units +74.7% on October across the panel (877 to 1,532). Every product rode the season."
  - "Rung 2: the cut group rose +111.0% (310 to 654 units): 344 extra units, but held products rose too."
  - "Rung 3: cut +111.0% minus held +65.5% leaves +45.5 points: 141 extra units in November."
  - "Rung 4: December +23 units against the held group, so 164 extra units over November and December."
  - "Rung 5: discount depth 7.9% at an assumed 60.0% cost ratio needs 24.6% more volume; measured 20.4%. It did not pay: -R$ 1,058.10."
  - cost 50%: "... needs 18.7% more volume; measured 20.4%. It paid: +R$ 550.78."
  - Anti-lever: "Anti-lever: discount depth 7.9% at an assumed 60.0% cost ratio needs 24.6% more volume; measured 70.5%. It paid: +R$ 8,210.60." plus "Counting the crowd credits 422 extra units where the comparison group allows 164: overstated by 258 units, 2.57 times the honest figure."
  - Home and garden rung 4: "Rung 4: December -16.6 units against the held group, so 30.5 extra units over November and December."
  - garden_tools: "Refused: 7 cut and 4 held products is under the floor of 8 each. Widen the scope."
  - Break button (default): "Real gap +45.5 points sits above 186 of 200 shuffles; 14 shuffles reach it. Middle 90% of shuffles: -53.9 to +50.2 points." and "At this n the gap is inside the shuffle spread: the cut-group advantage is not separable from which products happened to be cut."
  - Break button at 5%: "Real gap +72.8 points sits above 198 of 200 shuffles; 2 shuffles reach it. Middle 90% of shuffles: -57.9 to +52.5 points."
  - n line: "n: 99 products sold in all three months; 29 cut, 54 held, 16 raised. Floor: 8 cut and 8 held."

## Per-session coverage

| ID | File | Title | Covers (Live) | Self-study | Figures (mechanism) |
|---|---|---|---|---|---|
| b1 | b1-price-is-the-biggest-lever.html | Price is the biggest lever | the profit line: price, volume, variable cost, fixed cost; why price falls straight to profit; the discount break-even identity d / (m - d) worked on the Kettle tin; the 1% claim (F1, F1b) and why it depends on the margin base | the McKinsey 2003 update; Castle Battery's 14% | 1 the profit line as a stack where 1% of price lands entirely on the thin profit layer; 2 the break-even curve: volume rise needed vs discount at three margins; 3 the same 1% at three margin bases (9% / 12.5% / 7% -> 11.1 / 8 / 14); 4 (build-along) the Kettle discount worksheet |
| b2 | b2-value-cost-or-competitor.html | Value, cost or competitor | three ways to set a price; cost-plus and why it leaves money on the table (the price ignores what the buyer would pay); competitor-based; economic value to the customer = next best alternative + differentiation value (F2, reported); links Economics a1 and p3 | Monetizing Innovation's "design the product around the price" (F3); versioning stays in Economics p3 | 1 three arrows pointing at one price from cost, competitor, value; 2 the EVC stack (reference value + positive - negative differentiation); 3 the gap cost-plus leaves between its price and the value ceiling; 4 (build-along) Kettle's office-tea value stack, constructed |
| b3 | b3-where-the-money-leaks.html | Where the money leaks | the pocket price waterfall (F1): list, on-invoice, invoice, off-invoice, pocket; the pocket price band; why invoice reports hide leakage; reading Kettle's wholesale waterfall (a1 numbers, quoted) | Marn & Rosiello's band widths (35% to 500%); who owns each waterfall element | 1 the waterfall as a cascade; 2 the band: 40 accounts as dots by volume vs pocket price; 3 invoice band vs pocket band; 4 (build-along) the leak audit sheet |
| b4 | b4-reading-a-pricing-recommendation.html | Reading a pricing recommendation | a challenge checklist for "raise prices 8%": whose elasticity, estimated over what range of prices, what horizon, what competitors do, what margin base; dynamic and personalised pricing: what the FTC, CMA and OECD found (F6-F8), dated, with the disagreement taught | the full FTC timeline; Ticketmaster/Oasis | 1 the checklist as a decision tree; 2 the regulator timeline 2018-2026; 3 help vs harm as two columns with the shared middle (disclosure); 4 (build-along) red-pen a constructed Kettle "raise prices 8%" deck |
| a1 | a1-the-pricing-data-model.html | The pricing data model | transaction rows with list, invoice, pocket price and unit cost; building the waterfall from rows; price realisation; the band per account; widget `waterfall` | SQL shape of the price table; currency and units hygiene | 1 the row grain (order line) with its price columns; 2 rows to waterfall: unit-weighted averages; 3 the band and the volume trap (top-5 vs bottom-5 accounts); 4 (build-along) the waterfall from the 240 rows |
| a2 | a2-measuring-willingness-to-pay.html | Measuring willingness to pay | Van Westendorp: four questions, four curves, four points, the two definitions (F4); Gabor-Granger (F5): demand, revenue-max vs contribution-max; stated vs revealed; conjoint as self-study only; widget `wtp` | conjoint; Newton-Miller-Smith extension; questionnaire craft (the planned Survey Design course, no link) | 1 the four cumulative curves and where they cross; 2 the two definitions side by side; 3 Gabor-Granger demand steps with revenue and contribution peaks; 4 (build-along) reading the widget |
| a3 | a3-deciding-with-a-borrowed-elasticity.html | Deciding with a borrowed elasticity | the elasticity as an input with a range (link Economics p10 for how it is estimated; never refit); constant-elasticity arithmetic; break-even elasticity for a move = ln(m / (m + x)) / ln(1 + x); the decision that survives the whole range vs the one that needs the point estimate; widget `range` | Economics' Olist estimate -1.854 (se 0.150) as a worked range | 1 profit change vs elasticity for +5%, crossing zero at -1.64; 2 the range bar against each move's break-even; 3 why a range narrower than the point does not help if it straddles break-even; 4 (build-along) three ranges in the widget |
| a4 | a4-promo-lift-and-the-dip-after.html | Promo lift and the dip after | baseline, lift, pull-forward (the post-promo dip), cannibalisation; rungs 1-4 on real rows; parallel trends as an assumption; price tests designed with Experimentation's method (link b4 and b9, never re-teach DiD or power); widget `promo` | cannibalisation needs cross-product data the panel does not hold; daily data would show Black Friday itself | 1 the season vs the discount: two lines Oct-Dec; 2 baseline and the dip: what pull-forward looks like vs carryover; 3 cannibalisation: units moving between sibling products; 4 (build-along) the four rungs |
| a5 | a5-tiers-bundles-and-price-fences.html | Tiers, bundles and price fences | good-better-best; fences that keep segments apart (time, quantity, channel, features); bundles (pure, mixed); the price-volume-mix bridge on real rows (October to November 2017); widget `pvm` | the FP&A rate/volume variance taught in Ship Platform Diagnosis a2 (link); versioning theory stays in Economics p3 | 1 good-better-best ladder with the decoy; 2 a fence: who can cross it and what it costs them; 3 the PVM bridge as a stepped bar; 4 (build-along) the bridge from the widget |
| a6 | a6-the-promo-and-discount-lab.html | The promo and discount lab | the five-rung ladder, controls, anti-lever, break button, the honest sentence | n floors; threshold choice; what monthly grain hides | 1 the lab schematic: rows -> groups -> five rungs; 2 the anti-lever's overstatement; 3 the placebo strip with the real gap marked; 4 (build-along) run the ladder |

## Seams (absolute links, say them out loud)

- Economics owns elasticity theory and its estimation on Olist:
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/a1-prices-are-information.html ;
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/p1-demand-from-data.html ;
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/p2-why-the-naive-number-lies.html ;
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/p3-pricing-with-the-number.html (versioning, price discrimination) ;
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/p10-the-elasticity-bench.html .
  Its canon (quoted from its map, not refitted): within-product -1.788 (se 0.149); two-way -1.854 (se 0.150).
- Experimentation owns test method:
  https://phoebefu6.github.io/learn-experimentation-with-phoebe/courses/b4-run-an-ab-test.html ;
  https://phoebefu6.github.io/learn-experimentation-with-phoebe/courses/b9-difference-in-differences.html ;
  https://phoebefu6.github.io/learn-experimentation-with-phoebe/courses/a5-when-you-cant-randomize.html
- Sales Pipeline owns Kettle's office-tea B2B pipeline: https://phoebefu6.github.io/learn-sales-pipeline-analytics-with-phoebe/
- Customer Retention owns CLV and churn: https://phoebefu6.github.io/learn-customer-retention-with-phoebe/courses/a6-clv-buy-till-you-die.html
- Metric Decomposition owns metric trees: https://phoebefu6.github.io/learn-metric-decomposition-with-phoebe/
- Ecommerce Metrics owns AOV and shop KPIs: https://phoebefu6.github.io/learn-ecommerce-metrics-with-phoebe/courses/a1-the-gmv-equation.html
- Market Sizing owns sizing: https://phoebefu6.github.io/learn-market-sizing-with-phoebe/
- Ship Platform Diagnosis teaches the FP&A margin bridge: https://phoebefu6.github.io/learn-ship-platform-diagnosis-with-phoebe/courses/a2-follow-the-margin.html
- Survey Design is planned (no repo): mention "a survey design course" only, no link.
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Not covered (honest list)

- Estimating elasticity (Economics owns it); regression of any kind on this course's pages.
- Conjoint analysis beyond a self-study card; questionnaire design.
- Optimisation solvers, revenue management for perishable inventory (airlines, hotels).
- Daily or hourly promo data: the panel is monthly, so Black Friday itself is invisible as a day.
- Costs: Olist publishes none; every margin on real rows uses an assumed cost ratio.
- Cannibalisation measured on real rows: the panel has no sibling-product links.
- Legal advice on pricing law in any jurisdiction; the regulator material is descriptive and dated.
- B2B deal pricing and negotiation (Sales Pipeline's territory for Kettle).

## Corrections to the course block

- The 1% claim's margin is not printed in the 1992 article; it is implied (about 9%). The 2003
  update gives 8% at a 12.5% margin. Teach "1 / operating margin".
- The FTC's 2024 orders went to eight firms including JPMorgan Chase; the January 2025 findings drew
  on six of them. Later dates (August and October 2026) were read on ftc.gov: re-verify before delivery.
- Nagle & Mueller 6th edition has two authors (Hogan co-wrote earlier editions).
- Real signal re-verified: totals 877 / 1,532 / 1,092; 99 products in all three months; 29 cut and
  54 held at 3%; units 310 / 654 / 388 and 310 / 513 / 365. The December number shows NO dip for
  the default scope (+23 vs comparison); the Home and garden scope shows one (-16.6).
- The placebo does not separate the default gap from chance (14 of 200 shuffles reach it). Pages say
  so plainly; at the 5% threshold 2 of 200 reach it, and choosing the threshold after looking is
  itself a bias.

## Citation appendix (the exact forms pages use)

- Marn, M. V. and Rosiello, R. L. (1992). Managing Price, Gaining Profit. Harvard Business Review, September-October 1992. https://hbr.org/1992/09/managing-price-gaining-profit
- Marn, M. V., Roegner, E. V. and Zawada, C. C. (2003). The power of pricing. The McKinsey Quarterly, 2003 Number 1.
- Nagle, T. T. and Mueller, G. (2018). The Strategy and Tactics of Pricing, 6th edition. Routledge. (reported for content)
- Ramanujam, M. and Tacke, G. (2016). Monetizing Innovation. Wiley. (publisher page read; content reported)
- van Westendorp, P. (1976). NSS-Price Sensitivity Meter. ESOMAR Congress. (reported; method read in the CRAN pricesensitivitymeter manual)
- Gabor, A. and Granger, C. W. J. (1964). Price Sensitivity of the Consumer. Journal of Advertising Research 4(4). (method reported)
- US Federal Trade Commission (2024, 2025, 2026). Surveillance pricing 6(b) study and personalised pricing releases. https://www.ftc.gov (re-verify before delivery)
- UK Competition and Markets Authority (2021). Algorithms: How they can reduce competition and harm consumers. (2022) Online Choice Architecture, CMA155. (2025) Dynamic pricing: project update. https://www.gov.uk/cma
- OECD (2018). Personalised Pricing in the Digital Era. DAF/COMP(2018)13.
- Olist. Brazilian E-Commerce Public Dataset by Olist. Kaggle, CC BY-NC-SA 4.0. https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

## Constructed arithmetic added on fan-out pages (checked by the lead 2026-11-06)

- b2: value stack 1,300 + 600 + 400 - 200 = 2,100; cost-plus 720 x 1.5 = 1,080; overhead spiral at 3,600,000 yen a month: 10,000 / 8,000 / 6,000 tins give full cost 1,080 / 1,170 / 1,320 and cost-plus prices 1,620 / 1,755 / 1,980.
- b3: Kettle invoice-to-pocket drop 1,209 / 8,874 = about 13.6% (our arithmetic).
- b4: break-even for +8% at m 60% = ln(0.60 / 0.68) / ln(1.08) = about -1.63; the deck's -0.8 gives volume 0.940 and contribution +6.6% (operating profit 10 -> 13.9, +39%, if every product shared the numbers); at -1.854 contribution -1.7%.
- a3: +5% at -1.2: 9,431.33 tins, profit +234,656 by hand vs +234,654 printed (rounding); -10% needs about 12,000 tins at 1,620 yen.
- a4: cannibalisation example tin 2,000 -> 2,400, caddy 900 -> 750, category 2,900 -> 3,150 (+8.6%).
- a5: tiers (caddy 3,900 yen = 1,560 per 100 g, 13.3% cheaper, assumed caddy cost 1,600); subscription 4,860 = 1,620 a tin; bundle 2,700 with infuser 1,200 (cost 400); three-customer bundle revenue 4,800 / 5,400 / 7,200; order-dependence and mix examples.
