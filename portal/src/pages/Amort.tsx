import { useMemo, useState } from "react"
import { amortize } from "../lib/finance"
import { money } from "../lib/format"
import { Card, Field, Page, Stat } from "../components/ui"

export function Amort() {
  const [loan, setLoan] = useState(800000)
  const [ratePct, setRatePct] = useState(6.5)
  const [years, setYears] = useState(25)
  const [ppy, setPpy] = useState(12)

  const { payment, rows } = useMemo(
    () => amortize(loan, ratePct / 100, years, ppy),
    [loan, ratePct, years, ppy],
  )

  const annual = useMemo(() => {
    const map = new Map<number, { interest: number; principal: number; ending: number }>()
    rows.forEach((r) => {
      const cur = map.get(r.year) ?? { interest: 0, principal: 0, ending: r.ending }
      cur.interest += r.interest
      cur.principal += r.principal
      cur.ending = r.ending
      map.set(r.year, cur)
    })
    return [...map.entries()].map(([year, v]) => ({ year, ...v }))
  }, [rows])

  return (
    <Page kicker="Financial calculator" title="Mortgage amortization" source="Calculator tabs (8) Amortization and (9) Annual Summary">
      <Card>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Loan amount" value={loan} onChange={setLoan} />
          <Field label="Annual interest (%)" value={ratePct} onChange={setRatePct} />
          <Field label="Amortization years" value={years} onChange={setYears} />
          <Field label="Payments / year" value={ppy} onChange={setPpy} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Periodic payment" value={money(payment, 2)} accent />
          <Stat label="Annual debt service" value={money(payment * ppy, 0)} />
          <Stat label="Total interest" value={money(rows.reduce((s, r) => s + r.interest, 0), 0)} />
        </div>
      </Card>
      <div className="mt-6 overflow-auto rounded-xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-ink text-cream">
            <tr>
              <th className="px-3 py-2 text-left">Year</th>
              <th className="px-3 py-2 text-right">Interest</th>
              <th className="px-3 py-2 text-right">Principal</th>
              <th className="px-3 py-2 text-right">Ending balance</th>
            </tr>
          </thead>
          <tbody>
            {annual.map((r) => (
              <tr key={r.year} className="border-t border-line">
                <td className="px-3 py-1.5">{r.year}</td>
                <td className="px-3 py-1.5 text-right">{money(r.interest, 0)}</td>
                <td className="px-3 py-1.5 text-right">{money(r.principal, 0)}</td>
                <td className="px-3 py-1.5 text-right">{money(r.ending, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}
