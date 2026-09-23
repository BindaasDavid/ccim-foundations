import { useMemo, useState } from "react"
import { irr, npv, pmt, remainingBalance } from "../lib/finance"
import { money, pct } from "../lib/format"
import { Card, Field, Page, Sheet, SheetRow, Stat } from "../components/ui"

export function Dcf() {
  const [price, setPrice] = useState(2500000)
  const [acq, setAcq] = useState(50000)
  const [hold, setHold] = useState(5)
  const [pri0, setPri0] = useState(320000)
  const [growth, setGrowth] = useState(3)
  const [vac, setVac] = useState(8)
  const [opex0, setOpex0] = useState(98000)
  const [opexG, setOpexG] = useState(2.5)
  const [loan, setLoan] = useState(1600000)
  const [ratePct, setRatePct] = useState(6.5)
  const [amort, setAmort] = useState(25)
  const [exitCap, setExitCap] = useState(7.25)
  const [saleCost, setSaleCost] = useState(4)
  const [hurdle, setHurdle] = useState(12)

  const model = useMemo(() => {
    const ppy = 12
    const payment = -pmt(ratePct / 100 / ppy, amort * ppy, loan)
    const ads = payment * ppy
    const equity = price + acq - loan
    const years = Array.from({ length: hold }, (_, i) => i + 1)
    const ops = years.map((y) => {
      const pri = pri0 * (1 + growth / 100) ** (y - 1)
      const noi = pri * (1 - vac / 100) - opex0 * (1 + opexG / 100) ** (y - 1)
      const cfbt = noi - ads
      return { y, noi, cfbt }
    })
    const lastNoiNext = (ops.at(-1)?.noi ?? 0) * (1 + growth / 100)
    const sale = lastNoiNext / (exitCap / 100)
    const costs = sale * (saleCost / 100)
    const bal = remainingBalance(loan, ratePct / 100, amort, ppy, hold * ppy)
    const sbt = sale - costs - bal
    const cfs = [-equity, ...ops.map((o, i) => (i === ops.length - 1 ? o.cfbt + sbt : o.cfbt))]
    return {
      equity,
      ads,
      ops,
      sale,
      sbt,
      bal,
      cfs,
      irr: irr(cfs),
      npv: npv(hurdle / 100, cfs),
      y1Cap: price ? (ops[0]?.noi ?? 0) / price : 0,
      coc: equity ? (ops[0]?.cfbt ?? 0) / equity : 0,
    }
  }, [price, acq, hold, pri0, growth, vac, opex0, opexG, loan, ratePct, amort, exitCap, saleCost, hurdle])

  return (
    <Page kicker="DCF model" title="Discounted cash flow" source="CCIM_DCF_Analysis Input / Cash Flows / Sale / MIP">
      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Acquisition price" value={price} onChange={setPrice} />
          <Field label="Acquisition costs" value={acq} onChange={setAcq} />
          <Field label="Holding period (years)" value={hold} onChange={setHold} />
          <Field label="Year 1 PRI" value={pri0} onChange={setPri0} />
          <Field label="Income growth (%)" value={growth} onChange={setGrowth} />
          <Field label="Vacancy (%)" value={vac} onChange={setVac} />
          <Field label="Year 1 opex" value={opex0} onChange={setOpex0} />
          <Field label="Opex growth (%)" value={opexG} onChange={setOpexG} />
          <Field label="Loan amount" value={loan} onChange={setLoan} />
          <Field label="Interest (%)" value={ratePct} onChange={setRatePct} />
          <Field label="Amort years" value={amort} onChange={setAmort} />
          <Field label="Exit cap (%)" value={exitCap} onChange={setExitCap} />
          <Field label="Cost of sale (%)" value={saleCost} onChange={setSaleCost} />
          <Field label="NPV hurdle (%)" value={hurdle} onChange={setHurdle} />
        </div>
      </Card>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Initial equity" value={money(model.equity, 0)} />
        <Stat label="Going-in cap" value={pct(model.y1Cap)} />
        <Stat label="Year 1 cash-on-cash" value={pct(model.coc)} />
        <Stat label="Annual debt service" value={money(model.ads, 0)} />
        <Stat label="Projected sale" value={money(model.sale, 0)} />
        <Stat label="Sale proceeds (BT)" value={money(model.sbt, 0)} />
        <Stat label="Before-tax IRR" value={model.irr == null ? "—" : pct(model.irr)} accent />
        <Stat label={`NPV @ ${hurdle}%`} value={money(model.npv, 0)} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Sheet title="Initial investment">
          <SheetRow n="" label="Purchase price" value={price} onChange={setPrice} format="money" />
          <SheetRow n="" label="Acquisition costs" value={acq} onChange={setAcq} format="money" />
          <SheetRow n="" label="Less loan" value={loan} onChange={setLoan} format="money" />
          <SheetRow n="" label="Equity out at close" value={model.equity} kind="total" format="money" hint="price + costs − loan" />
        </Sheet>
        <Sheet title="Sale proceeds before tax">
          <SheetRow n="" label="Projected sale (next NOI ÷ exit cap)" value={model.sale} kind="computed" format="money" />
          <SheetRow n="" label="Cost of sale" value={model.sale * (saleCost / 100)} kind="computed" format="money" />
          <SheetRow n="" label="Loan balance" value={model.bal} kind="computed" format="money" />
          <SheetRow n="" label="Sale proceeds before tax" value={model.sbt} kind="total" format="money" hint="sale − costs − balance" />
        </Sheet>
      </div>
      <div className="mt-6 overflow-auto rounded-xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-ink text-cream">
            <tr>
              <th className="px-3 py-2 text-left">EOY</th>
              <th className="px-3 py-2 text-right">NOI</th>
              <th className="px-3 py-2 text-right">CFBT</th>
              <th className="px-3 py-2 text-right">T-bar cash flow</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line">
              <td className="px-3 py-1.5">0</td>
              <td />
              <td />
              <td className="px-3 py-1.5 text-right">{money(model.cfs[0], 0)}</td>
            </tr>
            {model.ops.map((o, i) => (
              <tr key={o.y} className="border-t border-line">
                <td className="px-3 py-1.5">{o.y}</td>
                <td className="px-3 py-1.5 text-right">{money(o.noi, 0)}</td>
                <td className="px-3 py-1.5 text-right">{money(o.cfbt, 0)}</td>
                <td className="px-3 py-1.5 text-right">{money(model.cfs[i + 1], 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}
