import { useMemo, useState } from "react"
import { money, pct } from "../lib/format"
import { Card, Page, Sheet, SheetRow, Stat, TextField } from "../components/ui"

export function Apod() {
  const [name, setName] = useState("Subject office")
  const [sf, setSf] = useState(10000)
  const [price, setPrice] = useState(1050000)
  const [acq, setAcq] = useState(0)
  const [loanFees, setLoanFees] = useState(0)
  const [loan, setLoan] = useState(350000)

  const [pri, setPri] = useState(106200)
  const [vacPct, setVacPct] = useState(7)
  const [other, setOther] = useState(0)

  const [tax, setTax] = useState(10000)
  const [pptax, setPptax] = useState(0)
  const [ins, setIns] = useState(3000)
  const [mgmt, setMgmt] = useState(6914)
  const [payroll, setPayroll] = useState(0)
  const [benefits, setBenefits] = useState(0)
  const [wc, setWc] = useState(0)
  const [rm, setRm] = useState(2000)
  const [electric, setElectric] = useState(600)
  const [water, setWater] = useState(600)
  const [legal, setLegal] = useState(988)
  const [permits, setPermits] = useState(0)
  const [ads, setAds] = useState(0)
  const [supplies, setSupplies] = useState(0)
  const [misc, setMisc] = useState(0)
  const [landscape, setLandscape] = useState(1200)

  const [debt, setDebt] = useState(48000)
  const [part, setPart] = useState(0)
  const [leaseComm, setLeaseComm] = useState(0)
  const [reserves, setReserves] = useState(0)

  const c = useMemo(() => {
    const vacancy = pri * (vacPct / 100)
    const eri = pri - vacancy
    const goi = eri + other
    const opex = tax + pptax + ins + mgmt + payroll + benefits + wc + rm + electric + water + legal + permits + ads + supplies + misc + landscape
    const noi = goi - opex
    const below = debt + part + leaseComm + reserves
    const cfbt = noi - below
    const equity = price + acq + loanFees - loan
    return {
      vacancy,
      eri,
      goi,
      opex,
      noi,
      below,
      cfbt,
      equity,
      cap: price ? noi / price : 0,
      perSf: sf ? noi / sf : 0,
    }
  }, [pri, vacPct, other, tax, pptax, ins, mgmt, payroll, benefits, wc, rm, electric, water, legal, permits, ads, supplies, misc, landscape, debt, part, leaseComm, reserves, price, acq, loanFees, loan, sf])

  return (
    <Page kicker="Imported form" title="Annual Property Operating Data" source="CCIM_APOD_eForm.pdf — line totals follow the printed form">
      <p className="mb-6 text-sm text-ink/65">
        White rows are inputs. Gold rows are totals of the lines above them. Line 29 is the sum of
        operating expenses. Line 35 is NOI minus debt service, participation, leasing commissions, and
        reserves.
      </p>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Initial investment" value={money(c.equity, 0)} accent />
        <Stat label="Line 29 total opex" value={money(c.opex, 0)} />
        <Stat label="Line 30 NOI" value={money(c.noi, 0)} />
        <Stat label="Line 35 CFBT" value={money(c.cfbt, 0)} accent />
      </div>

      <Card className="mb-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <TextField label="Property" value={name} onChange={setName} />
          <TextField label="Size (SF)" value={String(sf)} onChange={(v) => setSf(Number(v) || 0)} />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Sheet title="Capital stack">
          <SheetRow n="" label="Purchase price" value={price} onChange={setPrice} format="money" />
          <SheetRow n="" label="Plus acquisition costs" value={acq} onChange={setAcq} format="money" />
          <SheetRow n="" label="Plus loan fees / costs" value={loanFees} onChange={setLoanFees} format="money" />
          <SheetRow n="" label="Less mortgages" value={loan} onChange={setLoan} format="money" />
          <SheetRow n="" label="Equals initial investment" value={c.equity} kind="total" format="money" hint="price + costs + fees − loan" />
        </Sheet>

        <Sheet title="Income">
          <SheetRow n="1" label="Potential rental income" value={pri} onChange={setPri} format="money" />
          <SheetRow n="2" label="Vacancy & credit loss %" value={vacPct} onChange={setVacPct} hint={`${money(c.vacancy, 0)}`} />
          <SheetRow n="3" label="Effective rental income" value={c.eri} kind="computed" format="money" hint="1 − 2" />
          <SheetRow n="4" label="Other income" value={other} onChange={setOther} format="money" />
          <SheetRow n="5" label="Gross operating income" value={c.goi} kind="total" format="money" hint="3 + 4" />
        </Sheet>
      </div>

      <div className="mt-6">
        <Sheet title="Operating expenses (sum to line 29)">
          <SheetRow n="7" label="Real estate taxes" value={tax} onChange={setTax} format="money" />
          <SheetRow n="8" label="Personal property taxes" value={pptax} onChange={setPptax} format="money" />
          <SheetRow n="9" label="Property insurance" value={ins} onChange={setIns} format="money" />
          <SheetRow n="10" label="Off-site management" value={mgmt} onChange={setMgmt} format="money" />
          <SheetRow n="11" label="Payroll" value={payroll} onChange={setPayroll} format="money" />
          <SheetRow n="12" label="Expenses / benefits" value={benefits} onChange={setBenefits} format="money" />
          <SheetRow n="13" label="Taxes / workers’ compensation" value={wc} onChange={setWc} format="money" />
          <SheetRow n="14" label="Repairs and maintenance" value={rm} onChange={setRm} format="money" />
          <SheetRow n="15" label="Electric" value={electric} onChange={setElectric} format="money" />
          <SheetRow n="16" label="Water and sewer" value={water} onChange={setWater} format="money" />
          <SheetRow n="19" label="Accounting and legal" value={legal} onChange={setLegal} format="money" />
          <SheetRow n="20" label="Licenses / permits" value={permits} onChange={setPermits} format="money" />
          <SheetRow n="21" label="Advertising" value={ads} onChange={setAds} format="money" />
          <SheetRow n="22" label="Supplies" value={supplies} onChange={setSupplies} format="money" />
          <SheetRow n="23" label="Miscellaneous" value={misc} onChange={setMisc} format="money" />
          <SheetRow n="24" label="Landscaping" value={landscape} onChange={setLandscape} format="money" />
          <SheetRow n="29" label="Total operating expenses" value={c.opex} kind="total" format="money" hint="7 through 24" />
          <SheetRow n="30" label="Net operating income" value={c.noi} kind="total" format="money" hint="5 − 29" />
        </Sheet>
      </div>

      <div className="mt-6">
        <Sheet title="Below-the-line (sum against NOI to line 35)">
          <SheetRow n="31" label="Annual debt service" value={debt} onChange={setDebt} format="money" />
          <SheetRow n="32" label="Participation payments" value={part} onChange={setPart} format="money" />
          <SheetRow n="33" label="Leasing commissions" value={leaseComm} onChange={setLeaseComm} format="money" />
          <SheetRow n="34" label="Funded reserves" value={reserves} onChange={setReserves} format="money" />
          <SheetRow n="35" label="Cash flow before taxes" value={c.cfbt} kind="total" format="money" hint="30 − (31 + 32 + 33 + 34)" />
        </Sheet>
      </div>

      <p className="mt-4 text-sm text-ink/55">
        Cap rate on price {pct(c.cap)} · NOI / SF {money(c.perSf, 2)}
      </p>
    </Page>
  )
}
