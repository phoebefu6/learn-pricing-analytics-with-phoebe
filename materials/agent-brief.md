# Agent brief - shared by every fan-out page of learn-pricing-analytics-with-phoebe

Internal build document, filled from course-builder/references/agent-brief.template.md on
2026-11-06 (starting point: the Sales Pipeline brief, every course-specific line re-filled). Never
link it from an audience page.

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page for YOUR track. Copy its structure, classes, SVG grammar and quiz markup
   EXACTLY, including how many options each question has (4, lettered "A · ", "B · ", ...):
   - Business: `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-pricing-analytics-with-phoebe/courses/b1-price-is-the-biggest-lever.html`
   - Analyst: `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-pricing-analytics-with-phoebe/courses/a1-the-pricing-data-model.html`
2. The source map: every verified number, its evidence tier, per-session coverage, the seams, and
   the exact lines each widget prints. Use ONLY its numbers; never invent a statistic; if a fact is
   missing, teach the uncertainty.
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-pricing-analytics-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block (first 30 lines) for the palette tokens:
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-pricing-analytics-with-phoebe/assets/style.css`

## Page skeleton (keep every component)

toolbar (crumb EXACTLY `<a href="../index.html">learn-pricing-analytics-with-phoebe</a> / Business
session N of 4` or `... / Analyst session N of 6`, #toggle-all, #zoom-toggle) · masthead (eyebrow
"Learn Pricing Analytics with Phoebe · Business session N of 4" or "· Analyst session N of 6", h1
with one `<span class="accent">`, .sub, .chip-row with the level chip "🟢 Business" for b2, "🟡
Business" for b3, "🟠 Business" for b4, "🟢 Analyst" for a2, "🟡 Analyst" for a3 and a4, "🟠
Analyst" for a5, plus the two audience chips and the time chip exactly as the template, .agenda
a1-a4) · main.wrap · section#intro (Part 0 "Where we start": kicker, .lede, .legend pills,
.callout.win "★ What you walk out with tonight.") · 3 Parts, each `section.section#part-N` with
section-kicker (klabel "Part N · covers ...", h2, `.tag.concept "N min live"`), a `.lede`, ONE
figure, `details.card` accordions (summary: `.mode.live` or `.mode.self`, title, `.mini`, `.caret
▶`), at least one `.callout.example` with `span.ex-pill` "Real world" on the page · section#demo-1
Build-along (kicker `.tag.demo "★ 22 min · everyone works it through"` on Business pages, `"★ 22
min · everyone builds"` on Analyst pages, .lede, ONE figure, `.steps > .step`, each with a
`.prompt-box.good` carrying a `span.label`; see your outline) · section#exercise Homework (ol, 4
items) · section#quiz (3 x `.quiz-q data-answer="0-based"`, `p.qtext`, 4 `button.qopt` "A · ...",
`p.qwhy`; one `p.quiz-score` after the last; vary the correct letter across the three) ·
section#official, h2 EXACTLY "What this session teaches, and where it came from", `.covered >
.covered-row` (pill solid ✓ / light ◐ + name + note), then the `.mono` line EXACTLY "Every fact on
this page, and its verification tier, is recorded in the course's source map." ·
section.cheat#cheatsheet (h3 "Business session N cheat sheet <span>· pin this</span>" or "Analyst
session N cheat sheet ...", .grid-2 of six .cheat-item) · `.callout.next` with `.nx-pill` "Next
session" · footer.pagefoot · scripts.

Head: the template's social meta block with this page's own title/description/url (url
`https://phoebefu6.github.io/learn-pricing-analytics-with-phoebe/courses/<file>`, og:image the
course's assets/og-cover.png exactly as the template); `<title>Business session N · <Title> - learn
pricing analytics with phoebe</title>` (or Analyst); `<link rel="stylesheet"
href="../assets/style.css?v=1">`. Nothing else external.

Scripts at the end: Business pages only `<script src="../assets/app.js?v=1"></script>`. Analyst
pages, exactly as a1: pra-sample.js?v=1, pra-live.js?v=1, pra-bench.js?v=1, then app.js?v=1. The
widget is `<div class="pra-widget" data-mode="MODE"></div>` placed right after the build-along
.lede, before its figure (MODE is in your outline).

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm
practitioner voice, concrete, never dry. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines
is guidance about depth, never a target: never collapse whitespace, dissolve a list into a
paragraph, or drop a component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only. Ranges
  are written "6,371 to 8,986", never with a dash.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "Analyst session 5" style cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Every number comes from the map or is labelled constructed. Widget numbers: quote ONLY the lines
  listed under "Widget-printed lines" in the map, verbatim. For constructed arithmetic you invent
  (e.g. a Kettle tier price), show the arithmetic, label it "Constructed Kettle &amp; Co example",
  and check it twice.
- Contested or missing evidence: teach the disagreement; never resolve what the sources have not.
  Van Westendorp has two published definitions of its bounds; personalised pricing has regulators
  on both sides; teach both.
- Citations in the exact form of the map's appendix; anything marked reported is said to be
  "reported". Quote at most one short phrase (under 15 words) per source; otherwise paraphrase.
  Never quote Nagle or Ramanujam: paraphrase and say "reported".
- NEVER "lottery" or "lotteries"; say the mechanism ("decided by row order", "a random draw").
- Default to the English word. No Chinese terms needed here.
- The elasticity is an INPUT, never refitted: no regression of any kind on any page. Link
  Economics for estimation. No power maths, no DiD derivation: link Experimentation.
- Titles, widget ids and class names must not collide with siblings. Do not reuse these sibling
  titles: "Prices are information", "Pricing with the number", "Pricing a data product", "Three
  prices for one dataset", "Proposal, pricing and the follow-up", "One asset, many prices", "Follow
  the margin". Do not invent new CSS classes; use the template's classes only.
- Running case: Kettle &amp; Co, a constructed direct-to-consumer tea brand in Japan, prices in yen:
  the 100 g tin (1,800 yen, unit cost 720 yen, contribution margin 60%), a wholesale arm selling the
  1 kg catering bag (list 9,600 yen) to cafes, grocers and hotels. Business-wide constructed P&amp;L per
  100 yen: variable 40, fixed 50, operating profit 10. Its office-tea B2B pipeline belongs to the
  Sales Pipeline course (link, do not re-teach). Never Phoebe's own employer, clients or projects.
  Say "constructed" on the page for every Kettle example.
- The real rows: "real Olist marketplace rows (Brazilian e-commerce, delivered orders, prices in
  BRL)". Monthly grain; no costs; sellers chose which products to cut. Never claim otherwise.

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): ink `#26191B` · muted `#5F5154` · accent (crimson)
`#B4233C` · accent-deep `#7C1428` · accent-soft `#EBB8C1` · accent-50 `#FCEFF1` · faint `#D8CACC`
· hairline `#EEE4E5` · teal-green (the one thing) `#0E6B5B` · teal-ink `#08433A` · teal-50
`#E5F3EF` · `#FFFFFF` · universal reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a wrong-way panel.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg"
  role="img" aria-label="the data, not the shape">` > `<defs>` + `<style>` + content, then
  `<figcaption>🔍 Click to zoom - takeaway</figcaption>`. Grow H, never W.
- Prefix unique per figure, used for every class and id: `<page id><letter>`, e.g. `b2a`, `b2b`,
  `b2c`, `b2d` (b2's four figures), `a3a` ... Never reuse another page's prefix.
- `<defs>` holds three things with the figure prefix P: a wobble filter `id="PSk"`
  (`feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="<int>"` +
  `feDisplacementMap scale="2.4" xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%"
  width="106%" height="106%"`), a hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one
  `#B4233C` line, opacity .5), an open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none, ink
  stroke 1.6). ALL shapes sit inside ONE `<g filter="url(#PSk)" fill="none" stroke="#26191B"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`; rects carry a tiny rotation
  (-4 to 4 degrees for hand-placed items, under 1 for panels). Fills: white, accent-50, the hachure
  for "the pile" or "the data", and the teal-green ONLY for the one thing the figure is about. One
  doodle anchor per figure (a price tag, a tea tin, a magnifier), simple strokes, never a mascot.
  Text classes: `.PH` 800 12px ink heading · `.PL` 600 12px ink label · `.PS` 400 11px muted ·
  `.PB` 800 11px teal-ink · `.PV` 800 16-20px accent-deep value · `.PW` 800 12px white on a fill
  (teal-green or crimson only) · `.PA` 700 11px accent-deep axis caption · `.PN` 400 12px muted
  note. Hand-stacked items must not overlap as painted rects (the gate flags it). Text over a
  hachure fill sits on a white rect placed OUTSIDE the filtered group.
