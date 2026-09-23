import { useMemo, useState } from "react"
import { money, pct } from "../lib/format"
import { Card, Field, Page, Stat } from "../components/ui"

type Solve = "Value" | "NOI" | "Cap"

export function Irv() {
  const [noi, setNoi] = useState(50000)
  const [cap, setCap] = useState(6)
  const [value, setValue] = useState(833333)
  const [solve, setSolve] = useState<Solve>("Value")

  const out = useMemo(() => {
    if (solve === "Value") return { label: "Value (I ÷ R)", value: cap ? noi / (cap / 100) : NaN, kind: "money" as const }
    if (solve === "NOI") return { label: "NOI (R × V)", value: value * (cap / 100), kind: "money" as const }
    return { label: "Cap rate (I ÷ V)", value: value ? noi / value : NaN, kind: "pct" as const }
  }, [noi, cap, value, solve])

  return (
    <Page kicker="Module 7" title="IRV — income, rate, value" source="FOUND_M07_Investment_Analysis_Tools">
      <div className="mb-4 flex flex-wrap gap-2">
        {(["Value", "NOI", "Cap"] as Solve[]).map((s) => (
          <button
            key={s}
            onClick={() => setSolve(s)}
            className={`rounded-full px-3 py-1 text-xs ${solve === s ? "bg-ink text-cream" : "bg-paper border border-line"}`}
          >
            Solve {s}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="grid gap-3">
            <Field label="I — NOI" value={noi} onChange={setNoi} />
            <Field label="R — cap rate (%)" value={cap} onChange={setCap} />
            <Field label="V — value / price" value={value} onChange={setValue} />
          </div>
        </Card>
        <Stat
          accent
          label={out.label}
          value={out.kind === "money" ? money(out.value, 0) : pct(out.value)}
        />
      </div>
      <p className="mt-6 text-sm text-ink/60">I = R × V. If NOI is $50,000 and the market cap is 6%, indicated value is $833,333.</p>
    </Page>
  )
}
