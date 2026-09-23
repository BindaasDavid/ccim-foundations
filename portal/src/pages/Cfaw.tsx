import { useMemo, useState } from "react"
import { pmt } from "../lib/finance"
import { money } from "../lib/format"
import { Card, Field, Page, Stat } from "../components/ui"

const YEARS = [1, 2, 3, 4, 5, 6] as const

type Kind = "input" | "computed" | "total"

function Line({
  n,
  label,
  values,
  kind = "computed",
  hint,
}: {
  n: string
  label: string
  values: number[]
  kind?: Kind
  hint?: string
}) {
  const tone =
    kind === "total" ? "bg-gold/15 font-medium" : kind === "computed" ? "bg-cream/50" : "bg-white"
  return (
    <tr className={`border-t border-line ${tone}`}>
      <td className="w-10 px-3 py-1.5 text-xs text-ink/45">{n}</td>
      <td className="px-3 py-1.5">
        {label}
        {hint ? <span className="ml-2 text-xs text-ink/40">{hint}</span> : null}
      </td>
      {values.map((v, i) => (
        <td key={i} className="px-3 py-1.5 text-right tabular-nums">
          {money(v, 0)}
        </td>
      ))}
    </tr>
  )
}

export function Cfaw() {
  const [pri0, setPri0] = useState(320000)
  const [priG, setPriG] = useState(3)
  const [vac, setVac] = useState(8)
  const [other, setOther] = useState(12000)
  const [opex0, setOpex0] = useState(98000)
  const [opexG, setOpexG] = useState(2.5)
  const [loan, setLoan] = useState(1600000)
  const [ratePct, setRatePct] = useState(6.5)
  const [amort, setAmort] = useState(25)
  const [ppy, setPpy] = useState(12)
  const [impr, setImpr] = useState(1800000)
  const [life, setLife] = useState(39)
  const [points, setPoints] = useState(0)
  const [part, setPart] = useState(0)
  const [leaseComm, setLeaseComm] = useState(0)
  const [tax, setTax] = useState(37)
  const [reserves, setReserves] = useState(8000)

  const rows = useMemo(() => {
    const i = ratePct / 100 / ppy
    const n = amort * ppy
    const payment = -pmt(i, n, loan)
    const ads = payment * ppy
    const cr = life ? impr / life : 0
    let bal = loan
    return YEARS.map((y) => {
      const pri = pri0 * (1 + priG / 100) ** (y - 1)
      const vacancy = pri * (vac / 100)
      const eri = pri - vacancy
      const goi = eri + other
      const opex = opex0 * (1 + opexG / 100) ** (y - 1)
      const noi = goi - opex
      let interest = 0
      for (let p = 0; p < ppy; p++) {
        const int = bal * i
        interest += int
        bal = Math.max(0, bal - (payment - int))
      }
      const deductions = interest + points + part + cr
      const taxable = noi - deductions
      const taxBill = taxable * (tax / 100)
      const afterTaxInc = taxable - taxBill
      const cashOut = ads + part + leaseComm + reserves
      const cfbt = noi - cashOut
      const cfat = cfbt - taxBill
      return {
        pri,
        vacancy,
        eri,
        other,
        goi,
        opex,
        noi,
        interest,
        points,
        part,
        cr,
        deductions,
        taxable,
        taxBill,
        afterTaxInc,
        ads,
        leaseComm,
        reserves,
        cashOut,
        cfbt,
        cfat,
      }
    })
  }, [pri0, priG, vac, other, opex0, opexG, loan, ratePct, amort, ppy, impr, life, points, part, leaseComm, tax, reserves])

  const col = (pick: (r: (typeof rows)[number]) => number) => rows.map(pick)

  return (
    <Page kicker="Imported form" title="Cash Flow Analysis Worksheet" source="CFAW_6Year_eForm.pdf — each gold line totals the lines named in the hint">
      <p className="mb-6 text-sm text-ink/65">
        Year 1 drivers sit above the sheet. Later years grow income and expenses. Line 7 is GOI minus
        operating expenses. Line 13 is the tax deductions that come off NOI. Line 21 is cash leaving
        after NOI. Line 24 is CFBT minus tax.
      </p>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Year 1 NOI (line 7)" value={money(rows[0]?.noi ?? 0, 0)} />
        <Stat label="Year 1 CFBT (line 22)" value={money(rows[0]?.cfbt ?? 0, 0)} />
        <Stat label="Year 1 tax (line 15)" value={money(rows[0]?.taxBill ?? 0, 0)} />
        <Stat label="Year 1 CFAT (line 24)" value={money(rows[0]?.cfat ?? 0, 0)} accent />
      </div>
      <Card className="mb-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Year 1 potential rent" value={pri0} onChange={setPri0} />
          <Field label="PRI growth (%)" value={priG} onChange={setPriG} />
          <Field label="Vacancy (%)" value={vac} onChange={setVac} />
          <Field label="Other income" value={other} onChange={setOther} />
          <Field label="Year 1 operating expenses" value={opex0} onChange={setOpex0} />
          <Field label="Opex growth (%)" value={opexG} onChange={setOpexG} />
          <Field label="Loan amount" value={loan} onChange={setLoan} />
          <Field label="Interest (%)" value={ratePct} onChange={setRatePct} />
          <Field label="Amort years" value={amort} onChange={setAmort} />
          <Field label="Payments / year" value={ppy} onChange={setPpy} />
          <Field label="Improvement basis" value={impr} onChange={setImpr} />
          <Field label="Useful life" value={life} onChange={setLife} />
          <Field label="Deductible loan costs" value={points} onChange={setPoints} />
          <Field label="Participation payments" value={part} onChange={setPart} />
          <Field label="Leasing commissions" value={leaseComm} onChange={setLeaseComm} />
          <Field label="Funded reserves" value={reserves} onChange={setReserves} />
          <Field label="Tax rate (%)" value={tax} onChange={setTax} />
        </div>
      </Card>
      <div className="overflow-auto rounded-xl border border-line bg-paper">
        <table className="min-w-[880px] w-full text-sm">
          <thead className="bg-ink text-cream">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Line</th>
              {YEARS.map((y) => (
                <th key={y} className="px-3 py-2 text-right">
                  Y{y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Line n="1" label="Potential rental income" values={col((r) => r.pri)} />
            <Line n="2" label="Vacancy and credit loss" values={col((r) => r.vacancy)} />
            <Line n="3" label="Effective rental income" values={col((r) => r.eri)} kind="total" hint="1 − 2" />
            <Line n="4" label="Other income" values={col((r) => r.other)} />
            <Line n="5" label="Gross operating income" values={col((r) => r.goi)} kind="total" hint="3 + 4" />
            <Line n="6" label="Operating expenses" values={col((r) => r.opex)} />
            <Line n="7" label="Net operating income" values={col((r) => r.noi)} kind="total" hint="5 − 6" />
            <Line n="8" label="Interest" values={col((r) => r.interest)} />
            <Line n="9" label="Deductible loan costs" values={col((r) => r.points)} />
            <Line n="10" label="Participation (tax)" values={col((r) => r.part)} />
            <Line n="11" label="Cost recovery" values={col((r) => r.cr)} />
            <Line n="13" label="Total tax deductions" values={col((r) => r.deductions)} kind="total" hint="8 + 9 + 10 + 11" />
            <Line n="14" label="Taxable income (loss)" values={col((r) => r.taxable)} kind="computed" hint="7 − 13" />
            <Line n="15" label="Income tax (savings)" values={col((r) => r.taxBill)} />
            <Line n="16" label="After-tax income" values={col((r) => r.afterTaxInc)} kind="computed" hint="14 − 15" />
            <Line n="17" label="Annual debt service" values={col((r) => r.ads)} />
            <Line n="18" label="Participation (cash)" values={col((r) => r.part)} />
            <Line n="19" label="Leasing commissions" values={col((r) => r.leaseComm)} />
            <Line n="20" label="Funded reserves" values={col((r) => r.reserves)} />
            <Line n="21" label="Cash uses after NOI" values={col((r) => r.cashOut)} kind="total" hint="17 + 18 + 19 + 20" />
            <Line n="22" label="Cash flow before tax" values={col((r) => r.cfbt)} kind="total" hint="7 − 21" />
            <Line n="23" label="Income tax (savings)" values={col((r) => r.taxBill)} />
            <Line n="24" label="Cash flow after tax" values={col((r) => r.cfat)} kind="total" hint="22 − 23" />
          </tbody>
        </table>
      </div>
    </Page>
  )
}
