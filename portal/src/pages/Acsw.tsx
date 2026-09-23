import { useMemo, useState } from "react"
import { money } from "../lib/format"
import { Page, Sheet, SheetRow, Stat } from "../components/ui"

export function Acsw() {
  const [sale, setSale] = useState(3100000)
  const [costPct, setCostPct] = useState(4)
  const [basis, setBasis] = useState(2550000)
  const [additions, setAdditions] = useState(0)
  const [cr, setCr] = useState(230769)
  const [loanBal, setLoanBal] = useState(1450000)
  const [reserves, setReserves] = useState(24000)
  const [ordRate, setOrdRate] = useState(37)
  const [recapRate, setRecapRate] = useState(25)
  const [cgRate, setCgRate] = useState(20)
  const [loanFeesLeft, setLoanFeesLeft] = useState(8000)

  const c = useMemo(() => {
    const cost = sale * (costPct / 100)
    const realized = sale - cost
    const adj = basis + additions - cr
    const gain = realized - adj
    const slRecap = Math.max(0, Math.min(cr, Math.max(gain, 0)))
    const capGain = Math.max(0, gain - slRecap)
    const ordinary = loanFeesLeft
    const taxOrd = ordinary * (ordRate / 100)
    const taxRecap = slRecap * (recapRate / 100)
    const taxCg = capGain * (cgRate / 100)
    const taxTotal = taxOrd + taxRecap + taxCg
    const sbt = sale - cost - loanBal + reserves
    const sat = sbt - taxTotal
    return { cost, realized, adj, gain, slRecap, capGain, ordinary, taxOrd, taxRecap, taxCg, taxTotal, sbt, sat }
  }, [sale, costPct, basis, additions, cr, loanBal, reserves, ordRate, recapRate, cgRate, loanFeesLeft])

  return (
    <Page kicker="Imported form" title="Alternative Cash Sale Worksheet" source="CCIM_ACSW_eForm.pdf — gold rows total the lines in the hint">
      <p className="mb-6 text-sm text-ink/65">
        Amount realized is price minus cost of sale. Adjusted basis is original basis plus additions
        minus cost recovery. Sale proceeds before tax take the loan off and add reserves back. After-tax
        proceeds subtract the three tax pieces.
      </p>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Line 8 gain (loss)" value={money(c.gain, 0)} />
        <Stat label="Line 22 proceeds before tax" value={money(c.sbt, 0)} />
        <Stat label="Line 25 total tax" value={money(c.taxTotal, 0)} />
        <Stat label="Line 26 proceeds after tax" value={money(c.sat, 0)} accent />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Sheet title="Amount realized and adjusted basis">
          <SheetRow n="1" label="Projected sales price" value={sale} onChange={setSale} format="money" />
          <SheetRow n="2" label="Cost of sale (%)" value={costPct} onChange={setCostPct} hint={money(c.cost, 0)} />
          <SheetRow n="3" label="Amount realized" value={c.realized} kind="total" format="money" hint="1 − 2" />
          <SheetRow n="4" label="Basis at acquisition" value={basis} onChange={setBasis} format="money" />
          <SheetRow n="5" label="Capital additions" value={additions} onChange={setAdditions} format="money" />
          <SheetRow n="6" label="Cost recovery taken" value={cr} onChange={setCr} format="money" />
          <SheetRow n="7" label="Adjusted basis" value={c.adj} kind="total" format="money" hint="4 + 5 − 6" />
          <SheetRow n="8" label="Gain or (loss)" value={c.gain} kind="total" format="money" hint="3 − 7" />
        </Sheet>

        <Sheet title="Character of gain">
          <SheetRow n="9" label="Straight-line recapture" value={c.slRecap} kind="computed" format="money" hint="lesser of 6 or positive 8" />
          <SheetRow n="10" label="Capital gain from appreciation" value={c.capGain} kind="computed" format="money" hint="8 − 9" />
          <SheetRow n="11" label="Ordinary — unamortized loan fees" value={loanFeesLeft} onChange={setLoanFeesLeft} format="money" />
          <SheetRow n="12" label="Ordinary tax rate (%)" value={ordRate} onChange={setOrdRate} />
          <SheetRow n="13" label="Recapture tax rate (%)" value={recapRate} onChange={setRecapRate} />
          <SheetRow n="14" label="Capital gains tax rate (%)" value={cgRate} onChange={setCgRate} />
        </Sheet>
      </div>

      <div className="mt-6">
        <Sheet title="Cash at sale">
          <SheetRow n="20" label="Mortgage balance" value={loanBal} onChange={setLoanBal} format="money" />
          <SheetRow n="21" label="Funded reserves released" value={reserves} onChange={setReserves} format="money" />
          <SheetRow n="22" label="Sale proceeds before tax" value={c.sbt} kind="total" format="money" hint="1 − 2 − 20 + 21" />
          <SheetRow n="23" label="Tax on ordinary income" value={c.taxOrd} kind="computed" format="money" hint="11 × 12" />
          <SheetRow n="23a" label="Tax on recapture" value={c.taxRecap} kind="computed" format="money" hint="9 × 13" />
          <SheetRow n="24" label="Tax on capital gain" value={c.taxCg} kind="computed" format="money" hint="10 × 14" />
          <SheetRow n="25" label="Total tax on sale" value={c.taxTotal} kind="total" format="money" hint="23 + 23a + 24" />
          <SheetRow n="26" label="Sale proceeds after tax" value={c.sat} kind="total" format="money" hint="22 − 25" />
        </Sheet>
      </div>
    </Page>
  )
}
