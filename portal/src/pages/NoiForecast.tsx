import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { money } from "../lib/format"
import {
  buildNoiForecast,
  NOI_YEARS,
  parkPlazaDrivers,
  parkPlazaTenants,
  type NoiDrivers,
  type TenantRow,
} from "../lib/noiForecast"
import { Page } from "../components/ui"
import { Workbook, XlInput } from "../components/workbook"

function Cell({
  value,
  onChange,
  kind = "calc",
  bold = false,
}: {
  value: number
  onChange?: (n: number) => void
  kind?: "input" | "calc" | "total"
  bold?: boolean
}) {
  const tone =
    kind === "input"
      ? "border-[#bf8f00] bg-[#fff2cc]"
      : kind === "total"
        ? "border-[#bf8f00] bg-[#fff2cc] font-semibold"
        : "border-[#8faadc] bg-[#ddebf7]"
  if (onChange) {
    return (
      <td className={`border px-1 py-0.5 ${tone}`}>
        <input
          type="number"
          step="any"
          className="w-full bg-transparent px-1 py-0.5 text-right outline-none"
          value={value === 0 ? "" : value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      </td>
    )
  }
  return (
    <td className={`border px-2 py-1 text-right ${tone} ${bold ? "font-semibold" : ""}`}>
      {money(value, 0)}
    </td>
  )
}

function Label({ children, total = false }: { children: string; total?: boolean }) {
  return (
    <td
      className={`border px-3 py-1 ${
        total ? "bg-[#1f4e79] font-semibold text-white" : "border-[#d6dce4] bg-[#f8f8f8]"
      }`}
    >
      {children}
    </td>
  )
}

export function NoiForecastGrid({
  tenants,
  setTenants,
  drivers,
  setDrivers,
}: {
  tenants: TenantRow[]
  setTenants: (rows: TenantRow[]) => void
  drivers: NoiDrivers
  setDrivers: (d: NoiDrivers) => void
}) {
  const years = useMemo(() => buildNoiForecast(tenants, drivers), [tenants, drivers])

  function setRent(ti: number, yi: number, n: number) {
    setTenants(
      tenants.map((t, i) =>
        i === ti ? { ...t, rents: t.rents.map((r, j) => (j === yi ? n : r)) } : t,
      ),
    )
  }

  return (
    <div>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ["Vacancy & credit (%)", drivers.vacPct, (n: number) => setDrivers({ ...drivers, vacPct: n })],
            ["Leasing & management (%)", drivers.mgmtPct, (n: number) => setDrivers({ ...drivers, mgmtPct: n })],
            ["Administrative costs (%)", drivers.adminPct, (n: number) => setDrivers({ ...drivers, adminPct: n })],
            ["Other opex ($/sf)", drivers.stopPsf, (n: number) => setDrivers({ ...drivers, stopPsf: n })],
            ["Building SF", drivers.buildingSf, (n: number) => setDrivers({ ...drivers, buildingSf: n })],
          ] as const
        ).map(([label, value, onChange]) => (
          <label key={label} className="block text-xs">
            <span className="mb-1 block text-[#595959]">{label}</span>
            <XlInput value={value} onChange={onChange} />
          </label>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border border-[#16365c] bg-[#1f4e79] px-3 py-2 text-left font-normal text-white">
                Potential Rental Income
              </th>
              {NOI_YEARS.map((y) => (
                <th key={y} className="border border-[#16365c] bg-[#1f4e79] px-3 py-2 font-normal text-white">
                  Year {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.map((t, ti) => (
              <tr key={t.name}>
                <td className="border border-[#d6dce4] bg-[#f8f8f8] px-3">
                  <input
                    className="w-full bg-transparent outline-none"
                    value={t.name}
                    onChange={(e) =>
                      setTenants(tenants.map((row, i) => (i === ti ? { ...row, name: e.target.value } : row)))
                    }
                  />
                </td>
                {t.rents.map((rent, yi) => (
                  <Cell key={yi} value={rent} kind="input" onChange={(n) => setRent(ti, yi, n)} />
                ))}
              </tr>
            ))}
            <tr>
              <Label total>= Potential Rental Income</Label>
              {years.map((y, i) => (
                <Cell key={i} value={y.pri} kind="total" bold />
              ))}
            </tr>
            <tr>
              <Label>{`− Vacancy and Credit Losses (${drivers.vacPct}%)`}</Label>
              {years.map((y, i) => (
                <Cell key={i} value={y.vacancy} />
              ))}
            </tr>
            <tr>
              <Label total>= Gross Operating Income</Label>
              {years.map((y, i) => (
                <Cell key={i} value={y.goi} kind="total" bold />
              ))}
            </tr>
            <tr>
              <td colSpan={7} className="border border-[#d6dce4] bg-[#d6dce4] px-3 py-1 text-xs font-semibold tracking-wide text-[#1f4e79] uppercase">
                Operating Expenses
              </td>
            </tr>
            <tr>
              <Label>{`Leasing and Management (${drivers.mgmtPct}%)`}</Label>
              {years.map((y, i) => (
                <Cell key={i} value={y.mgmt} />
              ))}
            </tr>
            <tr>
              <Label>{`Administrative Costs (${drivers.adminPct}%)`}</Label>
              {years.map((y, i) => (
                <Cell key={i} value={y.admin} />
              ))}
            </tr>
            <tr>
              <Label>{`Other Operating Expenses $${drivers.stopPsf} psf`}</Label>
              {years.map((y, i) => (
                <Cell key={i} value={y.other} />
              ))}
            </tr>
            <tr>
              <Label total>= Total Operating Expenses</Label>
              {years.map((y, i) => (
                <Cell key={i} value={y.opex} kind="total" bold />
              ))}
            </tr>
            <tr>
              <td colSpan={7} className="border border-[#d6dce4] bg-[#d6dce4] px-3 py-1 text-xs font-semibold tracking-wide text-[#1f4e79] uppercase">
                Net Operating Income
              </td>
            </tr>
            <tr>
              <Label>Gross Operating Income</Label>
              {years.map((y, i) => (
                <Cell key={i} value={y.goi} />
              ))}
            </tr>
            <tr>
              <Label>− Total Operating Expenses</Label>
              {years.map((y, i) => (
                <Cell key={i} value={y.opex} />
              ))}
            </tr>
            <tr>
              <Label total>Net Operating Income</Label>
              {years.map((y, i) => (
                <Cell key={i} value={y.noi} kind="total" bold />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[#595959]">
        Yellow cells are inputs. Blue cells calculate. Gold totals are PRI, GOI, total opex, and NOI.
        Vacancy and management/admin are percents of the line above them. Other opex is the stop × building SF
        and does not escalate in this worksheet.
      </p>
    </div>
  )
}

export function NoiForecast() {
  const [tenants, setTenants] = useState<TenantRow[]>(() => parkPlazaTenants.map((t) => ({ ...t, rents: [...t.rents] })))
  const [drivers, setDrivers] = useState<NoiDrivers>({ ...parkPlazaDrivers })
  const years = useMemo(() => buildNoiForecast(tenants, drivers), [tenants, drivers])

  return (
    <Page
      kicker="Module 10 · Task 6"
      title="Forecasting NOI"
      source="Interactive recreation of the six-year NOI worksheet (packet page 10.42)"
    >
      <p className="mb-6 text-sm text-ink/65">
        Edit any tenant-year rent or the percent drivers. Totals follow the printed stack: PRI, vacancy,
        GOI, then management, admin, and the $1.74 stop, then NOI.
      </p>
      <Workbook
        title="Task 6: Forecasting NOI"
        version="Study recreation · page 10.42"
        tabs={[{ id: "noi", label: "NOI worksheet" }]}
        active="noi"
        onTab={() => undefined}
      >
        <NoiForecastGrid tenants={tenants} setTenants={setTenants} drivers={drivers} setDrivers={setDrivers} />
      </Workbook>
      <p className="mt-4 text-sm text-ink/60">
        Year-6 NOI on this sheet is {money(years[5]?.noi ?? 0, 0)}. Carry it to{" "}
        <Link className="text-gold-deep" to="/tools/cfaw">
          CFAW line 7
        </Link>
        .
      </p>
    </Page>
  )
}
