import { useMemo, useState } from "react"
import { irr, npv, pmt, remainingBalance } from "../lib/finance"
import { money, num, pct } from "../lib/format"
import { Page } from "../components/ui"
import { Workbook, XlGrid, XlHead, XlInput, XlOut, XlRow, XlSection, XlTd, XlText } from "../components/workbook"

const YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

function grow(base: number, ratePct: number, year: number) {
  return base * (1 + ratePct / 100) ** (year - 1)
}

export function Dcf() {
  const [tab, setTab] = useState("input")
  const [name, setName] = useState("Subject property")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("Office")
  const [purpose, setPurpose] = useState("Hold / sale")
  const [prepared, setPrepared] = useState("")
  const [hold, setHold] = useState(5)
  const [size, setSize] = useState(10000)
  const [land, setLand] = useState(250000)
  const [impr, setImpr] = useState(1800000)
  const [life, setLife] = useState(39)
  const [price, setPrice] = useState(2500000)
  const [acq, setAcq] = useState(50000)
  const [loan, setLoan] = useState(1600000)
  const [ltvMax, setLtvMax] = useState(75)
  const [dcrMin, setDcrMin] = useState(1.25)
  const [ratePct, setRatePct] = useState(6.5)
  const [amort, setAmort] = useState(25)
  const [term, setTerm] = useState(5)
  const [ppy, setPpy] = useState(12)
  const [loanCosts, setLoanCosts] = useState(16000)
  const [ordRate, setOrdRate] = useState(37)
  const [cgRate, setCgRate] = useState(20)
  const [recapRate, setRecapRate] = useState(25)
  const [saleOverride, setSaleOverride] = useState(0)
  const [saleCostPct, setSaleCostPct] = useState(4)
  const [exitCap, setExitCap] = useState(7.25)
  const [pri0, setPri0] = useState(320000)
  const [priG, setPriG] = useState(3)
  const [other0, setOther0] = useState(0)
  const [vac, setVac] = useState(8)
  const [opex0, setOpex0] = useState(98000)
  const [opexG, setOpexG] = useState(2.5)
  const [hurdle, setHurdle] = useState(12)
  const [reserves, setReserves] = useState(0)

  const nHold = Math.max(1, Math.min(10, Math.round(hold)))

  const model = useMemo(() => {
    const payment = loan ? -pmt(ratePct / 100 / ppy, amort * ppy, loan) : 0
    const ads = payment * ppy
    const equity = price + acq + loanCosts - loan
    const cr = life ? impr / life : 0
    const years = YEARS.filter((y) => y <= nHold)
    const ops = years.map((y) => {
      const pri = grow(pri0, priG, y)
      const vacancy = pri * (vac / 100)
      const eri = pri - vacancy
      const other = other0
      const goi = eri + other
      const opex = grow(opex0, opexG, y)
      const noi = goi - opex
      const interest = (() => {
        const bal0 = remainingBalance(loan, ratePct / 100, amort, ppy, (y - 1) * ppy)
        const bal1 = remainingBalance(loan, ratePct / 100, amort, ppy, y * ppy)
        return Math.max(0, ads - Math.max(0, bal0 - bal1))
      })()
      const taxable = noi - interest - cr
      const tax = taxable * (ordRate / 100)
      const cfbt = noi - ads - reserves
      const cfat = cfbt - tax
      const bal = remainingBalance(loan, ratePct / 100, amort, ppy, y * ppy)
      return { y, pri, vacancy, eri, other, goi, opex, noi, interest, cr, taxable, tax, ads, cfbt, cfat, bal }
    })
    const last = ops.at(-1)
    const nextNoi = last ? last.noi * (1 + priG / 100) : 0
    const saleRaw = saleOverride || (exitCap ? nextNoi / (exitCap / 100) : 0)
    const sale = Math.round(saleRaw / 1000) * 1000
    const costSale = sale * (saleCostPct / 100)
    const exitBal = last?.bal ?? 0
    const basis = price + acq
    const crTaken = cr * nHold
    const adj = basis - crTaken
    const realized = sale - costSale
    const gain = realized - adj
    const slRecap = Math.max(0, Math.min(crTaken, Math.max(gain, 0)))
    const capGain = Math.max(0, gain - slRecap)
    const feesLeft = Math.max(0, loanCosts * (1 - nHold / Math.max(term, nHold)))
    const taxOrd = feesLeft * (ordRate / 100)
    const taxRecap = slRecap * (recapRate / 100)
    const taxCg = capGain * (cgRate / 100)
    const sbt = sale - costSale - exitBal + reserves
    const sat = sbt - taxOrd - taxRecap - taxCg
    const bt = [-equity, ...ops.map((o, i) => (i === ops.length - 1 ? o.cfbt + sbt : o.cfbt))]
    const at = [-equity, ...ops.map((o, i) => (i === ops.length - 1 ? o.cfat + sat : o.cfat))]
    const y1 = ops[0]
    return {
      payment,
      ads,
      equity,
      cr,
      ops,
      sale,
      costSale,
      exitBal,
      basis,
      crTaken,
      adj,
      gain,
      slRecap,
      capGain,
      feesLeft,
      taxOrd,
      taxRecap,
      taxCg,
      sbt,
      sat,
      bt,
      at,
      ltv: price ? loan / price : 0,
      dcr: ads ? (y1?.noi ?? 0) / ads : 0,
      capIn: price && y1 ? y1.noi / price : 0,
      cocBt: equity && y1 ? y1.cfbt / equity : 0,
      cocAt: equity && y1 ? y1.cfat / equity : 0,
      grm: y1 && price ? price / y1.pri : 0,
      irrBt: irr(bt),
      irrAt: irr(at),
      npvBt: npv(hurdle / 100, bt),
      npvAt: npv(hurdle / 100, at),
    }
  }, [
    nHold,
    pri0,
    priG,
    vac,
    other0,
    opex0,
    opexG,
    loan,
    ratePct,
    amort,
    ppy,
    price,
    acq,
    loanCosts,
    impr,
    life,
    ordRate,
    saleOverride,
    exitCap,
    saleCostPct,
    term,
    recapRate,
    cgRate,
    reserves,
    hurdle,
  ])

  const yearHead = YEARS.filter((y) => y <= nHold)

  return (
    <Page
      kicker="DCF model"
      title="Discounted cash flow workbook"
      source="Independent recreation of Input / Cash Flows / Sale / MIP sheet structure"
    >
      <Workbook
        title="DCF Analysis"
        version="Study recreation · V 12.2 tab order"
        tabs={[
          { id: "input", label: "Input Sheets" },
          { id: "cf", label: "Cash Flows" },
          { id: "sale", label: "Sale" },
          { id: "mip", label: "MIP" },
        ]}
        active={tab}
        onTab={setTab}
      >
        {tab === "input" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <XlGrid cols="40px 280px 160px">
              <XlHead span={3}>Property Input Sheet 1</XlHead>
              <XlSection span={3}>Property Assumptions</XlSection>
              <XlRow n="1" label="Name">
                <XlTd>
                  <XlText value={name} onChange={setName} />
                </XlTd>
              </XlRow>
              <XlRow n="2" label="Location">
                <XlTd>
                  <XlText value={location} onChange={setLocation} />
                </XlTd>
              </XlRow>
              <XlRow n="3" label="Type of Property">
                <XlTd>
                  <XlText value={type} onChange={setType} />
                </XlTd>
              </XlRow>
              <XlRow n="4" label="Purpose of Analysis">
                <XlTd>
                  <XlText value={purpose} onChange={setPurpose} />
                </XlTd>
              </XlRow>
              <XlRow n="5" label="Prepared By">
                <XlTd>
                  <XlText value={prepared} onChange={setPrepared} />
                </XlTd>
              </XlRow>
              <XlRow n="6" label="Anticipated Holding Period (1–10 Years)">
                <XlTd>
                  <XlInput value={hold} onChange={setHold} />
                </XlTd>
              </XlRow>
              <XlRow n="7" label="Size (Square feet or Number of Units)">
                <XlTd>
                  <XlInput value={size} onChange={setSize} />
                </XlTd>
              </XlRow>
              <XlRow n="8" label="Assessed/Appraised Value of Land">
                <XlTd>
                  <XlInput value={land} onChange={setLand} />
                </XlTd>
              </XlRow>
              <XlRow n="9" label="Assessed/Appraised Value of Improvements">
                <XlTd>
                  <XlInput value={impr} onChange={setImpr} />
                </XlTd>
              </XlRow>
              <XlRow n="11" label="Useful Life of Improvements (Years)">
                <XlTd>
                  <XlInput value={life} onChange={setLife} />
                </XlTd>
              </XlRow>
              <XlRow n="12" label="Acquisition Price">
                <XlTd>
                  <XlInput value={price} onChange={setPrice} />
                </XlTd>
              </XlRow>
              <XlRow n="13" label="Acquisition Costs">
                <XlTd>
                  <XlInput value={acq} onChange={setAcq} />
                </XlTd>
              </XlRow>
              <XlSection span={3}>Financing Assumptions</XlSection>
              <XlRow n="14" label="Loan Amount">
                <XlTd>
                  <XlInput value={loan} onChange={setLoan} />
                </XlTd>
              </XlRow>
              <XlRow n="15" label="Maximum Loan to Value Ratio">
                <XlTd>
                  <XlInput value={ltvMax} onChange={setLtvMax} />
                </XlTd>
              </XlRow>
              <XlRow n="16" label="Minimum Debt Service Coverage Ratio">
                <XlTd>
                  <XlInput value={dcrMin} onChange={setDcrMin} />
                </XlTd>
              </XlRow>
              <XlRow n="17" label="Interest Rate">
                <XlTd>
                  <XlInput value={ratePct} onChange={setRatePct} />
                </XlTd>
              </XlRow>
              <XlRow n="18" label="Amortization Period (Years)">
                <XlTd>
                  <XlInput value={amort} onChange={setAmort} />
                </XlTd>
              </XlRow>
              <XlRow n="19" label="Loan Term (Years)">
                <XlTd>
                  <XlInput value={term} onChange={setTerm} />
                </XlTd>
              </XlRow>
              <XlRow n="20" label="Payments Per Year">
                <XlTd>
                  <XlInput value={ppy} onChange={setPpy} />
                </XlTd>
              </XlRow>
              <XlRow n="21" label="Loan Costs">
                <XlTd>
                  <XlInput value={loanCosts} onChange={setLoanCosts} />
                </XlTd>
              </XlRow>
            </XlGrid>
            <XlGrid cols="40px 280px 160px">
              <XlHead span={3}>Investor / operations</XlHead>
              <XlSection span={3}>Investor/Owner Assumptions</XlSection>
              <XlRow n="22" label="Ordinary Income Marginal Tax Rate">
                <XlTd>
                  <XlInput value={ordRate} onChange={setOrdRate} />
                </XlTd>
              </XlRow>
              <XlRow n="23" label="Capital Gains Tax Rate">
                <XlTd>
                  <XlInput value={cgRate} onChange={setCgRate} />
                </XlTd>
              </XlRow>
              <XlRow n="24" label="Cost Recovery Recapture Tax Rate">
                <XlTd>
                  <XlInput value={recapRate} onChange={setRecapRate} />
                </XlTd>
              </XlRow>
              <XlRow n="25" label="Disposition Price (0 = exit cap)">
                <XlTd>
                  <XlInput value={saleOverride} onChange={setSaleOverride} />
                </XlTd>
              </XlRow>
              <XlRow n="" label="Exit cap if price is 0">
                <XlTd>
                  <XlInput value={exitCap} onChange={setExitCap} />
                </XlTd>
              </XlRow>
              <XlRow n="26" label="Disposition Cost of Sale (%)">
                <XlTd>
                  <XlInput value={saleCostPct} onChange={setSaleCostPct} />
                </XlTd>
              </XlRow>
              <XlRow n="" label="NPV hurdle (%)">
                <XlTd>
                  <XlInput value={hurdle} onChange={setHurdle} />
                </XlTd>
              </XlRow>
              <XlSection span={3}>Potential Rental Income & Escalations</XlSection>
              <XlRow n="27" label="Year 1 Potential Rental Income">
                <XlTd>
                  <XlInput value={pri0} onChange={setPri0} />
                </XlTd>
              </XlRow>
              <XlRow n="" label="PRI growth (%)">
                <XlTd>
                  <XlInput value={priG} onChange={setPriG} />
                </XlTd>
              </XlRow>
              <XlRow n="28" label="Other Income (Collectable)">
                <XlTd>
                  <XlInput value={other0} onChange={setOther0} />
                </XlTd>
              </XlRow>
              <XlRow n="29" label="Annual Vacancy Rates (% of #27)">
                <XlTd>
                  <XlInput value={vac} onChange={setVac} />
                </XlTd>
              </XlRow>
              <XlSection span={3}>Operating Expenses & Escalations</XlSection>
              <XlRow n="31" label="Year 1 Total Operating Expenses">
                <XlTd>
                  <XlInput value={opex0} onChange={setOpex0} />
                </XlTd>
              </XlRow>
              <XlRow n="" label="Opex growth (%)">
                <XlTd>
                  <XlInput value={opexG} onChange={setOpexG} />
                </XlTd>
              </XlRow>
              <XlRow n="" label="Funded reserves">
                <XlTd>
                  <XlInput value={reserves} onChange={setReserves} />
                </XlTd>
              </XlRow>
            </XlGrid>
          </div>
        )}

        {tab === "cf" && (
          <div className="overflow-x-auto">
            <XlGrid cols="260px 140px">
              <XlHead span={2}>Cash Flow Analysis: Summary</XlHead>
              <XlSection span={2}>Initial investment</XlSection>
              <XlRow label="Acquisition Price">
                <XlTd kind="calc">
                  <XlOut>{money(price, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Plus: Acquisition Costs">
                <XlTd kind="calc">
                  <XlOut>{money(acq, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Plus: Loan Costs">
                <XlTd kind="calc">
                  <XlOut>{money(loanCosts, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Less: Mortgages">
                <XlTd kind="calc">
                  <XlOut>{money(loan, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Equals: Initial Investment">
                <XlTd kind="calc">
                  <XlOut>{money(model.equity, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlSection span={2}>Mortgage Data</XlSection>
              <XlRow label="Periodic Payment">
                <XlTd kind="calc">
                  <XlOut>{money(model.payment, 2)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Annual Debt Service">
                <XlTd kind="calc">
                  <XlOut>{money(model.ads, 0)}</XlOut>
                </XlTd>
              </XlRow>
            </XlGrid>
            <table className="mt-6 w-full min-w-[880px] border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="border border-[#16365c] bg-[#1f4e79] px-2 py-1 text-left font-normal text-white">End of Year</th>
                  {yearHead.map((y) => (
                    <th key={y} className="border border-[#16365c] bg-[#1f4e79] px-2 py-1 font-normal text-white">
                      {y}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["1 Potential Rental Income", (r) => r.pri],
                    ["2 Less: Vacancy & Credit Losses", (r) => r.vacancy],
                    ["3 Effective Rental Income", (r) => r.eri],
                    ["4 Plus: Other Income", (r) => r.other],
                    ["5 Gross Operating Income", (r) => r.goi],
                    ["6 Less: Operating Expenses", (r) => r.opex],
                    ["7 NET OPERATING INCOME", (r) => r.noi],
                    ["8 Less: Interest", (r) => r.interest],
                    ["11 Less: Cost Recovery", (r) => r.cr],
                    ["15 Taxable Income", (r) => r.taxable],
                    ["16 Tax (Savings)", (r) => r.tax],
                    ["18 Annual Debt Service", (r) => r.ads],
                    ["22 CASH FLOW BEFORE TAXES", (r) => r.cfbt],
                    ["24 CASH FLOW AFTER TAXES", (r) => r.cfat],
                  ] as Array<[string, (r: (typeof model.ops)[number]) => number]>
                ).map(([label, pick]) => (
                  <tr key={label}>
                    <td className="border border-[#d6dce4] bg-[#f8f8f8] px-2 py-1">{label}</td>
                    {model.ops.map((r) => (
                      <td key={r.y} className="border border-[#8faadc] bg-[#ddebf7] px-2 py-1 text-right">
                        {money(pick(r), 0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "sale" && (
          <div className="max-w-xl">
            <XlGrid cols="40px 320px 160px">
              <XlHead span={3}>Cash Flow Analysis: Cash Sale</XlHead>
              <XlRow n="1" label="Principal Balance — 1st Mortgage">
                <XlTd kind="calc">
                  <XlOut>{money(model.exitBal, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="4" label="PROJECTED SALES PRICE">
                <XlTd kind="calc">
                  <XlOut>{money(model.sale, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="5" label="Basis at Acquisition">
                <XlTd kind="calc">
                  <XlOut>{money(model.basis, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="7" label="Less: Cost Recovery">
                <XlTd kind="calc">
                  <XlOut>{money(model.crTaken, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="9" label="Adjusted Basis at Sale">
                <XlTd kind="calc">
                  <XlOut>{money(model.adj, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="11" label="Less: Costs of Sale">
                <XlTd kind="calc">
                  <XlOut>{money(model.costSale, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="13" label="Gain or (Loss)">
                <XlTd kind="calc">
                  <XlOut>{money(model.gain, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="14" label="Straight Line Cost Recovery (limited to gain)">
                <XlTd kind="calc">
                  <XlOut>{money(model.slRecap, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="16" label="Capital Gain from Appreciation">
                <XlTd kind="calc">
                  <XlOut>{money(model.capGain, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="17" label="Unamortized Loan Fees/Costs">
                <XlTd kind="calc">
                  <XlOut>{money(model.feesLeft, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="22" label="Less: Mortgage Balances">
                <XlTd kind="calc">
                  <XlOut>{money(model.exitBal, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="24" label="Sale Proceeds Before Tax">
                <XlTd kind="calc">
                  <XlOut>{money(model.sbt, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="25" label="Tax on Ordinary Income">
                <XlTd kind="calc">
                  <XlOut>{money(model.taxOrd, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="26" label="Tax on Cost Recovery Recapture">
                <XlTd kind="calc">
                  <XlOut>{money(model.taxRecap, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="27" label="Tax on Capital Gain">
                <XlTd kind="calc">
                  <XlOut>{money(model.taxCg, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow n="28" label="Sale Proceeds After Tax">
                <XlTd kind="calc">
                  <XlOut>{money(model.sat, 0)}</XlOut>
                </XlTd>
              </XlRow>
            </XlGrid>
          </div>
        )}

        {tab === "mip" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="border border-[#16365c] bg-[#1f4e79] px-2 py-1 text-left font-normal text-white" colSpan={3}>
                    Before Tax
                  </th>
                </tr>
                <tr>
                  <th className="border border-[#1f4e79] bg-[#2e75b6] px-2 text-white">EOY</th>
                  <th className="border border-[#1f4e79] bg-[#2e75b6] px-2 text-white">$</th>
                  <th className="border border-[#1f4e79] bg-[#2e75b6] px-2 text-white">Sale</th>
                </tr>
              </thead>
              <tbody>
                {model.bt.map((cf, i) => (
                  <tr key={i}>
                    <td className="border border-[#d6dce4] px-2">{i}</td>
                    <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">
                      {money(i === nHold ? (model.ops[i - 1]?.cfbt ?? 0) : cf, 0)}
                    </td>
                    <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">{i === nHold ? money(model.sbt, 0) : ""}</td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-[#d6dce4] bg-[#f8f8f8] px-2">IRR =</td>
                  <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right" colSpan={2}>
                    {model.irrBt == null ? "—" : pct(model.irrBt)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#d6dce4] bg-[#f8f8f8] px-2">NPV @ {num(hurdle, 1)}%</td>
                  <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right" colSpan={2}>
                    {money(model.npvBt, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="border border-[#16365c] bg-[#1f4e79] px-2 py-1 text-left font-normal text-white" colSpan={3}>
                    After Tax
                  </th>
                </tr>
                <tr>
                  <th className="border border-[#1f4e79] bg-[#2e75b6] px-2 text-white">EOY</th>
                  <th className="border border-[#1f4e79] bg-[#2e75b6] px-2 text-white">$</th>
                  <th className="border border-[#1f4e79] bg-[#2e75b6] px-2 text-white">Sale</th>
                </tr>
              </thead>
              <tbody>
                {model.at.map((cf, i) => (
                  <tr key={i}>
                    <td className="border border-[#d6dce4] px-2">{i}</td>
                    <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">
                      {money(i === nHold ? (model.ops[i - 1]?.cfat ?? 0) : cf, 0)}
                    </td>
                    <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">{i === nHold ? money(model.sat, 0) : ""}</td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-[#d6dce4] bg-[#f8f8f8] px-2">IRR =</td>
                  <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right" colSpan={2}>
                    {model.irrAt == null ? "—" : pct(model.irrAt)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#d6dce4] bg-[#f8f8f8] px-2">NPV @ {num(hurdle, 1)}%</td>
                  <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right" colSpan={2}>
                    {money(model.npvAt, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
            <XlGrid cols="240px 140px">
              <XlHead span={2}>Measures of Investment Performance</XlHead>
              <XlRow label="Acquisition Cap Rate">
                <XlTd kind="calc">
                  <XlOut>{pct(model.capIn)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Loan to Value">
                <XlTd kind="calc">
                  <XlOut>{pct(model.ltv)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Debt Service Coverage Ratio">
                <XlTd kind="calc">
                  <XlOut>
                    {num(model.dcr, 2)} {model.dcr < dcrMin ? `(below ${num(dcrMin, 2)})` : ""}
                  </XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Before Tax Cash-on-Cash">
                <XlTd kind="calc">
                  <XlOut>{pct(model.cocBt)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="After Tax Cash-on-Cash">
                <XlTd kind="calc">
                  <XlOut>{pct(model.cocAt)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Gross Rent Multiplier">
                <XlTd kind="calc">
                  <XlOut>{num(model.grm, 2)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Max LTV check">
                <XlTd kind="calc">
                  <XlOut>{model.ltv * 100 <= ltvMax + 0.05 ? "Inside max" : "Above max"}</XlOut>
                </XlTd>
              </XlRow>
            </XlGrid>
          </div>
        )}
      </Workbook>
    </Page>
  )
}
