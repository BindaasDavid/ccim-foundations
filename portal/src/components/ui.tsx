import type { ReactNode } from "react"

export function Page({
  kicker,
  title,
  source,
  children,
}: {
  kicker: string
  title: string
  source?: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <p className="text-[11px] tracking-[0.2em] text-gold-deep uppercase">{kicker}</p>
      <h2 className="font-serif mt-2 text-3xl text-ink">{title}</h2>
      {source && <p className="mt-2 max-w-3xl text-sm text-ink/60">Based on: {source}</p>}
      <div className="mt-8">{children}</div>
    </div>
  )
}

export function Card({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={`rounded-xl border border-line bg-paper p-5 shadow-sm ${id ? "scroll-mt-6" : ""} ${className}`}>
      {children}
    </div>
  )
}

export function Field({
  label,
  value,
  onChange,
  suffix,
  step = "any",
}: {
  label: string
  value: number | string
  onChange: (n: number) => void
  suffix?: string
  step?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink/70">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step={step}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-gold"
          value={value === 0 ? "" : value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
        {suffix && <span className="w-8 text-xs text-ink/50">{suffix}</span>}
      </div>
    </label>
  )
}

export function TextField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink/70">{label}</span>
      <input
        className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-gold"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${accent ? "border-gold bg-gold/10" : "border-line bg-white"}`}>
      <p className="text-[11px] tracking-wide text-ink/55 uppercase">{label}</p>
      <p className="font-serif mt-1 text-xl text-ink">{value}</p>
    </div>
  )
}

export function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

export function SheetRow({
  n,
  label,
  value,
  onChange,
  kind = "input",
  digits = 0,
  hint,
  format = "number",
}: {
  n: string
  label: string
  value: number
  onChange?: (n: number) => void
  kind?: "input" | "computed" | "total"
  digits?: number
  hint?: string
  format?: "number" | "money" | "pct"
}) {
  const tone =
    kind === "total" ? "bg-gold/15 font-medium" : kind === "computed" ? "bg-cream/80 text-ink/80" : "bg-white"
  return (
    <tr className={`border-t border-line ${tone}`}>
      <td className="w-12 px-3 py-1.5 align-middle text-xs text-ink/50">{n}</td>
      <td className="px-3 py-1.5 align-middle">
        {label}
        {hint ? <span className="ml-2 text-xs text-ink/40">{hint}</span> : null}
      </td>
      <td className="w-44 px-3 py-1.5 align-middle text-right">
        {kind === "input" && onChange ? (
          <input
            type="number"
            step="any"
            className="w-full rounded-md border border-line bg-white px-2 py-1 text-right text-sm outline-none focus:border-gold"
            value={value === 0 ? "" : value}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          />
        ) : (
          <span>
            {format === "money"
              ? value.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: digits, minimumFractionDigits: digits })
              : format === "pct"
                ? `${(value * 100).toFixed(digits)}%`
                : value.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits })}
          </span>
        )}
      </td>
    </tr>
  )
}

export function Sheet({
  title,
  children,
  columns,
}: {
  title?: string
  children: ReactNode
  columns?: string[]
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-paper">
      {title ? <p className="border-b border-line px-4 py-3 font-serif text-lg">{title}</p> : null}
      <table className="w-full text-sm">
        {columns ? (
          <thead>
            <tr className="text-left text-xs uppercase text-ink/45">
              {columns.map((c) => (
                <th key={c} className="px-3 py-2">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function AnswerKey({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4 rounded-lg border-2 border-gold bg-gold/15 p-4">
      <p className="text-xs font-semibold tracking-[0.16em] text-gold-deep uppercase">Published answer · {title}</p>
      <ol className="mt-2 space-y-2 text-sm text-ink">
        {items.map((item) => (
          <li key={item} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ol>
    </div>
  )
}
