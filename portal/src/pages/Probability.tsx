import { useMemo, useState } from "react"
import { money } from "../lib/format"
import { Page, Sheet, SheetRow, Stat } from "../components/ui"

export function Probability() {
  const [inventory, setInventory] = useState(400000)
  const [users, setUsers] = useState(80)
  const [priceSf, setPriceSf] = useState(28)
  const [term, setTerm] = useState(5)
  const [yearsInPlace, setYearsInPlace] = useState(7)
  const [share, setShare] = useState(15)
  const [commPct, setCommPct] = useState(5)

  const c = useMemo(() => {
    const avgSf = users ? inventory / users : 0
    const leaseValue = priceSf * avgSf * term
    const txPerYear = yearsInPlace ? users / yearsInPlace : 0
    const marketComm = leaseValue * txPerYear * (commPct / 100)
    const yours = marketComm * (share / 100)
    return { avgSf, leaseValue, txPerYear, marketComm, yours }
  }, [inventory, users, priceSf, term, yearsInPlace, share, commPct])

  return (
    <Page kicker="Imported form" title="Probability of success" source="ProbabilityForm.xls — each total uses only the lines above it">
      <p className="mb-6 text-sm text-ink/65">
        Average user size is inventory divided by users. Lease value is rent times size times term.
        Transactions per year are users divided by years in place. Your commission is the market pool
        times your share.
      </p>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Average user SF" value={c.avgSf.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
        <Stat label="Market commission pool" value={money(c.marketComm, 0)} />
        <Stat label="Your potential gross" value={money(c.yours, 0)} accent />
      </div>

      <Sheet title="Territory math">
        <SheetRow n="1" label="Inventory (SF)" value={inventory} onChange={setInventory} />
        <SheetRow n="2" label="Number of users" value={users} onChange={setUsers} />
        <SheetRow n="3" label="Average user SF" value={c.avgSf} kind="total" digits={0} hint="1 ÷ 2" />
        <SheetRow n="4" label="Average price / SF / year" value={priceSf} onChange={setPriceSf} format="money" />
        <SheetRow n="5" label="Average lease term (years)" value={term} onChange={setTerm} />
        <SheetRow n="6" label="Average lease value" value={c.leaseValue} kind="total" format="money" hint="3 × 4 × 5" />
        <SheetRow n="7" label="Average years in place" value={yearsInPlace} onChange={setYearsInPlace} />
        <SheetRow n="8" label="Transactions per year" value={c.txPerYear} kind="total" digits={2} hint="2 ÷ 7" />
        <SheetRow n="9" label="Commission rate (%)" value={commPct} onChange={setCommPct} />
        <SheetRow n="10" label="Market commission pool" value={c.marketComm} kind="total" format="money" hint="6 × 8 × 9" />
        <SheetRow n="11" label="Estimated market share (%)" value={share} onChange={setShare} />
        <SheetRow n="12" label="Your potential gross commission" value={c.yours} kind="total" format="money" hint="10 × 11" />
      </Sheet>
    </Page>
  )
}
