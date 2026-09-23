import { useMemo, useState } from "react"
import { fv, nper, pmt, pv, rate } from "../lib/finance"
import { money, num } from "../lib/format"
import { Card, Field, Page, Stat } from "../components/ui"

type Solve = "PV" | "PMT" | "FV" | "I/YR" | "Years"

export function Tvm() {
  const [ppy, setPpy] = useState(12)
  const [years, setYears] = useState(5)
  const [iyr, setIyr] = useState(8)
  const [present, setPresent] = useState(-250000)
  const [payment, setPayment] = useState(5000)
  const [future, setFuture] = useState(0)
  const [begin, setBegin] = useState(false)
  const [solve, setSolve] = useState<Solve>("FV")

  const result = useMemo(() => {
    const type = begin ? 1 : 0
    const n = years * ppy
    const r = iyr / 100 / ppy
    try {
      if (solve === "FV") return { label: "Future value", value: fv(r, n, payment, present, type), kind: "money" as const }
      if (solve === "PV") return { label: "Present value", value: pv(r, n, payment, future, type), kind: "money" as const }
      if (solve === "PMT") return { label: "Payment", value: pmt(r, n, present, future, type), kind: "money" as const }
      if (solve === "Years") return { label: "Years", value: nper(r, payment, present, future, type) / ppy, kind: "num" as const }
      return { label: "I/YR", value: rate(n, payment, present, future, type) * ppy, kind: "rate" as const }
    } catch {
      return { label: "Result", value: NaN, kind: "num" as const }
    }
  }, [ppy, years, iyr, present, payment, future, begin, solve])

  return (
    <Page kicker="Financial calculator" title="Time value of money" source="CCIM_Financial_Calculator tab (3) TVM">
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card>
          <div className="mb-4 flex flex-wrap gap-2">
            {(["PV", "PMT", "FV", "I/YR", "Years"] as Solve[]).map((s) => (
              <button
                key={s}
                onClick={() => setSolve(s)}
                className={`rounded-full px-3 py-1 text-xs ${solve === s ? "bg-ink text-cream" : "bg-cream text-ink"}`}
              >
                Solve {s}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Payments per year" value={ppy} onChange={setPpy} />
            <Field label="Years" value={years} onChange={setYears} />
            <Field label="I/YR (%)" value={iyr} onChange={setIyr} />
            <Field label="PV (outlay negative)" value={present} onChange={setPresent} />
            <Field label="PMT" value={payment} onChange={setPayment} />
            <Field label="FV" value={future} onChange={setFuture} />
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={begin} onChange={(e) => setBegin(e.target.checked)} />
            Begin mode (annuity due)
          </label>
        </Card>
        <div className="space-y-3">
          <Stat
            accent
            label={result.label}
            value={
              result.kind === "money"
                ? money(result.value, 2)
                : result.kind === "rate"
                  ? `${(result.value * 100).toFixed(3)}%`
                  : num(result.value, 3)
            }
          />
          <p className="text-xs text-ink/55">
            Sign convention matches a handheld calculator: money you pay out is negative. N = years × payments/year.
          </p>
        </div>
      </div>
    </Page>
  )
}
