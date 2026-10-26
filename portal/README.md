# CRE study notes

Personal study workspace for commercial real estate fundamentals. It holds original module notes, a listen mode that reads those notes aloud, and calculators for time value of money, operations, and cash flow.

```bash
cd portal
npm install
npm run dev
```

The GitHub Pages build uses base path `/ccim-foundations/` (see `.github/workflows/pages.yml`).

```bash
VITE_BASE=/ccim-foundations/ npm run build
npm run preview
```

`scripts/extract-readings.py` is a local-only helper. Its output stays in a gitignored folder and is not read by the site, committed, or deployed.

Personal study notes. Not affiliated with or endorsed by the CCIM Institute.
