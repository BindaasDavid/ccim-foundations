import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { amortize, pmt } from "../lib/finance"
import { money } from "../lib/format"
import { buildNoiForecast, parkPlazaDrivers, parkPlazaTenants } from "../lib/noiForecast"
import { Page } from "../components/ui"

const YEARS = [1, 2, 3, 4, 5, 6] as const

function InNum({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <input
      type="number"
      step="any"
      className="w-full border border-[#bf8f00] bg-[#fff2cc] px-1.5 py-0.5 text-right text-[12px] outline-none"
      value={value === 0 ? "" : value}
      onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
    />
  )
}

function InText({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      className="w-full border border-[#bf8f00] bg-[#fff2cc] px-1.5 py-0.5 text-left text-[12px] outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function Out({ n, digits = 0 }: { n: number; digits?: number }) {
  return (
    <div className="border border-[#8faadc] bg-[#ddebf7] px-1.5 py-0.5 text-right text-[12px] tabular-nums">
      {Number.isFinite(n) ? money(n, digits) : "—"}
    </div>
  )
}

function setAt(arr: number[], i: number, n: number) {
  return arr.map((v, idx) => (idx === i ? n : v))
}

export function Cfaw() {
  const seed = useMemo(() => buildNoiForecast(parkPlazaTenants, parkPlazaDrivers), [])

  const [name, setName] = useState("Park Plaza Task 8-6")
  const [forWhom, setForWhom] = useState("Owner")
  const [by, setBy] = useState("CCIM")
  const [when, setWhen] = useState("Today")
  const [price, setPrice] = useState(1050000)
  const [acq, setAcq] = useState(0)
  const [loanFees, setLoanFees] = useState(0)
  const [loan1, setLoan1] = useState(787500)
  const [loan2, setLoan2] = useState(0)
  const [rate1, setRate1] = useState(6.5)
  const [rate2, setRate2] = useState(0)
  const [amort1, setAmort1] = useState(25)
  const [amort2, setAmort2] = useState(0)
  const [term1, setTerm1] = useState(5)
  const [term2, setTerm2] = useState(0)
  const [ppy1, setPpy1] = useState(12)
  const [ppy2, setPpy2] = useState(12)
  const [impr, setImpr] = useState(0)
  const [pp, setPp] = useState(0)
  const [lifeImpr, setLifeImpr] = useState(39)
  const [lifePp, setLifePp] = useState(0)
  const [crMethod, setCrMethod] = useState("SL")
  const [taxRate, setTaxRate] = useState(0)

  const [pri, setPri] = useState(seed.map((y) => y.pri))
  const [vac, setVac] = useState(seed.map((y) => y.vacancy))
  const [otherInc, setOtherInc] = useState([0, 0, 0, 0, 0, 0])
  const [opex, setOpex] = useState(seed.map((y) => y.opex))
  const [part, setPart] = useState([0, 0, 0, 0, 0, 0])
  const [leaseComm, setLeaseComm] = useState([0, 0, 0, 0, 0, 0])
  const [reserves, setReserves] = useState([0, 0, 0, 0, 0, 0])
  const [loanFeeAmort, setLoanFeeAmort] = useState([0, 0, 0, 0, 0, 0])

  const equity = price + acq + loanFees - loan1 - loan2
  const pmt1 = loan1 ? -pmt(rate1 / 100 / ppy1, amort1 * ppy1, loan1) : 0
  const pmt2 = loan2 && amort2 ? -pmt(rate2 / 100 / ppy2, amort2 * ppy2, loan2) : 0
  const ads1 = pmt1 * ppy1
  const ads2 = pmt2 * ppy2
  const ads = ads1 + ads2
  const crImpr = lifeImpr && impr ? impr / lifeImpr : 0
  const crPp = lifePp && pp ? pp / lifePp : 0

  const interest = useMemo(() => {
    const a1 = loan1 ? amortize(loan1, rate1 / 100, amort1, ppy1) : null
    const a2 = loan2 && amort2 ? amortize(loan2, rate2 / 100, amort2, ppy2) : null
    return YEARS.map((y) => {
      const i1 = a1 ? a1.rows.filter((r) => r.year === y).reduce((s, r) => s + r.interest, 0) : 0
      const i2 = a2 ? a2.rows.filter((r) => r.year === y).reduce((s, r) => s + r.interest, 0) : 0
      return { i1, i2 }
    })
  }, [loan1, rate1, amort1, ppy1, loan2, rate2, amort2, ppy2])

  const cols = useMemo(() => {
    return YEARS.map((_, i) => {
      const eri = (pri[i] ?? 0) - (vac[i] ?? 0)
      const goi = eri + (otherInc[i] ?? 0)
      const noi = goi - (opex[i] ?? 0)
      const int1 = interest[i]?.i1 ?? 0
      const int2 = interest[i]?.i2 ?? 0
      const taxable = noi - int1 - int2 - (part[i] ?? 0) - crImpr - crPp - (loanFeeAmort[i] ?? 0) - (leaseComm[i] ?? 0)
      const tax = taxable * (taxRate / 100)
      const cfbt = noi - ads - (part[i] ?? 0) - (leaseComm[i] ?? 0) - (reserves[i] ?? 0)
      const cfat = cfbt - tax
      return { eri, goi, noi, int1, int2, taxable, tax, cfbt, cfat }
    })
  }, [pri, vac, otherInc, opex, interest, part, crImpr, crPp, loanFeeAmort, leaseComm, taxRate, ads, reserves])

  return (
    <Page
      kicker="Imported form"
      title="Cash Flow Analysis Worksheet"
      source="Independent recreation of CFAW_6Year_eForm — Park Plaza Tasks 6–8 figures are seeded"
    >
      <p className="mb-4 text-sm text-ink/65">
        This is the printed CFAW, not the earlier simplified calculator. Yellow cells are inputs. Blue
        cells total only the lines named on that row. Seeded from the{" "}
        <Link className="text-gold-deep" to="/tools/noi">
          Task 6 NOI forecast
        </Link>{" "}
        and Task 7 loan (PV $787,500, 6.5%, 25 years).
      </p>

      <div className="overflow-x-auto rounded-sm border-2 border-black bg-white p-4 text-[#111]">
        <h2 className="mb-4 text-center font-serif text-2xl">Cash Flow Analysis Worksheet</h2>

        <div className="mb-4 grid gap-6 md:grid-cols-2">
          <table className="w-full border-collapse text-[12px]">
            <tbody>
              {(
                [
                  ["Property Name", name, setName],
                  ["Prepared For", forWhom, setForWhom],
                  ["Prepared By", by, setBy],
                  ["Date Prepared", when, setWhen],
                ] as const
              ).map(([label, value, set]) => (
                <tr key={label}>
                  <td className="w-36 py-0.5">{label}</td>
                  <td>
                    <InText value={value} onChange={set} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="w-full border-collapse text-[12px]">
            <tbody>
              <tr>
                <td className="w-44 py-0.5">Purchase Price</td>
                <td>
                  <InNum value={price} onChange={setPrice} />
                </td>
              </tr>
              <tr>
                <td className="py-0.5">Plus Acquisition Costs</td>
                <td>
                  <InNum value={acq} onChange={setAcq} />
                </td>
              </tr>
              <tr>
                <td className="py-0.5">Plus Loan Fees / Costs</td>
                <td>
                  <InNum value={loanFees} onChange={setLoanFees} />
                </td>
              </tr>
              <tr>
                <td className="py-0.5">Less Mortgages</td>
                <td>
                  <Out n={loan1 + loan2} />
                </td>
              </tr>
              <tr>
                <td className="py-0.5 font-semibold">Equals Initial Investment</td>
                <td>
                  <Out n={equity} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-2 py-1 text-left font-normal">Mortgage Data</th>
                <th className="px-2 py-1 font-normal">1st Mortgage</th>
                <th className="px-2 py-1 font-normal">2nd Mortgage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2">Amount</td>
                <td className="border border-black p-0.5">
                  <InNum value={loan1} onChange={setLoan1} />
                </td>
                <td className="border border-black p-0.5">
                  <InNum value={loan2} onChange={setLoan2} />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2">Interest Rate</td>
                <td className="border border-black p-0.5">
                  <InNum value={rate1} onChange={setRate1} />
                </td>
                <td className="border border-black p-0.5">
                  <InNum value={rate2} onChange={setRate2} />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2">Amortization Period</td>
                <td className="border border-black p-0.5">
                  <InNum value={amort1} onChange={setAmort1} />
                </td>
                <td className="border border-black p-0.5">
                  <InNum value={amort2} onChange={setAmort2} />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2">Loan Term</td>
                <td className="border border-black p-0.5">
                  <InNum value={term1} onChange={setTerm1} />
                </td>
                <td className="border border-black p-0.5">
                  <InNum value={term2} onChange={setTerm2} />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2">Payments / Year</td>
                <td className="border border-black p-0.5">
                  <InNum value={ppy1} onChange={setPpy1} />
                </td>
                <td className="border border-black p-0.5">
                  <InNum value={ppy2} onChange={setPpy2} />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2">Periodic Payment</td>
                <td className="border border-black p-0.5">
                  <Out n={pmt1} digits={2} />
                </td>
                <td className="border border-black p-0.5">
                  <Out n={pmt2} digits={2} />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 font-semibold">Annual Debt Service</td>
                <td className="border border-black p-0.5">
                  <Out n={ads1} />
                </td>
                <td className="border border-black p-0.5">
                  <Out n={ads2} />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2">Loan Fees / Costs</td>
                <td className="border border-black p-0.5">
                  <InNum value={loanFees} onChange={setLoanFees} />
                </td>
                <td className="border border-black bg-[#f2f2f2]" />
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-2 py-1 text-left font-normal">Cost Recovery Data</th>
                <th className="px-2 py-1 font-normal">Improvements</th>
                <th className="px-2 py-1 font-normal">Personal Property</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2">Value</td>
                <td className="border border-black p-0.5">
                  <InNum value={impr} onChange={setImpr} />
                </td>
                <td className="border border-black p-0.5">
                  <InNum value={pp} onChange={setPp} />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2">C. R. Method</td>
                <td className="border border-black p-0.5">
                  <InText value={crMethod} onChange={setCrMethod} />
                </td>
                <td className="border border-black bg-[#f2f2f2]" />
              </tr>
              <tr>
                <td className="border border-black px-2">Useful Life</td>
                <td className="border border-black p-0.5">
                  <InNum value={lifeImpr} onChange={setLifeImpr} />
                </td>
                <td className="border border-black p-0.5">
                  <InNum value={lifePp} onChange={setLifePp} />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2">Annual cost recovery</td>
                <td className="border border-black p-0.5">
                  <Out n={crImpr} />
                </td>
                <td className="border border-black p-0.5">
                  <Out n={crPp} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-1 mt-6 text-center text-xs font-semibold tracking-[0.2em] uppercase">Taxable Income</p>
        <table className="w-full min-w-[920px] border-collapse text-[12px]">
          <thead>
            <tr className="bg-black text-white">
              <th className="w-10 px-1 py-1 font-normal">#</th>
              <th className="px-2 py-1 text-left font-normal">End of Year</th>
              {YEARS.map((y) => (
                <th key={y} className="w-28 px-1 py-1 font-normal">
                  {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Line n="1" label="Potential Rental Income" values={pri} onChange={(i, n) => setPri(setAt(pri, i, n))} />
            <Line n="2" label="− Vacancy & Credit Losses" values={vac} onChange={(i, n) => setVac(setAt(vac, i, n))} />
            <Line n="3" label="= Effective Rental Income" values={cols.map((c) => c.eri)} hint="1 − 2" />
            <Line n="4" label="+ Other Income (Collectable)" values={otherInc} onChange={(i, n) => setOtherInc(setAt(otherInc, i, n))} />
            <Line n="5" label="= Gross Operating Income" values={cols.map((c) => c.goi)} hint="3 + 4" total />
            <Line n="6" label="− Operating Expenses" values={opex} onChange={(i, n) => setOpex(setAt(opex, i, n))} />
            <Line n="7" label="= NET OPERATING INCOME" values={cols.map((c) => c.noi)} hint="5 − 6" total />
            <Line n="8" label="− Interest – 1st Mortgage" values={cols.map((c) => c.int1)} />
            <Line n="9" label="− Interest – 2nd Mortgage" values={cols.map((c) => c.int2)} />
            <Line n="10" label="− Participation Payments" values={part} onChange={(i, n) => setPart(setAt(part, i, n))} />
            <Line n="11" label="− Cost Recovery – Improvements" values={YEARS.map(() => crImpr)} />
            <Line n="12" label="− Cost Recovery – Personal Property" values={YEARS.map(() => crPp)} />
            <Line
              n="13"
              label="− Amortization of Loan Fees / Costs"
              values={loanFeeAmort}
              onChange={(i, n) => setLoanFeeAmort(setAt(loanFeeAmort, i, n))}
            />
            <Line
              n="14"
              label="− Leasing Commissions"
              values={leaseComm}
              onChange={(i, n) => setLeaseComm(setAt(leaseComm, i, n))}
            />
            <Line n="15" label="= Real Estate Taxable Income" values={cols.map((c) => c.taxable)} hint="7 − (8…14)" total />
            <tr>
              <td className="border border-black px-1 text-center">16</td>
              <td className="border border-black px-2">
                − Tax Liability (Savings) at
                <span className="ml-2 inline-block w-16">
                  <InNum value={taxRate} onChange={setTaxRate} />
                </span>
                %
              </td>
              {cols.map((c, i) => (
                <td key={i} className="border border-black p-0.5">
                  <Out n={c.tax} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <p className="mb-1 mt-6 text-center text-xs font-semibold tracking-[0.2em] uppercase">Cash Flow</p>
        <table className="w-full min-w-[920px] border-collapse text-[12px]">
          <thead>
            <tr className="bg-black text-white">
              <th className="w-10 px-1 py-1 font-normal">#</th>
              <th className="px-2 py-1 text-left font-normal" />
              {YEARS.map((y) => (
                <th key={y} className="w-28 px-1 py-1 font-normal">
                  {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Line n="17" label="NET OPERATING INCOME (Line 7)" values={cols.map((c) => c.noi)} hint="from 7" />
            <Line n="18" label="− Annual Debt Service" values={YEARS.map(() => ads)} hint="from mortgage box" />
            <Line n="19" label="− Participation Payments" values={part} onChange={(i, n) => setPart(setAt(part, i, n))} />
            <Line
              n="20"
              label="− Leasing Commissions"
              values={leaseComm}
              onChange={(i, n) => setLeaseComm(setAt(leaseComm, i, n))}
            />
            <Line n="21" label="− Funded Reserves" values={reserves} onChange={(i, n) => setReserves(setAt(reserves, i, n))} />
            <Line n="22" label="= CASH FLOW BEFORE TAXES" values={cols.map((c) => c.cfbt)} hint="17 − (18…21)" total />
            <Line n="23" label="− Tax Liability (Savings) (Line 16)" values={cols.map((c) => c.tax)} />
            <Line n="24" label="= CASH FLOW AFTER TAXES" values={cols.map((c) => c.cfat)} hint="22 − 23" total />
          </tbody>
        </table>

        <p className="mt-3 text-[11px] text-[#555]">
          Periodic payment {money(pmt1, 2)} · ADS {money(ads, 0)} · Initial investment {money(equity, 0)}. Line 7
          Year 6 should read {money(cols[5]?.noi ?? 0, 0)} for the Park Plaza seed (packet $80,173). Before-tax
          work leaves line 16 at 0%.
        </p>
      </div>
    </Page>
  )
}

function Line({
  n,
  label,
  values,
  onChange,
  hint,
  total,
}: {
  n: string
  label: string
  values: number[]
  onChange?: (i: number, n: number) => void
  hint?: string
  total?: boolean
}) {
  return (
    <tr className={total ? "font-semibold" : ""}>
      <td className="border border-black px-1 text-center">{n}</td>
      <td className="border border-black px-2">
        {label}
        {hint ? <span className="ml-2 text-[10px] font-normal text-[#777]">{hint}</span> : null}
      </td>
      {values.map((v, i) => (
        <td key={i} className="border border-black p-0.5">
          {onChange ? <InNum value={v} onChange={(n) => onChange(i, n)} /> : <Out n={v} />}
        </td>
      ))}
    </tr>
  )
}
