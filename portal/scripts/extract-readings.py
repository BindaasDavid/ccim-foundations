#!/usr/bin/env python3
"""Rebuild spoken-text JSON from the Support Materials module packets."""
import json, re, subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[2]
src = root / "Support Materials"
out = root / "portal" / "public" / "readings"
out.mkdir(parents=True, exist_ok=True)

files = {
    "1": "FOUND_M1_Overview_2025-07-14.pdf",
    "2": "FOUND_M2_Markets_Trade_Areas_Demos_KS_2025-07-14.pdf",
    "3": "FOUND_M3_TVM_2025-07-14.pdf",
    "4": "FOUND_M4_Leasing_Market_2025-07-14.pdf",
    "5": "FOUND_M5_Lease_Clauses_2025-07-14.pdf",
    "6": "FOUND_M06_Business_Development_2025-07-14.pdf",
    "7": "FOUND_M07_Investment_Analysis_Tools_2025-07-14.pdf",
    "8": "FOUND_M08_Using_IRR_2025-07-14.pdf",
    "9": "FOUND_M09_Mortgage_Loans_2025-07-14.pdf",
    "10": "FOUND_M10_Case_Study_2025-07-23.pdf",
}

skip_re = re.compile(
    r"^(©|copyright|\d+\.\d+$|module \d+$|foundations for|success in|commercial real estate|"
    r"table of contents|answer section|revised july|the ccim institute$)$",
    re.I,
)


def clean_page(text: str) -> list[str]:
    text = text.replace("\r", "")
    text = re.sub(r"(\w)-\n(\w)", r"\1\2", text)
    chunks, buf = [], []
    for raw in text.split("\n"):
        line = re.sub(r"\s+", " ", raw).strip()
        if not line:
            if buf:
                chunks.append(" ".join(buf))
                buf = []
            continue
        if skip_re.match(line) or re.fullmatch(r"[\d.]{1,6}", line) or len(line) <= 2:
            continue
        buf.append(line)
    if buf:
        chunks.append(" ".join(buf))
    merged = []
    for c in chunks:
        if merged and len(c) < 40:
            merged[-1] = merged[-1] + " " + c
        else:
            merged.append(c)
    return [c.strip() for c in merged if len(c.strip()) > 20]


index = []
for mid, name in files.items():
    pdf = src / name
    info = subprocess.check_output(["pdfinfo", str(pdf)], text=True, errors="replace")
    pages = int(re.search(r"Pages:\s+(\d+)", info).group(1))
    page_objs = []
    for p in range(1, pages + 1):
        raw = subprocess.check_output(
            ["pdftotext", "-f", str(p), "-l", str(p), str(pdf), "-"],
            text=True,
            errors="replace",
        )
        paras = clean_page(raw)
        if paras:
            page_objs.append({"page": p, "paragraphs": paras})
    (out / f"module-{mid}.json").write_text(json.dumps({"id": mid, "file": name, "pages": page_objs}), encoding="utf-8")
    words = sum(len(x.split()) for pg in page_objs for x in pg["paragraphs"])
    index.append({"id": mid, "file": name, "pageCount": len(page_objs), "words": words})
    print(f"M{mid}: {len(page_objs)} pages, ~{words} words")

(out / "index.json").write_text(json.dumps(index, indent=2), encoding="utf-8")
