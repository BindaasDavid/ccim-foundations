export function money(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "—"
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

export function pct(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—"
  return `${(n * 100).toFixed(digits)}%`
}

export function num(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—"
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

export function parseNum(value: string): number {
  const cleaned = value.replace(/[$,%\s,]/g, "")
  if (cleaned === "" || cleaned === "-") return 0
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}