- ALL `<text>` outside any filtered group, sans stack, never below 10.5px.
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px (bold: add 8%); full-width
  note under 110 chars; 40px between neighbouring point labels; bottom note 22px below the last
  row, H clears it by 8px. A label whose start sits inside a rect must END inside it too (the gate
  flags text-out-of-box). No path or line may cross a text label (the gate flags line-through-text;
  check diagonal arrows against nearby labels). When in doubt, shorten.
- Floor: one figure per Part plus one in the build-along. Draw the MECHANISM (three anchors pulling
  one price; the value stack from reference value up; a cascade from list to pocket; a decision
  tree for a pricing deck; four cumulative curves crossing; profit change against elasticity
  crossing zero at break-even; a baseline with the season and the dip; a fence and who can cross
  it; a stepped price-volume-mix bridge), never a metaphor literally, never decoration.

## Voice and honesty

Every Part gets a real-world story: a fact from the map where it has one, otherwise a constructed
Kettle story labelled "Constructed Kettle &amp; Co example". Kettle numbers that a widget prints are
quoted from the map; other Kettle numbers are constructed arithmetic and say so. Regulator material
is dated and carries "re-verify before relying on it" where the map says so.

## Cross-links (absolute URLs, use where the outline says)

- Economics (elasticity, estimation, versioning, price discrimination):
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/a1-prices-are-information.html ;
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/p1-demand-from-data.html ;
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/p2-why-the-naive-number-lies.html ;
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/p3-pricing-with-the-number.html ;
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/p10-the-elasticity-bench.html
- Experimentation (test method): https://phoebefu6.github.io/learn-experimentation-with-phoebe/courses/b4-run-an-ab-test.html ;
  https://phoebefu6.github.io/learn-experimentation-with-phoebe/courses/b9-difference-in-differences.html ;
  https://phoebefu6.github.io/learn-experimentation-with-phoebe/courses/a5-when-you-cant-randomize.html
