import type { ReactNode } from "react"

export function Workbook({
  title,
  version,
  tabs,
  active,
  onTab,
  children,
}: {
  title: string
  version?: string
  tabs: { id: string; label: string }[]
  active: string
  onTab: (id: string) => void
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#8faadc] bg-white shadow-sm">
      <div className="flex items-center justify-between bg-[#1f4e79] px-4 py-2 text-white">
        <p className="text-sm font-semibold tracking-wide">{title}</p>
        {version ? <p className="text-[11px] text-white/70">{version}</p> : null}
      </div>
      <div className="flex flex-wrap gap-px border-b border-[#8faadc] bg-[#d6dce4] px-1 pt-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTab(t.id)}
            className={`rounded-t px-3 py-1.5 text-[11px] ${
              active === t.id ? "bg-white font-semibold text-[#1f4e79]" : "bg-[#e7e6e6] text-[#595959] hover:bg-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="bg-white p-4">{children}</div>
      <div className="flex flex-wrap gap-3 border-t border-[#d6dce4] bg-[#f2f2f2] px-4 py-2 text-[10px] uppercase tracking-wide text-[#595959]">
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-3 w-3 border border-[#bf8f00] bg-[#fff2cc]" /> Input
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-3 w-3 border border-[#8faadc] bg-[#ddebf7]" /> Calculation
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-3 w-3 border border-[#b3b3b3] bg-[#f2f2f2]" /> No input
        </span>
      </div>
    </div>
  )
}

export function XlGrid({ children, cols }: { children: ReactNode; cols?: string }) {
  return (
    <table className="w-full border-collapse text-[13px]">
      {cols ? (
        <colgroup>
          {cols.split(" ").map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
      ) : null}
      <tbody>{children}</tbody>
    </table>
  )
}

export function XlHead({ children, span = 1 }: { children: ReactNode; span?: number }) {
  return (
    <tr>
      <td colSpan={span} className="bg-[#1f4e79] px-3 py-1.5 font-semibold text-white">
        {children}
      </td>
    </tr>
  )
}

export function XlSection({ children, span = 2 }: { children: ReactNode; span?: number }) {
  return (
    <tr>
      <td colSpan={span} className="bg-[#d6dce4] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#1f4e79] uppercase">
        {children}
      </td>
    </tr>
  )
}

function cellTone(kind: "label" | "input" | "calc" | "locked") {
  if (kind === "input") return "border-[#bf8f00] bg-[#fff2cc]"
  if (kind === "calc") return "border-[#8faadc] bg-[#ddebf7] font-medium"
  if (kind === "locked") return "border-[#c0c0c0] bg-[#f2f2f2] text-[#595959]"
  return "border-[#d6dce4] bg-[#f8f8f8] text-[#404040]"
}

export function XlInput({
  value,
  onChange,
  disabled,
  align = "right",
}: {
  value: number | string
  onChange?: (n: number) => void
  disabled?: boolean
  align?: "left" | "right"
}) {
  if (disabled || !onChange) {
    return (
      <span className={`block min-h-[28px] border px-2 py-1 text-right ${cellTone("locked")}`}>
        {value === "" || value === 0 ? "" : value}
      </span>
    )
  }
  return (
    <input
      type="number"
      step="any"
      className={`w-full border px-2 py-1 outline-none ${align === "right" ? "text-right" : ""} ${cellTone("input")}`}
      value={value === 0 || value === "" ? "" : value}
      onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
    />
  )
}

export function XlText({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      className={`w-full border px-2 py-1 text-left outline-none ${cellTone("input")}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function XlOut({ children }: { children: ReactNode }) {
  return <span className={`block min-h-[28px] border px-2 py-1 text-right ${cellTone("calc")}`}>{children}</span>
}

export function XlRow({
  n,
  label,
  children,
}: {
  n?: string
  label: string
  children?: ReactNode
}) {
  return (
    <tr>
      {n != null ? <td className="w-10 border border-[#d6dce4] px-2 py-0.5 text-center text-[11px] text-[#7f7f7f]">{n}</td> : null}
      <td className={`border border-[#d6dce4] px-3 py-0.5 ${cellTone("label")}`}>{label}</td>
      {children}
    </tr>
  )
}

export function XlTd({ children, kind = "input" }: { children?: ReactNode; kind?: "input" | "calc" | "locked" | "label" }) {
  return <td className={`border px-1 py-0.5 ${cellTone(kind)}`}>{children}</td>
}
