import { useMemo, useState } from "react"
import { money, num } from "../lib/format"
import { Page, Sheet, SheetRow, Stat } from "../components/ui"

export function Goals() {
  const [goal, setGoal] = useState(100000)
  const [avgDeal, setAvgDeal] = useState(50000)
  const [commPct, setCommPct] = useState(6)
  const [coSplit, setCoSplit] = useState(40)
  const [withCo, setWithCo] = useState(40)
  const [desk, setDesk] = useState(40)
  const [leads, setLeads] = useState(5)
  const [calls, setCalls] = useState(15)

  const s = useMemo(() => {
    const gross = avgDeal * (commPct / 100)
    const yourSide = 1 - coSplit / 100
    const withCoShare = withCo / 100
    const blendedToCompany = gross * withCoShare * yourSide + gross * (1 - withCoShare)
    const toYou = blendedToCompany * (1 - desk / 100)
    const closings = toYou ? goal / toYou : 0
    const yearLeads = closings * leads
    const yearCalls = yearLeads * calls
    return { gross, yourSide, blendedToCompany, toYou, closings, yearLeads, yearCalls, weekCalls: yearCalls / 48 }
  }, [goal, avgDeal, commPct, coSplit, withCo, desk, leads, calls])

  return (
    <Page kicker="Imported form" title="Annual financial goal" source="Annual_Financial_Goal_Worksheet_v2.1.xls — each total uses only its source lines">
      <p className="mb-6 text-sm text-ink/65">
        Commission to you is the blended company share after co-broker deals, then after the desk
        split. Closings needed is the goal divided by that number. Weekly contacts assume 48 working
        weeks.
      </p>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Line 9 to you" value={money(s.toYou, 0)} />
        <Stat label="Line 10 closings" value={num(s.closings, 1)} accent />
        <Stat label="Line 13 contacts / year" value={num(s.yearCalls, 0)} />
        <Stat label="Line 14 contacts / week" value={num(s.weekCalls, 1)} accent />
      </div>

      <Sheet title="Income target">
        <SheetRow n="1" label="Annual financial goal" value={goal} onChange={setGoal} format="money" />
        <SheetRow n="2" label="Average sale / lease value" value={avgDeal} onChange={setAvgDeal} format="money" />
        <SheetRow n="2a" label="Gross commission both sides (%)" value={commPct} onChange={setCommPct} />
        <SheetRow n="3" label="Average gross commission" value={s.gross} kind="total" format="money" hint="2 × 2a" />
        <SheetRow n="4" label="Co-broker split they keep (%)" value={coSplit} onChange={setCoSplit} />
        <SheetRow n="5" label="Your side when there is a co-broker (%)" value={s.yourSide * 100} kind="computed" digits={0} hint="100 − 4" />
        <SheetRow n="6" label="Share of deals with a co-broker (%)" value={withCo} onChange={setWithCo} />
        <SheetRow n="7" label="Blended commission to the company" value={s.blendedToCompany} kind="total" format="money" hint="3 × mix of 5 and 100%" />
        <SheetRow n="8" label="Desk / company split they keep (%)" value={desk} onChange={setDesk} />
        <SheetRow n="9" label="Average commission to you" value={s.toYou} kind="total" format="money" hint="7 × (1 − 8)" />
      </Sheet>

      <div className="mt-6">
        <Sheet title="Activity required">
          <SheetRow n="10" label="Closings needed" value={s.closings} kind="total" digits={1} hint="1 ÷ 9" />
          <SheetRow n="11" label="Qualified leads per closing" value={leads} onChange={setLeads} />
          <SheetRow n="12" label="Contacts per qualified lead" value={calls} onChange={setCalls} />
          <SheetRow n="13" label="Contacts per year" value={s.yearCalls} kind="total" digits={0} hint="10 × 11 × 12" />
          <SheetRow n="14" label="Contacts per week (48 weeks)" value={s.weekCalls} kind="total" digits={1} hint="13 ÷ 48" />
        </Sheet>
      </div>
    </Page>
  )
}
