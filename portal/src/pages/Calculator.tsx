import { useMemo, useState } from "react"
import { amortize, fv, irr, mean, median, nper, npv, pmt, pv, rate, stdev } from "../lib/finance"
import { money, num, pct } from "../lib/format"
import { Page } from "../components/ui"
import { Workbook, XlGrid, XlHead, XlInput, XlOut, XlRow, XlSection, XlTd } from "../components/workbook"

export type CalcTab =
  | "tvm"
  | "chain"
  | "npv"
  | "annuity"
  | "diff"
  | "amort"
  | "annual"
  | "stats"
  | "math"
  | "accum"

const TABS: { id: CalcTab; label: string }[] = [
  { id: "tvm", label: "(3) TVM" },
  { id: "chain", label: "(4) TVM Chain" },
  { id: "npv", label: "(5) NPV-IRR" },
  { id: "annuity", label: "(6) Annuities" },
  { id: "diff", label: "(7) Differential CF" },
  { id: "amort", label: "(8) Amortization" },
  { id: "annual", label: "(9) Annual Summary" },
  { id: "stats", label: "(12) Statistics" },
  { id: "math", label: "(13) Basic Math" },
  { id: "accum", label: "(14) Capital Accumulation" },
]

type Solve = "PV" | "PMT" | "FV" | "I/YR" | "Years"

type TvmState = {
  ppy: number
  years: number
  iyr: number
  present: number
  payment: number
  future: number
  begin: number
  solve: Solve
}

function solveTvm(s: TvmState) {
  const type = s.begin ? 1 : 0
  const n = s.years * s.ppy
  const r = s.iyr / 100 / s.ppy
  const out = { ...s, n, solved: NaN as number }
  try {
    if (s.solve === "FV") out.solved = fv(r, n, s.payment, s.present, type)
    else if (s.solve === "PV") out.solved = pv(r, n, s.payment, s.future, type)
    else if (s.solve === "PMT") out.solved = pmt(r, n, s.present, s.future, type)
    else if (s.solve === "Years") out.solved = nper(r, s.payment, s.present, s.future, type) / s.ppy
    else out.solved = rate(n, s.payment, s.present, s.future, type) * s.ppy * 100
  } catch {
    out.solved = NaN
  }
  return out
}

