import { useMemo, useState } from "react"
import { money, pct } from "../lib/format"
import { Card, Field, Page, Stat } from "../components/ui"

type Bldg = { name: string; sf: number; vacant: number; rentPsf: number }

const starter: Bldg[] = [
  { name: "Building A", sf: 10000, vacant: 2000, rentPsf: 24 },
  { name: "Building B", sf: 18000, vacant: 1500, rentPsf: 22 },
  { name: "Building C", sf: 12000, vacant: 0, rentPsf: 26 },
]

export function Market() {
  const [rows, setRows] = useState(starter)
  const [absorbed, setAbsorbed] = useState(2000)
  const [newSupply, setNewSupply] = useState(0)

  const m = useMemo(() => {
    const total = rows.reduce((s, r) => s + r.sf, 0)
    const vacant = rows.reduce((s, r) => s + r.vacant, 0)
    const occupied = total - vacant
    const pri = rows.reduce((s, r) => s + r.sf * r.rentPsf, 0)
    const lost = rows.reduce((s, r) => s + r.vacant * r.rentPsf, 0)
    const goi = pri - lost
    const vacRate = total ? vacant / total : 0
    const endVacant = Math.max(0, vacant - absorbed + newSupply)
    const endOcc = total + newSupply - endVacant
    const netAbs = endOcc - occupied
    return { total, vacant, occupied, pri, lost, goi, vacRate, endVacant, netAbs }
  }, [rows, absorbed, newSupply])

  function patch(i: number, next: Partial<Bldg>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...next } : r)))
  }

  return (
    <Page kicker="Module 4 / Task 3" title="Vacancy and absorption" source="FOUND_M4_Leasing_Market and FOUND_M10 Task 3">
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50">
              <th className="pb-2">Building</th>
              <th className="pb-2">Total SF</th>
              <th className="pb-2">Vacant SF</th>
              <th className="pb-2">Rent / SF</th>
              <th className="pb-2 text-right">Vacancy</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-line">
                <td className="py-2 pr-2">
                  <input className="w-full rounded border border-line px-2 py-1" value={r.name} onChange={(e) => patch(i, { name: e.target.value })} />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" className="w-28 rounded border border-line px-2 py-1" value={r.sf || ""} onChange={(e) => patch(i, { sf: Number(e.target.value) })} />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" className="w-28 rounded border border-line px-2 py-1" value={r.vacant || ""} onChange={(e) => patch(i, { vacant: Number(e.target.value) })} />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" className="w-24 rounded border border-line px-2 py-1" value={r.rentPsf || ""} onChange={(e) => patch(i, { rentPsf: Number(e.target.value) })} />
                </td>
                <td className="py-2 text-right">{r.sf ? pct(r.vacant / r.sf, 1) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mt-3 text-sm text-gold-deep" onClick={() => setRows([...rows, { name: "Building", sf: 0, vacant: 0, rentPsf: 0 }])}>
          Add building
        </button>
      </Card>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Submarket vacancy" value={pct(m.vacRate, 1)} accent />
        <Stat label="Potential rent" value={money(m.pri, 0)} />
        <Stat label="Vacancy loss" value={money(m.lost, 0)} />
        <Stat label="GOI at current occupancy" value={money(m.goi, 0)} />
      </div>
      <Card className="mt-6">
        <h3 className="font-serif mb-3 text-lg">Period absorption</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="SF leased this period (gross)" value={absorbed} onChange={setAbsorbed} />
          <Field label="New supply delivered (SF)" value={newSupply} onChange={setNewSupply} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Stat label="Net absorption" value={`${m.netAbs.toLocaleString()} SF`} />
          <Stat label="Ending vacant SF" value={m.endVacant.toLocaleString()} />
        </div>
      </Card>
    </Page>
  )
}
