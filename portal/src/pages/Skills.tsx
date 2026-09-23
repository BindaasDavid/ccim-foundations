import { useMemo, useState } from "react"
import { pct } from "../lib/format"
import { Page } from "../components/ui"

const skills = [
  "Education",
  "Market knowledge",
  "Negotiating",
  "Computer",
  "Organization",
  "Communication",
  "Planning",
  "Time management",
  "Experience",
  "Financial analysis",
]

const traits = [
  "Attention to detail",
  "Accessibility",
  "Charm / charisma",
  "Dependability",
  "Honesty",
  "Professionalism",
  "Ethics",
  "Vision",
  "Creativity",
  "Self motivated",
  "Understanding",
]

type Row = { name: string; rank: number; weight: number }

function score(rows: Row[]) {
  const total = rows.reduce((s, r) => s + r.rank * r.weight, 0)
  const max = rows.reduce((s, r) => s + 5 * r.weight, 0)
  return { total, max, pct: max ? total / max : 0 }
}

export function Skills() {
  const [sRows, setSRows] = useState<Row[]>(skills.map((name) => ({ name, rank: 3, weight: 2 })))
  const [tRows, setTRows] = useState<Row[]>(traits.map((name) => ({ name, rank: 3, weight: 2 })))
  const s = useMemo(() => score(sRows), [sRows])
  const t = useMemo(() => score(tRows), [tRows])

  function edit(set: typeof setSRows, i: number, patch: Partial<Row>) {
    set((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  }

  function table(title: string, rows: Row[], set: typeof setSRows, summary: ReturnType<typeof score>) {
    return (
      <div className="rounded-xl border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="font-serif text-lg">{title}</h3>
          <span className="text-sm">{pct(summary.pct, 0)} of max</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50">
              <th className="px-4 py-2">Item</th>
              <th className="px-2 py-2">Rank 1–5</th>
              <th className="px-2 py-2">Weight 1–3</th>
              <th className="px-4 py-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} className="border-t border-line bg-white">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="w-16 rounded border border-line px-2 py-1"
                    value={r.rank}
                    onChange={(e) => edit(set, i, { rank: Number(e.target.value) })}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min={1}
                    max={3}
                    className="w-16 rounded border border-line px-2 py-1"
                    value={r.weight}
                    onChange={(e) => edit(set, i, { weight: Number(e.target.value) })}
                  />
                </td>
                <td className="px-4 py-2 text-right">{r.rank * r.weight}</td>
              </tr>
            ))}
            <tr className="border-t border-line bg-gold/15 font-medium">
              <td className="px-4 py-2" colSpan={3}>
                Total score (sum of rank × weight)
              </td>
              <td className="px-4 py-2 text-right">{summary.total}</td>
            </tr>
            <tr className="border-t border-line bg-cream/80">
              <td className="px-4 py-2" colSpan={3}>
                Maximum if every rank is 5
              </td>
              <td className="px-4 py-2 text-right">{summary.max}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <Page kicker="Self-assessment" title="Skills evaluation" source="Foundations_Skills_Worksheet_v2.0.xls">
      <p className="mb-6 text-sm text-ink/65">
        Rank 1 = none through 5 = excellent. Weight 1 = low importance through 3 = very important. Score = rank × weight.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        {table("Skills (objectively graded)", sRows, setSRows, s)}
        {table("Characteristics (self graded)", tRows, setTRows, t)}
      </div>
    </Page>
  )
}
