import { useMemo, useState } from "react"
import { glossary } from "../data/glossary"
import { Page } from "../components/ui"

export function Glossary() {
  const [q, setQ] = useState("")
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return glossary.filter((g) => !s || g.term.toLowerCase().includes(s) || g.definition.toLowerCase().includes(s))
  }, [q])

  return (
    <Page
      kicker="Reference"
      title="Study glossary"
      source="Terms selected from the course stack. Official wording is in CCIM_Glossary_2023-02_(2).pdf."
    >
      <input
        className="mb-6 w-full max-w-md rounded-md border border-line bg-white px-3 py-2 text-sm"
        placeholder="Search terms"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="space-y-3">
        {rows.map((g) => (
          <div key={g.term} className="rounded-xl border border-line bg-paper px-5 py-4">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-lg">{g.term}</h3>
              <span className="text-xs text-ink/45">Module {g.module}</span>
            </div>
            <p className="mt-1 text-sm text-ink/75">{g.definition}</p>
          </div>
        ))}
      </div>
    </Page>
  )
}
