"""Compare the node engine canon with the Python reference, by value.
Usage: python3 materials/compare-ladder.py [--plant]   (exit 0 = every shared number identical)
--plant multiplies the held group's November units by 1.001 on the Python side only, to prove the
comparison can fail. node prints one extra key, selfTest, which is reported then excluded.
Internal build script; never linked from an audience page."""
import json, os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
node = json.loads(subprocess.check_output(["node", os.path.join(here, "run-ladder.js")]))
if "--plant" in sys.argv:
    code = open(os.path.join(here, "pra_reference.py")).read()
    target = "    gN, gD = hu[1] / hu[0], hu[2] / hu[0]\n"
    assert target in code, "plant failed to apply"
    code = code.replace(target, "    gN, gD = hu[1] * 1.001 / hu[0], hu[2] / hu[0]\n")
    code = code.replace('HERE = os.path.dirname(os.path.abspath(__file__))', 'HERE = %r' % here)
    py = json.loads(subprocess.check_output([sys.executable, "-c", code]))
else:
    py = json.loads(subprocess.check_output([sys.executable, os.path.join(here, "pra_reference.py")]))
st = node.pop("selfTest", None)
print("node selfTest:", st)
diffs, seen = [], [0]
def walk(a, b, p=""):
    if isinstance(a, dict) and isinstance(b, dict):
        for k in sorted(set(a) | set(b)): walk(a.get(k), b.get(k), p + "." + k)
    elif isinstance(a, list) and isinstance(b, list) and len(a) == len(b):
        for i, (x, y) in enumerate(zip(a, b)): walk(x, y, f"{p}[{i}]")
    else:
        seen[0] += 1
        if a != b: diffs.append((p, a, b))
walk(node, py)
for d in diffs[:40]: print("DIFF", *d)
print("identical" if not diffs and st and st.get("ok") else "MISMATCH", "-", seen[0], "values compared,", len(diffs), "differences")
sys.exit(1 if diffs or not (st and st.get("ok")) else 0)