- Sales Pipeline (Kettle's office-tea B2B arm): https://phoebefu6.github.io/learn-sales-pipeline-analytics-with-phoebe/
- Customer Retention (CLV, churn): https://phoebefu6.github.io/learn-customer-retention-with-phoebe/courses/a6-clv-buy-till-you-die.html
- Ecommerce Metrics (AOV, GMV): https://phoebefu6.github.io/learn-ecommerce-metrics-with-phoebe/courses/a1-the-gmv-equation.html
- Metric Decomposition (metric trees): https://phoebefu6.github.io/learn-metric-decomposition-with-phoebe/
- Market Sizing: https://phoebefu6.github.io/learn-market-sizing-with-phoebe/
- Ship Platform Diagnosis (FP&amp;A margin bridge): https://phoebefu6.github.io/learn-ship-platform-diagnosis-with-phoebe/courses/a2-follow-the-margin.html
- Survey design: a planned course with no page yet; mention "a survey design course" only, no link.
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Footer chains and session titles

Business: b1 Price is the biggest lever → b2 Value, cost or competitor → b3 Where the money leaks →
b4 Reading a pricing recommendation (b4's next: "Next: The pricing data model →" to
a1-the-pricing-data-model.html).
Analyst: a1 The pricing data model → a2 Measuring willingness to pay → a3 Deciding with a borrowed
elasticity → a4 Promo lift and the dip after → a5 Tiers, bundles and price fences → a6 The promo
and discount lab.
Files: b2-value-cost-or-competitor.html, b3-where-the-money-leaks.html,
b4-reading-a-pricing-recommendation.html, a2-measuring-willingness-to-pay.html,
a3-deciding-with-a-borrowed-elasticity.html, a4-promo-lift-and-the-dip-after.html,
a5-tiers-bundles-and-price-fences.html.
Footer left: "Business session N of 4 · learn-pricing-analytics-with-phoebe · by Phoebe Fu
&nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>"
Footer right: "<a href="PREV">← Prev: <title></a> &nbsp;·&nbsp; <a href="NEXT">Next: <title> →</a>".

Session titles (exact, sentence case, one accent span in h1): as above.

## Before you return

Re-read your page once against this list: no em or en dash (grep for them), no "this course", every
number in the map or labelled constructed with arithmetic shown, widget quotes verbatim, figure
prefixes unique, every `<text>` outside the filtered group, every label inside its box and clear of
every path, tags balanced (`details`, `section`, `figure`, `svg`, `text` open = close).
