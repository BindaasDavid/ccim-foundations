import { useMemo, useState } from "react"
import { money } from "../lib/format"
import { Card, Field, Page, Stat } from "../components/ui"

export function EffectiveRent() {
  const [sf, setSf] = useState(2000)
  const [face, setFace] = useState(24)
  const [years, setYears] = useState(5)
  const [freeMonths, setFreeMonths] = useState(3)
  const [ti, setTi] = useState(20)
  const [opex, setOpex] = useState(8.5)
  const [stop, setStop] = useState(7)

  const c = useMemo(() => {
    const annualFace = face * sf
    const contract = annualFace * years
    const free = (face * sf * freeMonths) / 12
    const ti$ = ti * sf
    const netToOwner = contract - free - ti$
    const effAnnual = years ? netToOwner / years : 0
    const effPsf = sf ? effAnnual / sf : 0
    const pass = Math.max(0, opex - stop) * sf
    const ownerOpex = Math.min(opex, stop) * sf
    return { annualFace, contract, free, ti$, netToOwner, effAnnual, effPsf, pass, ownerOpex }
  }, [sf, face, years, freeMonths, ti, opex, stop])

  return (
    <Page kicker="Module 5 / Task 2 & 4" title="Expense stop and effective rent" source="FOUND_M5_Lease_Clauses and FOUND_M10 Tasks 2 and 4">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Suite SF" value={sf} onChange={setSf} />
            <Field label="Face rent $/SF / year" value={face} onChange={setFace} />
            <Field label="Term (years)" value={years} onChange={setYears} />
            <Field label="Free rent (months)" value={freeMonths} onChange={setFreeMonths} />
            <Field label="TI allowance $/SF" value={ti} onChange={setTi} />
            <Field label="Actual opex $/SF" value={opex} onChange={setOpex} />
            <Field label="Expense stop $/SF" value={stop} onChange={setStop} />
          </div>
        </Card>
        <div className="grid gap-3">
          <Stat label="Contract rent over term" value={money(c.contract, 0)} />
          <Stat label="Free-rent concession" value={money(c.free, 0)} />
          <Stat label="TI outlay" value={money(c.ti$, 0)} />
          <Stat label="Effective rent / year" value={money(c.effAnnual, 0)} accent />
          <Stat label="Effective $/SF" value={money(c.effPsf, 2)} />
          <Stat label="Owner opex (to the stop)" value={money(c.ownerOpex, 0)} />
          <Stat label="Tenant pass-through" value={money(c.pass, 0)} />
        </div>
      </div>
    </Page>
  )
}