function TvmBlock({
  s,
  set,
  title,
}: {
  s: TvmState
  set: (patch: Partial<TvmState>) => void
  title?: string
}) {
  const r = solveTvm(s)
  const show = (key: Solve, raw: number) => (s.solve === key ? r.solved : raw)
  const fmtMoney = (key: Solve, raw: number) => money(show(key, raw), 2)
  return (
    <XlGrid cols="220px 160px">
      {title ? <XlHead span={2}>{title}</XlHead> : null}
      <XlSection span={2}>Input</XlSection>
      <XlRow label="N (periods)">
        <XlTd kind="calc">
          <XlOut>{num(r.n, 0)}</XlOut>
        </XlTd>
      </XlRow>
      <XlRow label="Payments Per Year">
        <XlTd>
          <XlInput value={s.ppy} onChange={(n) => set({ ppy: n })} />
        </XlTd>
      </XlRow>
      <XlRow label="Years">
        <XlTd kind={s.solve === "Years" ? "calc" : "input"}>
          {s.solve === "Years" ? <XlOut>{num(r.solved, 3)}</XlOut> : <XlInput value={s.years} onChange={(n) => set({ years: n })} />}
        </XlTd>
      </XlRow>
      <XlRow label="I/YR">
        <XlTd kind={s.solve === "I/YR" ? "calc" : "input"}>
          {s.solve === "I/YR" ? <XlOut>{num(r.solved, 3)}%</XlOut> : <XlInput value={s.iyr} onChange={(n) => set({ iyr: n })} />}
        </XlTd>
      </XlRow>
      <XlRow label="PV">
        <XlTd kind={s.solve === "PV" ? "calc" : "input"}>
          {s.solve === "PV" ? <XlOut>{fmtMoney("PV", s.present)}</XlOut> : <XlInput value={s.present} onChange={(n) => set({ present: n })} />}
        </XlTd>
      </XlRow>
      <XlRow label="PMT">
        <XlTd kind={s.solve === "PMT" ? "calc" : "input"}>
          {s.solve === "PMT" ? <XlOut>{fmtMoney("PMT", s.payment)}</XlOut> : <XlInput value={s.payment} onChange={(n) => set({ payment: n })} />}
        </XlTd>
      </XlRow>
      <XlRow label="FV">
        <XlTd kind={s.solve === "FV" ? "calc" : "input"}>
          {s.solve === "FV" ? <XlOut>{fmtMoney("FV", s.future)}</XlOut> : <XlInput value={s.future} onChange={(n) => set({ future: n })} />}
        </XlTd>
      </XlRow>
      <XlRow label="Beg 1 / End 0">
        <XlTd>
          <XlInput value={s.begin} onChange={(n) => set({ begin: n ? 1 : 0 })} />
        </XlTd>
      </XlRow>
      <XlRow label="Select Calculation">
        <XlTd>
          <select
            className="w-full border border-[#bf8f00] bg-[#fff2cc] px-2 py-1"
            value={s.solve}
            onChange={(e) => set({ solve: e.target.value as Solve })}
          >
            {(["PV", "PMT", "FV", "I/YR", "Years"] as Solve[]).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </XlTd>
      </XlRow>
    </XlGrid>
  )
}

const defaultTvm = (): TvmState => ({
  ppy: 12,
  years: 5,
  iyr: 8,
  present: -250000,
  payment: 5000,
  future: 0,
  begin: 0,
  solve: "FV",
})

export function Calculator({ tab = "tvm" }: { tab?: CalcTab }) {
  const [active, setActive] = useState<CalcTab>(tab)

  const [tvm, setTvm] = useState<TvmState>(defaultTvm)
  const [chain, setChain] = useState<TvmState[]>(() => Array.from({ length: 5 }, defaultTvm))

  const [hold, setHold] = useState(5)
  const [hurdle, setHurdle] = useState(10)
  const [cfs, setCfs] = useState<number[]>(() => [-100000, 12000, 14000, 16000, 18000, 0, 0, 0, 0, 0, 0])
  const [sales, setSales] = useState<number[]>(() => [0, 0, 0, 0, 0, 120000, 0, 0, 0, 0, 0])

  const [ppyAnn, setPpyAnn] = useState(12)
  const [hurdleAnn, setHurdleAnn] = useState(10)
  const [annAmt, setAnnAmt] = useState<number[]>(() => [-80000, 1200, 0, 0, 0, 0])
  const [annTimes, setAnnTimes] = useState<number[]>(() => [1, 60, 0, 0, 0, 0])

  const [diffHurdle, setDiffHurdle] = useState(10)
  const [flowA, setFlowA] = useState<number[]>(() => [-80000, 10000, 10000, 10000, 10000, 90000, 0, 0, 0, 0, 0])
  const [flowB, setFlowB] = useState<number[]>(() => [-80000, 8000, 8000, 8000, 8000, 85000, 0, 0, 0, 0, 0])

  const [loan, setLoan] = useState(800000)
  const [ratePct, setRatePct] = useState(6.5)
  const [amortYrs, setAmortYrs] = useState(25)
  const [ppyLoan, setPpyLoan] = useState(12)

  const [statVals, setStatVals] = useState<number[]>(() => Array(40).fill(0))

  const [addA, setAddA] = useState(100)
  const [addB, setAddB] = useState(25)
  const [subA, setSubA] = useState(100)
  const [subB, setSubB] = useState(25)
  const [mulA, setMulA] = useState(12)
  const [mulB, setMulB] = useState(8)
  const [divA, setDivA] = useState(73464)
  const [divB, setDivB] = useState(0.07)
  const [base, setBase] = useState(100)
  const [pctN, setPctN] = useState(7)
  const [v1, setV1] = useState(100)
  const [v2, setV2] = useState(107)

  const [accHold, setAccHold] = useState(5)
  const [safe, setSafe] = useState(4)
  const [reinvest, setReinvest] = useState(8)
  const [accCf, setAccCf] = useState<number[]>(() => [-100000, 12000, 14000, 16000, 18000, 20000])
  const [accSale, setAccSale] = useState<number[]>(() => [0, 0, 0, 0, 0, 120000])

  const npvSeries = useMemo(() => {
    const years = Math.max(0, Math.min(10, Math.round(hold)))
    return Array.from({ length: years + 1 }, (_, i) => (cfs[i] ?? 0) + (sales[i] ?? 0))
  }, [hold, cfs, sales])
  const npvVal = useMemo(() => npv(hurdle / 100, npvSeries), [hurdle, npvSeries])
  const irrVal = useMemo(() => irr(npvSeries), [npvSeries])

  const annuitySeries = useMemo(() => {
    const out: number[] = []
    annAmt.forEach((amt, i) => {
      const times = Math.max(0, Math.round(annTimes[i] ?? 0))
      for (let k = 0; k < times; k++) out.push(amt)
    })
    return out
  }, [annAmt, annTimes])
  const annNpv = useMemo(() => {
    const r = hurdleAnn / 100 / ppyAnn
    return annuitySeries.reduce((s, cf, t) => s + cf / (1 + r) ** t, 0)
  }, [annuitySeries, hurdleAnn, ppyAnn])
  const annIrr = useMemo(() => {
    const periodic = irr(annuitySeries)
    return periodic == null ? null : periodic * ppyAnn
  }, [annuitySeries, ppyAnn])

  const diffRows = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => {
      const a = flowA[i] ?? 0
      const b = flowB[i] ?? 0
      return { a, b, d: a - b }
    })
  }, [flowA, flowB])
  const seriesA = diffRows.map((r) => r.a)
  const seriesB = diffRows.map((r) => r.b)
  const seriesD = diffRows.map((r) => r.d)
  const npvA = npv(diffHurdle / 100, seriesA)
  const npvB = npv(diffHurdle / 100, seriesB)
  const npvD = npv(diffHurdle / 100, seriesD)
  const irrD = irr(seriesD)

  const amort = useMemo(
    () => amortize(loan, ratePct / 100, amortYrs, ppyLoan),
    [loan, ratePct, amortYrs, ppyLoan],
  )
  const annual = useMemo(() => {
    const map = new Map<number, { begin: number; interest: number; principal: number; ending: number }>()
    amort.rows.forEach((r) => {
      const cur = map.get(r.year) ?? { begin: r.beginning, interest: 0, principal: 0, ending: r.ending }
      if (!map.has(r.year)) cur.begin = r.beginning
      cur.interest += r.interest
      cur.principal += r.principal
      cur.ending = r.ending
      map.set(r.year, cur)
    })
    return [...map.entries()].map(([year, v]) => ({ year, ...v }))
  }, [amort])

  const filledStats = statVals.filter((n) => n !== 0)
  const statMean = mean(filledStats)
  const statMed = median(filledStats)
  const statSd = stdev(filledStats)

  const accum = useMemo(() => {
    const n = accHold
    const rows = Array.from({ length: n + 1 }, (_, t) => {
      const cf = (accCf[t] ?? 0) + (t === n ? (accSale[t] ?? 0) : (accSale[t] ?? 0))
      const periodsLeft = n - t
      const grown = cf > 0 ? cf * (1 + reinvest / 100) ** periodsLeft : cf / (1 + safe / 100) ** t
      return { t, cf, grown }
    })
    const tv = rows.filter((r) => r.cf > 0).reduce((s, r) => s + r.cf * (1 + reinvest / 100) ** (n - r.t), 0)
    const pvNeg = rows.filter((r) => r.cf < 0).reduce((s, r) => s + r.cf / (1 + safe / 100) ** r.t, 0)
    const fmrr = pvNeg < 0 && n > 0 ? (tv / -pvNeg) ** (1 / n) - 1 : null
    return { rows, tv, pvNeg, fmrr, irr: irr(rows.map((r) => r.cf)) }
  }, [accHold, accCf, accSale, safe, reinvest])

  return (
    <Page
      kicker="Financial calculator"
      title="CCIM-style calculator workbook"
      source="Independent recreation of the V 14.3 tab layout — yellow cells are inputs, blue cells calculate"
    >
      <Workbook
        title="Financial Calculator"
        version="Study recreation · V 14.3 tab order"
        tabs={TABS}
        active={active}
        onTab={(id) => setActive(id as CalcTab)}
      >
        {active === "tvm" && (
          <div className="max-w-xl">
            <p className="mb-3 text-xs text-[#595959]">
              Sign convention matches a handheld: money out is negative. N = Years × Payments Per Year. The
              solved key is the blue cell.
            </p>
            <TvmBlock s={tvm} set={(patch) => setTvm((cur) => ({ ...cur, ...patch }))} title="Time Value of Money" />
          </div>
        )}

        {active === "chain" && (
          <div className="overflow-x-auto">
            <p className="mb-3 text-xs text-[#595959]">Five independent TVM columns — same keys as tab (3).</p>
            <div className="flex gap-4">
              {chain.map((col, i) => (
                <div key={i} className="min-w-[260px]">
                  <TvmBlock
                    title={`Step ${i + 1}`}
                    s={col}
                    set={(patch) => setChain((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "npv" && (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <XlGrid cols="70px 140px 40px 140px">
              <XlHead span={4}>Annual NPV and IRR Calculations</XlHead>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Holding Period (Years)</td>
                <XlTd>
                  <XlInput value={hold} onChange={setHold} />
                </XlTd>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">NPV Discount Rate</td>
                <XlTd>
                  <XlInput value={hurdle} onChange={setHurdle} />
                </XlTd>
              </tr>
              <tr>
                <td className="border border-[#d6dce4] bg-[#1f4e79] px-2 py-1 text-white">EOY</td>
                <td className="border border-[#8faadc] bg-[#1f4e79] px-2 py-1 text-white">Cash Flows</td>
                <td className="border border-[#8faadc] bg-[#1f4e79] px-2 py-1 text-center text-white">+</td>
                <td className="border border-[#8faadc] bg-[#1f4e79] px-2 py-1 text-white">Sale Proceeds</td>
              </tr>
              {Array.from({ length: 11 }, (_, i) => (
                <tr key={i}>
                  <td className="border border-[#d6dce4] px-2 text-center">{i}</td>
                  <XlTd>
                    <XlInput
                      value={cfs[i] ?? 0}
                      onChange={(n) => setCfs((rows) => rows.map((v, idx) => (idx === i ? n : v)))}
                    />
                  </XlTd>
                  <td className="border border-[#d6dce4] text-center text-[#7f7f7f]">+</td>
                  <XlTd>
                    <XlInput
                      value={sales[i] ?? 0}
                      onChange={(n) => setSales((rows) => rows.map((v, idx) => (idx === i ? n : v)))}
                    />
                  </XlTd>
                </tr>
              ))}
            </XlGrid>
            <XlGrid cols="180px 140px">
              <XlSection span={2}>Results</XlSection>
              <XlRow label="Net Present Value">
                <XlTd kind="calc">
                  <XlOut>{money(npvVal, 2)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Internal Rate of Return">
                <XlTd kind="calc">
                  <XlOut>{irrVal == null ? "—" : pct(irrVal)}</XlOut>
                </XlTd>
              </XlRow>
            </XlGrid>
          </div>
        )}

        {active === "annuity" && (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <XlGrid cols="80px 140px 140px">
              <XlHead span={3}>Annuities NPV and IRR</XlHead>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Periods Per Year</td>
                <XlTd>
                  <XlInput value={ppyAnn} onChange={setPpyAnn} />
                </XlTd>
                <td />
              </tr>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">NPV Discount Rate</td>
                <XlTd>
                  <XlInput value={hurdleAnn} onChange={setHurdleAnn} />
                </XlTd>
                <td />
              </tr>
              <tr>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">#</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">Amount</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white"># of Times</td>
              </tr>
              {annAmt.map((amt, i) => (
                <tr key={i}>
                  <td className="border border-[#d6dce4] px-2 text-center">{i}</td>
                  <XlTd>
                    <XlInput value={amt} onChange={(n) => setAnnAmt((rows) => rows.map((v, idx) => (idx === i ? n : v)))} />
                  </XlTd>
                  <XlTd>
                    <XlInput value={annTimes[i] ?? 0} onChange={(n) => setAnnTimes((rows) => rows.map((v, idx) => (idx === i ? n : v)))} />
                  </XlTd>
                </tr>
              ))}
            </XlGrid>
            <XlGrid cols="200px 140px">
              <XlRow label="Expanded periods">
                <XlTd kind="calc">
                  <XlOut>{annuitySeries.length}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Net Present Value">
                <XlTd kind="calc">
                  <XlOut>{money(annNpv, 2)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="IRR (annualized)">
                <XlTd kind="calc">
                  <XlOut>{annIrr == null ? "—" : pct(annIrr)}</XlOut>
                </XlTd>
              </XlRow>
            </XlGrid>
          </div>
        )}

        {active === "diff" && (
          <div>
            <XlGrid cols="60px 140px 30px 140px 30px 140px">
              <XlHead span={6}>Differential Cash Flow Analysis</XlHead>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3" colSpan={2}>
                  NPV Discount Rate
                </td>
                <XlTd>
                  <XlInput value={diffHurdle} onChange={setDiffHurdle} />
                </XlTd>
                <td colSpan={3} />
              </tr>
              <tr>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">EOY</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">“A” Cash Flows</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-center text-white">−</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">“B” Cash Flows</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-center text-white">=</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">Differential</td>
              </tr>
              {diffRows.map((row, i) => (
                <tr key={i}>
                  <td className="border border-[#d6dce4] px-2 text-center">{i}</td>
                  <XlTd>
                    <XlInput value={row.a} onChange={(n) => setFlowA((rows) => rows.map((v, idx) => (idx === i ? n : v)))} />
                  </XlTd>
                  <td className="border border-[#d6dce4] text-center">−</td>
                  <XlTd>
                    <XlInput value={row.b} onChange={(n) => setFlowB((rows) => rows.map((v, idx) => (idx === i ? n : v)))} />
                  </XlTd>
                  <td className="border border-[#d6dce4] text-center">=</td>
                  <XlTd kind="calc">
                    <XlOut>{money(row.d, 0)}</XlOut>
                  </XlTd>
                </tr>
              ))}
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-2">NPV =</td>
                <XlTd kind="calc">
                  <XlOut>{money(npvA, 0)}</XlOut>
                </XlTd>
                <td />
                <XlTd kind="calc">
                  <XlOut>{money(npvB, 0)}</XlOut>
                </XlTd>
                <td />
                <XlTd kind="calc">
                  <XlOut>{money(npvD, 0)}</XlOut>
                </XlTd>
              </tr>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-2" colSpan={5}>
                  Incremental IRR (A − B)
                </td>
                <XlTd kind="calc">
                  <XlOut>{irrD == null ? "—" : pct(irrD)}</XlOut>
                </XlTd>
              </tr>
            </XlGrid>
          </div>
        )}

        {(active === "amort" || active === "annual") && (
          <div>
            <div className="mb-4 max-w-md">
              <XlGrid cols="220px 160px">
                <XlHead span={2}>{active === "amort" ? "Mortgage Periodic Amortization" : "Mortgage Annual Summary"}</XlHead>
                <XlRow label="Payments Per Year">
                  <XlTd>
                    <XlInput value={ppyLoan} onChange={setPpyLoan} />
                  </XlTd>
                </XlRow>
                <XlRow label="Amortization (In Years)">
                  <XlTd>
                    <XlInput value={amortYrs} onChange={setAmortYrs} />
                  </XlTd>
                </XlRow>
                <XlRow label="Loan Amount">
                  <XlTd>
                    <XlInput value={loan} onChange={setLoan} />
                  </XlTd>
                </XlRow>
                <XlRow label="Annual Interest Rate">
                  <XlTd>
                    <XlInput value={ratePct} onChange={setRatePct} />
                  </XlTd>
                </XlRow>
                <XlRow label="Periodic Payment">
                  <XlTd kind="calc">
                    <XlOut>{money(amort.payment, 2)}</XlOut>
                  </XlTd>
                </XlRow>
                <XlRow label="Annual Debt Service">
                  <XlTd kind="calc">
                    <XlOut>{money(amort.payment * ppyLoan, 2)}</XlOut>
                  </XlTd>
                </XlRow>
              </XlGrid>
            </div>
            <div className="max-h-[480px] overflow-auto">
              {active === "amort" ? (
                <table className="w-full border-collapse text-[12px]">
                  <thead className="sticky top-0 bg-[#1f4e79] text-white">
                    <tr>
                      {["Period", "Beginning Balance", "Interest Payment", "Principal Payment", "Ending Balance"].map((h) => (
                        <th key={h} className="border border-[#16365c] px-2 py-1 text-right font-normal first:text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {amort.rows.slice(0, 360).map((r) => (
                      <tr key={r.period}>
                        <td className="border border-[#d6dce4] px-2">{r.period}</td>
                        <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">{money(r.beginning, 2)}</td>
                        <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">{money(r.interest, 2)}</td>
                        <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">{money(r.principal, 2)}</td>
                        <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">{money(r.ending, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full border-collapse text-[12px]">
                  <thead className="sticky top-0 bg-[#1f4e79] text-white">
                    <tr>
                      {["Year", "Beginning Balance", "Interest Payment", "Principal Payment", "Ending Balance"].map((h) => (
                        <th key={h} className="border border-[#16365c] px-2 py-1 text-right font-normal first:text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {annual.map((r) => (
                      <tr key={r.year}>
                        <td className="border border-[#d6dce4] px-2">{r.year}</td>
                        <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">{money(r.begin, 2)}</td>
                        <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">{money(r.interest, 2)}</td>
                        <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">{money(r.principal, 2)}</td>
                        <td className="border border-[#8faadc] bg-[#ddebf7] px-2 text-right">{money(r.ending, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {active === "stats" && (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="grid grid-cols-2 gap-x-6">
              {[0, 1].map((col) => (
                <XlGrid key={col} cols="70px 140px">
                  <tr>
                    <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">Item #</td>
                    <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">Input</td>
                  </tr>
                  {Array.from({ length: 20 }, (_, i) => {
                    const idx = col * 20 + i
                    return (
                      <tr key={idx}>
                        <td className="border border-[#d6dce4] px-2 text-center">{idx + 1}</td>
                        <XlTd>
                          <XlInput
                            value={statVals[idx] ?? 0}
                            onChange={(n) => setStatVals((rows) => rows.map((v, j) => (j === idx ? n : v)))}
                          />
                        </XlTd>
                      </tr>
                    )
                  })}
                </XlGrid>
              ))}
            </div>
            <XlGrid cols="160px 140px">
              <XlHead span={2}>Basic Statistical Functions</XlHead>
              <XlRow label="Mean">
                <XlTd kind="calc">
                  <XlOut>{num(statMean, 4)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Median">
                <XlTd kind="calc">
                  <XlOut>{num(statMed, 4)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Std. Deviation">
                <XlTd kind="calc">
                  <XlOut>{num(statSd, 4)}</XlOut>
                </XlTd>
              </XlRow>
              <XlRow label="Count (nonzero)">
                <XlTd kind="calc">
                  <XlOut>{filledStats.length}</XlOut>
                </XlTd>
              </XlRow>
            </XlGrid>
          </div>
        )}

        {active === "math" && (
          <div className="grid gap-6 md:grid-cols-2">
            <XlGrid cols="160px 120px 30px 120px 30px 120px">
              <XlHead span={6}>Basic Math Functions</XlHead>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Addition</td>
                <XlTd>
                  <XlInput value={addA} onChange={setAddA} />
                </XlTd>
                <td className="text-center">+</td>
                <XlTd>
                  <XlInput value={addB} onChange={setAddB} />
                </XlTd>
                <td className="text-center">=</td>
                <XlTd kind="calc">
                  <XlOut>{num(addA + addB, 4)}</XlOut>
                </XlTd>
              </tr>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Subtraction</td>
                <XlTd>
                  <XlInput value={subA} onChange={setSubA} />
                </XlTd>
                <td className="text-center">−</td>
                <XlTd>
                  <XlInput value={subB} onChange={setSubB} />
                </XlTd>
                <td className="text-center">=</td>
                <XlTd kind="calc">
                  <XlOut>{num(subA - subB, 4)}</XlOut>
                </XlTd>
              </tr>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Multiplication</td>
                <XlTd>
                  <XlInput value={mulA} onChange={setMulA} />
                </XlTd>
                <td className="text-center">×</td>
                <XlTd>
                  <XlInput value={mulB} onChange={setMulB} />
                </XlTd>
                <td className="text-center">=</td>
                <XlTd kind="calc">
                  <XlOut>{num(mulA * mulB, 4)}</XlOut>
                </XlTd>
              </tr>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Division</td>
                <XlTd>
                  <XlInput value={divA} onChange={setDivA} />
                </XlTd>
                <td className="text-center">/</td>
                <XlTd>
                  <XlInput value={divB} onChange={setDivB} />
                </XlTd>
                <td className="text-center">=</td>
                <XlTd kind="calc">
                  <XlOut>{divB ? num(divA / divB, 4) : "—"}</XlOut>
                </XlTd>
              </tr>
            </XlGrid>
            <XlGrid cols="160px 120px 30px 120px 30px 120px">
              <XlHead span={6}>Percent</XlHead>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Add %</td>
                <XlTd>
                  <XlInput value={base} onChange={setBase} />
                </XlTd>
                <td className="text-center">+</td>
                <XlTd>
                  <XlInput value={pctN} onChange={setPctN} />
                </XlTd>
                <td className="text-center">=</td>
                <XlTd kind="calc">
                  <XlOut>{num(base * (1 + pctN / 100), 4)}</XlOut>
                </XlTd>
              </tr>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Subtract %</td>
                <XlTd>
                  <XlInput value={base} onChange={setBase} />
                </XlTd>
                <td className="text-center">−</td>
                <XlTd>
                  <XlInput value={pctN} onChange={setPctN} />
                </XlTd>
                <td className="text-center">=</td>
                <XlTd kind="calc">
                  <XlOut>{num(base * (1 - pctN / 100), 4)}</XlOut>
                </XlTd>
              </tr>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Value 1</td>
                <XlTd>
                  <XlInput value={v1} onChange={setV1} />
                </XlTd>
                <td colSpan={4} />
              </tr>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Value 2</td>
                <XlTd>
                  <XlInput value={v2} onChange={setV2} />
                </XlTd>
                <td className="text-center">%</td>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">Change</td>
                <td className="text-center">=</td>
                <XlTd kind="calc">
                  <XlOut>{v1 ? num(((v2 - v1) / v1) * 100, 3) + "%" : "—"}</XlOut>
                </XlTd>
              </tr>
            </XlGrid>
          </div>
        )}

        {active === "accum" && (
          <div>
            <div className="mb-4 grid max-w-xl gap-4 sm:grid-cols-3">
              <XlGrid cols="160px 100px">
                <XlRow label="Holding Period">
                  <XlTd>
                    <XlInput value={accHold} onChange={(n) => setAccHold(Math.max(1, Math.min(10, n)))} />
                  </XlTd>
                </XlRow>
                <XlRow label="Safe Rate">
                  <XlTd>
                    <XlInput value={safe} onChange={setSafe} />
                  </XlTd>
                </XlRow>
                <XlRow label="Reinvestment Rate">
                  <XlTd>
                    <XlInput value={reinvest} onChange={setReinvest} />
                  </XlTd>
                </XlRow>
              </XlGrid>
            </div>
            <XlGrid cols="60px 140px 140px 160px 160px">
              <tr>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">EOY</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">Cash Flows</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">Sale Cash Flows</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">Net CF</td>
                <td className="border border-[#1f4e79] bg-[#1f4e79] px-2 text-white">Accumulated Value</td>
              </tr>
              {Array.from({ length: accHold + 1 }, (_, t) => (
                <tr key={t}>
                  <td className="border border-[#d6dce4] px-2 text-center">{t}</td>
                  <XlTd>
                    <XlInput
                      value={accCf[t] ?? 0}
                      onChange={(n) =>
                        setAccCf((rows) => {
                          const next = [...rows]
                          next[t] = n
                          return next
                        })
                      }
                    />
                  </XlTd>
                  <XlTd>
                    <XlInput
                      value={accSale[t] ?? 0}
                      onChange={(n) =>
                        setAccSale((rows) => {
                          const next = [...rows]
                          next[t] = n
                          return next
                        })
                      }
                    />
                  </XlTd>
                  <XlTd kind="calc">
                    <XlOut>{money(accum.rows[t]?.cf ?? 0, 0)}</XlOut>
                  </XlTd>
                  <XlTd kind="calc">
                    <XlOut>
                      {money(
                        (accum.rows[t]?.cf ?? 0) > 0
                          ? (accum.rows[t]?.cf ?? 0) * (1 + reinvest / 100) ** (accHold - t)
                          : (accum.rows[t]?.cf ?? 0) / (1 + safe / 100) ** t,
                        0,
                      )}
                    </XlOut>
                  </XlTd>
                </tr>
              ))}
              <XlRow n="" label="Terminal wealth (positives @ reinvest)">
                <XlTd kind="calc">
                  <XlOut>{money(accum.tv, 0)}</XlOut>
                </XlTd>
              </XlRow>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3" colSpan={4}>
                  IRR
                </td>
                <XlTd kind="calc">
                  <XlOut>{accum.irr == null ? "—" : pct(accum.irr)}</XlOut>
                </XlTd>
              </tr>
              <tr>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3" colSpan={4}>
                  FMRR (safe on outflows, reinvest on inflows)
                </td>
                <XlTd kind="calc">
                  <XlOut>{accum.fmrr == null ? "—" : pct(accum.fmrr)}</XlOut>
                </XlTd>
              </tr>
            </XlGrid>
          </div>
        )}
      </Workbook>
    </Page>
  )
}
