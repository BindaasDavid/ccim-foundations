import { useMemo, useState } from "react"
import { irr, pmt, remainingBalance } from "../lib/finance"
import { money, num, pct } from "../lib/format"
import { modules } from "../data/modules"
import { AnswerKey, Card, Field, Page, Sheet, SheetRow, Stat } from "../components/ui"
import { buildNoiForecast, parkPlazaDrivers, parkPlazaTenants, type NoiDrivers, type TenantRow } from "../lib/noiForecast"
import { NoiForecastGrid } from "./NoiForecast"

const YEARS = [1, 2, 3, 4, 5, 6] as const

type Tenant = {
  name: string
  y1: number
  bump4: number
  bump6: number
}

function tenantRent(t: Tenant, year: number) {
  let r = t.y1
  if (year >= 4) r *= 1 + t.bump4 / 100
  if (year >= 6) r *= 1 + t.bump6 / 100
  return r
}

function roundThousands(n: number) {
  return Math.round(n / 1000) * 1000
}

export function CaseLab() {
  const meta = modules.find((m) => m.id === "10")!

  const [notes, setNotes] = useState(
    "White-collar / medical demand. Target uses that match the vacant suite and the nearby demand generators.",
  )

  const [tenantSf, setTenantSf] = useState(2500)
  const [facePsf, setFacePsf] = useState(18)
  const [oldStop, setOldStop] = useState(2.1)
  const [newStop, setNewStop] = useState(1.85)

  const [b1sf, setB1sf] = useState(12000)
  const [b1vac, setB1vac] = useState(2500)
  const [b1rent, setB1rent] = useState(20)
  const [b2sf, setB2sf] = useState(14000)
  const [b2vac, setB2vac] = useState(3500)
  const [b2rent, setB2rent] = useState(17)
  const [b3sf, setB3sf] = useState(9000)
  const [b3vac, setB3vac] = useState(4500)
  const [b3rent, setB3rent] = useState(16.5)
  const [stressVac, setStressVac] = useState(30)
  const [abs1, setAbs1] = useState(2500)
  const [abs2, setAbs2] = useState(1500)
  const [abs3, setAbs3] = useState(2250)

  const [suiteSf, setSuiteSf] = useState(2500)
  const [stopPsf, setStopPsf] = useState(2.1)
  const [aFace, setAFace] = useState(22)
  const [aFree, setAFree] = useState(3)
  const [aTi, setATi] = useState(40000)
  const [cFace, setCFace] = useState(20)
  const [cFree, setCFree] = useState(0)
  const [cTi, setCTi] = useState(0)

  const [a] = useState<Tenant>({ name: "Suite A", y1: 45000, bump4: 5, bump6: 5 })
  const [b] = useState<Tenant>({ name: "Suite B", y1: 48000, bump4: 5, bump6: 0 })
  const [c] = useState<Tenant>({ name: "Suite C", y1: 50000, bump4: 5, bump6: 5 })
  const [d] = useState<Tenant>({ name: "Suite D", y1: 64000, bump4: 5, bump6: 0 })
  const [vacPct, setVacPct] = useState(7)
  const [mgmtPct, setMgmtPct] = useState(7)
  const [adminPct, setAdminPct] = useState(1)
  const [tax, setTax] = useState(10000)
  const [ins, setIns] = useState(3000)
  const [rm, setRm] = useState(2000)
  const [electric, setElectric] = useState(600)
  const [water, setWater] = useState(600)
  const [landscape, setLandscape] = useState(1200)
  const [cap, setCap] = useState(7)
  const [price, setPrice] = useState(0)
  const [t6tenants, setT6tenants] = useState<TenantRow[]>(() =>
    parkPlazaTenants.map((t) => ({ ...t, rents: [...t.rents] })),
  )
  const [t6drivers, setT6drivers] = useState<NoiDrivers>({ ...parkPlazaDrivers })
  const noiYears = useMemo(() => buildNoiForecast(t6tenants, t6drivers), [t6tenants, t6drivers])

  const [loan, setLoan] = useState(1050000)
  const [ratePct, setRatePct] = useState(6.5)
  const [amortYrs, setAmortYrs] = useState(25)
  const [hold, setHold] = useState(5)
  const [exitCap, setExitCap] = useState(7)
  const [saleCostPct, setSaleCostPct] = useState(5)

  const t2 = useMemo(() => {
    const extraPsf = oldStop - newStop
    const extra = extraPsf * tenantSf
    const face = facePsf * tenantSf
    return { extraPsf, extra, face, total: face + extra, eff: extraPsf + facePsf }
  }, [oldStop, newStop, tenantSf, facePsf])

  const t3 = useMemo(() => {
    const rows = [
      { name: "Subject", sf: b1sf, vac: b1vac, rent: b1rent, abs: abs1 },
      { name: "Comp A", sf: b2sf, vac: b2vac, rent: b2rent, abs: abs2 },
      { name: "Comp B", sf: b3sf, vac: b3vac, rent: b3rent, abs: abs3 },
    ]
    const totSf = rows.reduce((s, r) => s + r.sf, 0)
    const totVac = rows.reduce((s, r) => s + r.vac, 0)
    const totOcc0 = totSf - totVac
    const totAbs = rows.reduce((s, r) => s + r.abs, 0)
    return {
      rows: rows.map((r) => ({
        ...r,
        rate: r.sf ? r.vac / r.sf : 0,
        occ0: r.sf - r.vac,
        occ1: r.sf - r.vac + r.abs,
        pri: r.sf * r.rent,
        goiStress: r.sf * r.rent * (1 - stressVac / 100),
      })),
      totSf,
      totVac,
      totOcc0,
      totAbs,
      subRate: totSf ? totVac / totSf : 0,
    }
  }, [b1sf, b1vac, b1rent, b2sf, b2vac, b2rent, b3sf, b3vac, b3rent, abs1, abs2, abs3, stressVac])

  const prospect = (face: number, free: number, ti: number) => {
    const base = face * suiteSf
    const ownerOpex = stopPsf * suiteSf
    const free$ = (face * suiteSf * free) / 12
    const year1 = base - ownerOpex - free$ - ti
    return { base, ownerOpex, free$, ti, year1, psf: suiteSf ? year1 / suiteSf : 0 }
  }
  const pA = useMemo(() => prospect(aFace, aFree, aTi), [aFace, aFree, aTi, suiteSf, stopPsf])
  const pC = useMemo(() => prospect(cFace, cFree, cTi), [cFace, cFree, cTi, suiteSf, stopPsf])

  const forecast = useMemo(() => {
    const tenants = [a, b, c, d]
    return YEARS.map((y) => {
      const pri = tenants.reduce((s, t) => s + tenantRent(t, y), 0)
      const vacancy = pri * (vacPct / 100)
      const goi = pri - vacancy
      const mgmt = goi * (mgmtPct / 100)
      const admin = goi * (adminPct / 100)
      const stopOpex = tax + ins + rm + electric + water + landscape
      const opex = mgmt + admin + stopOpex
      const noi = goi - opex
      return { y, pri, vacancy, goi, mgmt, admin, stopOpex, opex, noi }
    })
  }, [a, b, c, d, vacPct, mgmtPct, adminPct, tax, ins, rm, electric, water, landscape])

  const y1 = forecast[0]
  const indicated = y1 && cap ? y1.noi / (cap / 100) : 0
  const asking = roundThousands(indicated)
  const purchase = price || asking

  const loanModel = useMemo(() => {
    const monthly = loan ? -pmt(ratePct / 100 / 12, amortYrs * 12, loan) : 0
    const ads = monthly * 12
    const bal = loan ? remainingBalance(loan, ratePct / 100, amortYrs, 12, hold * 12) : 0
    const equity = purchase - loan
    const ops = noiYears.slice(0, hold).map((row, i) => ({ y: i + 1, noi: row.noi, cfbt: row.noi - ads }))
    const y6 = noiYears[5]?.noi ?? 0
    const saleRaw = exitCap ? y6 / (exitCap / 100) : 0
    const sale = roundThousands(saleRaw)
    const costs = sale * (saleCostPct / 100)
    const sbt = sale - costs - bal
    const cfs = [-equity, ...ops.map((o, i) => (i === ops.length - 1 ? o.cfbt + sbt : o.cfbt))]
    return { monthly, ads, bal, equity, ops, y6, saleRaw, sale, costs, sbt, cfs, irr: irr(cfs) }
  }, [loan, ratePct, amortYrs, hold, purchase, noiYears, exitCap, saleCostPct])

  const pick = pA.year1 >= pC.year1 ? "Prospect A" : "Prospect B"
  const key = meta.tldr.answers ?? []

  return (
    <Page kicker="Module 10 · published answers" title="Office case study" source={`${meta.packet} — Tasks 1–8 answers are on this page`}>
      <section id="answers" className="mb-8 rounded-xl border-2 border-gold bg-gold/15 p-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">TLDR · published answers</p>
        <p className="font-serif mt-2 text-xl leading-snug text-ink">{meta.tldr.line}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-ink">
          {meta.tldr.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="mt-6 space-y-6">
          {(meta.tldr.answers ?? []).map((a) => (
            <div key={a.task} className="rounded-lg border border-gold/50 bg-paper p-4">
              <p className="font-serif text-lg text-ink">{a.task}</p>
              <ol className="mt-2 space-y-2 text-sm text-ink">
                {a.items.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Year 1 NOI" value={money(y1?.noi ?? 0, 0)} />
        <Stat label="Indicated value" value={money(asking, 0)} />
        <Stat label="Sale proceeds (BT)" value={money(loanModel.sbt, 0)} />
        <Stat label="Before-tax IRR" value={loanModel.irr == null ? "—" : pct(loanModel.irr)} accent />
      </div>

      <div className="space-y-8">
        <Card>
          <p className="text-xs tracking-wide text-gold-deep uppercase">Task 1 · Market analysis</p>
          <p className="mt-2 text-sm text-ink/70">
            Characterize workforce, lifestyle, and four uses that belong in the vacant suite. This task is
            judgment. The numbers start at Task 2.
          </p>
          <textarea
            className="mt-4 min-h-28 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-gold"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {key[0] && <AnswerKey title={key[0].task} items={key[0].items} />}
        </Card>

        <Card id="task-2">
          <p className="text-xs tracking-wide text-gold-deep uppercase">Task 2 · Operating expense stop</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Tenant SF" value={tenantSf} onChange={setTenantSf} />
            <Field label="Face rent $/SF" value={facePsf} onChange={setFacePsf} />
            <Field label="Current stop $/SF" value={oldStop} onChange={setOldStop} />
            <Field label="Proposed stop $/SF" value={newStop} onChange={setNewStop} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Face rent" value={money(t2.face, 0)} />
            <Stat label="Extra from lower stop" value={money(t2.extra, 0)} />
            <Stat label="Tenant year-1 cost" value={money(t2.total, 0)} accent />
            <Stat label="Effective $/SF" value={money(t2.eff, 2)} />
          </div>
          {key[1] && <AnswerKey title={key[1].task} items={key[1].items} />}
        </Card>

        <Card id="task-3">
          <p className="text-xs tracking-wide text-gold-deep uppercase">Task 3 · Vacancy and absorption</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {[
              ["Subject", b1sf, setB1sf, b1vac, setB1vac, b1rent, setB1rent, abs1, setAbs1],
              ["Comp A", b2sf, setB2sf, b2vac, setB2vac, b2rent, setB2rent, abs2, setAbs2],
              ["Comp B", b3sf, setB3sf, b3vac, setB3vac, b3rent, setB3rent, abs3, setAbs3],
            ].map((row) => {
              const [label, sf, setSf, vac, setVac, rent, setRent, abs, setAbs] = row as [
                string,
                number,
                (n: number) => void,
                number,
                (n: number) => void,
                number,
                (n: number) => void,
                number,
                (n: number) => void,
              ]
              return (
                <div key={label} className="rounded-lg border border-line bg-white p-4">
                  <p className="mb-3 text-sm font-medium">{label}</p>
                  <div className="grid gap-3">
                    <Field label="Total SF" value={sf} onChange={setSf} />
                    <Field label="Vacant SF (BOY)" value={vac} onChange={setVac} />
                    <Field label="Market rent $/SF" value={rent} onChange={setRent} />
                    <Field label="SF absorbed this year" value={abs} onChange={setAbs} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 max-w-xs">
            <Field label="Stressed vacancy (%)" value={stressVac} onChange={setStressVac} />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-ink/50">
                  <th className="py-2">Building</th>
                  <th>Vacancy</th>
                  <th>BOY occupied</th>
                  <th>EOY occupied</th>
                  <th>GOI at stressed vac</th>
                </tr>
              </thead>
              <tbody>
                {t3.rows.map((r) => (
                  <tr key={r.name} className="border-t border-line">
                    <td className="py-2">{r.name}</td>
                    <td>{pct(r.rate)}</td>
                    <td>{num(r.occ0, 0)} sf</td>
                    <td>{num(r.occ1, 0)} sf</td>
                    <td>{money(r.goiStress, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Submarket vacancy" value={pct(t3.subRate)} accent />
            <Stat label="BOY occupied" value={`${num(t3.totOcc0, 0)} sf`} />
            <Stat label="Absorption" value={`${num(t3.totAbs, 0)} sf`} />
            <Stat label="EOY occupied" value={`${num(t3.totOcc0 + t3.totAbs, 0)} sf`} />
          </div>
          {key[2] && <AnswerKey title={key[2].task} items={key[2].items} />}
        </Card>

        <Card id="task-4">
          <p className="text-xs tracking-wide text-gold-deep uppercase">Task 4 · Concessions and effective rent</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Suite SF" value={suiteSf} onChange={setSuiteSf} />
            <Field label="Owner opex stop $/SF" value={stopPsf} onChange={setStopPsf} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-line bg-white p-4">
              <p className="mb-3 text-sm font-medium">Prospect A — higher face, TIs and free rent</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Face $/SF" value={aFace} onChange={setAFace} />
                <Field label="Free months" value={aFree} onChange={setAFree} />
                <Field label="TI $" value={aTi} onChange={setATi} />
              </div>
              <div className="mt-3 grid gap-3">
                <Stat label="Year-1 owner cash" value={money(pA.year1, 0)} />
                <Stat label="Effective $/SF" value={money(pA.psf, 2)} />
              </div>
            </div>
            <div className="rounded-lg border border-line bg-white p-4">
              <p className="mb-3 text-sm font-medium">Prospect B — cleaner face, no concessions</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Face $/SF" value={cFace} onChange={setCFace} />
                <Field label="Free months" value={cFree} onChange={setCFree} />
                <Field label="TI $" value={cTi} onChange={setCTi} />
              </div>
              <div className="mt-3 grid gap-3">
                <Stat label="Year-1 owner cash" value={money(pC.year1, 0)} />
                <Stat label="Effective $/SF" value={money(pC.psf, 2)} />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink/75">
            Year-1 owner cash is higher for <span className="font-medium">{pick}</span>. Fill the vacancy
            with the prospect that still leaves the owner whole after TIs and free rent.
          </p>
          {key[3] && <AnswerKey title={key[3].task} items={key[3].items} />}
        </Card>

        <Card>
          <p className="text-xs tracking-wide text-gold-deep uppercase">Task 5 · APOD and value</p>
          <p className="mt-2 text-sm text-ink/70">
            Line 29 is the gold total. The $1.74 stop covers taxes through landscaping on 10,000 sf.
            Management is 7% of GOI. Accounting/legal/permits/advertising is the 1% admin line.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Vacancy (%)" value={vacPct} onChange={setVacPct} />
            <Field label="Mgmt (% of GOI)" value={mgmtPct} onChange={setMgmtPct} />
            <Field label="Admin / legal combo (% of GOI)" value={adminPct} onChange={setAdminPct} />
            <Field label="Going-in cap (%)" value={cap} onChange={setCap} />
            <Field label="Override purchase $" value={price} onChange={setPrice} />
          </div>
          <div className="mt-4">
            <Sheet title="Line 29 operating expenses">
              <SheetRow n="7" label="Real estate taxes ($1.00 psf)" value={tax} onChange={setTax} format="money" />
              <SheetRow n="8" label="Personal property taxes" value={0} kind="computed" format="money" />
              <SheetRow n="9" label="Property insurance ($0.30 psf)" value={ins} onChange={setIns} format="money" />
              <SheetRow n="10" label="Off-site management (7% of GOI)" value={y1?.mgmt ?? 0} kind="computed" format="money" />
              <SheetRow n="11–13" label="Payroll / benefits / workers’ comp (inside mgmt fee)" value={0} kind="computed" format="money" />
              <SheetRow n="14" label="Repairs and maintenance — exterior/CAM ($0.20 psf)" value={rm} onChange={setRm} format="money" />
              <SheetRow n="15" label="Common-area electric ($0.06 psf)" value={electric} onChange={setElectric} format="money" />
              <SheetRow n="16" label="Water and sewer ($0.06 psf)" value={water} onChange={setWater} format="money" />
              <SheetRow n="19–21" label="Accounting, legal, permits, advertising (combined)" value={y1?.admin ?? 0} kind="computed" format="money" />
              <SheetRow n="24" label="Landscaping ($0.12 psf)" value={landscape} onChange={setLandscape} format="money" />
              <SheetRow n="29" label="Total operating expenses" value={y1?.opex ?? 0} kind="total" format="money" hint="7 through 24" />
              <SheetRow n="30" label="NOI" value={y1?.noi ?? 0} kind="total" format="money" hint="GOI − 29" />
            </Sheet>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="PRI" value={money(y1?.pri ?? 0, 0)} />
            <Stat label="Vacancy & credit" value={money(y1?.vacancy ?? 0, 0)} />
            <Stat label="GOI" value={money(y1?.goi ?? 0, 0)} />
            <Stat label="Stop opex ($1.74 × 10,000)" value={money(y1?.stopOpex ?? 0, 0)} />
            <Stat label="NOI ÷ cap" value={money(indicated, 0)} />
            <Stat label="Ask (nearest $1,000)" value={money(asking, 0)} />
            <Stat label="Purchase used" value={money(purchase, 0)} />
          </div>
          {key[4] && <AnswerKey title={key[4].task} items={key[4].items} />}
        </Card>

        <Card id="task-6">
          <p className="text-xs tracking-wide text-gold-deep uppercase">Task 6 · Forecasting NOI</p>
          <p className="mt-2 mb-4 text-sm text-ink/70">
            Same six-year stack as the packet worksheet. Yellow cells are tenant rents and the percent
            drivers. Gold rows total PRI, GOI, opex, and NOI.
          </p>
          <NoiForecastGrid tenants={t6tenants} setTenants={setT6tenants} drivers={t6drivers} setDrivers={setT6drivers} />
          {key[5] && <AnswerKey title={key[5].task} items={key[5].items} />}
        </Card>

        <Card>
          <p className="text-xs tracking-wide text-gold-deep uppercase">Task 7 · Mortgage</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Loan amount" value={loan} onChange={setLoan} />
            <Field label="Interest (%)" value={ratePct} onChange={setRatePct} />
            <Field label="Amort years" value={amortYrs} onChange={setAmortYrs} />
            <Field label="Hold (years)" value={hold} onChange={setHold} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Monthly PMT" value={money(loanModel.monthly, 2)} />
            <Stat label="Annual debt service" value={money(loanModel.ads, 0)} accent />
            <Stat label={`Balance EOY ${hold}`} value={money(loanModel.bal, 0)} />
            <Stat label="Initial equity" value={money(loanModel.equity, 0)} />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-ink/50">
                  <th className="py-2">Year</th>
                  <th>NOI</th>
                  <th>ADS</th>
                  <th>CFBT</th>
                </tr>
              </thead>
              <tbody>
                {loanModel.ops.map((row) => (
                  <tr key={row.y} className="border-t border-line">
                    <td className="py-2">{row.y}</td>
                    <td>{money(row.noi, 0)}</td>
                    <td>{money(loanModel.ads, 0)}</td>
                    <td>{money(row.cfbt, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {key[6] && <AnswerKey title={key[6].task} items={key[6].items} />}
        </Card>

        <Card>
          <p className="text-xs tracking-wide text-gold-deep uppercase">Task 8 · Before-tax IRR</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Exit cap (%)" value={exitCap} onChange={setExitCap} />
            <Field label="Cost of sale (%)" value={saleCostPct} onChange={setSaleCostPct} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Year-6 NOI" value={money(loanModel.y6, 0)} />
            <Stat label="NOI ÷ exit cap" value={money(loanModel.saleRaw, 0)} />
            <Stat label="Sale (nearest $1,000)" value={money(loanModel.sale, 0)} />
            <Stat label="Cost of sale" value={money(loanModel.costs, 0)} />
            <Stat label="Loan balance" value={money(loanModel.bal, 0)} />
            <Stat label="Sale proceeds BT" value={money(loanModel.sbt, 0)} accent />
            <Stat label="Before-tax IRR" value={loanModel.irr == null ? "—" : pct(loanModel.irr)} accent />
          </div>
          <p className="mt-5 text-xs tracking-wide text-ink/50 uppercase">T-bar</p>
          <ol className="mt-2 space-y-1 text-sm">
            {loanModel.cfs.map((cf, i) => (
              <li key={i} className="flex justify-between border-b border-line/70 py-1">
                <span>{i === 0 ? "t = 0 equity" : i === hold ? `Year ${i} CFBT + sale` : `Year ${i} CFBT`}</span>
                <span>{money(cf, 0)}</span>
              </li>
            ))}
          </ol>
          {key[7] && <AnswerKey title={key[7].task} items={key[7].items} />}
        </Card>
      </div>
    </Page>
  )
}
