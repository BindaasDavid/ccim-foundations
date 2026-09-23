import { useMemo, useState } from "react"
import { irr, npv } from "../lib/finance"
import { money, pct } from "../lib/format"
import { Card, Field, Page, Stat } from "../components/ui"

function parseFlows(text: string): number[] {
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n))
}

export function NpvIrr() {
  const [discount, setDiscount] = useState(10)
  const [flows, setFlows] = useState("-100000\n12000\n14000\n16000\n18000\n120000")
  const [a, setA] = useState("-80000\n10000\n10000\n10000\n10000\n90000")
  const [b, setB] = useState("-80000\n8000\n8000\n8000\n8000\n85000")

  const series = useMemo(() => parseFlows(flows), [flows])
  const n = useMemo(() => npv(discount / 100, series), [discount, series])
  const r = useMemo(() => irr(series), [series])

  const diff = useMemo(() => {
    const A = parseFlows(a)
    const B = parseFlows(b)
    const len = Math.max(A.length, B.length)
    const d: number[] = []
    for (let i = 0; i < len; i++) d.push((A[i] ?? 0) - (B[i] ?? 0))
    return { d, npvA: npv(discount / 100, A), npvB: npv(discount / 100, B), irrD: irr(d) }
  }, [a, b, discount])

  return (
    <Page kicker="Financial calculator" title="NPV, IRR, and differential cash flows" source="Calculator tabs (5) NPV-IRR and (7) Differential CF">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-serif text-lg">Annual T-bar</h3>
          <p className="mb-3 text-xs text-ink/55">Year 0 first. Separate with commas or new lines. Include sale in the last operating year.</p>
          <Field label="Discount / hurdle (%)" value={discount} onChange={setDiscount} />
          <textarea
            className="mt-3 h-40 w-full rounded-md border border-line p-3 font-mono text-sm"
            value={flows}
            onChange={(e) => setFlows(e.target.value)}
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat label="NPV" value={money(n, 0)} accent={n > 0} />
            <Stat label="IRR" value={r == null ? "—" : pct(r)} />
          </div>
        </Card>
        <Card>
          <h3 className="font-serif text-lg">A minus B</h3>
          <p className="mb-3 text-xs text-ink/55">Compare two leases or two financing plans. Incremental IRR is on A − B.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <textarea className="h-36 rounded-md border border-line p-3 font-mono text-sm" value={a} onChange={(e) => setA(e.target.value)} />
            <textarea className="h-36 rounded-md border border-line p-3 font-mono text-sm" value={b} onChange={(e) => setB(e.target.value)} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Stat label="NPV A" value={money(diff.npvA, 0)} />
            <Stat label="NPV B" value={money(diff.npvB, 0)} />
            <Stat label="Incremental IRR" value={diff.irrD == null ? "—" : pct(diff.irrD)} />
          </div>
        </Card>
      </div>
    </Page>
  )
}
